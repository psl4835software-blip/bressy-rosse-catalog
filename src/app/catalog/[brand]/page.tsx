import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrandCategoryRail, EmptyCatalog, ProductGrid } from "@/components/catalog-ui";
import { BRAND_INFO, CATEGORIES, isBrandSlug, isCategoryForBrand } from "@/lib/catalog/constants";
import { getCatalogRepository } from "@/lib/catalog/repository";
import type { Product } from "@/lib/catalog/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: slug } = await params;
  if (!isBrandSlug(slug)) return { title: "Catálogo" };
  return { title: BRAND_INFO[slug].name, description: BRAND_INFO[slug].descriptor };
}

export default async function BrandCatalogPage({ params, searchParams }: Props) {
  const [{ brand: slug }, query] = await Promise.all([params, searchParams]);
  if (!isBrandSlug(slug)) notFound();
  const brand = slug;
  const selectedCategory = query.category && isCategoryForBrand(brand, query.category) ? query.category : undefined;
  const repository = getCatalogRepository();
  let products: Product[] = [];
  let catalogError = false;

  if (repository) {
    try {
      products = await repository.listPublic({ brand, category: selectedCategory });
    } catch {
      catalogError = true;
    }
  }

  const categoryName = selectedCategory
    ? CATEGORIES[brand].find((item) => item.slug === selectedCategory)?.label
    : null;

  return (
    <>
      <SiteHeader active={brand} />
      <main id="contenido" className="site-main">
        <div className="page-intro">
          <div className="breadcrumb"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span>{BRAND_INFO[brand].name}</span></div>
          <h1 className="page-title">{categoryName ?? BRAND_INFO[brand].name}</h1>
          <p className="page-description">{categoryName ? `Colección de ${categoryName.toLocaleLowerCase()}.` : BRAND_INFO[brand].descriptor} · Precios en bolivianos.</p>
        </div>
        <BrandCategoryRail brand={brand} selected={selectedCategory} />
        <div className="section-heading">
          <div>
            <h2>{categoryName ?? "Productos de la colección"}</h2>
            <p>Catálogo de {BRAND_INFO[brand].name}.</p>
          </div>
          <Link className="text-link" href="/">Cambiar de vitrina <ArrowLeft size={15} aria-hidden="true" /></Link>
        </div>
        {catalogError ? (
          <EmptyCatalog title="No pudimos cargar esta colección" description="Vuelve a intentarlo en un momento." />
        ) : products.length ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyCatalog title="Todavía no hay productos publicados aquí" description="Prueba otra categoría o vuelve más tarde para explorar esta colección." />
        )}
      </main>
      <SiteFooter />
    </>
  );
}
