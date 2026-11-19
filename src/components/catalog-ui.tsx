import Link from "next/link";
import { ArrowRight, ImagePlus } from "lucide-react";
import { AddToCartButton, ImageLightboxButton } from "@/components/storefront-interactions";
import { BRAND_INFO, CATEGORIES, formatPrice, isBrandSlug, promotionIsCurrent } from "@/lib/catalog/constants";
import { getImageUrl } from "@/lib/catalog/repository";
import type { BrandSlug, Product } from "@/lib/catalog/types";

export function BrandCategoryRail({ brand, selected }: { brand: BrandSlug; selected?: string }) {
  return (
    <nav className="category-rail" aria-label={`Categorías de ${BRAND_INFO[brand].name}`}>
      <Link className="category-link" href={`/catalog/${brand}`} aria-current={!selected ? "page" : undefined}>
        Todo el catálogo <ArrowRight size={14} aria-hidden="true" />
      </Link>
      {CATEGORIES[brand].map((category) => (
        <Link
          className="category-link"
          href={`/catalog/${brand}?category=${category.slug}`}
          key={category.slug}
          aria-current={selected === category.slug ? "page" : undefined}
        >
          {category.label}
        </Link>
      ))}
    </nav>
  );
}

export function EmptyCatalog({ title, description }: { title: string; description?: string }) {
  return (
    <div className="empty-state" role="status">
      <div>
        <h3>{title}</h3>
        <p>{description ?? "Todavía no hay productos publicados en esta colección."}</p>
      </div>
      <Link className="text-link" href="/">
        Volver a las marcas <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}

export async function ProductCard({ product }: { product: Product }) {
  const imageUrl = await getImageUrl(product.image_path);
  const isDiscount = promotionIsCurrent(product);
  const brandName = isBrandSlug(product.brand) ? BRAND_INFO[product.brand].name : product.brand;
  const currentPrice = isDiscount ? product.promo_price! : product.price;

  return (
    <article className="product-card">
      <div className="product-image">
        {imageUrl ? (
          <ImageLightboxButton
            src={imageUrl}
            alt={product.image_alt || product.name}
            title={product.name}
            fill
            sizes="(max-width: 680px) 50vw, 33vw"
            className="product-image-trigger"
            imageClassName="product-image-asset"
          />
        ) : (
          <div className="product-image--empty">
            <ImagePlus size={24} strokeWidth={1.4} aria-hidden="true" />
            <span>Imagen pendiente de cargar</span>
          </div>
        )}
        {isDiscount && <span className="sale-stamp">Descuento</span>}
      </div>
      <p className="product-label">{brandName}</p>
      <h3 className="product-name">{product.name}</h3>
      {product.description && <p className="product-description">{product.description}</p>}
      <div className="price-line" aria-label={isDiscount ? `Precio promocional ${formatPrice(product.promo_price!)}, antes ${formatPrice(product.price)}` : `Precio ${formatPrice(product.price)}`}>
        {isDiscount ? (
          <>
            <span className="price-sale">{formatPrice(product.promo_price!)}</span>
            <span className="price-original">{formatPrice(product.price)}</span>
          </>
        ) : (
          <span className="price-current">{formatPrice(product.price)}</span>
        )}
      </div>
      <AddToCartButton
        product={{
          id: `catalog:${product.id}`,
          name: product.name,
          brand: brandName,
          imageUrl,
          unitPrice: currentPrice,
        }}
      />
    </article>
  );
}

export async function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => <ProductCard product={product} key={product.id} />)}
    </div>
  );
}

export function BrandName({ brand }: { brand: BrandSlug }) {
  return <>{BRAND_INFO[brand].name}</>;
}
