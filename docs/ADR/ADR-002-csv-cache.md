# ADR-002: Seed a Local Set Cache from the Rebrickable CSV Database

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Date** | April 2026 |
| **Author** | William A. Evans |
| **Relates to** | API rate limiting, performance, data strategy |
| **Depends on** | ADR-001 (API proxy) |

---

## Context

Rebrickable provides two ways to access LEGO set data:

1. **Live API** — Real-time data via authenticated REST endpoints. Rate-limited to ~1 request/second on the free tier per API key.
2. **CSV database downloads** — The entire Rebrickable LEGO catalog (sets, themes, parts, minifigures, inventories) available as flat CSV files, updated automatically every 24 hours. Free to download. No rate limit. No authentication required.

For BrickDex, the primary lookup operations are:
- Find a set by set number (e.g. `75192`)
- Find sets by name (type-ahead search)
- Retrieve set metadata: name, theme, piece count, minifigure count, retail price, image URL

All of these operations can be served from the CSV data for the vast majority of sets. The live API is only strictly necessary for data not yet reflected in the last CSV export (i.e. sets released in the last 24 hours) or for data fields not included in the CSV files.

---

## Decision

**On application startup (and on a 24-hour refresh schedule), we download the Rebrickable CSV database files and import them into a local server-side cache (SQLite or equivalent). All set lookup requests are served from this cache first. The live Rebrickable API is called only when a set number is not found in the cache.**

---

## Rationale

**1. Rate limit pressure eliminated for common lookups**
The free Rebrickable API tier allows ~1 request/second. With a CSV-seeded cache, a lookup for any set that exists in the Rebrickable database (which is effectively all sets ever officially released) never touches the live API. The rate limit only becomes relevant for brand-new sets released within the last 24 hours — an edge case.

**2. Faster response times**
A cache query against a local SQLite database returns in milliseconds. A round trip to the Rebrickable API introduces network latency plus any upstream variability. For type-ahead search (user typing a set name), local cache is the only approach that provides a responsive experience.

**3. Offline resilience**
Set lookups continue to work even if Rebrickable's API is temporarily unavailable, experiencing downtime, or rate-limiting our key. For a personal tool used daily, this reliability matters.

**4. Cost-free at scale**
The CSV files are freely available with no usage restrictions. As the user base grows (if BrickDex is ever shared more broadly), the CSV cache means our Rebrickable API usage does not grow linearly with users.

---

## Cache Strategy

```
Request: lookup set #75192
  │
  ▼
Local CSV cache ──── HIT ──▶ Return cached data (< 5ms)
  │
  MISS
  │
  ▼
Live Rebrickable API ──▶ Return data + write to cache
```

**CSV files used:**
| File | Contents | Used for |
|---|---|---|
| `sets.csv` | Set number, name, year, theme ID, piece count, image URL | Primary set lookup |
| `themes.csv` | Theme ID → theme name | Theme name resolution |
| `inventories.csv` + `inventory_minifigs.csv` | Minifigure counts per set | Minifig count per set |

**Refresh schedule:** Daily at a low-traffic time (e.g. 3:00 AM). The CSV download is a background job that does not block normal app operation. If a refresh fails, the previous cache remains valid.

**Cache freshness indicator:** A `cacheUpdatedAt` timestamp is stored and surfaced in the app's Settings page so users can see when set data was last synced.

---

## Trade-offs

| Pro | Con |
|---|---|
| Eliminates rate limit concerns for ~99% of lookups | Adds initial setup complexity (CSV download + import pipeline) |
| Sub-millisecond local query vs. network round-trip | Cache is up to 24 hours stale for very recently released sets |
| Works offline / during Rebrickable downtime | Requires local storage for CSV data (~several MB) |
| No API cost growth with user scale | Background refresh job must be maintained |

The 24-hour staleness window is an accepted trade-off. A set released today not appearing until tomorrow is inconsequential for a personal collection tracker — collectors are unlikely to buy and immediately add a set on its release day in a way that would surface this gap.

---

## Implementation Notes

- CSV files are downloaded from `https://rebrickable.com/downloads/` on first run and stored server-side.
- Import pipeline: download → parse CSV → upsert into local SQLite → update `cacheUpdatedAt` timestamp.
- The same SQLite database used for caching set data in v1.0 can be extended to store user collection data in v2.0 when a backend is formally introduced.
- Retail price data is not reliably available in the Rebrickable CSV files. For retail price, a live API call or manual user entry is the fallback.
