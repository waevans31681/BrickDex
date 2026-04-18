# ADR-004: Include Nullable `userId` Field in v1.0 Data Schema

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Date** | April 2026 |
| **Author** | William A. Evans |
| **Relates to** | Data model, forward compatibility, multi-user architecture |
| **Affects** | Collection Set record, Wish List Item record |

---

## Context

BrickDex v1.0 stores all data locally in IndexedDB via Dexie.js. There are no user accounts, no authentication, and no backend database. Data belongs to whoever is using the device — there is no concept of ownership at the data level.

However, the product roadmap includes two future milestones that require a notion of data ownership:

- **v2.0** — Optional single-user accounts with cloud sync across devices. Every record in the cloud database must be associated with the user who owns it.
- **v3.0** — Household/family accounts. The shared collection is visible to all household members; wish lists are strictly private to their individual owner. The privacy boundary between "shared" and "private" data is enforced at the record level using the owner's identity.

There were two approaches to handling this:

**Option A — Add userId later, when accounts are introduced in v2.0**
Design the v1.0 schema without a userId field. When v2.0 ships, run a migration to add the field to all existing records and populate it with the new user's ID.

**Option B — Include userId as a nullable field in v1.0**
Add `userId` to the schema now. In v1.0 it is always `null` — no code reads or writes it. In v2.0 it is populated on every write. In v3.0 it becomes the enforcement boundary for wish list privacy.

---

## Decision

**We use Option B — a nullable `userId` field is included in both the Collection Set record and the Wish List Item record in v1.0, even though no authentication system exists yet.**

---

## Rationale

**1. Avoids a destructive schema migration**
Adding a new required field to an existing production database schema — especially one with user data already in it — is always a risk. Users who have been actively logging their collection in v1.0 would need every one of their records updated. With IndexedDB in v1.0 and a cloud database in v2.0, the migration path across storage backends is already complex enough. Adding a schema change on top is unnecessary risk that Option B eliminates entirely.

**2. The v3.0 wish list privacy boundary must be designed in, not bolted on**
The core promise of the v3.0 household model is: *"No household member can ever view another member's wish list."* This is not a UI-level restriction — it must be enforced at the API and database query level. The mechanism is a `WHERE userId = currentUserId` clause on every wish list query. This clause only works if `userId` exists as a reliable field on every wish list record, including records created in v1.0 before the user had an account.

If we retrofit `userId` in v2.0, there is a category of records — those created in v1.0 before accounts were introduced — that have no `userId`. Handling those edge cases in v3.0 privacy logic adds complexity and creates potential security gaps. Option B means there are no records without a `userId` field; they just have a null value that v2.0 populates on migration.

**3. Zero cost in v1.0**
A nullable field with a null value has no functional impact on v1.0. It does not affect any query, display, or user interaction. It is invisible to the end user. The only cost is a few bytes of schema definition — genuinely negligible.

**4. Documents intent**
Including `userId` in the v1.0 schema with a comment in the code (e.g. `// nullable in v1.0; populated in v2.0; privacy boundary in v3.0`) communicates the architectural intent to any future developer (or future-self) reading the code. This is the kind of forward-thinking design that reduces "why is this here?" confusion later.

---

## How userId Is Used Across Versions

| Version | userId value | How it's used |
|---|---|---|
| v1.0 | Always `null` | Not read or written by any application code; schema placeholder only |
| v2.0 | Populated on write with the authenticated user's UUID | All cloud sync queries filter by `userId`; identifies record ownership |
| v3.0 | Same as v2.0 | Collection records: readable by all household members (`householdId` join); Wish list records: readable only where `userId = currentUserId` — enforced at API level, not UI |

---

## Trade-offs

| Pro | Con |
|---|---|
| No destructive migration needed when v2.0 ships | Nullable field in schema that does nothing in v1.0 (minor code smell) |
| v3.0 privacy logic has a clean, reliable enforcement boundary | Developer must remember not to treat null userId as an error in v1.0 |
| Documents multi-user intent explicitly in the data model | Slightly more schema surface area to document |
| Zero runtime cost in v1.0 | |

The single real downside — a nullable field that does nothing in v1.0 — is a minor code smell that is entirely outweighed by the migration safety and v3.0 privacy correctness it buys.

---

## Implementation Notes

**Dexie.js schema (v1.0):**
```javascript
// db.js
const db = new Dexie('BrickDexDB');

db.version(1).stores({
  // userId: nullable UUID — unused in v1.0, populated in v2.0+
  // Index it now so v2.0 queries are fast without a schema version bump
  sets:      '++id, setNumber, status, theme, userId',
  wishlist:  '++id, setNumber, userId',
});
```

**Key note:** Index `userId` in the Dexie schema even in v1.0. Adding an index to an existing Dexie store requires a version increment and a migration. Defining it upfront means v2.0 can query `db.sets.where('userId').equals(currentUserId)` without any schema changes.

**v2.0 migration (when accounts are introduced):**
```javascript
db.version(2).stores({
  // No structural changes needed — userId field and index already exist
  sets:     '++id, setNumber, status, theme, userId',
  wishlist: '++id, setNumber, userId',
}).upgrade(tx => {
  // Populate userId on all existing records with the authenticated user's ID
  return tx.sets.toCollection().modify(set => {
    set.userId = currentUser.id;
  });
  // Same for wishlist records
});
```

This migration is safe, non-destructive, and only runs once on first login after v2.0 is installed.
