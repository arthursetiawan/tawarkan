import Link from "next/link";
import { notFound } from "next/navigation";
import { BargainPanel } from "@/components/BargainPanel";
import { SiteHeader } from "@/components/SiteHeader";
import { CATEGORY_LABELS, getListing, listings } from "@/data/listings";
import { formatIDR } from "@/lib/format";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return listings.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) return { title: "Listing · TawarKan" };
  return {
    title: `${listing.title} · TawarKan`,
    description: listing.description,
  };
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();

  return (
    <div className="page">
      <SiteHeader />
      <main className="detail">
        <Link href="/" className="back-link">
          ← Kembali ke feed
        </Link>

        <div className="detail__layout">
          <section className="detail__main">
            <div
              className="detail__hero"
              style={{
                background: `linear-gradient(150deg, ${listing.accent} 0%, #0c1613 70%)`,
              }}
            >
              <span className="detail__badge">
                {listing.condition === "baru" ? "Baru" : "Bekas"} ·{" "}
                {CATEGORY_LABELS[listing.category]}
              </span>
              <p className="detail__brand-mark">{listing.brand}</p>
            </div>

            <h1 className="detail__title">{listing.title}</h1>
            <p className="detail__ask">{formatIDR(listing.askPrice)}</p>
            <p className="detail__city">{listing.city}</p>
            <p className="detail__desc">{listing.description}</p>

            <dl className="spec-grid">
              <div>
                <dt>Garansi</dt>
                <dd>{listing.garansi}</dd>
              </div>
              <div>
                <dt>Battery health</dt>
                <dd>
                  {listing.batteryHealth != null
                    ? `${listing.batteryHealth}%`
                    : "N/A (baru / non-HP)"}
                </dd>
              </div>
              <div>
                <dt>Fullset</dt>
                <dd>{listing.fullset ? "Ya — box & aksesoris" : "Tidak lengkap"}</dd>
              </div>
              <div>
                <dt>Penjual</dt>
                <dd>
                  {listing.sellerName} · ★ {listing.sellerRating.toFixed(1)} (
                  {listing.sellerDeals} deal)
                </dd>
              </div>
            </dl>
          </section>

          <BargainPanel
            listingId={listing.id}
            askPrice={listing.askPrice}
            title={listing.title}
          />
        </div>
      </main>
    </div>
  );
}
