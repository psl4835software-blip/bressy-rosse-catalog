/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    PRODUCT_IMAGES: R2Bucket;
    BETTER_AUTH_SECRET: string;
    BOOTSTRAP_ADMIN_TOKEN?: string;
    BETTER_AUTH_URL?: string;
  }
}

export {};
