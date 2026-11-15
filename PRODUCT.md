# TawarKan — product

## One-liner

**TawarKan** is an Indonesian bargaining (*tawar-menawar*) marketplace for **smartphones & gadgets**: sellers post an ask; buyers accept or counter; sellers accept, decline, or counter back until both sides **Sepakat** — or walk away.

## First vertical

Smartphones, audio, tablets, and wearables (new + *bekas*). Vehicles stay out of scope (MotorMarket). Fashion/cameras are later candidates — see the market brief.

## MVP loop

1. Set a **display name** (local identity — no OAuth).
2. Browse feed — search + category + condition (`baru` / `bekas`).
3. **Pasang listing** — photos (URL/placeholder), ask, condition, category, garansi, BH%, fullset, optional IMEI/serial, COD/ketemuan badge.
4. Open listing — trust signals + report action.
5. **Buyer** accepts ask or counters; **seller** accepts / declines / counters on the same listing (real dual-sided thread, not a one-shot simulation).
6. Offer history persists per buyer↔seller thread.

## Persistence & auth tradeoff

- **Store:** `localStorage` keys `tawarkan:v1:*` (listings, offer threads, identity). Survives refresh; suitable for the static GitHub Pages export.
- **Not** multi-device or multi-user sync — a hosted API + SQLite/Postgres would be the next step.
- **Auth:** display name + generated local `userId` only. Skips OAuth weight for the demo; anyone can rename themselves in the browser.

## Trust basics (MVP)

- Optional IMEI/serial on listing
- COD / ketemuan badge
- Report listing (client-side flag)

## Explicitly deferred

Payments, shipping, realtime sync, IMEI verification service, seller KYC, moderated reports.

## Success signals (later)

Offers per listing, accept rate, counter depth, time-to-agree — not vanity browse.
