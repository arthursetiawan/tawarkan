"use client";

import { useEffect, useState } from "react";
import {
  acceptAsk,
  acceptSellerCounter,
  clearBargainState,
  declineAndWalkAway,
  initialBargainState,
  loadBargainState,
  saveBargainState,
  submitCounter,
  type BargainState,
} from "@/lib/bargain";
import { formatIDR } from "@/lib/format";

type Props = {
  listingId: string;
  askPrice: number;
  title: string;
};

export function BargainPanel({ listingId, askPrice, title }: Props) {
  const [state, setState] = useState<BargainState>(() =>
    initialBargainState(listingId, askPrice),
  );
  const [hydrated, setHydrated] = useState(false);
  const [counterInput, setCounterInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadBargainState(listingId, askPrice);
    setState(loaded);
    if (loaded.lastBuyerOffer != null) {
      setCounterInput(String(loaded.lastBuyerOffer));
    } else {
      setCounterInput(String(Math.round(askPrice * 0.92)));
    }
    setHydrated(true);
  }, [listingId, askPrice]);

  useEffect(() => {
    if (!hydrated) return;
    saveBargainState(state);
  }, [state, hydrated]);

  function apply(next: BargainState) {
    setState(next);
    setError(null);
  }

  function onAcceptAsk() {
    apply(acceptAsk(state));
  }

  function onSubmitCounter() {
    const amount = Number(counterInput.replace(/\D/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Masukkan nominal penawaran yang valid.");
      return;
    }
    if (amount >= askPrice) {
      setError("Counter harus di bawah harga ask — atau terima ask.");
      return;
    }
    if (amount < Math.round(askPrice * 0.5)) {
      setError("Penawaran terlalu rendah untuk MVP simulasi ini.");
      return;
    }
    apply(submitCounter(state, amount));
  }

  function onAcceptCounter() {
    apply(acceptSellerCounter(state));
  }

  function onWalkAway() {
    apply(declineAndWalkAway(state));
  }

  function onReset() {
    clearBargainState(listingId);
    const fresh = initialBargainState(listingId, askPrice);
    setState(fresh);
    setCounterInput(String(Math.round(askPrice * 0.92)));
    setError(null);
  }

  const locked = state.phase === "sepakat" || state.phase === "walk_away";

  return (
    <aside className="bargain" aria-labelledby="bargain-title">
      <div className="bargain__head">
        <h2 id="bargain-title">Tawar sekarang</h2>
        <p>
          Ask penjual: <strong>{formatIDR(askPrice)}</strong>
        </p>
      </div>

      {state.phase === "sepakat" && (
        <div className="bargain__banner bargain__banner--win" role="status">
          <p className="bargain__banner-title">Sepakat!</p>
          <p>
            {title} — deal di <strong>{formatIDR(state.agreedPrice ?? 0)}</strong>.
            Simulasi MVP; belum ada checkout.
          </p>
        </div>
      )}

      {state.phase === "walk_away" && (
        <div className="bargain__banner bargain__banner--out" role="status">
          <p className="bargain__banner-title">Walk away</p>
          <p>Negosiasi berhenti. Reset untuk coba lagi di sesi ini.</p>
        </div>
      )}

      {state.phase === "seller_counter" && state.lastSellerOffer != null && (
        <div className="bargain__banner bargain__banner--counter" role="status">
          <p className="bargain__banner-title">Penjual counter</p>
          <p>
            Penjual tawar balik{" "}
            <strong>{formatIDR(state.lastSellerOffer)}</strong>. Terima atau walk
            away.
          </p>
          <div className="bargain__actions">
            <button type="button" className="btn btn--primary" onClick={onAcceptCounter}>
              Terima counter
            </button>
            <button type="button" className="btn btn--ghost" onClick={onWalkAway}>
              Walk away
            </button>
          </div>
        </div>
      )}

      {!locked && state.phase !== "seller_counter" && (
        <div className="bargain__form">
          <button type="button" className="btn btn--primary" onClick={onAcceptAsk}>
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
          <button type="button" className="btn btn--secondary" onClick={onSubmitCounter}>
            Kirim counter
          </button>
        </div>
      )}

      {state.offers.length > 0 && (
        <ol className="bargain__timeline">
          {state.offers.map((offer) => (
            <li key={offer.id}>
              <span className="bargain__who">
                {offer.side === "buyer" ? "Kamu" : "Penjual"}
              </span>
              <span className="bargain__amt">{formatIDR(offer.amount)}</span>
              <span className="bargain__note">{offer.note}</span>
            </li>
          ))}
        </ol>
      )}

      <button type="button" className="btn btn--link" onClick={onReset}>
        Reset tawar (session)
      </button>
    </aside>
  );
}
