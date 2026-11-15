"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ListingDetailClient } from "@/components/ListingDetailClient";
import { SiteHeader } from "@/components/SiteHeader";

function ItemInner() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  return <ListingDetailClient listingId={id} />;
}

export function ItemPageClient() {
  return (
    <Suspense
      fallback={
        <div className="page">
          <SiteHeader />
          <main className="detail">
            <p>Memuat listing…</p>
          </main>
        </div>
      }
    >
      <ItemInner />
    </Suspense>
  );
}
