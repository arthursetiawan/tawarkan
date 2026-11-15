import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden>
            ⇄
          </span>
          <span className="brand__name">TawarKan</span>
        </Link>
        <p className="brand__tag">Tawar-menawar gadget — ask, counter, sepakat.</p>
        <nav className="site-nav" aria-label="Utama">
          <Link href="/">Feed</Link>
          <Link href="/pasang">Pasang</Link>
        </nav>
      </div>
    </header>
  );
}
