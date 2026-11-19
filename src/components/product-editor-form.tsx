"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Check, ImagePlus, Save } from "lucide-react";
import { CATEGORIES, BRAND_INFO } from "@/lib/catalog/constants";
import type { BrandSlug, Product } from "@/lib/catalog/types";
import { saveProduct, type ProductActionState } from "@/app/admin/products/actions";

function toLocalDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - 4 * 60 * 60 * 1000).toISOString().slice(0, 16);
}

export function ProductEditorForm({ product, imageUrl }: { product?: Product; imageUrl?: string | null }) {
  const [state, action, pending] = useActionState<ProductActionState, FormData>(saveProduct, {});
  const [brand, setBrand] = useState<BrandSlug>(product?.brand ?? "br");
  const categories = CATEGORIES[brand];
  const initialCategory = product?.category && categories.some((category) => category.slug === product.category)
    ? product.category
    : categories[0].slug;

  return (
    <form action={action}>
      {product && <input type="hidden" name="id" value={product.id} />}
      {product?.image_path && <input type="hidden" name="existingImagePath" value={product.image_path} />}
      {state.error && <p className="feedback feedback--error" role="alert">{state.error}</p>}
      {state.success && <p className="feedback feedback--success" role="status"><Check size={15} aria-hidden="true" /> {state.success}</p>}

      <div className="form-layout">
        <div>
          <section className="form-section" aria-labelledby="product-data-title">
            <h2 id="product-data-title">Información del producto</h2>
            <div className="form-grid">
              <div className="field field--wide">
                <label htmlFor="product-name">Nombre del producto</label>
                <input id="product-name" name="name" defaultValue={product?.name ?? ""} required minLength={2} maxLength={120} />
              </div>
              <div className="field">
                <label htmlFor="product-brand">Marca</label>
                <select id="product-brand" name="brand" value={brand} onChange={(event) => setBrand(event.target.value as BrandSlug)}>
                  {Object.entries(BRAND_INFO).map(([slug, info]) => <option value={slug} key={slug}>{info.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="product-category">Categoría</label>
                <select id="product-category" name="category" defaultValue={initialCategory} key={`${brand}-${initialCategory}`}>
                  {categories.map((category) => <option value={category.slug} key={category.slug}>{category.label}</option>)}
                </select>
              </div>
              <div className="field field--wide">
                <label htmlFor="product-description">Descripción</label>
                <textarea id="product-description" name="description" defaultValue={product?.description ?? ""} maxLength={1200} />
                <span className="field-hint">Máximo 1200 caracteres. Incluye solo información confirmada del producto.</span>
              </div>
            </div>
          </section>

          <section className="form-section" aria-labelledby="pricing-title">
            <h2 id="pricing-title">Precios y descuentos</h2>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="product-price">Precio original · Bs</label>
                <input id="product-price" name="price" type="number" inputMode="decimal" min="0" step="0.01" defaultValue={product?.price ?? ""} required />
              </div>
              <div className="field">
                <label htmlFor="product-promo-price">Precio promocional · Bs</label>
                <input id="product-promo-price" name="promoPrice" type="number" inputMode="decimal" min="0" step="0.01" defaultValue={product?.promo_price ?? ""} />
                <span className="field-hint">Debe ser menor al precio original.</span>
              </div>
              <div className="field">
                <label htmlFor="promo-start">Inicio de promoción</label>
                <input id="promo-start" name="promoStartsAt" type="datetime-local" defaultValue={toLocalDateTime(product?.promo_starts_at ?? null)} />
                <span className="field-hint">Hora de Bolivia. Deja vacío si no quieres programarla.</span>
              </div>
              <div className="field">
                <label htmlFor="promo-end">Fin de promoción</label>
                <input id="promo-end" name="promoEndsAt" type="datetime-local" defaultValue={toLocalDateTime(product?.promo_ends_at ?? null)} />
                <span className="field-hint">La promoción dejará de mostrarse al llegar esta fecha.</span>
              </div>
              <div className="field field--wide">
                <label className="field-checkbox">
                  <input name="showInDiscounts" type="checkbox" defaultChecked={product?.show_in_discounts ?? false} />
                  <span><strong>Mostrar en Descuentos</strong><small>El producto se publica en la pestaña promocional mientras la promoción esté activa.</small></span>
                </label>
              </div>
            </div>
          </section>
        </div>

        <aside>
          <section className="form-section" aria-labelledby="product-image-title">
            <h2 id="product-image-title">Fotografía</h2>
            <div className="image-preview">
              {imageUrl ? (
                <Image src={imageUrl} alt={product?.image_alt || product?.name || "Imagen actual del producto"} fill sizes="(max-width: 680px) 100vw, 32vw" unoptimized />
              ) : (
                <div className="product-image--empty"><ImagePlus size={25} strokeWidth={1.4} aria-hidden="true" /><span>La imagen del producto aparecerá aquí.</span></div>
              )}
            </div>
            <div className="field" style={{ marginTop: "1rem" }}>
              <label htmlFor="product-image">Cargar o reemplazar imagen</label>
              <input id="product-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" />
              <span className="field-hint">JPG, PNG o WebP · hasta 8 MB.</span>
            </div>
            <div className="field" style={{ marginTop: "0.9rem" }}>
              <label htmlFor="product-image-alt">Texto alternativo</label>
              <input id="product-image-alt" name="imageAlt" defaultValue={product?.image_alt ?? ""} maxLength={180} />
              <span className="field-hint">Describe la imagen para lectores de pantalla.</span>
            </div>
          </section>

          <section className="form-section" aria-labelledby="publishing-title">
            <h2 id="publishing-title">Publicación</h2>
            <label className="field-checkbox">
              <input name="isPublished" type="checkbox" defaultChecked={product?.is_published ?? false} />
              <span><strong>Publicar en el catálogo</strong><small>Si está desactivado, solo el personal podrá ver el producto en el panel.</small></span>
            </label>
            <div className="form-actions">
              <button className="button button-primary" type="submit" disabled={pending}>
                <Save size={15} aria-hidden="true" /> {pending ? "Guardando…" : "Guardar producto"}
              </button>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
