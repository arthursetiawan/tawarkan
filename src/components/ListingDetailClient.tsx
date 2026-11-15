"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BargainPanel } from "@/components/BargainPanel";
import { SiteHeader } from "@/components/SiteHeader";
import { useStore } from "@/components/StoreProvider";
import { CATEGORY_LABELS } from "@/data/listings";
import { formatIDR } from "@/lib/format";

type Props = {
  listingId: string;
};

export function ListingDetailClient({ listingId }: Props) {
  const { ready, listings, reportListing, identity } = useStore();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportNote, setReportNote] = useState("");
  const [reportDone, setReportDone] = useState(false);

  const listing = useMemo(
    () => listings.find((l) => l.id === listingId),
    [listings, listingId],
  );

  if (!ready) {
    return (
      <div className="page">
        <SiteHeader />
        <main className="detail">
          <p>Memuat listing…</p>
        </main>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="page">
        <SiteHeader />
        <main className="detail">
          <Link href="/" className="back-link">
            ← Kembali ke feed
          </Link>
          <h1 className="detail__title">Listing tidak ditemukan</h1>
          <p className="detail__desc">
            Mungkin sudah dihapus, atau ID salah. Listing buatan pengguna
            tersimpan di browser ini (localStorage).
          </p>
        </main>
      </div>
    );
  }

  const isOwner = identity?.id === listing.sellerId;
  const photo = listing.photoUrls[0];

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
                background: photo
                  ? `center/cover url(${photo}), linear-gradient(150deg, ${listing.accent} 0%, #0c1613 70%)`
                  : `linear-gradient(150deg, ${listing.accent} 0%, #0c1613 70%)`,
              }}
            >
              <span className="detail__badge">
                {listing.condition === "baru" ? "Baru" : "Bekas"} ·{" "}
                {CATEGORY_LABELS[listing.category]}
              </span>
              <div className="detail__hero-badges">
                {listing.meetupCod && (
                  <span className="trust-badge">COD / Ketemuan</span>
                )}
                {listing.reported && (
                  <span className="trust-badge trust-badge--warn">Dilaporkan</span>
                )}
              </div>
              <p className="detail__brand-mark">{listing.brand}</p>
            </div>

            {listing.photoUrls.length > 1 && (
              <ul className="photo-row">
                {listing.photoUrls.map((url) => (
                  <li key={url}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" />
                  </li>
                ))}
              </ul>
            )}

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
                <dd>
                  {listing.fullset ? "Ya — box & aksesoris" : "Tidak lengkap"}
                </dd>
              </div>
              <div>
                <dt>IMEI / serial</dt>
                <dd>{listing.imeiSerial ?? "Tidak dicantumkan"}</dd>
              </div>
              <div>
                <dt>COD / ketemuan</dt>
                <dd>{listing.meetupCod ? "Ya" : "Tidak / kirim saja"}</dd>
              </div>
              <div>
                <dt>Penjual</dt>
                <dd>
                  {listing.sellerName} · ★ {listing.sellerRating.toFixed(1)} (
                  {listing.sellerDeals} deal)
                  {isOwner ? " · (kamu)" : ""}
                </dd>
              </div>
            </dl>

            {!isOwner && (
              <div className="report-block">
                {!listing.reported && !reportDone && !reportOpen && (
                  <button
                    type="button"
                    className="btn btn--link"
                    onClick={() => setReportOpen(true)}
                  >
                    Laporkan listing
                  </button>
                )}
                {reportOpen && !reportDone && (
                  <form
                    className="report-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      reportListing(listing.id, reportNote);
                      setReportDone(true);
                      setReportOpen(false);
                    }}
                  >
                    <label className="field">
                      <span>Alasan laporan (opsional)</span>
                      <input
                        value={reportNote}
                        onChange={(e) => setReportNote(e.target.value)}
                        placeholder="Spam, harga tipu, barang curian…"
                      />
                    </label>
                    <div className="bargain__actions">
                      <button type="submit" className="btn btn--secondary">
                        Kirim laporan
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => setReportOpen(false)}
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                )}
                {(listing.reported || reportDone) && (
                  <p className="report-done" role="status">
                    Terima kasih — listing ditandai untuk ditinjau (MVP lokal).
                  </p>
                )}
              </div>
            )}
          </section>

          <BargainPanel listing={listing} />
        </div>
      </main>
    </div>
  );
}
