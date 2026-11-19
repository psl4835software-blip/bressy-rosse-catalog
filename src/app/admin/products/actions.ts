"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CATEGORIES } from "@/lib/catalog/constants";
import { getCloudflareEnv } from "@/lib/cloudflare/env";
import { getCatalogManager } from "@/lib/auth/admin";
import type { BrandSlug, CategorySlug } from "@/lib/catalog/types";

export type ProductActionState = { error?: string; success?: string };

const nullablePrice = z.preprocess(
  (value) => typeof value === "string" && value.trim() === "" ? null : Number(value),
  z.number().finite().min(0).nullable(),
);
const optionalBoliviaDateTime = z.string().trim().nullable().refine((value) => {
  if (value === null) return true;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}:00-04:00`).getTime());
}, "Escribe una fecha y hora válida.");

const productSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Escribe el nombre del producto.").max(120),
  brand: z.enum(["br", "bressy-rosse"]),
  category: z.enum(["material-escolar", "juguetes", "cocina", "bisuteria", "cosmeticos"]),
  description: z.string().trim().max(1200).nullable(),
  price: z.coerce.number().finite().min(0).max(999999999),
  promoPrice: nullablePrice,
  imageAlt: z.string().trim().max(180).nullable(),
  isPublished: z.preprocess((value) => value === "on", z.boolean()),
  showInDiscounts: z.preprocess((value) => value === "on", z.boolean()),
  promoStartsAt: optionalBoliviaDateTime,
  promoEndsAt: optionalBoliviaDateTime,
}).superRefine((value, ctx) => {
  const categories = CATEGORIES[value.brand as BrandSlug].map((item) => item.slug);
  if (!categories.includes(value.category as CategorySlug)) {
    ctx.addIssue({ code: "custom", path: ["category"], message: "Esa categoría no pertenece a la marca seleccionada." });
  }
  if (value.promoPrice !== null && value.promoPrice >= value.price) {
    ctx.addIssue({ code: "custom", path: ["promoPrice"], message: "El precio promocional debe ser menor al precio original." });
  }
  if (value.showInDiscounts && value.promoPrice === null) {
    ctx.addIssue({ code: "custom", path: ["promoPrice"], message: "Agrega el precio promocional para mostrar este producto en Descuentos." });
  }
  if (value.promoStartsAt && value.promoEndsAt && value.promoStartsAt >= value.promoEndsAt) {
    ctx.addIssue({ code: "custom", path: ["promoEndsAt"], message: "La fecha final debe ser posterior a la inicial." });
  }
});

const imagePathSchema = /^(br|bressy-rosse)\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i;

function toBoliviaIso(value: string | null) {
  if (!value) return null;
  const dateValue = value.length === 16 ? `${value}:00-04:00` : `${value}-04:00`;
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function revalidateCatalog() {
  revalidatePath("/");
  revalidatePath("/descuentos");
  revalidatePath("/catalog/br");
  revalidatePath("/catalog/bressy-rosse");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/discounts");
}

function imageFormat(bytes: Uint8Array) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return "png";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "webp";
  return null;
}

export async function saveProduct(_previous: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const parsed = productSchema.safeParse({
    id: formData.get("id") ?? "",
    name: formData.get("name"),
    brand: formData.get("brand"),
    category: formData.get("category"),
    description: formData.get("description") || null,
    price: formData.get("price"),
    promoPrice: formData.get("promoPrice"),
    imageAlt: formData.get("imageAlt") || null,
    isPublished: formData.get("isPublished"),
    showInDiscounts: formData.get("showInDiscounts"),
    promoStartsAt: formData.get("promoStartsAt") || null,
    promoEndsAt: formData.get("promoEndsAt") || null,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos del producto." };

  const manager = await getCatalogManager();
  if (!manager) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const { DB, PRODUCT_IMAGES } = await getCloudflareEnv();
  const currentImage = String(formData.get("existingImagePath") ?? "") || null;
  if (currentImage && !imagePathSchema.test(currentImage)) {
    return { error: "La imagen actual no es válida. Vuelve a cargarla antes de guardar." };
  }
  let imagePath = currentImage;
  let newImagePath: string | null = null;
  const imageFile = formData.get("image");

  if (imageFile instanceof File && imageFile.size > 0) {
    if (imageFile.size > 8 * 1024 * 1024) return { error: "La imagen debe pesar 8 MB o menos." };
    const formats: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
    const extension = formats[imageFile.type];
    if (!extension) return { error: "Usa una imagen JPG, PNG o WebP." };

    const bytes = new Uint8Array(await imageFile.arrayBuffer());
    if (imageFormat(bytes) !== extension) return { error: "El contenido del archivo no coincide con su formato de imagen." };
    const path = `${parsed.data.brand}/${crypto.randomUUID()}.${extension}`;
    await PRODUCT_IMAGES.put(path, bytes, {
      httpMetadata: { contentType: imageFile.type, cacheControl: "public, max-age=31536000, immutable" },
    });
    imagePath = path;
    newImagePath = path;
  }

  const values = parsed.data;
  const id = values.id || crypto.randomUUID();
  const now = new Date().toISOString();
  const fields = [
    values.name,
    values.brand,
    values.category,
    values.description,
    Math.round(values.price * 100),
    values.promoPrice === null ? null : Math.round(values.promoPrice * 100),
    imagePath,
    values.imageAlt,
    values.isPublished ? 1 : 0,
    values.showInDiscounts ? 1 : 0,
    toBoliviaIso(values.promoStartsAt),
    toBoliviaIso(values.promoEndsAt),
    now,
  ];

  try {
    if (values.id) {
      const result = await DB.prepare(
        `UPDATE products SET
          name = ?, brand = ?, category = ?, description = ?, price_centavos = ?, promo_price_centavos = ?,
          image_path = ?, image_alt = ?, is_published = ?, show_in_discounts = ?, promo_starts_at = ?, promo_ends_at = ?, updated_at = ?
         WHERE id = ?`,
      ).bind(...fields, id).run();
      if (!result.meta.changes) throw new Error("Producto no encontrado.");
    } else {
      await DB.prepare(
        `INSERT INTO products (
          id, name, brand, category, description, price_centavos, promo_price_centavos, image_path, image_alt,
          is_published, show_in_discounts, promo_starts_at, promo_ends_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(id, ...fields.slice(0, 12), now, now).run();
    }
  } catch {
    if (newImagePath) await PRODUCT_IMAGES.delete(newImagePath).catch(() => undefined);
    return { error: "No se pudo guardar el producto. Revisa los campos e inténtalo otra vez." };
  }

  if (currentImage && imagePath !== currentImage) {
    await PRODUCT_IMAGES.delete(currentImage).catch(() => undefined);
  }
  revalidateCatalog();
  return { success: "Producto guardado." };
}

export async function setProductPublished(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  if (!z.string().uuid().safeParse(id).success) return;
  if (!await getCatalogManager()) return;

  const { DB } = await getCloudflareEnv();
  await DB.prepare("UPDATE products SET is_published = ?, updated_at = ? WHERE id = ?")
    .bind(published ? 1 : 0, new Date().toISOString(), id).run();
  revalidateCatalog();
}
