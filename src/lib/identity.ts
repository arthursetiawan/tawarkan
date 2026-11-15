import { createId } from "@/lib/id";

export type Identity = {
  id: string;
  displayName: string;
};

const KEY = "tawarkan:v1:identity";

export function loadIdentity(): Identity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Identity;
    if (!parsed?.id || !parsed?.displayName) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveIdentity(identity: Identity): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(identity));
}

export function ensureIdentity(displayName?: string): Identity {
  const existing = loadIdentity();
  if (existing && (!displayName || displayName === existing.displayName)) {
    return existing;
  }
  const next: Identity = {
    id: existing?.id ?? createId("user"),
    displayName: (displayName?.trim() || existing?.displayName || "Penjelajah").slice(
      0,
      40,
    ),
  };
  saveIdentity(next);
  return next;
}

export function setDisplayName(displayName: string): Identity {
  return ensureIdentity(displayName);
}

/** New local persona (same browser) so buyer/seller can be demoed without OAuth. */
export function resetIdentity(displayName?: string): Identity {
  const next: Identity = {
    id: createId("user"),
    displayName: (displayName?.trim() || "Pembeli baru").slice(0, 40),
  };
  saveIdentity(next);
  return next;
}
