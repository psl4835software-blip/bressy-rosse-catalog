import Link from "next/link";
import { ArrowRight, CirclePercent } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { requireCatalogManager } from "@/lib/auth/admin";
import { BRAND_INFO, formatPrice } from "@/lib/catalog/constants";
import { getCatalogRepository } from "@/lib/catalog/repository";
import type { Product } from "@/lib/catalog/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Descuentos" };

export default async function AdminDiscountsPage() {
  const manager = await requireCatalogManager();
  const repository = getCatalogRepository();
  let products: Product[] = [];
  let listError = false;

  if (repository) {
    try {
      products = (await repository.listForManagement()).filter((product) => product.show_in_discounts);
    } catch {
      listError = true;
    }
  }

  return (
    <AdminShell section="discounts" username={manager.profile.username}>
      <main className="admin-content">
        <div className="admin-heading">
          <div><h1>Descuentos</h1><p>La selección pública se compone de los productos que marques como promocionales.</p></div>
          <Link className="button button-primary" href="/admin/products/new"><CirclePercent size={15} aria-hidden="true" /> Crear descuento</Link>
        </div>
        <div className="config-alert">Para que un producto aparezca aquí, asígnale un precio promocional menor al original y activa “Mostrar en Descuentos”. Las fechas de inicio y fin son opcionales.</div>
        {listError && <p className="feedback feedback--error" role="alert">No pudimos cargar los descuentos.</p>}
        <section className="admin-panel" aria-labelledby="discount-table-title">
          <div className="admin-panel-heading"><div><h2 id="discount-table-title">Productos promocionales</h2><p>{products.length} productos seleccionados</p></div></div>
          {products.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th scope="col">Producto</th><th scope="col">Marca</th><th scope="col">Precio original</th><th scope="col">Precio promocional</th><th scope="col">Estado</th><th scope="col"><span className="sr-only">Acciones</span></th></tr></thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td><strong>{product.name}</strong></td>
                      <td>{BRAND_INFO[product.brand].name}</td>
                      <td><s>{formatPrice(product.price)}</s></td>
                      <td><strong>{product.promo_price === null ? "Pendiente" : formatPrice(product.promo_price)}</strong></td>
                      <td><span className={`status-pill ${product.is_published ? "status-pill--discount" : "status-pill--draft"}`}>{product.is_published ? "Visible" : "Borrador"}</span></td>
                      <td><Link href={`/admin/products/${product.id}`}>Editar promoción <ArrowRight size={13} aria-hidden="true" /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-table">{listError ? "No hay datos disponibles por el momento." : "Todavía no hay productos seleccionados para Descuentos."}<br /><Link className="text-link" href="/admin/products/new">Agregar un producto promocional <ArrowRight size={14} aria-hidden="true" /></Link></div>
          )}
        </section>
      </main>
    </AdminShell>
  );
}
