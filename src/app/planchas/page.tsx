import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Planchas y herramientas para el cabello",
  description: "Explora planchas, secadores, rizadores y cepillos para el cabello.",
};

const items = [
  {
    src: "/planchas/plancha-profesional-titanium-mc-5572.jpeg",
    width: 1536,
    height: 1024,
    name: "Plancha profesional Titanium Crimper",
    model: "MC-5572",
    alt: "Plancha profesional Titanium Crimper MAC Styler, modelo MC-5572.",
  },
  {
    src: "/planchas/luxe-dryer-mc-6644.jpeg",
    width: 1536,
    height: 1024,
    name: "Luxe Dryer",
    model: "MC-6644",
    alt: "Secador profesional Luxe Dryer MAC Styler, modelo MC-6644.",
  },
  {
    src: "/planchas/secador-profesional-mc-6609.jpeg",
    width: 1536,
    height: 1024,
    name: "Secador de cabello profesional",
    model: "MC-6609",
    alt: "Secador de cabello profesional MAC, modelo MC-6609.",
  },
  {
    src: "/planchas/alisadora-profesional-mc-2031a.jpeg",
    width: 1536,
    height: 1024,
    name: "Plancha alisadora profesional",
    model: "MC-2031A Pro",
    alt: "Plancha alisadora profesional MAC Styler, modelo MC-2031A Pro.",
  },
  {
    src: "/planchas/cepillo-secador-rotativo-mc-6630.jpeg",
    width: 1536,
    height: 1024,
    name: "Cepillo secador rotativo 3 en 1",
    model: "MC-6630",
    alt: "Cepillo secador rotativo MAC Styler 3 en 1, modelo MC-6630.",
  },
  {
    src: "/planchas/set-secador-plancha-mc-6605.jpeg",
    width: 1536,
    height: 1024,
    name: "Set profesional secador + plancha",
    model: "MC-6605 · Pro+ 2 en 1",
    alt: "Set profesional MAC Styler con secador y plancha, modelo MC-6605 Pro+ 2 en 1.",
  },
  {
    src: "/planchas/alisador-profesional-mc-5552.jpeg",
    width: 899,
    height: 1600,
    name: "Alisador de cabello profesional",
    model: "MC-5552",
    alt: "Alisador de cabello profesional MAC Styler, modelo MC-5552.",
  },
  {
    src: "/planchas/secador-rotativo-5-en-1-mc-660.jpeg",
    width: 899,
    height: 1600,
    name: "Secador rotativo 5 en 1",
    model: "MC-660",
    alt: "Secador rotativo MAC Styler 5 en 1, modelo MC-660.",
  },
  {
    src: "/planchas/rizador-electrico-qt-8804.jpeg",
    width: 899,
    height: 1600,
    name: "Rizador eléctrico",
    model: "QT-8804",
    alt: "Rizador eléctrico para el cabello, modelo QT-8804.",
  },
  {
    src: "/planchas/alisadora-pro-mc-2031a-azul.jpeg",
    width: 899,
    height: 1600,
    name: "Alisador profesional",
    model: "MC-2031A Pro",
    alt: "Alisador profesional MAC Styler azul, modelo MC-2031A Pro.",
  },
  {
    src: "/planchas/cepillo-rotativo-3-en-1-mc-6630.jpeg",
    width: 899,
    height: 1600,
    name: "Cepillo rotativo 3 en 1",
    model: "MC-6630",
    alt: "Cepillo rotativo MAC Styler 3 en 1, modelo MC-6630.",
  },
  {
    src: "/planchas/secador-mac-profesional.jpeg",
    width: 899,
    height: 1600,
    name: "Secador MAC profesional",
    model: "Secador de cabello",
    alt: "Secador de cabello MAC profesional.",
  },
  {
    src: "/planchas/multistyler-5-en-1-tp-5-1.jpeg",
    width: 1536,
    height: 1024,
    name: "Multistyler 5 en 1",
    model: "TP-5+1",
    alt: "Multistyler MAC Styler 5 en 1 con accesorios para estilizar el cabello, modelo TP-5+1.",
  },
];

export default function PlanchasPage() {
  return (
    <>
      <SiteHeader active="planchas" />
      <main id="contenido" className="site-main">
        <div className="page-intro">
          <div className="breadcrumb">
            <Link href="/">Inicio</Link><span aria-hidden="true">/</span><span>Planchas</span>
          </div>
          <h1 className="page-title">Planchas</h1>
          <p className="page-description">Planchas, secadores, rizadores y cepillos para el cabello. Explora cada modelo y sus características en las imágenes.</p>
        </div>

        <section className="planchas-grid" aria-label="Galería de planchas y herramientas para el cabello">
          {items.map((item) => (
            <article className="planchas-item" key={item.src}>
              <div className="planchas-image">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 440px) 100vw, (max-width: 680px) 50vw, (max-width: 920px) 33vw, 25vw"
                  unoptimized
                />
              </div>
              <div className="planchas-caption">
                <h2>{item.name}</h2>
                <p>{item.model}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
