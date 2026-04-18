# BrickDex — Product Requirements Document

| Field | Detail |
|---|---|
| **Author** | William A. Evans ([@waevans31681](https://github.com/waevans31681)) |
| **Version** | 1.2 — Family accounts roadmap added |
| **Date** | April 2026 |
| **Status** | Draft — In Development |
| **Repository** | [github.com/waevans31681/brickdex](https://github.com/waevans31681/brickdex) |
| **Target Platform** | Web App (PWA) + Android APK (sideload) |
| **Primary API** | Rebrickable API v3 |
| **Distribution** | Self-hosted web; Android via developer APK (no Play Store) |

> **Note:** This document serves dual purpose — it is the working PRD guiding development of BrickDex, and a portfolio artifact demonstrating product management methodology including market research, competitive analysis, platform scoping, and architectural decision-making.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Non-Goals](#3-goals--non-goals)
4. [User Personas](#4-user-personas)
5. [Competitive Analysis](#5-competitive-analysis)
6. [Feature Requirements](#6-feature-requirements)
7. [Technical Architecture](#7-technical-architecture)
8. [UX & Design Approach](#8-ux--design-approach)
9. [Data Model](#9-data-model)
10. [Success Metrics](#10-success-metrics)
11. [Risks & Mitigations](#11-risks--mitigations)
12. [Open Questions & Future Decisions](#12-open-questions--future-decisions)
13. [Revision History](#13-revision-history)

---

## 1. Executive Summary

BrickDex is a personal LEGO set collection tracker built for Adult Fans of LEGO (AFOLs) who want a clean, organized view of their collection without the investment-focused framing of existing tools. The app lets collectors track build status, purchase type, piece counts, purchase history, and — optionally in a later release — resale value.

The project originated from a genuine personal need: managing a collection of 100+ sets with no single tool that fit the use case of an organized, non-investor collector. The name BrickDex was chosen after a competitive naming check confirmed that BrickVault (the most similar competitor) is already live on both app stores as of January 2026.

v1.0 is deliberately scoped to core collection tracking and API-driven set data entry. Value/insights analytics and minifigure tracking are deferred to v1.5 to keep the MVP focused and shippable. The long-term roadmap extends to v3.0, which introduces household/family accounts — enabling a shared collection view with individual, private wish lists per household member.

> **Career Note:** This project is intentionally designed as a Technical PM portfolio artifact. Every major product decision — market analysis, competitor research, platform scoping, API architecture — is documented here to demonstrate end-to-end product thinking alongside hands-on technical execution.

---

## 2. Problem Statement

### The Problem

LEGO collectors with large collections (50+ sets) have no purpose-built, lightweight tool for tracking what they own, its build status, purchase context, storage location, and what they paid. Existing solutions fall into two unsatisfying categories:

- **Investment-focused apps** (e.g., BrickVault) — built for resellers and investors, with market pricing as the core feature. Collectors who never plan to sell find these cluttered and misaligned with their needs.
- **Spreadsheets** — flexible but brittle, not mobile-friendly, require full manual data entry, and offer no barcode scanning or API-driven auto-fill.
- **Brickset** — primarily a set database and news site. Collection tracking is a secondary feature; the UX is dated and not optimized for status management.

### Who Has This Problem

The AFOL (Adult Fan of LEGO) community is large and growing. LEGO reported 12% revenue growth in 2025, driven in part by adult collectors. Industry estimates place adult purchases at 5–10% of all US LEGO sales. Brickset, a collector-focused site, has over 250,000 registered members — a useful proxy for the engaged collector audience that would consider a dedicated tracking tool.

### Why This Project, Why Now

BrickVault's January 2026 launch validates the market but also defines the competitive space. BrickDex is not positioned to out-feature BrickVault in investment analytics. Instead it occupies the adjacent, underserved position: a clean, organization-first tracker for collectors who measure success in completed builds and organized shelves, not ROI.

---

## 3. Goals & Non-Goals

### Goals — v1.0 (MVP)

1. Build a working web app (PWA) for tracking personal LEGO collections, usable on desktop and mobile browsers without installation.
2. Enable fast set entry via set number lookup and name search — powered by the Rebrickable API.
3. Track key metadata per set: name, set number, theme, piece count, minifig count, retail price (user-entered), price paid, purchase date, purchase type (New / Used), build status, location, and notes.
4. Support four build status states: Unbuilt, Built, Sealed, Sold.
5. Provide a Wish List with PDF export so users can share their list with others who do not have the app.
6. Publish to GitHub with full documentation suitable for a Technical PM portfolio.

### Goals — v1.5

- Value / Insights tab: total collection value, appreciation delta, value-by-theme chart, top sets by value.
- Minifigure tracking module: separate minifig collection log with rarity indicators, set appearance cross-reference, and buy/sell history.
- Android APK build via Capacitor for sideload installation on developer-mode Android device.
- Barcode scanning via device camera (Android APK only — not available in web/PWA).

### Goals — v2.0

- Optional single-user accounts with cloud sync across multiple personal devices (phone + tablet + desktop).
- CSV import for bulk migration from spreadsheets.
- Wish list price-drop notifications (requires resale value integration).
- Backend migration: move from local IndexedDB to cloud database to support account-based data ownership.

### Goals — v3.0

- Household / family account system: one primary account can invite additional members to join a shared household.
- Shared collection: all sets owned by any household member are consolidated into a single unified collection view.
- Private wish lists: each household member maintains their own wish list, visible only to themselves — enabling gift-giving surprise.
- Household member management: invite via link or code; remove members; designate household admin.
- Permission model: shared = collection data; private = wish list data. No member can view another member's wish list.

### Non-Goals

- **Google Play Store publication** — not planned. Android distribution is via developer APK sideload only.
- **iOS / Apple App Store** — not planned. Development team is an Android household with no iOS devices for testing.
- **Reseller tools, profit calculators, or investment forecasting** — deferred to v1.5 and positioned as optional/hidden by default.
- **Social features, community sharing, or MOC (My Own Creation) tracking.**
- **Parts-level inventory tracking** (individual bricks) — this is Rebrickable's core use case; out of scope.

---

## 4. User Personas

| Persona | Description | Primary Need | Pain Point Today |
|---|---|---|---|
| The Organized Collector | Adult collector, 50–200 sets, builds for enjoyment and display. Never plans to sell. | Know what I own, where it is, and what I've built. | Spreadsheet is a mess; no mobile access. |
| The Couple Collector | Two adults sharing a collection spanning different themes (Star Wars, Botanical, etc.) | Shared visibility of the full collection. | No tool supports a joint household view. |
| The Gifting Household | Family and friends give LEGO as gifts. Collector needs a wish list to share. | Track what was gifted and share a wish list easily. | Gifts get duplicated; no shareable wish list. |
| The Minifig Enthusiast | Collector focused on individual minifigures, not full sets. Trades figs separately. | Track individual figs, rarity, and which sets they appear in. | No tracker connects figs to sets cleanly. *(v1.5)* |
| The Occasional Seller | Collector who sometimes sells duplicate or unwanted sets. Needs Sold status. | Know what has left the collection and at what price. | Sold sets disappear from spreadsheet with no record. |

---

## 5. Competitive Analysis

> Research conducted April 2026 prior to committing to the product name and scope.

| Product | Platform | Primary Angle | Pricing | BrickDex Differentiation |
|---|---|---|---|---|
| BrickVault | iOS + Android + Web | Investment portfolio tracker | Freemium / Pro sub | Organization-first; not investor-focused |
| Brickset | Web + mobile apps | Set database + community | Free (ads) | Mobile PWA; cleaner add flow; purchase type tracking |
| Rebrickable | Web | Parts & MOC tracking | Free / Pro | Set-level tracking; simpler scope; wish list PDF export |
| BrickSearch | iOS + Android | Set catalog + CMF scanner | Free | Full collection mgmt; purchase history; sold status |
| Spreadsheets | Any | DIY tracking | Free | Mobile-friendly; API auto-fill; barcode scan (v1.5) |

> **Key Finding:** BrickVault is the closest competitor and launched January 2026. It validates the market but is explicitly positioned as an investment tool. BrickDex's organizational positioning — with purchase type, sold status, and wish list PDF export — addresses collector needs BrickVault does not prioritize.

---

## 6. Feature Requirements

### 6.0 Release Summary

| Feature Area | v1.0 | v1.5 | v2.0 | v3.0 |
|---|---|---|---|---|
| Core set collection tracking | ✅ | ✅ | ✅ | ✅ |
| API auto-fill (Rebrickable) | ✅ | ✅ | ✅ | ✅ |
| Build status (Unbuilt/Built/Sealed/Sold) | ✅ | ✅ | ✅ | ✅ |
| Purchase type (New / Used) | ✅ | ✅ | ✅ | ✅ |
| Wish list + PDF export | ✅ | ✅ | ✅ | ✅ |
| Insights / value dashboard | — | ✅ | ✅ | ✅ |
| Minifigure tracking module | — | ✅ | ✅ | ✅ |
| Barcode scanning (Android APK) | — | ✅ | ✅ | ✅ |
| Android APK (sideload) | — | ✅ | ✅ | ✅ |
| Single-user accounts / cloud sync | — | — | ✅ | ✅ |
| CSV bulk import | — | — | ✅ | ✅ |
| Household / family accounts | — | — | — | ✅ |
| Shared collection across household | — | — | — | ✅ |
| Private per-member wish lists | — | — | — | ✅ |
| Google Play Store publication | ❌ | ❌ | ❌ | ❌ |

---

### 6.1 Collection Management

| ID | Feature | Priority | Notes |
|---|---|---|---|
| F-01 | Add set by set number lookup | P0 | Calls Rebrickable API; auto-fills name, theme, pieces, minifigs, set image |
| F-02 | Add set by name search | P0 | Type-ahead search against Rebrickable; returns results list to select from |
| F-03 | Add set by barcode scan | v1.5 | Android APK only; web version presents set number field; UPC/EAN-13 → set number → API lookup |
| F-04 | Edit set details | P0 | All user-entered fields editable after initial entry |
| F-05 | Delete set from collection | P0 | Requires confirmation dialog; permanent in v1 (no soft delete) |
| F-06 | Build status field | P0 | Four states: Unbuilt, Built, Sealed, Sold |
| F-07 | Purchase type field | P0 | Two values: New, Used |
| F-08 | Retired set flag | P0 | Auto-detected via Rebrickable data; badge on set card; not user-editable |
| F-09 | Location field | P1 | Free-text (e.g. "Shelf B", "Attic Box 3") |
| F-10 | Notes field | P1 | Free-text personal context |
| F-11 | Box condition field | P2 | Options: Sealed, Open/Good, No Box |
| F-12 | Purchase source field | P2 | Free-text (e.g. "LEGO Store", "Facebook Marketplace") |

---

### 6.2 Status Definitions

#### Build Status

| Status | Definition | Typical Scenario |
|---|---|---|
| Unbuilt | Set is owned but has not been assembled. | Bought and stored; waiting to build |
| Built | Set has been fully assembled at least once. | Completed and stored, or currently assembled |
| Sealed | Set is owned and the box remains factory-sealed; has never been opened. | Collector piece kept in original packaging |
| Sold | Set was previously in the collection but has been sold or given away. | Archived for disposition history; never deleted |

> **Design Note:** Sold sets remain visible in the collection log (grayed out / filterable) so owners maintain a complete history. This is distinct from deletion, which permanently removes the record.

#### Purchase Type

| Value | Definition |
|---|---|
| New | Purchased brand-new in original factory-sealed packaging from a retailer or LEGO directly. |
| Used | Purchased second-hand or pre-owned (e.g. Facebook Marketplace, eBay, garage sale, traded). |

---

### 6.3 Data Fields per Set

| Field | Source | v1.0 | Editable |
|---|---|---|---|
| Set Name | Rebrickable API (auto-fill) | ✅ | Yes |
| Set Number | User input / barcode | ✅ | No — primary key |
| Theme | Rebrickable API (auto-fill) | ✅ | Yes |
| Sub-theme | Rebrickable API (auto-fill) | ✅ | Yes |
| Piece Count | Rebrickable API (auto-fill) | ✅ | Yes |
| Minifigure Count | Rebrickable API (auto-fill) | ✅ | Yes |
| Official Retail Price | **User input** ⚠️ | ✅ | Yes |
| Price Paid | User input | ✅ | Yes |
| Purchase Date | User input | ✅ | Yes |
| Purchase Type | User input (New / Used) | ✅ | Yes |
| Purchase Source | User input | P2 | Yes |
| Build Status | User input | ✅ | Yes |
| Location | User input | P1 | Yes |
| Box Condition | User input | P2 | Yes |
| Notes | User input | P1 | Yes |
| Set Image | Rebrickable API (auto-fill) | ✅ | No |
| Retired Flag | Rebrickable API | ✅ | No — read-only |
| Current Resale Value | External API (future) | v1.5 | No — auto-updated |
| Date Added | System generated | ✅ | No |
| Date Updated | System generated | ✅ | No |

> ⚠️ **Retail Price Note:** The Rebrickable API v3 does not include pricing data. Their documentation explicitly states: *"There is no Set/Part pricing data available, as that data is owned by external sites such as BrickLink or BrickOwl."* Official retail price must be entered manually by the user in v1.0. Auto-fill of retail price via an external source is a v1.5 consideration.

---

### 6.4 Browse & Filter

| ID | Feature | Priority | Notes |
|---|---|---|---|
| F-13 | Filter by status | P0 | All, Unbuilt, Built, Sealed, Sold |
| F-14 | Filter by theme | P0 | Sidebar; multi-select |
| F-15 | Filter by purchase type | P1 | New, Used, or both |
| F-16 | Filter by retired status | P1 | Show only retired / exclude retired / show all |
| F-17 | Text search | P0 | Searches name, set number, theme, notes |
| F-18 | Sort options | P1 | Date Added (default), Name A–Z, Piece Count, Price Paid |
| F-19 | Grid / list view toggle | P2 | Grid default; list for dense viewing |
| F-20 | Hide sold sets toggle | P1 | Sold sets shown by default; can be hidden; never deleted |

---

### 6.5 Wish List

| ID | Feature | Priority | Notes |
|---|---|---|---|
| F-21 | Add set to wish list | P0 | Same lookup flow as collection add |
| F-22 | View wish list in dedicated tab | P0 | Completely separate from owned collection |
| F-23 | Add priority / notes to wish item | P1 | User can annotate why they want it or note a target price |
| F-24 | Export wish list as PDF | P0 | Clean printable PDF: set image, name, number, retail price, notes — shareable with no app required |
| F-25 | Move wish list item to collection | P1 | One-tap; prompts for purchase details before moving |
| F-26 | Remove item from wish list | P0 | With confirmation prompt |

> **PDF Wish List:** The export (F-24) is a key differentiator for gift-giving households. Requires no app, no login, no internet to view. Designed to be printable or sent via text/email. Format: set image thumbnail, set name, set number, theme, retail price (user-entered), user notes/priority.

---

### 6.6 Insights & Value Tab — Deferred to v1.5

> These features are explicitly out of scope for v1.0. Documented here for planning continuity.

| ID | Feature | v1.5 Priority | Notes |
|---|---|---|---|
| F-27 | Total sets count stat card | P0 | Simple dashboard metric |
| F-28 | Total piece count stat card | P0 | Simple dashboard metric |
| F-29 | Total current collection value | P1 | Requires resale value integration |
| F-30 | Appreciation delta | P1 | Current value minus total paid |
| F-31 | Value by theme bar chart | P2 | Paid vs. current per theme |
| F-32 | Top sets by current value | P2 | Ranked list with gain/loss indicator |

---

### 6.7 Minifigure Tracking Module — Deferred to v1.5

> Minifigure collecting is a distinct sub-hobby. Some collectors buy, sell, and trade individual figs entirely separately from sets. This module ships in v1.5 as a separate but linked section.

| ID | Feature | v1.5 Priority | Notes |
|---|---|---|---|
| F-33 | Minifig collection log | P0 | Separate from set collection; linked by set number where applicable |
| F-34 | Minifig lookup by name / ID | P0 | Powered by Rebrickable minifig API |
| F-35 | Rarity indicator | P1 | Based on number of sets the fig appears in; rare = appears in 1–2 sets only |
| F-36 | Set appearance cross-reference | P1 | Show which sets a given minifig appears in |
| F-37 | Minifig status (Owned / Sold / Want) | P0 | Mirrors set status pattern |
| F-38 | Purchase / sale price tracking | P1 | Figs are bought and sold individually; separate from set prices |

---

### 6.8 Household / Family Accounts — Deferred to v3.0

The household account system enables multiple people sharing a physical LEGO collection — couples, families, roommates — to manage collaboratively while keeping personal wish lists completely private. This is the feature that distinguishes BrickDex from all current LEGO trackers, none of which model household-level ownership.

> **Core Design Principle:** The collection is shared. The wish list is private. No household member can ever view another member's wish list. This is what makes gift-giving work — a partner can check the shared collection to avoid buying a duplicate, but cannot see what the other person is hoping to receive.

#### Household Account Model

| Concept | Definition |
|---|---|
| Household | A named group of 2+ user accounts linked together. Has one shared collection and N private wish lists (one per member). |
| Household Admin | The user who created the household. Can invite/remove members and rename the household. Cannot view other members' wish lists. |
| Member | Any user account belonging to the household. Can add/edit sets in the shared collection. Can only view their own wish list. |
| Shared Collection | All sets added by any member are visible to all members. Each set record shows which member added it (`addedBy` field). |
| Private Wish List | Each member has exactly one wish list. Visible only to that member — not to the admin, not to other members. |
| Invite | Admin sends an invite link or code. Invitee creates or logs into an existing account and accepts. Invites expire after 7 days. |

#### v3.0 Feature List

| ID | Feature | Priority | Notes |
|---|---|---|---|
| F-39 | Create household | P0 | Any v2.0 account holder can create a household; becomes admin automatically |
| F-40 | Invite members to household | P0 | Admin generates invite link / 6-digit code |
| F-41 | Accept household invite | P0 | Invitee links their existing account to the household |
| F-42 | Shared collection view | P0 | All household members see one unified set collection; contributor shown on each card |
| F-43 | Per-member private wish list | P0 | Each member's wish list isolated; enforced at API level, not just UI |
| F-44 | Member management (admin) | P1 | View member list, remove a member, transfer admin role |
| F-45 | Leave household | P1 | Member can leave; their contributed sets remain in the shared collection |
| F-46 | Contributor attribution on sets | P2 | Each set card shows which household member added it |
| F-47 | Household-level stats | P2 | Insights tab shows combined household totals alongside per-member breakdowns |

#### Architecture Implications — Plan Ahead in v1.0 and v2.0

The following v1.0 decisions directly enable v3.0 without requiring a data migration or redesign:

- v1.0 data model uses UUID primary keys on all records — required for cloud sync and multi-user attribution.
- v1.0 Collection Set record includes a `userId` field (nullable) — becomes the `addedBy` attribution field in v3.0.
- v1.0 Wish List record includes a `userId` field (nullable) — this is the **privacy boundary** in v3.0. See [ADR-004](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-004-userid-forward-compat.md).
- v2.0 backend enforces resource ownership per user on all API endpoints. v3.0 extends collection records to household-level read access while wish list records remain strictly user-scoped.
- v3.0 introduces a `households` table and a `household_members` join table. No existing tables are restructured — only new relationships are added.

> **[ADR-004](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-004-userid-forward-compat.md):** We add a nullable `userId` field to both the Collection Set and Wish List records in v1.0, even though authentication does not exist yet. Rationale: (1) avoids a destructive schema migration when v2.0 introduces accounts; (2) the `userId` field becomes the privacy enforcement boundary for wish lists in v3.0 — designing it in from the start is lower risk than retrofitting it. In v1.0 this field is always `null`. In v2.0 it is populated on write. In v3.0 it drives the shared/private permission split.

---

## 7. Technical Architecture

### 7.1 Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React + Vite | Component reuse when converting to Android APK via Capacitor; Figma Make exports cleanly to React |
| UI Design | Figma Make | AI-assisted UI generation; exported to React; logic wired with Claude Code |
| Styling | Tailwind CSS | Utility-first; responsive by default |
| State Management | Zustand | Lightweight; simpler than Redux for solo project scope |
| Local Storage (v1) | IndexedDB via Dexie.js | Offline-first; no backend required; all data stays on device |
| PDF Export | jsPDF / react-pdf | Client-side PDF generation for wish list export; no server required |
| Backend (v2) | Node.js + Express | Required for user accounts and cloud sync; not needed for v1 |
| Android (v1.5) | Capacitor | Wraps React web app in native Android shell; enables camera/barcode access |

---

### 7.2 Android Distribution — APK Sideload

BrickDex will **not** be published to the Google Play Store. The Android version is distributed as a self-signed APK installed directly on the developer's personal Android device, which is already in developer mode.

> **[ADR-003](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-003-apk-sideload.md):** APK sideload over Play Store. Rationale: (1) Play Store submission requires a $25 fee and review process not warranted for a personal tool; (2) the device is already in developer mode; (3) faster iteration — builds install immediately without store review. Trade-off: APK must be manually transferred for each update. Accepted given the single-user context.

**Build and distribution workflow (v1.5):**

```bash
# 1. Build the React web app
npm run build

# 2. Sync web build into the Capacitor Android project
npx cap sync android

# 3. Build a signed debug APK in Android Studio
npx cap open android
# Build → Build Bundle(s) / APK(s) → Build APK(s)

# 4. Transfer APK to device (USB or private download link)

# 5. Install on device — tap APK file → Install
# Requires: Settings → Install Unknown Apps → enabled
```

---

### 7.3 Rebrickable API — Integration Details

**Base URL:** `https://rebrickable.com/api/v3/`

**Authentication:** `Authorization: key {YOUR_API_KEY}` header on every request.

**Rate limit:** ~1 request/second average. HTTP 429 returned when exceeded. Repeated 429 violations result in a temporary IP ban. This makes ADR-001 (proxy) and ADR-002 (CSV cache) critical — the vast majority of set lookups must be served from cache, not the live API.

**Key endpoints used by BrickDex:**

| Endpoint | Method | Used for |
|---|---|---|
| `/lego/sets/{set_num}/` | GET | Fetch set details by set number (name, year, theme, piece count, image) |
| `/lego/sets/?search={query}` | GET | Search sets by name for type-ahead lookup |
| `/lego/sets/{set_num}/minifigs/` | GET | Fetch minifigure count and details for a set |
| `/lego/themes/{id}/` | GET | Resolve theme ID to theme name |
| `/lego/minifigs/{fig_num}/` | GET | Fetch minifig details (v1.5, minifig module) |

> ⚠️ **No pricing data:** The Rebrickable API explicitly does not include retail or resale price data. Official retail price is user-entered in BrickDex v1.0. Resale value integration from an external source is a v1.5 consideration.

**Pagination:** Results default to 100 items per page, max 1000. `next` and `previous` URL fields are included in list responses.

---

### 7.4 API Strategy — Proxy + CSV Cache

> See [ADR-001](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-001-api-proxy.md) and [ADR-002](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-002-csv-cache.md) for full rationale.

```
Client request: lookup set #75192
        │
        ▼
  Local CSV cache ──── HIT ──▶ Return cached data  (< 5ms)
        │
       MISS
        │
        ▼
  Backend proxy ──▶ Rebrickable API ──▶ Return + write to cache
```

The Rebrickable [CSV database downloads](https://rebrickable.com/downloads/) (updated daily) are imported into a local server-side cache on startup and refreshed every 24 hours. This eliminates live API calls for the ~99% of lookups involving sets already in the Rebrickable catalog.

---

### 7.5 Barcode Scanning — v1.5, Android APK Only

LEGO box barcodes are standard EAN-13 / UPC-A format. The encoded value maps to the LEGO set number.

**Lookup chain:**
1. User opens camera in the Android APK via Capacitor Camera plugin
2. Barcode library decodes EAN-13 from camera frame
3. Set number is extracted from the barcode value
4. Set number is passed to the Rebrickable lookup endpoint (proxied)
5. Set details returned and auto-populated in the Add Set form

> **Web note:** Barcode scanning is not available in the PWA/web version. Web users enter a set number directly or use name search. This is a deliberate scope decision, not a gap.

---

### 7.6 Platform Scope

| Platform | v1.0 | v1.5 | v2.0 | v3.0 | Notes |
|---|---|---|---|---|---|
| Web (PWA) | ✅ | ✅ | ✅ | ✅ | Primary delivery; works on all browsers including Android Chrome |
| Android APK (sideload) | — | ✅ | ✅ | ✅ | Capacitor build; installed via developer mode |
| Google Play Store | ❌ | ❌ | ❌ | ❌ | Explicitly out of scope |
| iOS / App Store | ❌ | ❌ | ❌ | ❌ | Explicitly out of scope — no iOS test devices |
| Desktop (Electron) | ❌ | ❌ | ❌ | ❌ | PWA covers desktop adequately |

---

## 8. UX & Design Approach

UI design is handled in **Figma Make**, leveraging AI-assisted frontend generation. Designs are exported to React and wired with logic using **Claude Code**.

| Screen / View | Description | v1.0 |
|---|---|---|
| Collection tab (default) | Grid of set cards. Sidebar filters by status and theme. Search bar and filter chips at top. Sold sets grayed but visible unless toggled off. | ✅ |
| Set detail view | Full set data, all editable fields, set image, purchase type badge, notes, price paid vs retail. | ✅ |
| Add Set flow | Three-method entry: set number (primary for web), name search, barcode (v1.5 APK only). API auto-fills set data; user fills personal fields. | ✅ |
| Wish List tab | Separate list of desired sets. Set image, name, number, retail price, user notes. PDF export button prominent. | ✅ |
| Insights tab | Stats cards + value chart + top sets table. | v1.5 |
| Settings | API preferences, data export (CSV), about page, GitHub link. | P2 |

**Design Principles:**
- **Organization-first** — status and purchase type are visible on every set card without opening the detail view.
- **Sold is not deleted** — sold sets remain in the collection log, distinguished visually and filterable.
- **Value is opt-in** — resale prices appear only in the Insights tab (v1.5); never on the default Collection view.
- **Wish list is shareable** — PDF export requires no app, no internet, no login to view.
- **Fast entry** — adding a set should take under 30 seconds via set number lookup on web.
- **Mobile-first** — all interactions work at 375px viewport width.

---

## 9. Data Model

> v1.0 stores all data locally in IndexedDB via Dexie.js. No account, login, or network connection required after initial set lookup. Data is exportable as CSV.

### Collection Set Record

| Field | Type | Source | Notes |
|---|---|---|---|
| `id` | UUID | System | Primary key; auto-generated |
| `userId` | UUID \| null | System / Auth | **Nullable in v1.0.** Populated in v2.0+. Privacy boundary in v3.0. See [ADR-004](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-004-userid-forward-compat.md) |
| `setNumber` | String | User / API | e.g. `75192`; used for Rebrickable lookup |
| `name` | String | Rebrickable API | e.g. `Millennium Falcon` |
| `theme` | String | Rebrickable API | e.g. `Star Wars` |
| `subTheme` | String | Rebrickable API | e.g. `Ultimate Collector Series` |
| `pieceCount` | Integer | Rebrickable API | |
| `minifigCount` | Integer | Rebrickable API | |
| `retailPrice` | Float \| null | **User input** ⚠️ | Official retail price in USD; not available from Rebrickable API |
| `pricePaid` | Float \| null | User input | What the user actually paid; nullable |
| `purchaseDate` | Date \| null | User input | ISO 8601; nullable |
| `purchaseType` | Enum \| null | User input | `NEW` \| `USED` |
| `purchaseSource` | String \| null | User input | Free text; nullable |
| `status` | Enum | User input | `UNBUILT` \| `BUILT` \| `SEALED` \| `SOLD` |
| `soldDate` | Date \| null | User input | Nullable; populated when status set to `SOLD` |
| `soldPrice` | Float \| null | User input | Nullable; what the user received when sold |
| `isRetired` | Boolean | Rebrickable API | Auto-flagged; not user-editable |
| `location` | String \| null | User input | Free text; nullable |
| `boxCondition` | Enum \| null | User input | `SEALED` \| `OPEN_GOOD` \| `NO_BOX` |
| `notes` | String \| null | User input | Free text; nullable |
| `imageUrl` | String \| null | Rebrickable API | Cached CDN URL for set thumbnail |
| `currentResaleValue` | Float \| null | External API | Nullable; v1.5 only; auto-updated |
| `dateAdded` | DateTime | System | When record was created |
| `dateUpdated` | DateTime | System | Last modification timestamp |

### Wish List Item Record

| Field | Type | Source | Notes |
|---|---|---|---|
| `id` | UUID | System | Primary key |
| `userId` | UUID \| null | System / Auth | **Nullable in v1.0.** Privacy enforcement boundary in v3.0. See [ADR-004](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-004-userid-forward-compat.md) |
| `setNumber` | String | User / API | Rebrickable lookup key |
| `name` | String | Rebrickable API | |
| `theme` | String | Rebrickable API | |
| `pieceCount` | Integer | Rebrickable API | |
| `retailPrice` | Float \| null | User input | Not available from Rebrickable API |
| `imageUrl` | String \| null | Rebrickable API | Used in PDF export |
| `priority` | Enum \| null | User input | `HIGH` \| `MEDIUM` \| `LOW` |
| `notes` | String \| null | User input | Free text; shown on PDF export |
| `dateAdded` | DateTime | System | When added to wish list |

---

## 10. Success Metrics

### Personal Use (Primary Goal — v1.0)
- Full collection of 100+ sets entered and actively maintained within 30 days of v1.0 launch.
- Both household users using the app weekly to track new purchases and status changes.
- Zero reliance on spreadsheet for collection tracking within 60 days of launch.
- At least one PDF wish list export used as a real gift guide within the first holiday/gifting season.

### Portfolio / Career Goal
- GitHub repository public with README, PRD (this document), and ADR files committed before first job application that references the project.
- Ability to speak confidently to 4+ technical decisions in interviews: API proxy architecture, APK sideload vs. Play Store, platform scoping rationale, barcode integration approach, PDF generation approach, userId forward-compatibility.
- Project listed on resume under Technical PM portfolio with a link to the GitHub repo.

### v1.5 Milestone
- Android APK successfully built and sideloaded onto personal device.
- Barcode scan successfully adds a set in under 10 seconds from scan to saved.
- Insights tab correctly calculates and displays collection value against price-paid data.

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Rebrickable API changes or deprecates endpoints | Low | High | CSV database download used as primary cache; live API as fallback only |
| API key exposed in client bundle | Low | High | [ADR-001](docs/ADR/ADR-001-api-proxy.md): all API calls proxied through backend; key never in client code |
| Rate limits hit (429 responses) | Medium | Medium | [ADR-002](docs/ADR/ADR-002-csv-cache.md): CSV cache reduces live API call volume by ~80–90% |
| Rebrickable API has no pricing data | **Confirmed** | Low | Retail price is user-entered in v1.0; resale value integration deferred to v1.5 |
| BrickDex name already in use | Low | Medium | Search conducted April 2026; no LEGO-space conflicts found |
| PDF export renders poorly on some devices | Medium | Low | Use well-supported client-side PDF library (jsPDF); test on multiple screen sizes |
| Sold status misunderstood (users expect deletion) | Medium | Low | Onboarding tooltip clarifies Sold = archived, not deleted; filter toggle provided |
| Solo developer bandwidth — scope creep | High | Medium | v1.0 scope locked to P0/P1 items in this document; v1.5+ features clearly deferred |
| LEGO trademark concerns | Low | High | App is unofficial fan tool; disclaimer in README and app; LEGO wordmark not used in logo |

---

## 12. Open Questions & Future Decisions

1. **Resale value data source (v1.5):** BrickEconomy does not have a public API. Options: (a) BrickLink API — requires partner approval; (b) manual price entry by user; (c) deep link out to BrickEconomy rather than integrating live data. Decision deferred to v1.5 planning.

2. **Sold price tracking UI:** When a user sets status to Sold, should the app immediately prompt for sold date and sold price, or allow those to be filled in later? Recommendation: prompt immediately with both fields optional/skippable.

3. **Wish list PDF format:** Single-column list vs. multi-column grid (like a gift registry). Grid uses less paper and shows more sets per page with thumbnails. Decision deferred to design phase.

4. **Multi-user architecture (v2.0):** Single-user accounts will use a standard JWT auth flow with email/password. Backend will be Node.js + Express with PostgreSQL. Cloud hosting provider (Railway, Fly.io, Supabase) to be evaluated at v2.0 planning time based on cost and complexity for a personal project.

5. **Household invite flow (v3.0):** Invite-by-link vs. invite-by-code. Link is simpler UX (one tap); code is safer for privacy (doesn't expose a guessable URL). Recommendation: code-based invite with expiry; evaluated at v3.0 planning time.

6. **Wish list privacy enforcement (v3.0):** Privacy must be enforced at the API/database level, not just the UI. The `userId` field on wish list records (added in v1.0 per [ADR-004](docs/ADR/ADR-004-userid-forward-compat.md)) is the enforcement mechanism — API queries for wish list data always include a `WHERE userId = currentUser` clause that cannot be overridden by client requests.

7. **Minifig ID source (v1.5):** Rebrickable has a minifig database. BrickLink also has one. Which source better covers rare/variant figs? Evaluate both at v1.5 planning time.

---

## 13. Revision History

| Version | Date | Author | Summary of Changes |
|---|---|---|---|
| 1.0 | April 2026 | William A. Evans | Initial draft. Market research, competitive analysis, feature requirements, tech architecture, data model, ADRs 001–002. |
| 1.1 | April 2026 | William A. Evans | Build statuses updated to Unbuilt / Built / Sealed / Sold. Added Purchase Type field (New/Used). Sold-specific fields added to data model. Wish list PDF export added as P0. Insights/value tab deferred to v1.5. Minifigure module added as v1.5 scope. Google Play Store removed; APK sideload + ADR-003 added. Release summary table added. |
| 1.2 | April 2026 | William A. Evans | v3.0 Household/Family Accounts added throughout. Goals section updated with v3.0 objectives. Section 6.8 added with household model, permission design, feature list F-39–F-47, and architecture implications. ADR-004 added: nullable `userId` field for forward-compatibility. Release summary expanded to v3.0 column. Open questions updated. Exec summary updated. **Retail price correction:** Rebrickable API v3 confirmed to not include pricing data — retail price field updated to user-entered throughout. Rebrickable API details section (7.3) added with confirmed endpoints, auth method, rate limit behavior, and pricing note. |

---

> *Next scheduled review: Upon completion of v1.0 MVP build. PRD will be updated to reflect implementation learnings and any scope changes made during development.*

---

*BrickDex is an independent, unofficial fan project. Not affiliated with or endorsed by the LEGO Group. LEGO® is a trademark of the LEGO Group. Set data sourced from the [Rebrickable API](https://rebrickable.com/api/).*
