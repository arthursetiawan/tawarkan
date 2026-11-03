import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TawarKan — tawar gadget sampai sepakat",
    template: "%s · TawarKan",
  },
  description:
    "Marketplace tawar-menawar untuk ponsel & gadget di Indonesia. Ask, counter, sepakat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
