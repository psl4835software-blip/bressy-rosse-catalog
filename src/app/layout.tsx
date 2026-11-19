import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import type { Metadata } from "next";
import { StorefrontProvider } from "@/components/storefront-interactions";

export const metadata: Metadata = {
  title: {
    default: "BR · Bressy Rosse | Catálogo",
    template: "%s · BR y Bressy Rosse",
  },
  description: "Explora los catálogos de BR y Bressy Rosse.",
  applicationName: "BR y Bressy Rosse",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-BO">
      <body>
        <StorefrontProvider>{children}</StorefrontProvider>
      </body>
    </html>
  );
}
