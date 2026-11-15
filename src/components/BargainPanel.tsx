"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/components/StoreProvider";
import { formatIDR } from "@/lib/format";
import {
  isTerminal,
  lastOffer,
  type OfferThread,
} from "@/lib/offers";
import type { Listing } from "@/data/listings";

type Props = {
  listing: Listing;
};

function OfferTimeline({ thread }: { thread: OfferThread }) {
  if (thread.offers.length === 0) return null;
  return (
    <ol className="bargain__timeline">
      {thread.offers.map((offer) => (
        <li key={offer.id}>
          <span className="bargain__who">
            {offer.side === "buyer" ? thread.buyerName : "Penjual"}
          </span>
          <span className="bargain__amt">{formatIDR(offer.amount)}</span>
          <span className="bargain__note">{offer.note}</span>
        </li>
      ))}
    </ol>
  );
}

function StatusBanner({ thread }: { thread: OfferThread }) {
  if (thread.status === "sepakat") {
    return (
      <div className="bargain__banner bargain__banner--win" role="status">
        <p className="bargain__banner-title">Sepakat!</p>
        <p>
          Deal di <strong>{formatIDR(thread.agreedPrice ?? 0)}</strong> dengan{" "}
          {thread.buyerName}.
        </p>
      </div>
    );
  }
  if (thread.status === "walk_away") {
    return (
      <div className="bargain__banner bargain__banner--out" role="status">
        <p className="bargain__banner-title">Walk away</p>
        <p>Pembeli menghentikan nego pada thread ini.</p>
      </div>
    );
  }
  if (thread.status === "declined") {
    return (
      <div className="bargain__banner bargain__banner--out" role="status">
        <p className="bargain__banner-title">Ditolak penjual</p>
        <p>Penawaran terakhir ditolak. Pembeli bisa buka thread baru nanti.</p>
      </div>
    );
  }
  return null;
}

