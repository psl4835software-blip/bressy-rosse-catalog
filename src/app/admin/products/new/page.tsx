import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { ProductEditorForm } from "@/components/product-editor-form";
import { requireCatalogManager } from "@/lib/auth/admin";

export const metadata = { title: "Agregar producto" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const manager = await requireCatalogManager();
  return (
    <AdminShell section="new-product" username={manager.profile.username}>
      <main className="admin-content">
        <div className="breadcrumb admin-breadcrumb"><Link href="/admin/products"><ArrowLeft size={13} aria-hidden="true" /> Volver a productos</Link></div>
        <div className="admin-heading"><div><h1>Agregar producto</h1><p>Elige marca y categoría, completa el precio y carga la imagen.</p></div></div>
        <ProductEditorForm />
      </main>
    </AdminShell>
  );
}
