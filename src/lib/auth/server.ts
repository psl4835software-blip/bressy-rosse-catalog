import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { getCloudflareEnv } from "@/lib/cloudflare/env";

export async function createAuth() {
  const env = await getCloudflareEnv();
  const secret = env.BETTER_AUTH_SECRET?.trim();
  const localDevelopment = process.env.NODE_ENV === "development";
  if (!secret || secret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET debe tener al menos 32 caracteres y estar configurado en Cloudflare.");
  }

  const baseURL = env.BETTER_AUTH_URL?.trim();
  return betterAuth({
    appName: "BR · Bressy Rosse",
    ...(baseURL ? { baseURL, trustedOrigins: [baseURL] } : {}),
    secret,
    database: env.DB,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: localDevelopment ? 3 : 12,
      maxPasswordLength: 128,
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 300,
      max: 5,
      customRules: {
        "/sign-in/username": { window: 300, max: 5 },
      },
    },
    advanced: {
      ipAddress: {
        ipAddressHeaders: ["cf-connecting-ip"],
      },
    },
    disabledPaths: ["/sign-in/email", "/is-username-available"],
    plugins: [
      username({
        displayUsername: false,
        immutableUsername: true,
        usernameValidator: (value) => /^[a-z0-9._-]{3,30}$/.test(value),
      }),
      nextCookies(),
    ],
  });
}
