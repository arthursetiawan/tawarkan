# TawarKan

Marketplace *tawar-menawar* for **phones & gadgets** in Indonesia.

Sellers list with an ask price. Buyers accept or counter. Sellers accept, decline, or counter back until **Sepakat** or walk-away. Listings and offer threads persist in **localStorage** (survives refresh).

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Client store (localStorage) + seed gadget listings

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

### Static export (GitHub Pages under `/demos/tawarkan`)

```bash
STATIC_EXPORT=1 npm run build
```

Copy `out/` into `arthursetiawan.github.io/demos/tawarkan/`.

## Product

See [PRODUCT.md](./PRODUCT.md) for the loop, persistence tradeoff, and deferred work.

## Repo

https://github.com/arthursetiawan/tawarkan

## Live demo

https://arthursetiawan.github.io/demos/tawarkan/