export function BargainPanel({ listing }: Props) {
  const {
    ready,
    identity,
    getBuyerThread,
    getThreadsForListing,
    buyerStartAcceptAsk,
    buyerStartCounter,
    buyerAcceptSellerCounter,
    buyerWalk,
    sellerAcceptOffer,
    sellerDeclineOffer,
    sellerSendCounter,
  } = useStore();

  const [counterInput, setCounterInput] = useState(
    String(Math.round(listing.askPrice * 0.92)),
  );
  const [sellerCounterInput, setSellerCounterInput] = useState(
    String(Math.round(listing.askPrice * 0.96)),
  );
  const [error, setError] = useState<string | null>(null);
  const [activeSellerThreadId, setActiveSellerThreadId] = useState<string | null>(
    null,
  );

  const isSeller = ready && identity?.id === listing.sellerId;
  const buyerThread = getBuyerThread(listing.id);
  const sellerThreads = useMemo(
    () => getThreadsForListing(listing.id),
    [getThreadsForListing, listing.id],
  );

  const activeSellerThread =
    sellerThreads.find((t) => t.id === activeSellerThreadId) ??
    sellerThreads.find((t) => !isTerminal(t.status)) ??
    sellerThreads[0];

  function parseAmount(raw: string): number | null {
    const amount = Number(raw.replace(/\D/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) return null;
    return amount;
  }

  function onBuyerCounter() {
    const amount = parseAmount(counterInput);
    if (amount == null) {
      setError("Masukkan nominal penawaran yang valid.");
      return;
    }
    if (amount >= listing.askPrice) {
      setError("Counter harus di bawah harga ask — atau terima ask.");
      return;
    }
    if (amount < Math.round(listing.askPrice * 0.5)) {
      setError("Penawaran terlalu rendah.");
      return;
    }
    setError(null);
    buyerStartCounter(listing.id, amount);
  }

  function onSellerCounter(threadId: string) {
    const amount = parseAmount(sellerCounterInput);
    if (amount == null) {
      setError("Masukkan nominal counter penjual yang valid.");
      return;
    }
    if (amount > listing.askPrice) {
      setError("Counter penjual tidak boleh di atas ask.");
      return;
    }
    const thread = sellerThreads.find((t) => t.id === threadId);
    const buyerLast = thread ? lastOffer(thread, "buyer") : undefined;
    if (buyerLast && amount <= buyerLast.amount) {
      setError("Counter penjual harus di atas tawaran pembeli, atau terima.");
      return;
    }
    setError(null);
    sellerSendCounter(threadId, amount);
  }

  if (!ready) {
    return (
      <aside className="bargain">
        <p>Memuat tawar-menawar…</p>
      </aside>
    );
  }

  if (isSeller) {
    return (
      <aside className="bargain" aria-labelledby="bargain-title">
        <div className="bargain__head">
          <h2 id="bargain-title">Inbox tawaran</h2>
          <p>
            Kamu penjual listing ini. Ask:{" "}
            <strong>{formatIDR(listing.askPrice)}</strong>
          </p>
        </div>

        {sellerThreads.length === 0 && (
          <p className="bargain__empty">
            Belum ada tawaran. Bagikan listing atau tunggu pembeli counter.
          </p>
        )}

        {sellerThreads.length > 0 && (
          <div className="thread-tabs" role="tablist" aria-label="Thread pembeli">
            {sellerThreads.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                className={
                  activeSellerThread?.id === t.id
                    ? "chip chip--active"
                    : "chip"
                }
                onClick={() => setActiveSellerThreadId(t.id)}
              >
                {t.buyerName}
                {t.status === "sepakat" ? " · ✓" : ""}
              </button>
            ))}
          </div>
        )}

        {activeSellerThread && (
          <>
            <StatusBanner thread={activeSellerThread} />
            <p className="bargain__meta">
              Status: <strong>{activeSellerThread.status}</strong>
            </p>

            {activeSellerThread.status === "awaiting_seller" && (
              <div className="bargain__form">
                <p>
                  Menunggu responsmu pada{" "}
                  <strong>
                    {formatIDR(
                      lastOffer(activeSellerThread, "buyer")?.amount ??
                        listing.askPrice,
                    )}
                  </strong>
                </p>
                <div className="bargain__actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => sellerAcceptOffer(activeSellerThread.id)}
                  >
                    Terima
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => sellerDeclineOffer(activeSellerThread.id)}
                  >
                    Tolak
                  </button>
                </div>
                <div className="bargain__or">atau counter</div>
                <label className="field">
                  <span>Counter penjual (IDR)</span>
                  <input
                    inputMode="numeric"
                    value={sellerCounterInput}
                    onChange={(e) => setSellerCounterInput(e.target.value)}
                  />
                </label>
                {error && <p className="field__error">{error}</p>}
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => onSellerCounter(activeSellerThread.id)}
                >
                  Kirim counter
                </button>
              </div>
            )}

            <OfferTimeline thread={activeSellerThread} />
          </>
        )}
      </aside>
    );
  }

  // Buyer view
  const locked = buyerThread ? isTerminal(buyerThread.status) : false;
  const awaitingSeller = buyerThread?.status === "awaiting_seller";
  const awaitingBuyer = buyerThread?.status === "awaiting_buyer";

  return (
    <aside className="bargain" aria-labelledby="bargain-title">
      <div className="bargain__head">
        <h2 id="bargain-title">Tawar sekarang</h2>
        <p>
          Ask penjual: <strong>{formatIDR(listing.askPrice)}</strong>
        </p>
        <p className="bargain__meta">
          Sebagai <strong>{identity?.displayName}</strong>
        </p>
      </div>

      {buyerThread && <StatusBanner thread={buyerThread} />}

      {awaitingSeller && (
        <div className="bargain__banner bargain__banner--counter" role="status">
          <p className="bargain__banner-title">Menunggu penjual</p>
          <p>
            Tawaranmu terkirim. Penjual bisa terima, tolak, atau counter — bukan
            simulasi otomatis.
          </p>
        </div>
      )}

      {awaitingBuyer && buyerThread && (
        <div className="bargain__banner bargain__banner--counter" role="status">
          <p className="bargain__banner-title">Penjual counter</p>
          <p>
            Penjual tawar balik{" "}
            <strong>
              {formatIDR(lastOffer(buyerThread, "seller")?.amount ?? 0)}
            </strong>
            .
          </p>
          <div className="bargain__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => buyerAcceptSellerCounter(buyerThread.id)}
            >
              Terima counter
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => buyerWalk(buyerThread.id)}
            >
              Walk away
            </button>
          </div>
          <div className="bargain__or">atau counter lagi</div>
          <label className="field">
            <span>Nominal counter (IDR)</span>
            <input
              inputMode="numeric"
              value={counterInput}
              onChange={(e) => setCounterInput(e.target.value)}
            />
          </label>
          {error && <p className="field__error">{error}</p>}
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onBuyerCounter}
          >
            Kirim counter
          </button>
        </div>
      )}

      {!locked && !awaitingSeller && !awaitingBuyer && (
        <div className="bargain__form">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              setError(null);
              buyerStartAcceptAsk(listing.id);
            }}
          >
            Terima harga ask
          </button>

          <div className="bargain__or">atau counter</div>

          <label className="field">
            <span>Nominal counter (IDR)</span>
            <input
              inputMode="numeric"
              value={counterInput}
              onChange={(e) => setCounterInput(e.target.value)}
              placeholder="Mis. 13500000"
            />
          </label>
          {error && <p className="field__error">{error}</p>}
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onBuyerCounter}
          >
            Kirim counter
          </button>
        </div>
      )}

      {buyerThread && <OfferTimeline thread={buyerThread} />}
    </aside>
  );
}
