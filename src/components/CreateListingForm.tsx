"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  CATEGORY_LABELS,
  type Category,
  type Condition,
} from "@/data/listings";
import { useStore } from "@/components/StoreProvider";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function CreateListingForm() {
  const router = useRouter();
  const { addListing, identity } = useStore();
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<Category>("ponsel");
  const [condition, setCondition] = useState<Condition>("bekas");
  const [askPrice, setAskPrice] = useState("");
  const [city, setCity] = useState("Jakarta");
  const [description, setDescription] = useState("");
  const [garansi, setGaransi] = useState("");
  const [batteryHealth, setBatteryHealth] = useState("");
  const [fullset, setFullset] = useState(true);
  const [photoUrls, setPhotoUrls] = useState("");
  const [imeiSerial, setImeiSerial] = useState("");
  const [meetupCod, setMeetupCod] = useState(true);
  const [sellerName, setSellerName] = useState(identity?.displayName ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (identity?.displayName) setSellerName(identity.displayName);
  }, [identity?.displayName]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const price = Number(askPrice.replace(/\D/g, ""));
    if (!title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }
    if (!Number.isFinite(price) || price < 50_000) {
      setError("Harga ask minimal Rp50.000.");
      return;
    }
    const bhRaw = batteryHealth.trim();
    let bh: number | null = null;
    if (bhRaw) {
      const n = Number(bhRaw);
      if (!Number.isFinite(n) || n < 1 || n > 100) {
        setError("Battery health harus 1–100, atau kosongkan.");
        return;
      }
      bh = Math.round(n);
    }

    const urls = photoUrls
      .split(/[\n,]/)
      .map((u) => u.trim())
      .filter(Boolean)
      .slice(0, 6);

    const listing = addListing({
      title,
      brand,
      category,
      condition,
      askPrice: price,
      city,
      description:
        description.trim() ||
        `${condition === "baru" ? "Baru" : "Bekas"} · ${CATEGORY_LABELS[category]}`,
      garansi,
      batteryHealth: bh,
      fullset,
      photoUrls: urls,
      imeiSerial: imeiSerial.trim() || null,
      meetupCod,
      sellerName: sellerName.trim() || undefined,
    });

    if (!listing) {
      setError("Gagal membuat listing.");
      return;
    }
    router.push(`/item?id=${encodeURIComponent(listing.id)}`);
  }

  return (
    <form className="create-form" onSubmit={onSubmit}>
      <div className="create-form__grid">
        <label className="field">
          <span>Judul listing</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mis. iPhone 14 Pro 256GB Purple"
            required
          />
        </label>

        <label className="field">
          <span>Brand</span>
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Apple, Samsung, Sony…"
          />
        </label>

        <label className="field">
          <span>Kategori</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Kondisi</span>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as Condition)}
          >
            <option value="baru">Baru</option>
            <option value="bekas">Bekas</option>
          </select>
        </label>

        <label className="field">
          <span>Harga ask (IDR)</span>
          <input
            inputMode="numeric"
            value={askPrice}
            onChange={(e) => setAskPrice(e.target.value)}
            placeholder="14250000"
            required
          />
        </label>

        <label className="field">
          <span>Kota</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Jakarta Selatan"
          />
        </label>

        <label className="field">
          <span>Garansi</span>
          <input
            value={garansi}
            onChange={(e) => setGaransi(e.target.value)}
            placeholder="Sisa resmi / toko 30 hari"
          />
        </label>

        <label className="field">
          <span>Battery health % (opsional)</span>
          <input
            inputMode="numeric"
            value={batteryHealth}
            onChange={(e) => setBatteryHealth(e.target.value)}
            placeholder="94"
          />
        </label>

        <label className="field">
          <span>Nama penjual</span>
          <input
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            placeholder="Nama toko / kamu"
          />
        </label>

        <label className="field">
          <span>IMEI / serial (opsional)</span>
          <input
            value={imeiSerial}
            onChange={(e) => setImeiSerial(e.target.value)}
            placeholder="Untuk cek keaslian di tempat"
          />
        </label>
      </div>

      <label className="field">
        <span>Deskripsi</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Kondisi, kelengkapan, lokasi ketemuan…"
        />
      </label>

      <label className="field">
        <span>URL foto (satu per baris / koma — boleh kosong, pakai placeholder)</span>
        <textarea
          value={photoUrls}
          onChange={(e) => setPhotoUrls(e.target.value)}
          rows={2}
          placeholder="https://… atau kosongkan"
        />
      </label>

      <div className="create-form__checks">
        <label className="check">
          <input
            type="checkbox"
            checked={fullset}
            onChange={(e) => setFullset(e.target.checked)}
          />
          <span>Fullset (box & aksesoris)</span>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={meetupCod}
            onChange={(e) => setMeetupCod(e.target.checked)}
          />
          <span>Bisa COD / ketemuan</span>
        </label>
      </div>

      {error && <p className="field__error">{error}</p>}

      <button type="submit" className="btn btn--primary">
        Pasang listing
      </button>
    </form>
  );
}
