# ADR-001: Proxy Rebrickable API Calls Through the Backend

| Field | Detail |
|---|---|
| **Status** | Accepted |
| **Date** | April 2026 |
| **Author** | William A. Evans |
| **Relates to** | API architecture, security, rate limiting |

---

## Context

BrickDex relies on the [Rebrickable API v3](https://rebrickable.com/api/) to auto-fill set data (name, theme, piece count, minifigure count, retail price, set image) whenever a user adds a set by number or name search. To use this API, a personal API key is required.

There were two architectural options for how the client app calls this API:

**Option A — Direct client-side calls**
The React frontend calls the Rebrickable API directly from the browser, with the API key stored in a client-side environment variable (e.g. `VITE_REBRICKABLE_API_KEY`).

**Option B — Backend proxy**
The React frontend calls an endpoint on our own backend. The backend holds the API key in a server-side environment variable and forwards the request to Rebrickable on the client's behalf.

---

## Decision

**We use Option B — all Rebrickable API calls are proxied through the backend.**

The API key is stored exclusively in a server-side environment variable. It is never included in the client bundle, never exposed in network requests visible to the browser, and never committed to the repository.

---

## Rationale

**1. API key security**
Any value stored in a `VITE_` prefixed environment variable in a Vite/React app is compiled directly into the JavaScript bundle served to the browser. It is trivially extractable by anyone who opens DevTools → Sources. A Rebrickable API key exposed this way could be harvested and used by third parties, burning through rate limits or violating Rebrickable's terms of service.

**2. Response caching**
With a backend proxy in place, we can cache Rebrickable responses server-side. A set like `#75192` (Millennium Falcon) will be looked up by many users — with direct client calls, each user generates a separate API request. With a proxy and cache, the first lookup fetches from Rebrickable and stores the result; all subsequent lookups for the same set number are served from cache. Combined with ADR-002 (CSV pre-seeding), this reduces live Rebrickable API calls by an estimated 80–90%.

**3. Future flexibility**
If Rebrickable changes their API structure, introduces new authentication requirements, or if we decide to switch to a different data source (e.g. the BrickSet API), we change one server-side file. The client-side code requires no modification. Consumers of our internal API endpoint are fully insulated from upstream changes.

**4. Rate limit management**
Rebrickable's free tier allows approximately 1 request/second per API key. With direct client calls and multiple users, this limit would be hit almost immediately at any meaningful scale. The backend proxy is the natural place to implement request queuing, throttling, and cache-first logic.

---

## Trade-offs

| Pro | Con |
|---|---|
| API key never exposed in client bundle | Adds a backend dependency not strictly needed for single-user local use |
| Enables server-side caching | Adds one network hop (client → our backend → Rebrickable) |
| Single point to swap data sources | Backend must be running for set lookup to work |
| Rate limiting and queuing in one place | Slightly more complex local development setup |

The cons are accepted. For v1.0 single-user use, the proxy is a lightweight serverless function (minimal overhead). The security and caching benefits outweigh the added complexity at every stage of the roadmap.

---

## Implementation Notes

- In **v1.0**, the proxy is implemented as a simple serverless function (e.g. a Vite dev proxy or a single Express route). No full backend server is required.
- In **v2.0**, when a full Node.js + Express backend is introduced for user accounts, the proxy logic migrates into that backend naturally — no client-side changes needed.
- Cache TTL for set data: **24 hours** is appropriate. Set metadata (piece count, name, theme) rarely changes. Retail price may change; if price freshness becomes important, TTL can be shortened independently.
- The `.env.example` file in the repo root documents the required variable name (`REBRICKABLE_API_KEY`) without exposing a real value.
