# TawarKan — product

## One-liner

**TawarKan** is an Indonesian bargaining (*tawar-menawar*) marketplace for **smartphones & gadgets**: sellers post an ask; buyers accept or counter until both sides **Sepakat** — or walk away.

## First vertical

Smartphones, audio, tablets, and wearables (new + *bekas*). Vehicles stay out of scope (MotorMarket). Fashion/cameras are later candidates — see the market brief.

## MVP loop

1. Browse feed — search + category + condition (`baru` / `bekas`).
2. Open listing — ask price, garansi, battery health %, fullset, seller rating.
3. Buyer **accepts ask** or **counters**.
4. Simulated seller responds: accept → **Sepakat**, counter → buyer accepts/walks, or decline → walk-away.
5. Bargain state persists in `sessionStorage` per listing (no auth/backend yet).

## Explicitly deferred

Payments, shipping, chat, IMEI verification, seller onboarding, and real-time multiplayer negotiation.

## Success signals (later)

Offers per listing, accept rate, counter depth, time-to-agree — not vanity browse.
