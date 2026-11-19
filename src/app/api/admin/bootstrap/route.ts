import { z } from "zod";
import { createAuth } from "@/lib/auth/server";
import { getCloudflareEnv } from "@/lib/cloudflare/env";

const minimumPasswordLength = process.env.NODE_ENV === "development" ? 3 : 12;

const bootstrapSchema = z.object({
  username: z.string().trim().toLowerCase().min(3).max(30).regex(/^[a-z0-9._-]+$/),
  name: z.string().trim().min(2).max(80),
  password: z.string().min(minimumPasswordLength).max(128),
});

function constantTimeEqual(left: string, right: string) {
  let mismatch = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    mismatch |= (left.charCodeAt(index % Math.max(left.length, 1)) || 0)
      ^ (right.charCodeAt(index % Math.max(right.length, 1)) || 0);
  }
  return mismatch === 0;
}

export async function POST(request: Request) {
  const env = await getCloudflareEnv();
  const expectedToken = env.BOOTSTRAP_ADMIN_TOKEN?.trim();
  if (!expectedToken) return new Response(null, { status: 404 });

  const bearerToken = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1] ?? "";
  if (!constantTimeEqual(bearerToken, expectedToken)) return new Response(null, { status: 401 });
  if (Number(request.headers.get("content-length") ?? 0) > 4096) return new Response(null, { status: 413 });

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return Response.json({ error: "Solicitud no válida." }, { status: 400 });
  }
  const parsed = bootstrapSchema.safeParse(rawBody);
  if (!parsed.success) return Response.json({ error: "Revisa usuario, nombre y contraseña." }, { status: 400 });

  const { DB } = env;
  const lock = await DB.prepare(
    "UPDATE catalog_setup SET value = 'in_progress' WHERE key = 'admin-bootstrap' AND value = 'pending'",
  ).run();
  if (!lock.meta.changes) return Response.json({ error: "La cuenta inicial ya existe o ya se está creando." }, { status: 409 });

  let userId: string | null = null;
  try {
    const auth = await createAuth();
    const { user } = await auth.api.signUpEmail({
      body: {
        email: `${parsed.data.username}@staff.bressy.invalid`,
        name: parsed.data.name,
        password: parsed.data.password,
        username: parsed.data.username,
      },
      headers: request.headers,
    });
    userId = user.id;
    await DB.prepare(
      "INSERT INTO catalog_managers (user_id, username, role, active) VALUES (?, ?, 'admin', 1)",
    ).bind(user.id, parsed.data.username).run();
    await DB.prepare("UPDATE catalog_setup SET value = 'complete' WHERE key = 'admin-bootstrap'").run();
    return Response.json({ created: true }, { status: 201, headers: { "cache-control": "no-store" } });
  } catch {
    if (userId) await DB.prepare('DELETE FROM "user" WHERE id = ?').bind(userId).run().catch(() => undefined);
    await DB.prepare("UPDATE catalog_setup SET value = 'pending' WHERE key = 'admin-bootstrap' AND value = 'in_progress'").run().catch(() => undefined);
    return Response.json({ error: "No se pudo crear la cuenta inicial." }, { status: 400, headers: { "cache-control": "no-store" } });
  }
}
