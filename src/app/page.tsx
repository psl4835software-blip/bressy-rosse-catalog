import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EmptyCatalog, ProductGrid } from "@/components/catalog-ui";
import { CATEGORIES } from "@/lib/catalog/constants";
import { getCatalogRepository } from "@/lib/catalog/repository";
import type { Product } from "@/lib/catalog/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const repository = getCatalogRepository();
  let products: Product[] = [];
  let catalogError = false;

  if (repository) {
    try {
      products = (await repository.listPublic()).slice(0, 3);
    } catch {
      catalogError = true;
    }
  }

  return (
    <>
      <SiteHeader />
      <main id="contenido" className="site-main">
        <section aria-labelledby="home-title" className="home-hero">
          <div className="hero-copy">
            <h1 id="home-title" className="home-title">
              Un mundo de <span>hallazgos.</span>
            </h1>
            <p className="hero-description">
              Explora los cosméticos de Bressy Rosse y las colecciones de BR: útiles escolares, juguetes, cocina y bisutería.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/catalog/bressy-rosse">
                Descubrir Bressy Rosse <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link className="button button-glass" href="/catalog/br">
                Explorar BR <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <Link className="hero-discount-link" href="/descuentos">
              Mira los descuentos <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <span className="hero-currency">Catálogo para Bolivia <span aria-hidden="true">·</span> Precios en Bs</span>
          </div>

          <div className="hero-visual" role="group" aria-label="Accesos directos a las marcas">
            <div className="hero-orb hero-orb--large" aria-hidden="true" />
            <div className="hero-orb hero-orb--small" aria-hidden="true" />
            <div className="hero-glass-disc" aria-hidden="true"><Sparkles size={28} strokeWidth={1.5} /></div>
            <Link className="hero-brand-glass hero-brand-glass--rosse" href="/catalog/bressy-rosse">
              <span className="hero-brand-monogram hero-brand-monogram--rose"><Sparkles size={18} aria-hidden="true" /></span>
              <span className="hero-brand-copy"><small>Cosméticos</small><strong>Bressy Rosse</strong></span>
              <ArrowUpRight className="hero-brand-arrow" size={19} aria-hidden="true" />
            </Link>
            <Link className="hero-brand-glass hero-brand-glass--br" href="/catalog/br">
              <span className="hero-brand-monogram hero-brand-monogram--br">BR</span>
              <span className="hero-brand-copy"><small>Ideas para cada día</small><strong>BR</strong></span>
              <ArrowUpRight className="hero-brand-arrow" size={19} aria-hidden="true" />
            </Link>
            <span className="hero-floating-note">dos marcas<br />para explorar</span>
          </div>
        </section>

        <section aria-labelledby="categories-title" className="discovery-section">
          <div className="section-heading">
            <div>
              <h2 id="categories-title">¿Qué te gustaría encontrar?</h2>
              <p>Entra por la categoría que te interesa.</p>
            </div>
          </div>
          <nav className="category-rail" aria-label="Todas las categorías">
            {CATEGORIES.br.map((category) => (
              <Link className="category-link" href={`/catalog/br?category=${category.slug}`} key={category.slug}>
                <span className="category-brand">BR</span>{category.label}<ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            ))}
            <Link className="category-link" href="/planchas">
              Planchas<ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <Link className="category-link category-link--rose" href="/catalog/bressy-rosse?category=cosmeticos">
              <span className="category-brand category-brand--rosse">Bressy Rosse</span>Cosméticos<ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </nav>
        </section>

        <section aria-labelledby="newest-title" className="catalog-section">
          <div className="section-heading">
            <div>
              <h2 id="newest-title">Recién publicados</h2>
              <p>Descubre los productos que ya forman parte del catálogo.</p>
            </div>
            <Link className="text-link" href="/catalog/br">Ver las colecciones <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          {catalogError ? (
            <EmptyCatalog title="No pudimos cargar el catálogo" description="Vuelve a intentarlo en un momento." />
          ) : products.length ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyCatalog
              title="Estamos preparando el catálogo para ti"
              description="Los productos publicados aparecerán aquí para que puedas explorarlos."
            />
          )}
        </section>

        <section className="offer-panel" aria-labelledby="offers-title">
          <div>
            <h2 id="offers-title">Un lugar para las buenas oportunidades.</h2>
            <p>Explora los productos que el equipo haya marcado con un precio especial y consulta su valor original en Bs.</p>
          </div>
          <Link className="button button-light" href="/descuentos">Ver descuentos <ArrowRight size={16} aria-hidden="true" /></Link>
          <Sparkles className="offer-sparkle" size={32} strokeWidth={1.2} aria-hidden="true" />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
