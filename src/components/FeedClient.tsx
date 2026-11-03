"use client";

import { useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  listings,
  type Category,
  type Condition,
} from "@/data/listings";
import { ListingCard } from "@/components/ListingCard";

const CATEGORIES: Array<Category | "semua"> = [
  "semua",
  "ponsel",
  "audio",
  "tablet",
  "wearable",
];

const CONDITIONS: Array<Condition | "semua"> = ["semua", "baru", "bekas"];

export function FeedClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "semua">("semua");
  const [condition, setCondition] = useState<Condition | "semua">("semua");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((item) => {
      if (category !== "semua" && item.category !== category) return false;
      if (condition !== "semua" && item.condition !== condition) return false;
      if (!q) return true;
      const hay = `${item.title} ${item.brand} ${item.city} ${item.sellerName}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, category, condition]);

  return (
    <section className="feed">
      <div className="feed__intro">
        <h1 className="feed__headline">Cari, tawar, sepakat</h1>
        <p className="feed__sub">
          Ponsel, audio, tablet, dan wearable — harga ask jelas, counter langsung.
        </p>
      </div>

      <div className="feed__controls">
        <label className="search">
          <span className="sr-only">Cari listing</span>
          <input
            type="search"
            placeholder="Cari iPhone, Buds, iPad, Watch…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <div className="chips" role="group" aria-label="Kategori">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={category === c ? "chip chip--active" : "chip"}
              onClick={() => setCategory(c)}
            >
              {c === "semua" ? "Semua" : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        <div className="chips" role="group" aria-label="Kondisi">
          {CONDITIONS.map((c) => (
            <button
              key={c}
              type="button"
              className={condition === c ? "chip chip--active" : "chip"}
              onClick={() => setCondition(c)}
            >
              {c === "semua" ? "Baru & bekas" : c === "baru" ? "Baru" : "Bekas"}
            </button>
          ))}
        </div>
      </div>

      <p className="feed__count">
        {filtered.length} listing
        {query || category !== "semua" || condition !== "semua"
          ? " cocok filter"
          : ""}
      </p>

      <div className="listing-grid">
        {filtered.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="feed__empty">
          Tidak ada listing. Coba ubah kata kunci atau filter.
        </p>
      )}
    </section>
  );
}
