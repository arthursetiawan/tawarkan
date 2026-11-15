"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Listing } from "@/data/listings";
import {
  ensureIdentity,
  resetIdentity,
  setDisplayName,
  type Identity,
} from "@/lib/identity";
import {
  buyerAcceptAsk,
  buyerAcceptCounter,
  buyerCounter,
  buyerWalkAway,
  createThread,
  lastOffer,
  sellerAccept,
  sellerCounter,
  sellerDecline,
  type OfferThread,
} from "@/lib/offers";
import {
  createListingFromInput,
  loadListings,
  loadThreads,
  saveThreads,
  saveUserListings,
  type CreateListingInput,
} from "@/lib/store";

type StoreContextValue = {
  ready: boolean;
  identity: Identity | null;
  listings: Listing[];
  threads: OfferThread[];
  setName: (name: string) => void;
  switchAccount: (name?: string) => void;
  addListing: (
    input: Omit<CreateListingInput, "sellerId" | "sellerName"> & {
      sellerName?: string;
    },
  ) => Listing | null;
  reportListing: (listingId: string, note?: string) => void;
  getThreadsForListing: (listingId: string) => OfferThread[];
  getBuyerThread: (listingId: string) => OfferThread | undefined;
  buyerStartAcceptAsk: (listingId: string) => void;
  buyerStartCounter: (listingId: string, amount: number) => void;
  buyerAcceptSellerCounter: (threadId: string) => void;
  buyerWalk: (threadId: string) => void;
  sellerAcceptOffer: (threadId: string) => void;
  sellerDeclineOffer: (threadId: string) => void;
  sellerSendCounter: (threadId: string, amount: number) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [threads, setThreads] = useState<OfferThread[]>([]);

  useEffect(() => {
    setIdentity(ensureIdentity());
    setListings(loadListings());
    setThreads(loadThreads());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveUserListings(listings);
  }, [listings, ready]);

  useEffect(() => {
    if (!ready) return;
    saveThreads(threads);
  }, [threads, ready]);

  const setName = useCallback((name: string) => {
    const next = setDisplayName(name);
    setIdentity(next);
    setListings((prev) =>
      prev.map((l) =>
        l.sellerId === next.id ? { ...l, sellerName: next.displayName } : l,
      ),
    );
  }, []);

  const switchAccount = useCallback((name?: string) => {
    setIdentity(resetIdentity(name));
  }, []);

  const addListing = useCallback(
    (
      input: Omit<CreateListingInput, "sellerId" | "sellerName"> & {
        sellerName?: string;
      },
    ) => {
      let me = identity ?? ensureIdentity();
      if (input.sellerName?.trim() && input.sellerName.trim() !== me.displayName) {
        me = setDisplayName(input.sellerName.trim());
      }
      setIdentity(me);
      const listing = createListingFromInput({
        title: input.title,
        brand: input.brand,
        category: input.category,
        condition: input.condition,
        askPrice: input.askPrice,
        city: input.city,
        description: input.description,
        garansi: input.garansi,
        batteryHealth: input.batteryHealth,
        fullset: input.fullset,
        photoUrls: input.photoUrls,
        imeiSerial: input.imeiSerial,
        meetupCod: input.meetupCod,
        sellerId: me.id,
        sellerName: me.displayName,
      });
      setListings((prev) => [listing, ...prev]);
      return listing;
    },
    [identity],
  );

  const reportListing = useCallback((listingId: string, note?: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId
          ? {
              ...l,
              reported: true,
              reportNote: note?.trim() || "Dilaporkan oleh pengguna",
            }
          : l,
      ),
    );
  }, []);

  const getThreadsForListing = useCallback(
    (listingId: string) =>
      threads
        .filter((t) => t.listingId === listingId)
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    [threads],
  );

  const getBuyerThread = useCallback(
    (listingId: string) => {
      if (!identity) return undefined;
      return threads.find(
        (t) => t.listingId === listingId && t.buyerId === identity.id,
      );
    },
    [threads, identity],
  );

  const upsertThread = useCallback((next: OfferThread) => {
    setThreads((prev) => {
      const idx = prev.findIndex((t) => t.id === next.id);
      if (idx === -1) return [next, ...prev];
      const copy = [...prev];
      copy[idx] = next;
      return copy;
    });
  }, []);

  const withBuyerThread = useCallback(
    (listingId: string, mutate: (thread: OfferThread) => OfferThread) => {
      const listing = listings.find((l) => l.id === listingId);
      const me = identity ?? ensureIdentity();
      if (!identity) setIdentity(me);
      if (!listing || listing.sellerId === me.id) return;

      setThreads((prev) => {
        const existing = prev.find(
          (t) => t.listingId === listingId && t.buyerId === me.id,
        );
        const base =
          existing ??
          createThread({
            listingId,
            askPrice: listing.askPrice,
            buyerId: me.id,
            buyerName: me.displayName,
            sellerId: listing.sellerId,
          });
        const next = mutate(base);
        if (!existing) return [next, ...prev];
        return prev.map((t) => (t.id === next.id ? next : t));
      });
    },
    [listings, identity],
  );

  const buyerStartAcceptAsk = useCallback(
    (listingId: string) => {
      withBuyerThread(listingId, buyerAcceptAsk);
    },
    [withBuyerThread],
  );

  const buyerStartCounter = useCallback(
    (listingId: string, amount: number) => {
      withBuyerThread(listingId, (thread) => buyerCounter(thread, amount));
    },
    [withBuyerThread],
  );

  const buyerAcceptSellerCounter = useCallback(
    (threadId: string) => {
      const thread = threads.find((t) => t.id === threadId);
      if (!thread) return;
      const sellerLast = lastOffer(thread, "seller");
      if (!sellerLast) return;
      upsertThread(buyerAcceptCounter(thread, sellerLast.amount));
    },
    [threads, upsertThread],
  );

  const buyerWalk = useCallback(
    (threadId: string) => {
      const thread = threads.find((t) => t.id === threadId);
      if (!thread) return;
      upsertThread(buyerWalkAway(thread));
    },
    [threads, upsertThread],
  );

  const sellerAcceptOffer = useCallback(
    (threadId: string) => {
      const thread = threads.find((t) => t.id === threadId);
      if (!thread) return;
      const buyerLast = lastOffer(thread, "buyer");
      if (!buyerLast) return;
      upsertThread(sellerAccept(thread, buyerLast.amount));
    },
    [threads, upsertThread],
  );

  const sellerDeclineOffer = useCallback(
    (threadId: string) => {
      const thread = threads.find((t) => t.id === threadId);
      if (!thread) return;
      upsertThread(sellerDecline(thread));
    },
    [threads, upsertThread],
  );

  const sellerSendCounter = useCallback(
    (threadId: string, amount: number) => {
      const thread = threads.find((t) => t.id === threadId);
      if (!thread) return;
      upsertThread(sellerCounter(thread, amount));
    },
    [threads, upsertThread],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      ready,
      identity,
      listings,
      threads,
      setName,
      switchAccount,
      addListing,
      reportListing,
      getThreadsForListing,
      getBuyerThread,
      buyerStartAcceptAsk,
      buyerStartCounter,
      buyerAcceptSellerCounter,
      buyerWalk,
      sellerAcceptOffer,
      sellerDeclineOffer,
      sellerSendCounter,
    }),
    [
      ready,
      identity,
      listings,
      threads,
      setName,
      switchAccount,
      addListing,
      reportListing,
      getThreadsForListing,
      getBuyerThread,
      buyerStartAcceptAsk,
      buyerStartCounter,
      buyerAcceptSellerCounter,
      buyerWalk,
      sellerAcceptOffer,
      sellerDeclineOffer,
      sellerSendCounter,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return ctx;
}
