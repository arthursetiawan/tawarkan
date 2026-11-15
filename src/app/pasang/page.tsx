import Link from "next/link";
import { CreateListingForm } from "@/components/CreateListingForm";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Pasang listing",
  description: "Pasang listing ponsel & gadget dengan harga ask di TawarKan.",
};

export default function PasangPage() {
  return (
    <div className="page">
      <SiteHeader />
      <main className="detail">
        <Link href="/" className="back-link">
          ← Kembali ke feed
        </Link>
        <h1 className="detail__title">Pasang listing gadget</h1>
        <p className="detail__desc">
          Foto (URL), ask price, kondisi, kategori, garansi, BH%, fullset, IMEI
          opsional, dan badge COD/ketemuan. Listing muncul di feed dan tersimpan
          di browser (localStorage).
        </p>
        <CreateListingForm />
      </main>
    </div>
  );
}
