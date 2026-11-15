import Link from "next/link";
import { CATEGORY_LABELS, type Listing } from "@/data/listings";
import { formatIDR } from "@/lib/format";

export function ListingCard({ listing }: { listing: Listing }) {
  const href = `/item?id=${encodeURIComponent(listing.id)}`;
  const photo = listing.photoUrls[0];

  return (
    <Link href={href} className="listing-card">
      <div
        className="listing-card__visual"
        style={{
          background: photo
            ? `center/cover url(${photo}), linear-gradient(145deg, ${listing.accent}, #0f1c18)`
            : `linear-gradient(145deg, ${listing.accent}, #0f1c18)`,
        }}
        aria-hidden
      >
        <span className="listing-card__condition">
          {listing.condition === "baru" ? "Baru" : "Bekas"}
        </span>
        <div className="listing-card__tags">
          {listing.meetupCod && (
            <span className="listing-card__category">COD</span>
          )}
          <span className="listing-card__category">
            {CATEGORY_LABELS[listing.category]}
          </span>
        </div>
      </div>
      <div className="listing-card__body">
        <h2 className="listing-card__title">{listing.title}</h2>
        <p className="listing-card__meta">
          {listing.city} · ★ {listing.sellerRating.toFixed(1)} ·{" "}
          {listing.sellerName}
        </p>
        <p className="listing-card__price">{formatIDR(listing.askPrice)}</p>
        <p className="listing-card__specs">
          {listing.batteryHealth != null
            ? `BH ${listing.batteryHealth}% · `
            : ""}
          {listing.fullset ? "Fullset" : "Tidak fullset"} · {listing.garansi}
          {listing.reported ? " · Dilaporkan" : ""}
        </p>
      </div>
    </Link>
  );
}
