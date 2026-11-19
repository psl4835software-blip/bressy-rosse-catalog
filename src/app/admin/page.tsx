import Link from "next/link";
import { ArrowRight, Boxes, CirclePercent, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { requireCatalogManager } from "@/lib/auth/admin";
import { BRAND_INFO } from "@/lib/catalog/constants";
import { getCatalogRepository } from "@/lib/catalog/repository";
import type { Product } from "@/lib/catalog/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administración" };

export default async function AdminOverviewPage() {
  const manager = await requireCatalogManager();
  const repository = getCatalogRepository();
  let products: Product[] = [];
  let listError = false;

  if (repository) {
    try {
      products = await repository.listForManagement();
    } catch {
      listError = true;
    }
  }

  const publishedCount = products.filter((product) => product.is_published).length;
  const discountCount = products.filter((product) => product.show_in_discounts && product.promo_price !== null).length;

  return (
    <AdminShell section="overview" username={manager.profile.username}>
      <main className="admin-content">
        <div className="admin-heading">
          <div>
            <h1>Resumen del catálogo</h1>
            <p>Administra las colecciones de BR y Bressy Rosse desde un mismo panel.</p>
          </div>
          <Link className="button button-primary" href="/admin/products/new"><Plus size={15} aria-hidden="true" /> Agregar producto</Link>
        </div>
        {listError && <p className="feedback feedback--error" role="alert">No pudimos cargar los productos. Revisa la conexión e inténtalo de nuevo.</p>}
        <div className="admin-stats" aria-label="Resumen de productos">
          <div className="admin-stat"><strong>{products.length}</strong><span>Productos guardados</span></div>
          <div className="admin-stat"><strong>{publishedCount}</strong><span>Publicados en el catálogo</span></div>
          <div className="admin-stat"><strong>{discountCount}</strong><span>En Descuentos</span></div>
        </div>
        <div className="section-heading">
          <div><h2>Marcas</h2><p>Abre una colección para editar sus productos.</p></div>
        </div>
        <div className="brand-admin-list">
          <Link className="brand-admin-row" href="/admin/products?brand=br">
            <span className="brand-admin-mark">BR</span>
            <span><strong>BR</strong><small>{BRAND_INFO.br.descriptor}</small></span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link className="brand-admin-row brand-admin-row--rose" href="/admin/products?brand=bressy-rosse">
            <span className="brand-admin-mark">BR</span>
            <span><strong>Bressy Rosse</strong><small>{BRAND_INFO["bressy-rosse"].descriptor}</small></span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="admin-quick-links">
          <Link className="admin-quick-link" href="/admin/products"><Boxes size={18} aria-hidden="true" /><span><strong>Gestionar productos</strong><small>Crear, editar y publicar artículos.</small></span><ArrowRight size={16} aria-hidden="true" /></Link>
          <Link className="admin-quick-link" href="/admin/discounts"><CirclePercent size={18} aria-hidden="true" /><span><strong>Gestionar descuentos</strong><small>Seleccionar productos y definir sus precios promocionales.</small></span><ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </main>
    </AdminShell>
  );
}
