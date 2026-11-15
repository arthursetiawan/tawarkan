import {
  pickAccent,
  seedListings,
  type Category,
  type Condition,
  type Listing,
} from "@/data/listings";
import { createId } from "@/lib/id";
import type { OfferThread } from "@/lib/offers";

const LISTINGS_KEY = "tawarkan:v1:listings";
const THREADS_KEY = "tawarkan:v1:threads";
const STORE_VERSION_KEY = "tawarkan:v1:meta";
const STORE_VERSION = 1;

export type CreateListingInput = {
  title: string;
  brand: string;
  category: Category;
  condition: Condition;
  askPrice: number;
  city: string;
  description: string;
  garansi: string;
  batteryHealth: number | null;
  fullset: boolean;
  photoUrls: string[];
  imeiSerial: string | null;
  meetupCod: boolean;
  sellerId: string;
  sellerName: string;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function migrateIfNeeded(): void {
  if (typeof window === "undefined") return;
  const meta = readJson<{ version?: number }>(STORE_VERSION_KEY, {});
  if (meta.version === STORE_VERSION) return;
  // Clear legacy sessionStorage bargain keys if any.
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const k = sessionStorage.key(i);
      if (k?.startsWith("tawarkan:bargain:")) toRemove.push(k);
    }
    toRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
  writeJson(STORE_VERSION_KEY, { version: STORE_VERSION });
}

/** Merge seed + user listings. User overrides seed by id if edited. */
export function loadListings(): Listing[] {
  migrateIfNeeded();
  const user = readJson<Listing[]>(LISTINGS_KEY, []);
  const byId = new Map<string, Listing>();
  for (const item of seedListings) byId.set(item.id, item);
  for (const item of user) byId.set(item.id, item);
  return Array.from(byId.values()).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
}

export function saveUserListings(listings: Listing[]): void {
  // Persist only non-seed or modified seed (reported) entries.
  const seedIds = new Set(seedListings.map((s) => s.id));
  const toSave = listings.filter((l) => {
    if (!seedIds.has(l.id)) return true;
    const seed = seedListings.find((s) => s.id === l.id);
    if (!seed) return true;
    return l.reported !== seed.reported || l.reportNote !== seed.reportNote;
  });
  writeJson(LISTINGS_KEY, toSave);
}

export function loadThreads(): OfferThread[] {
  migrateIfNeeded();
  return readJson<OfferThread[]>(THREADS_KEY, []);
}

export function saveThreads(threads: OfferThread[]): void {
  writeJson(THREADS_KEY, threads);
}

export function createListingFromInput(input: CreateListingInput): Listing {
  const id = createId("listing");
  return {
    id,
    title: input.title.trim(),
    brand: input.brand.trim() || "Lainnya",
    category: input.category,
    condition: input.condition,
    askPrice: input.askPrice,
    city: input.city.trim() || "Indonesia",
    description: input.description.trim(),
    garansi: input.garansi.trim() || "Tanpa info garansi",
    batteryHealth: input.batteryHealth,
    fullset: input.fullset,
    photoUrls: input.photoUrls.filter(Boolean),
    imeiSerial: input.imeiSerial?.trim() || null,
    meetupCod: input.meetupCod,
    sellerId: input.sellerId,
    sellerName: input.sellerName,
    sellerRating: 5,
    sellerDeals: 0,
    accent: pickAccent(Math.floor(Math.random() * 4)),
    createdAt: new Date().toISOString(),
    reported: false,
    reportNote: null,
  };
}

export function getListingFrom(listings: Listing[], id: string): Listing | undefined {
  return listings.find((item) => item.id === id);
}
