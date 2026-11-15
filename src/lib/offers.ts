import { createId } from "@/lib/id";

export type OfferSide = "buyer" | "seller";

export type OfferStatus =
  | "open"
  | "awaiting_buyer"
  | "awaiting_seller"
  | "sepakat"
  | "declined"
  | "walk_away";

export type Offer = {
  id: string;
  side: OfferSide;
  amount: number;
  note: string;
  at: string;
  action: "offer" | "accept" | "decline" | "counter" | "walk_away";
};

export type OfferThread = {
  id: string;
  listingId: string;
  askPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  status: OfferStatus;
  agreedPrice: number | null;
  offers: Offer[];
  updatedAt: string;
};

export function makeOffer(
  side: OfferSide,
  amount: number,
  note: string,
  action: Offer["action"],
): Offer {
  return {
    id: createId("offer"),
    side,
    amount,
    note,
    at: new Date().toISOString(),
    action,
  };
}

export function createThread(input: {
  listingId: string;
  askPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
}): OfferThread {
  const now = new Date().toISOString();
  return {
    id: createId("thread"),
    listingId: input.listingId,
    askPrice: input.askPrice,
    buyerId: input.buyerId,
    buyerName: input.buyerName,
    sellerId: input.sellerId,
    status: "open",
    agreedPrice: null,
    offers: [],
    updatedAt: now,
  };
}

function withOffer(thread: OfferThread, offer: Offer, status: OfferStatus, agreedPrice: number | null = null): OfferThread {
  return {
    ...thread,
    status,
    agreedPrice,
    offers: [...thread.offers, offer],
    updatedAt: offer.at,
  };
}

/** Buyer accepts the ask price. */
export function buyerAcceptAsk(thread: OfferThread): OfferThread {
  const offer = makeOffer(
    "buyer",
    thread.askPrice,
    "Pembeli terima harga ask.",
    "accept",
  );
  return withOffer(thread, offer, "awaiting_seller");
}

/** Buyer sends a counter below ask. */
export function buyerCounter(thread: OfferThread, amount: number): OfferThread {
  const offer = makeOffer("buyer", amount, "Counter pembeli.", "counter");
  return withOffer(thread, offer, "awaiting_seller");
}

/** Buyer accepts the latest seller counter. */
export function buyerAcceptCounter(thread: OfferThread, amount: number): OfferThread {
  const offer = makeOffer(
    "buyer",
    amount,
    "Pembeli terima counter penjual.",
    "accept",
  );
  return withOffer(thread, offer, "sepakat", amount);
}

/** Buyer walks away. */
export function buyerWalkAway(thread: OfferThread): OfferThread {
  const last = thread.offers.filter((o) => o.side === "buyer").at(-1);
  const offer = makeOffer(
    "buyer",
    last?.amount ?? 0,
    "Pembeli walk away.",
    "walk_away",
  );
  return withOffer(thread, offer, "walk_away");
}

/** Seller accepts the latest buyer offer (or ask accept). */
export function sellerAccept(thread: OfferThread, amount: number): OfferThread {
  const offer = makeOffer(
    "seller",
    amount,
    "Penjual setuju — Sepakat!",
    "accept",
  );
  return withOffer(thread, offer, "sepakat", amount);
}

/** Seller declines the latest buyer offer. */
export function sellerDecline(thread: OfferThread): OfferThread {
  const lastBuyer = thread.offers.filter((o) => o.side === "buyer").at(-1);
  const offer = makeOffer(
    "seller",
    lastBuyer?.amount ?? thread.askPrice,
    "Penjual menolak penawaran.",
    "decline",
  );
  return withOffer(thread, offer, "declined");
}

/** Seller counters with a new amount. */
export function sellerCounter(thread: OfferThread, amount: number): OfferThread {
  const offer = makeOffer("seller", amount, "Counter penjual.", "counter");
  return withOffer(thread, offer, "awaiting_buyer");
}

export function lastOffer(thread: OfferThread, side?: OfferSide): Offer | undefined {
  const list = side ? thread.offers.filter((o) => o.side === side) : thread.offers;
  return list.at(-1);
}

export function isTerminal(status: OfferStatus): boolean {
  return status === "sepakat" || status === "declined" || status === "walk_away";
}
