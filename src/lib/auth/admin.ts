import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAuth } from "./server";
import { getCloudflareEnv } from "@/lib/cloudflare/env";

export type CatalogManager = {
  user: { id: string; name: string };
  profile: { username: string; role: "admin" | "editor"; active: true };
};

export async function getCatalogManager(): Promise<CatalogManager | null> {
  const requestHeaders = await headers();
  const auth = await createAuth();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) return null;

  const { DB } = await getCloudflareEnv();
  const profile = await DB.prepare(
    "SELECT username, role, active FROM catalog_managers WHERE user_id = ? LIMIT 1",
  ).bind(session.user.id).first<{ username: string; role: "admin" | "editor"; active: number }>();

  if (!profile || profile.active !== 1 || !["admin", "editor"].includes(profile.role)) return null;
  return {
    user: { id: session.user.id, name: session.user.name },
    profile: { username: profile.username, role: profile.role, active: true },
  };
}

export async function requireCatalogManager() {
  const manager = await getCatalogManager();
  if (!manager) redirect("/admin/login");
  return manager;
}
