"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAuth } from "@/lib/auth/server";

export async function logoutAdmin() {
  try {
    const auth = await createAuth();
    await auth.api.signOut({ headers: await headers() });
  } finally {
    redirect("/admin/login");
  }
}
