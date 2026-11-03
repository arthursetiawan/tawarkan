export type BargainPhase =
  | "idle"
  | "awaiting_seller"
  | "seller_counter"
  | "sepakat"
  | "walk_away";

export type OfferSide = "buyer" | "seller";

export type Offer = {
  id: string;
  side: OfferSide;
  amount: number;
  note: string;
  at: string;
};

export type BargainState = {
  listingId: string;
  askPrice: number;
  phase: BargainPhase;
  agreedPrice: number | null;
  lastBuyerOffer: number | null;
  lastSellerOffer: number | null;
  offers: Offer[];
};

const STORAGE_PREFIX = "tawarkan:bargain:";

export function storageKey(listingId: string): string {
  return `${STORAGE_PREFIX}${listingId}`;
}

export function initialBargainState(
  listingId: string,
  askPrice: number,
): BargainState {
  return {
    listingId,
    askPrice,
    phase: "idle",
    agreedPrice: null,
    lastBuyerOffer: null,
    lastSellerOffer: null,
    offers: [],
  };
}

export function loadBargainState(
  listingId: string,
  askPrice: number,
): BargainState {
  if (typeof window === "undefined") {
    return initialBargainState(listingId, askPrice);
  }
  try {
    const raw = sessionStorage.getItem(storageKey(listingId));
    if (!raw) return initialBargainState(listingId, askPrice);
    const parsed = JSON.parse(raw) as BargainState;
    if (parsed.listingId !== listingId) {
      return initialBargainState(listingId, askPrice);
    }
    return { ...parsed, askPrice };
  } catch {
    return initialBargainState(listingId, askPrice);
  }
}

export function saveBargainState(state: BargainState): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(storageKey(state.listingId), JSON.stringify(state));
}

export function clearBargainState(listingId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(storageKey(listingId));
}

function makeOffer(side: OfferSide, amount: number, note: string): Offer {
  return {
    id: `${side}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    side,
    amount,
    note,
    at: new Date().toISOString(),
  };
}

/** Simulated seller: accept near ask, counter mid-gap, or walk away if too low. */
export function simulateSellerResponse(
  state: BargainState,
  buyerAmount: number,
): BargainState {
  const ask = state.askPrice;
  const floor = Math.round(ask * 0.86);
  const sweet = Math.round(ask * 0.95);
  const offers = [...state.offers];

  if (buyerAmount >= sweet) {
    const note =
      buyerAmount >= ask
        ? "Deal. Harga ask diterima."
        : "Oke, selisihnya kecil — sepakat.";
    offers.push(makeOffer("seller", buyerAmount, note));
    return {
      ...state,
      phase: "sepakat",
      agreedPrice: buyerAmount,
      lastBuyerOffer: buyerAmount,
      lastSellerOffer: buyerAmount,
      offers,
    };
  }

  if (buyerAmount < floor) {
    offers.push(
      makeOffer(
        "seller",
        ask,
        "Terlalu jauh dari ask. Maaf, saya walk away dulu.",
      ),
    );
    return {
      ...state,
      phase: "walk_away",
      lastBuyerOffer: buyerAmount,
      offers,
    };
  }

  const gap = ask - buyerAmount;
  const counter = Math.min(
    ask - 25_000,
    Math.round(buyerAmount + gap * 0.55),
  );
  const rounded = Math.round(counter / 50_000) * 50_000;
  const sellerAmount = Math.max(buyerAmount + 50_000, Math.min(ask, rounded));

  offers.push(
    makeOffer(
      "seller",
      sellerAmount,
      `Bisa turun ke ${sellerAmount.toLocaleString("id-ID")}. Yuk ketemu di situ.`,
    ),
  );

  return {
    ...state,
    phase: "seller_counter",
    lastBuyerOffer: buyerAmount,
    lastSellerOffer: sellerAmount,
    offers,
  };
}

export function acceptAsk(state: BargainState): BargainState {
  const offers = [
    ...state.offers,
    makeOffer("buyer", state.askPrice, "Terima harga ask."),
  ];
  const next: BargainState = {
    ...state,
    phase: "awaiting_seller",
    lastBuyerOffer: state.askPrice,
    offers,
  };
  return simulateSellerResponse(next, state.askPrice);
}

export function submitCounter(
  state: BargainState,
  amount: number,
): BargainState {
  const offers = [
    ...state.offers,
    makeOffer("buyer", amount, "Penawaran pembeli."),
  ];
  const next: BargainState = {
    ...state,
    phase: "awaiting_seller",
    lastBuyerOffer: amount,
    offers,
  };
  return simulateSellerResponse(next, amount);
}

export function acceptSellerCounter(state: BargainState): BargainState {
  if (state.lastSellerOffer == null) return state;
  const amount = state.lastSellerOffer;
  const offers = [
    ...state.offers,
    makeOffer("buyer", amount, "Terima counter penjual."),
  ];
  return {
    ...state,
    phase: "sepakat",
    agreedPrice: amount,
    lastBuyerOffer: amount,
    offers,
  };
}

export function declineAndWalkAway(state: BargainState): BargainState {
  const offers = [
    ...state.offers,
    makeOffer("buyer", state.lastBuyerOffer ?? 0, "Pembeli walk away."),
  ];
  return {
    ...state,
    phase: "walk_away",
    offers,
  };
}
