export type BrandSlug = "br" | "bressy-rosse";
export type CategorySlug =
  | "material-escolar"
  | "juguetes"
  | "cocina"
  | "bisuteria"
  | "cosmeticos";

export type Product = {
  id: string;
  name: string;
  brand: BrandSlug;
  category: CategorySlug;
  description: string | null;
  price: number;
  promo_price: number | null;
  image_path: string | null;
  image_alt: string | null;
  is_published: boolean;
  show_in_discounts: boolean;
  promo_starts_at: string | null;
  promo_ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at">;
