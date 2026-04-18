# 🧱 BrickDex

> **Because 100+ LEGO sets deserve more than a spreadsheet.**

BrickDex is a personal LEGO collection tracker built for Adult Fans of LEGO (AFOLs) who want a clean, organized view of their collection — without the investment-focused framing of existing tools. Track build status, purchase history, and wish lists. Share a wish list with family at gift time. Keep it all in one place.

[![Status](https://img.shields.io/badge/status-in%20development-yellow)](https://github.com/waevans31681/brickdex)
[![Version](https://img.shields.io/badge/version-1.0--MVP-blue)](https://github.com/waevans31681/brickdex/blob/main/docs/PRD.md)
[![PRD](https://img.shields.io/badge/docs-PRD%20v1.2-informational)](https://github.com/waevans31681/brickdex/blob/main/docs/PRD.md)

---

## 📸 Screenshots

> 🚧 Screenshots coming soon — app is currently in active development.

---

## ✨ Features

### v1.0 — MVP *(in development)*
- 🔍 **Fast set entry** — look up any set by set number or name, auto-filled from the Rebrickable API
- 📦 **Build status tracking** — Unbuilt, Built, Sealed, or Sold
- 🏷️ **Purchase type** — know whether each set was bought New or Used
- 📍 **Location & notes** — track where a set is stored and any personal context
- 🔴 **Retired set detection** — automatically flagged via Rebrickable data
- ⭐ **Wish list** — separate from your owned collection
- 📄 **PDF wish list export** — shareable with family and friends who don't have the app; no login required to view
- 🔎 **Filter & search** — by status, theme, retired flag, purchase type, or free text

### v1.5 *(planned)*
- 💰 Insights & value dashboard — collection worth, appreciation, top sets by value
- 🧍 Minifigure tracking module — separate fig collection with rarity indicators
- 📱 Android APK build via Capacitor — sideloaded directly onto personal device
- 📷 Barcode scanning — point your camera at the box, set added automatically

### v2.0 *(planned)*
- ☁️ Optional user accounts with cloud sync across devices
- 📤 CSV bulk import from spreadsheets

### v3.0 *(planned)*
- 👨‍👩‍👧 Household / family accounts — shared collection, individual private wish lists
- 🎁 Gift-safe design — no household member can view another member's wish list

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| UI Design | Figma Make |
| State | Zustand |
| Local Storage | IndexedDB via Dexie.js |
| PDF Export | jsPDF / react-pdf |
| Set Data API | Rebrickable API v3 |
| Android (v1.5) | Capacitor |
| Backend (v2.0) | Node.js + Express |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A free [Rebrickable account](https://rebrickable.com/api/) to generate an API key

### Installation

```bash
# Clone the repo
git clone https://github.com/waevans31681/brickdex.git
cd brickdex

# Install dependencies
npm install

# Copy the environment variables template
cp .env.example .env
```

### Environment Variables

Open `.env` and add your Rebrickable API key:

```env
VITE_REBRICKABLE_API_KEY=your_api_key_here
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

### Run in Development

```bash
npm run dev
```

App will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📐 Architecture Notes

A few decisions worth calling out — full rationale in the [ADR docs](https://github.com/waevans31681/brickdex/tree/main/docs/ADR).

**API proxy pattern** — All Rebrickable API calls are routed through a lightweight backend function rather than called directly from the client. This keeps the API key out of the client bundle and enables response caching that reduces live API calls by ~80-90% for common set lookups. See [ADR-001](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-001-api-proxy.md) and [ADR-002](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-002-csv-cache.md).

**Android via sideload, not Play Store** — The Android build is distributed as a self-signed APK installed directly on a developer-mode device. No Play Store review process, no $25 fee, faster iteration. See [ADR-003](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-003-apk-sideload.md).

**Forward-compatible data model** — The v1.0 local data schema includes a nullable `userId` field on both the collection and wish list records, even though authentication doesn't exist yet. This avoids a destructive migration when user accounts ship in v2.0, and is the enforcement boundary for private wish lists in the v3.0 household model. See [ADR-004](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-004-userid-forward-compat.md).

---

## 🗺️ Roadmap

| Version | Focus | Status |
|---|---|---|
| v1.0 | Core collection tracking, API auto-fill, wish list + PDF export | 🔨 In development |
| v1.5 | Insights dashboard, minifigure module, Android APK, barcode scan | 📋 Planned |
| v2.0 | User accounts, cloud sync, CSV import | 📋 Planned |
| v3.0 | Household accounts, shared collection, private wish lists | 📋 Planned |

---

## 📂 Repository Structure

```
brickdex/
├── README.md
├── src/                  # React app source
│   ├── components/
│   ├── pages/
│   ├── store/            # Zustand state
│   └── db/               # Dexie.js schema & queries
├── docs/
│   ├── PRD.md            # Full Product Requirements Document
│   ├── CHANGELOG.md      # Version history
│   └── ADR/
│       ├── ADR-001-api-proxy.md
│       ├── ADR-002-csv-cache.md
│       ├── ADR-003-apk-sideload.md
│       └── ADR-004-userid-forward-compat.md
├── .env.example
└── package.json
```

---

## 📖 Documentation

| Document | Description |
|---|---|
| [PRD v1.2](https://github.com/waevans31681/brickdex/blob/main/docs/PRD.md) | Full product requirements, feature specs, data model, release roadmap |
| [ADR-001](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-001-api-proxy.md) | Why all API calls are proxied through the backend |
| [ADR-002](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-002-csv-cache.md) | Why we cache the Rebrickable CSV database locally |
| [ADR-003](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-003-apk-sideload.md) | Why Android distribution is APK sideload, not Play Store |
| [ADR-004](https://github.com/waevans31681/brickdex/blob/main/docs/ADR/ADR-004-userid-forward-compat.md) | Why userId is in the v1.0 schema before auth exists |
| [CHANGELOG](https://github.com/waevans31681/brickdex/blob/main/docs/CHANGELOG.md) | Version history and release notes |

---

## 🧩 Project Background

My wife and I are serious LEGO collectors — between us we have well over 100 sets spanning Star Wars, Botanical, Technic, Harry Potter, and more. Some are built and on display, some are sealed waiting for a rainy day, some we've sold. Keeping track of all of it in a spreadsheet was a mess, and none of the existing apps quite fit how we actually think about our collection. BrickDex is the tool we wanted but couldn't find.

This project is also a deliberate part of my professional development as a Product Manager. Building BrickDex gave me hands-on experience with the full product lifecycle — from market research and competitive analysis through architecture decisions, API design, data modeling, and implementation. Every major decision in this project is documented (see the ADRs and PRD above) because understanding *why* a product is built the way it is matters as much as the code itself.

---

## 👤 About the Author

**William A. Evans**
Senior Product Manager

[![GitHub](https://img.shields.io/badge/GitHub-waevans31681-181717?logo=github)](https://github.com/waevans31681)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-william--a--evans-0A66C2?logo=linkedin)](https://www.linkedin.com/in/william-a-evans)

---

## ⚠️ Disclaimer

BrickDex is an independent, unofficial fan project and is not affiliated with, endorsed by, or connected to the LEGO Group in any way. LEGO® is a trademark of the LEGO Group. Set data is sourced from the [Rebrickable API](https://rebrickable.com/api/).

---

## 📜 License

This project is for personal and portfolio use. See [LICENSE](LICENSE) for details.
