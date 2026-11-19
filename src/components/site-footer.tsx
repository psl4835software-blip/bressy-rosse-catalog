import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="brand-name">BR · Bressy Rosse</div>
          <p className="footer-copy">Un catálogo para explorar dos marcas y sus productos.</p>
        </div>
        <nav className="footer-links" aria-label="Navegación del pie de página">
          <Link href="/catalog/br">Catálogo BR</Link>
          <Link href="/catalog/bressy-rosse">Bressy Rosse</Link>
          <Link href="/descuentos">Descuentos</Link>
        </nav>
      </div>
    </footer>
  );
}
