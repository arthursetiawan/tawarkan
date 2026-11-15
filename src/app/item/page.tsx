import { ItemPageClient } from "@/components/ItemPageClient";

export const metadata = {
  title: "Listing",
  description: "Detail listing gadget di TawarKan.",
};

/** Static shell; id comes from ?id= on the client (works with output: 'export'). */
export default function ItemPage() {
  return <ItemPageClient />;
}
