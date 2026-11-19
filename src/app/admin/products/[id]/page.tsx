import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { ProductEditorForm } from "@/components/product-editor-form";
import { requireCatalogManager } from "@/lib/auth/admin";
import { getCatalogRepository, getImageUrl } from "@/lib/catalog/repository";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar producto" };

export default async function EditProductPage({ params }: Props) {
  const [manager, { id }] = await Promise.all([requireCatalogManager(), params]);
  const repository = getCatalogRepository();
  if (!repository) notFound();
  const product = await repository.getForManagement(id);
  if (!product) notFound();
  const imageUrl = await getImageUrl(product.image_path);

  return (
    <AdminShell section="products" username={manager.profile.username}>
      <main className="admin-content">
        <div className="breadcrumb admin-breadcrumb"><Link href="/admin/products"><ArrowLeft size={13} aria-hidden="true" /> Volver a productos</Link></div>
        <div className="admin-heading"><div><h1>Editar producto</h1><p>Los cambios se reflejarán en el catálogo cuando lo publiques.</p></div></div>
        <ProductEditorForm product={product} imageUrl={imageUrl} />
      </main>
    </AdminShell>
  );
}
