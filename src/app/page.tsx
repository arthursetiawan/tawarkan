import { FeedClient } from "@/components/FeedClient";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <div className="page">
      <SiteHeader />
      <main>
        <FeedClient />
      </main>
    </div>
  );
}
