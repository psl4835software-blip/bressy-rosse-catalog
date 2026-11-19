import { getCloudflareEnv } from "@/lib/cloudflare/env";

const imagePathPattern = /^(br|bressy-rosse)\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ imagePath: string[] }> },
) {
  const { imagePath } = await params;
  const key = imagePath.join("/");
  if (!imagePathPattern.test(key)) return new Response(null, { status: 404 });

  const { PRODUCT_IMAGES } = await getCloudflareEnv();
  const image = await PRODUCT_IMAGES.get(key);
  if (!image) return new Response(null, { status: 404 });

  const headers = new Headers();
  image.writeHttpMetadata(headers);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("etag", image.httpEtag);
  headers.set("x-content-type-options", "nosniff");
  return new Response(image.body, { headers });
}
