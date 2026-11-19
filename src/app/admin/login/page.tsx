import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getCatalogManager } from "@/lib/auth/admin";
import { getCloudflareEnv } from "@/lib/cloudflare/env";

export const metadata = { title: "Ingreso administrativo" };

export default async function AdminLoginPage() {
  let ready = false;
  let initialAdminPending = false;
  try {
    const env = await getCloudflareEnv();
    const setup = await env.DB.prepare("SELECT value FROM catalog_setup WHERE key = 'admin-bootstrap' LIMIT 1")
      .first<{ value: string }>();
    ready = Boolean(env.BETTER_AUTH_SECRET && env.BETTER_AUTH_SECRET.length >= 32 && setup?.value === "complete");
    initialAdminPending = setup?.value === "pending";
  } catch {
    ready = false;
  }

  if (ready) {
    const manager = await getCatalogManager();
    if (manager) redirect("/admin");
    return <AdminLoginForm />;
  }

  const title = initialAdminPending ? "Acceso pendiente de activación" : "Panel pendiente de configuración";
  const message = initialAdminPending
    ? "El acceso administrativo debe prepararse desde el entorno seguro del proyecto antes del primer ingreso."
    : "El catálogo está disponible, pero el panel administrativo todavía no está conectado a los servicios de Cloudflare.";

  return (
    <main className="admin-page">
      <div className="admin-login-wrap">
        <section className="admin-login-brand">
          <Link className="brand-lockup" href="/" aria-label="Volver al catálogo">
            <span className="brand-mark" aria-hidden="true">BR</span>
            <span><span className="brand-name">BR · Bressy Rosse</span><span className="brand-subtitle">Catálogo de marcas</span></span>
          </Link>
          <h1>Las vitrinas, desde dentro.</h1>
          <p>Administra productos, fotografías y precios promocionales en un solo lugar.</p>
        </section>
        <section className="admin-login-panel" aria-labelledby="setup-title">
          <div className="setup-panel">
            <h2 id="setup-title">{title}</h2>
            <p>{message}</p>
            <Link className="button button-primary" href="/">Volver al catálogo</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
