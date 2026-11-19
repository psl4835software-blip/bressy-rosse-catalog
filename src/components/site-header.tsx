import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import type { BrandSlug } from "@/lib/catalog/types";

type SiteHeaderProps = { active?: "home" | "br" | "bressy-rosse" | "planchas" | "discounts" };

export function SiteHeader({ active = "home" }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <div className="header-inner">
        <Link className="brand-lockup" href="/" aria-label="BR y Bressy Rosse, inicio">
          <span className="brand-mark" aria-hidden="true">BR</span>
          <span>
            <span className="brand-name">BR · Bressy Rosse</span>
            <span className="brand-subtitle">Catálogo de marcas</span>
          </span>
        </Link>
        <nav className="nav-primary" aria-label="Navegación principal">
          <Link className="nav-link" href="/catalog/br" aria-current={active === "br" ? "page" : undefined}>BR</Link>
          <Link className="nav-link" href="/catalog/bressy-rosse" aria-current={active === "bressy-rosse" ? "page" : undefined}>Bressy Rosse</Link>
          <Link className="nav-link" href="/planchas" aria-current={active === "planchas" ? "page" : undefined}>Planchas</Link>
          <Link className="nav-link nav-discounts" href="/descuentos" aria-current={active === "discounts" ? "page" : undefined}>Descuentos</Link>
          <Link className="admin-link" href="/admin/login"><LockKeyhole size={14} aria-hidden="true" /> Administración</Link>
        </nav>
      </div>
    </header>
  );
}

export function brandCatalogHref(brand: BrandSlug) {
  return `/catalog/${brand}`;
}
