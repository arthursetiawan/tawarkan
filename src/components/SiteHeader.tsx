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
      </div>
    </header>
  );
}
