import { getCloudflareEnv } from "@/lib/cloudflare/env";
import { promotionIsCurrent } from "./constants";
import type { BrandSlug, CategorySlug, Product } from "./types";

export type CatalogFilters = {
  brand?: BrandSlug;
  category?: CategorySlug;
  discountsOnly?: boolean;
};

export interface CatalogRepository {
  listPublic(filters?: CatalogFilters): Promise<Product[]>;
  listForManagement(): Promise<Product[]>;
  getForManagement(id: string): Promise<Product | null>;
}

type ProductRow = {
  id: string;
  name: string;
  brand: BrandSlug;
  category: CategorySlug;
  description: string | null;
  price_centavos: number;
  promo_price_centavos: number | null;
  image_path: string | null;
  image_alt: string | null;
  is_published: number;
  show_in_discounts: number;
  promo_starts_at: string | null;
  promo_ends_at: string | null;
  created_at: string;
  updated_at: string;
};

function fromRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    description: row.description,
    price: row.price_centavos / 100,
    promo_price: row.promo_price_centavos === null ? null : row.promo_price_centavos / 100,
    image_path: row.image_path,
    image_alt: row.image_alt,
    is_published: row.is_published === 1,
    show_in_discounts: row.show_in_discounts === 1,
    promo_starts_at: row.promo_starts_at,
    promo_ends_at: row.promo_ends_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

class D1CatalogRepository implements CatalogRepository {
  async listPublic(filters: CatalogFilters = {}) {
    const { DB } = await getCloudflareEnv();
    const conditions = ["is_published = 1"];
    const values: string[] = [];

    if (filters.brand) {
      conditions.push("brand = ?");
      values.push(filters.brand);
    }
    if (filters.category) {
      conditions.push("category = ?");
      values.push(filters.category);
    }
    if (filters.discountsOnly) conditions.push("show_in_discounts = 1");

    const result = await DB.prepare(
      `SELECT * FROM products WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC`,
    ).bind(...values).all<ProductRow>();
    const products = (result.results ?? []).map(fromRow);
    return filters.discountsOnly
      ? products.filter((product) => promotionIsCurrent(product))
      : products;
  }

  async listForManagement() {
    const { DB } = await getCloudflareEnv();
    const result = await DB.prepare("SELECT * FROM products ORDER BY updated_at DESC").all<ProductRow>();
    return (result.results ?? []).map(fromRow);
  }

  async getForManagement(id: string) {
    const { DB } = await getCloudflareEnv();
    const row = await DB.prepare("SELECT * FROM products WHERE id = ? LIMIT 1")
      .bind(id)
      .first<ProductRow>();
    return row ? fromRow(row) : null;
  }
}

export function getCatalogRepository(): CatalogRepository {
  return new D1CatalogRepository();
}

export async function getImageUrl(imagePath: string | null) {
  if (!imagePath) return null;
  const safePath = /^(br|bressy-rosse)\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i;
  if (!safePath.test(imagePath)) return null;
  return `/api/images/${imagePath.split("/").map(encodeURIComponent).join("/")}`;
}
