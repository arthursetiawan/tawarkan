import { ListingDetailClient } from "@/components/ListingDetailClient";
import { getSeedListing, seedListings } from "@/data/listings";

type Props = {
  params: Promise<{ id: string }>;
};

/** Seed paths stay statically exported for old demo links. */
export function generateStaticParams() {
  return seedListings.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const listing = getSeedListing(id);
  if (!listing) return { title: "Listing · TawarKan" };
  return {
    title: `${listing.title} · TawarKan`,
    description: listing.description,
  };
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  return <ListingDetailClient listingId={id} />;
}
