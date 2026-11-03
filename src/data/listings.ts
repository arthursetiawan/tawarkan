export type Category = "ponsel" | "audio" | "tablet" | "wearable";
export type Condition = "baru" | "bekas";

export type Listing = {
  id: string;
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
  sellerName: string;
  sellerRating: number;
  sellerDeals: number;
  accent: string;
};

export const CATEGORY_LABELS: Record<Category, string> = {
  ponsel: "Ponsel",
  audio: "Audio",
  tablet: "Tablet",
  wearable: "Wearable",
};

export const listings: Listing[] = [
  {
    id: "iphone-15-pro-128",
    title: "iPhone 15 Pro 128GB Natural Titanium",
    brand: "Apple",
    category: "ponsel",
    condition: "bekas",
    askPrice: 14_250_000,
    city: "Jakarta Selatan",
    description:
      "BH 94%, ex-pribadi, tidak pernah service. Bekas pemakaian ringan, body mulus, Face ID normal. Bisa ketemuan di Senopati.",
    garansi: "Sisa resmi Indo s/d Apr 2026",
    batteryHealth: 94,
    fullset: true,
    sellerName: "Raka Gadget",
    sellerRating: 4.9,
    sellerDeals: 128,
    accent: "#1f6f5b",
  },
  {
    id: "samsung-s24-ultra",
    title: "Samsung Galaxy S24 Ultra 256GB Titanium Gray",
    brand: "Samsung",
    category: "ponsel",
    condition: "bekas",
    askPrice: 13_900_000,
    city: "Bandung",
    description:
      "Open box 2 bulan, S-Pen lengkap. Screen protector ori masih nempel. Siap transfer Samsung Care+.",
    garansi: "Resmi SEIN 11 bulan",
    batteryHealth: 97,
    fullset: true,
    sellerName: "Dapur Gadget BD",
    sellerRating: 4.8,
    sellerDeals: 86,
    accent: "#245b8c",
  },
  {
    id: "xiaomi-14t-pro",
    title: "Xiaomi 14T Pro 512GB Blue Titan — seal",
    brand: "Xiaomi",
    category: "ponsel",
    condition: "baru",
    askPrice: 7_499_000,
    city: "Surabaya",
    description:
      "Unit baru seal, distributor resmi. Belum aktivasi. Bisa cek IMEI di tempat.",
    garansi: "Resmi 15 bulan",
    batteryHealth: null,
    fullset: true,
    sellerName: "Toko Gadget SBY",
    sellerRating: 4.7,
    sellerDeals: 210,
    accent: "#c45c26",
  },
  {
    id: "pixel-8-pro",
    title: "Google Pixel 8 Pro 128GB Obsidian",
    brand: "Google",
    category: "ponsel",
    condition: "bekas",
    askPrice: 8_750_000,
    city: "Tangerang",
    description:
      "Import US, unlock, kamera magis masih gila. Ada hairline di frame kanan bawah.",
    garansi: "Toko 30 hari",
    batteryHealth: 91,
    fullset: false,
    sellerName: "Pixel Corner",
    sellerRating: 4.6,
    sellerDeals: 54,
    accent: "#3d5a40",
  },
  {
    id: "airpods-pro-2",
    title: "AirPods Pro 2 USB-C",
    brand: "Apple",
    category: "audio",
    condition: "bekas",
    askPrice: 2_850_000,
    city: "Jakarta Pusat",
    description:
      "Battery case 92%, left/right 90%+. Noise cancel masih kenceng. Case ada gores tipis.",
    garansi: "Habis (toko 7 hari)",
    batteryHealth: 91,
    fullset: true,
    sellerName: "AudioLab JKT",
    sellerRating: 4.9,
    sellerDeals: 173,
    accent: "#1f6f5b",
  },
  {
    id: "sony-wh1000xm5",
    title: "Sony WH-1000XM5 Black",
    brand: "Sony",
    category: "audio",
    condition: "baru",
    askPrice: 4_299_000,
    city: "Depok",
    description:
      "Baru, dus penyok ringan dari kurir — unit utuh seal dalam. ANC flagship.",
    garansi: "Resmi Sony Indo 1 tahun",
    batteryHealth: null,
    fullset: true,
    sellerName: "SoundHouse",
    sellerRating: 4.8,
    sellerDeals: 97,
    accent: "#245b8c",
  },
  {
    id: "nothing-ear-a",
    title: "Nothing Ear (a) White",
    brand: "Nothing",
    category: "audio",
    condition: "bekas",
    askPrice: 890_000,
    city: "Yogyakarta",
    description:
      "Pakai 3 bulan, case transparan masih bening. Cocok buat daily commute.",
    garansi: "Sisa 8 bulan",
    batteryHealth: 95,
    fullset: true,
    sellerName: "Jogja Tech",
    sellerRating: 4.5,
    sellerDeals: 41,
    accent: "#c45c26",
  },
  {
    id: "ipad-air-m2",
    title: "iPad Air M2 11\" 128GB Blue + Pencil Pro",
    brand: "Apple",
    category: "tablet",
    condition: "bekas",
    askPrice: 11_200_000,
    city: "Jakarta Barat",
    description:
      "Paket lengkap dengan Pencil Pro. Dipakai sketching, screen anti-glare nempel dari hari 1.",
    garansi: "Sisa resmi s/d Agu 2026",
    batteryHealth: 96,
    fullset: true,
    sellerName: "Kreator Store",
    sellerRating: 4.9,
    sellerDeals: 62,
    accent: "#3d5a40",
  },
  {
    id: "galaxy-tab-s9",
    title: "Samsung Galaxy Tab S9 128GB Graphite",
    brand: "Samsung",
    category: "tablet",
    condition: "bekas",
    askPrice: 7_850_000,
    city: "Medan",
    description:
      "IP68, S-Pen in-box. Cocok kuliah / note-taking. Keyboard cover opsional +350rb.",
    garansi: "Toko 14 hari",
    batteryHealth: 93,
    fullset: true,
    sellerName: "Medan Gadget Hub",
    sellerRating: 4.7,
    sellerDeals: 119,
    accent: "#1f6f5b",
  },
  {
    id: "lenovo-pad-pro",
    title: "Lenovo Tab P12 Pro 8/256 — baru",
    brand: "Lenovo",
    category: "tablet",
    condition: "baru",
    askPrice: 6_499_000,
    city: "Bekasi",
    description:
      "AMOLED 120Hz, cocok entertainment & WFH. Belum dibuka seal retailer.",
    garansi: "Resmi 1 tahun",
    batteryHealth: null,
    fullset: true,
    sellerName: "Bekasi Digital",
    sellerRating: 4.6,
    sellerDeals: 38,
    accent: "#245b8c",
  },
  {
    id: "apple-watch-ultra-2",
    title: "Apple Watch Ultra 2 Trailt Loop Orange",
    brand: "Apple",
    category: "wearable",
    condition: "bekas",
    askPrice: 10_500_000,
    city: "Bali",
    description:
      "Dipakai diving & trail. Titanium masih kinclong, scratch di action button tipis.",
    garansi: "Sisa resmi s/d Jan 2027",
    batteryHealth: 94,
    fullset: true,
    sellerName: "Island Wearables",
    sellerRating: 4.8,
    sellerDeals: 33,
    accent: "#c45c26",
  },
  {
    id: "garmin-fenix-7",
    title: "Garmin Fenix 7 Sapphire Solar",
    brand: "Garmin",
    category: "wearable",
    condition: "bekas",
    askPrice: 8_200_000,
    city: "Jakarta Utara",
    description:
      "Maps offline Indo sudah di-load. Strap silicone + nylon. Sensor HR akurat.",
    garansi: "Habis (garansi toko 30 hari)",
    batteryHealth: null,
    fullset: false,
    sellerName: "RunLab ID",
    sellerRating: 4.9,
    sellerDeals: 77,
    accent: "#3d5a40",
  },
  {
    id: "galaxy-watch-7",
    title: "Samsung Galaxy Watch7 44mm Green — seal",
    brand: "Samsung",
    category: "wearable",
    condition: "baru",
    askPrice: 3_199_000,
    city: "Makassar",
    description:
      "Baru seal, resmi SEIN. Bundle charger wireless. Cocok pairing S24 series.",
    garansi: "Resmi 1 tahun",
    batteryHealth: null,
    fullset: true,
    sellerName: "Makassar Mobile",
    sellerRating: 4.7,
    sellerDeals: 145,
    accent: "#1f6f5b",
  },
];

export function getListing(id: string): Listing | undefined {
  return listings.find((item) => item.id === id);
}
