import Link from "next/link";
import { Boxes, CirclePercent, House, LogOut, Plus, Tag } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";

type AdminSection = "overview" | "products" | "discounts" | "new-product";

export function AdminShell({
  children,
  section,
  username,
}: {
  children: React.ReactNode;
  section: AdminSection;
  username: string;
}) {
  const links = [
    { href: "/admin", label: "Resumen", section: "overview" as const, icon: House },
    { href: "/admin/products", label: "Productos", section: "products" as const, icon: Boxes },
    { href: "/admin/discounts", label: "Descuentos", section: "discounts" as const, icon: CirclePercent },
    { href: "/admin/products/new", label: "Agregar producto", section: "new-product" as const, icon: Plus },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link className="brand-lockup" href="/admin" aria-label="Administración de BR y Bressy Rosse">
          <span className="brand-mark" aria-hidden="true">BR</span>
          <span>
            <span className="brand-name">BR · Bressy Rosse</span>
            <span className="brand-subtitle">Administración</span>
          </span>
        </Link>
        <p className="admin-side-label">Catálogo</p>
        <nav className="admin-nav" aria-label="Menú de administración">
          {links.map(({ href, label, section: itemSection, icon: Icon }) => (
            <Link className="admin-nav-link" href={href} key={href} aria-current={section === itemSection ? "page" : undefined}>
              <Icon size={16} strokeWidth={1.8} aria-hidden="true" /> {label}
            </Link>
          ))}
        </nav>
        <div className="admin-side-bottom">
          <Link href="/" className="admin-nav-link"><Tag size={15} aria-hidden="true" /> Ver catálogo público</Link>
          <form action={logoutAdmin}>
            <button type="submit"><LogOut size={14} aria-hidden="true" /> Cerrar sesión</button>
          </form>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-topbar-title">Panel de catálogo</span>
          <span className="admin-topbar-user">Sesión: <strong>{username}</strong></span>
        </header>
        {children}
      </div>
    </div>
  );
}
