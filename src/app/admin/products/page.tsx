import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Image as ImageIcon, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { requireCatalogManager } from "@/lib/auth/admin";
import { BRAND_INFO, formatPrice, isBrandSlug } from "@/lib/catalog/constants";
import { getCatalogRepository, getImageUrl } from "@/lib/catalog/repository";
import { setProductPublished } from "./actions";
import type { Product } from "@/lib/catalog/types";

type Props = { searchParams: Promise<{ brand?: string }> };

export const dynamic = "force-dynamic";
export const metadata = { title: "Productos" };

export default async function AdminProductsPage({ searchParams }: Props) {
  const manager = await requireCatalogManager();
  const query = await searchParams;
  const brandFilter = query.brand && isBrandSlug(query.brand) ? query.brand : undefined;
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
  if (brandFilter) products = products.filter((product) => product.brand === brandFilter);
  const productRows = await Promise.all(products.map(async (product) => ({
    product,
    imageUrl: await getImageUrl(product.image_path),
  })));

  return (
    <AdminShell section="products" username={manager.profile.username}>
      <main className="admin-content">
        <div className="admin-heading">
          <div>
            <h1>{brandFilter ? `Productos · ${BRAND_INFO[brandFilter].name}` : "Productos"}</h1>
            <p>Actualiza los datos que aparecen en las dos vitrinas públicas.</p>
          </div>
          <Link className="button button-primary" href="/admin/products/new"><Plus size={15} aria-hidden="true" /> Nuevo producto</Link>
        </div>
        <div className="admin-toolbar">
          <nav className="category-rail" aria-label="Filtrar por marca">
            <Link className="category-link" href="/admin/products" aria-current={!brandFilter ? "page" : undefined}>Todas las marcas</Link>
            <Link className="category-link" href="/admin/products?brand=br" aria-current={brandFilter === "br" ? "page" : undefined}>BR</Link>
            <Link className="category-link" href="/admin/products?brand=bressy-rosse" aria-current={brandFilter === "bressy-rosse" ? "page" : undefined}>Bressy Rosse</Link>
          </nav>
        </div>
        {listError && <p className="feedback feedback--error" role="alert">No pudimos cargar los productos. Revisa la conexión e inténtalo de nuevo.</p>}
        <section className="admin-panel" aria-labelledby="products-table-title">
          <div className="admin-panel-heading"><div><h2 id="products-table-title">Inventario del catálogo</h2><p>{products.length} productos en esta vista</p></div></div>
          {products.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th scope="col">Producto</th><th scope="col">Marca y categoría</th><th scope="col">Precio</th><th scope="col">Estado</th><th scope="col"><span className="sr-only">Acciones</span></th></tr></thead>
                <tbody>
                  {productRows.map(({ product, imageUrl }) => (
                      <tr key={product.id}>
                        <td>
                          <div className="table-product">
                            <span className="table-thumb">{imageUrl ? <Image src={imageUrl} alt="" fill sizes="48px" unoptimized /> : <ImageIcon size={18} aria-hidden="true" />}</span>
                            <span><strong>{product.name}</strong><small>{product.description || "Sin descripción"}</small></span>
                          </div>
                        </td>
                        <td>{BRAND_INFO[product.brand].name}<small className="table-secondary">{product.category.replaceAll("-", " ")}</small></td>
                        <td><strong>{formatPrice(product.promo_price ?? product.price)}</strong>{product.promo_price !== null && <small className="table-secondary"><s>{formatPrice(product.price)}</s></small>}</td>
                        <td><span className={`status-pill ${product.is_published ? "" : "status-pill--draft"}`}>{product.is_published ? "Publicado" : "Borrador"}</span></td>
                        <td>
                          <div className="row-actions">
                            <Link href={`/admin/products/${product.id}`}>Editar</Link>
                            <form action={setProductPublished}>
                              <input type="hidden" name="id" value={product.id} />
                              <input type="hidden" name="published" value={String(!product.is_published)} />
                              <button className="link-button" type="submit">{product.is_published ? "Ocultar" : "Publicar"}</button>
                            </form>
                          </div>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-table">{listError ? "No hay datos disponibles por el momento." : "Aún no hay productos guardados. Agrega el primero para llenar las vitrinas."}<br /><Link className="text-link" href="/admin/products/new">Agregar un producto <ArrowRight size={14} aria-hidden="true" /></Link></div>
          )}
        </section>
      </main>
    </AdminShell>
  );
}
