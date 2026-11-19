import { toNextJsHandler } from "better-auth/next-js";
import { createAuth } from "@/lib/auth/server";

async function handlers() {
  return toNextJsHandler(await createAuth());
}

export async function GET(request: Request) {
  const { GET: handleGet } = await handlers();
  return handleGet(request);
}

export async function POST(request: Request) {
  // Accounts are created only through the one-time, token-protected bootstrap route.
  if (new URL(request.url).pathname.replace(/\/+$/, "") === "/api/auth/sign-up/email") {
    return Response.json({ message: "Not found" }, { status: 404 });
  }
  const { POST: handlePost } = await handlers();
  return handlePost(request);
}
