import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";

export async function getCloudflareEnv() {
  // Bindings must be read in a request context, never during module initialization.
  await headers();
  const context = await getCloudflareContext({ async: true });
  return context.env as CloudflareEnv;
}
