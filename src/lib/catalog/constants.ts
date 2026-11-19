import type { BrandSlug, CategorySlug } from "./types";

export const BRAND_INFO: Record<BrandSlug, { name: string; descriptor: string }> = {
  br: {
    name: "BR",
    descriptor: "Material escolar, juguetes, cocina y bisutería",
  },
  "bressy-rosse": {
    name: "Bressy Rosse",
    descriptor: "Cosméticos",
  },
};

export const CATEGORIES: Record<BrandSlug, { slug: CategorySlug; label: string }[]> = {
  br: [
    { slug: "material-escolar", label: "Material escolar" },
    { slug: "juguetes", label: "Juguetes" },
    { slug: "cocina", label: "Artículos de cocina" },
    { slug: "bisuteria", label: "Bisutería" },
  ],
  "bressy-rosse": [{ slug: "cosmeticos", label: "Cosméticos" }],
};

export const BRAND_SLUGS = Object.keys(BRAND_INFO) as BrandSlug[];

export function isBrandSlug(value: string): value is BrandSlug {
  return value in BRAND_INFO;
}

export function isCategoryForBrand(
  brand: BrandSlug,
  category: string,
): category is CategorySlug {
  return CATEGORIES[brand].some((item) => item.slug === category);
}

export function formatPrice(value: number) {
  return `Bs ${new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

export function promotionIsCurrent(product: {
  promo_price: number | null;
  show_in_discounts: boolean;
  promo_starts_at: string | null;
  promo_ends_at: string | null;
}, now = new Date()) {
  if (!product.show_in_discounts || product.promo_price === null) return false;
  if (product.promo_starts_at && new Date(product.promo_starts_at) > now) return false;
  if (product.promo_ends_at && new Date(product.promo_ends_at) < now) return false;
  return true;
}
