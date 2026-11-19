import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EmptyCatalog, ProductGrid } from "@/components/catalog-ui";
import { getCatalogRepository } from "@/lib/catalog/repository";
import type { Product } from "@/lib/catalog/types";

export const metadata: Metadata = { title: "Descuentos" };
export const dynamic = "force-dynamic";

export default async function DiscountsPage() {
  const repository = getCatalogRepository();
  let products: Product[] = [];
  let catalogError = false;

  if (repository) {
    try {
      products = await repository.listPublic({ discountsOnly: true });
    } catch {
      catalogError = true;
    }
  }

  return (
    <>
      <SiteHeader active="discounts" />
      <main id="contenido" className="site-main">
        <div className="page-intro">
          <div className="breadcrumb"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span>Descuentos</span></div>
          <h1 className="page-title">Descuentos en las dos vitrinas.</h1>
          <p className="page-description">Aquí aparecen los productos promocionales publicados por el equipo, con precio original y precio especial en bolivianos.</p>
        </div>
        {catalogError ? (
          <EmptyCatalog title="No pudimos cargar los descuentos" description="Vuelve a intentarlo en un momento." />
        ) : products.length ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyCatalog title="No hay descuentos publicados ahora" description="Cuando el equipo agregue productos a esta selección, aparecerán aquí." />
        )}
        <div className="offer-panel">
          <div>
            <h2>Dos marcas. Una selección especial.</h2>
            <p>Explora también los catálogos completos de BR y Bressy Rosse.</p>
          </div>
          <Link className="button button-light" href="/">Volver a las vitrinas <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
