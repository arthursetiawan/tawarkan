# TawarKan

**TawarKan** — marketplace *tawar-menawar* for phones and gadgets in Indonesia. Sellers list with an ask; buyers accept or counter until **Sepakat** or walk away.

## Charter (program)

| | |
|---|---|
| **Business idea** | Marketplace bargaining and bidding — credible two-sided trade. |
| **North star** | Recruiters can open the demo and complete a believable accept → counter → re-counter loop in under a minute. |
| **Live demo** | https://arthursetiawan.github.io/tawarkan/ (static export via portfolio; see [Deploy](#deploy-github-pages)) |
| **Repo** | https://github.com/arthursetiawan/tawarkan |

### In scope (MVP)

- Browse feed — search, category, condition (`baru` / `bekas`).
- Listing detail — ask, trust cues (garansi, battery, fullset, seller rating).
- Bargain panel — accept ask, counter, seller simulation, **re-counter after seller counter**, offer timeline.
- Session persistence — `sessionStorage` per listing (no auth/backend).

### Non-goals

- Payments, shipping, chat, IMEI checks, seller onboarding, live multi-user negotiation.
- Vehicles (see [MotorMarket](https://github.com/arthursetiawan/motormarket)).

### Success signals (later)

Offers per listing, accept rate, counter depth, time-to-agree — not vanity browse alone.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Static seed listings (ponsel, audio, tablet, wearable)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

## Product

See [PRODUCT.md](./PRODUCT.md) for the loop, scope, and deferred work.

## Deploy (GitHub Pages)

Portfolio hosts the static build under `demos/tawarkan/` (public URL may redirect from `/tawarkan/`).

```bash
STATIC_EXPORT=1 npm run build
# sync `out/` → arthursetiawan.github.io/demos/tawarkan/
rsync -a --delete out/ path/to/arthursetiawan.github.io/demos/tawarkan/
```

`STATIC_EXPORT=1` sets `output: "export"`, `basePath` / `assetPrefix` `/demos/tawarkan`, and `images.unoptimized`. Local dev omits `STATIC_EXPORT` (root path).