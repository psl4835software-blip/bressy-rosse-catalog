---
name: "BR · Bressy Rosse"
description: "Catálogo de dos marcas con una experiencia fluida y luminosa."
colors:
  primary: "#29172f"
  rose-accent: "#d74879"
  berry-deep: "#842650"
  lilac-soft: "#b891c4"
  neutral-bg: "#fbf7fa"
  neutral-surface: "#ffffff"
  neutral-muted: "#5b4d61"
typography:
  display:
    fontFamily: '"Fraunces Variable", Georgia, serif'
    fontSize: "clamp(3.2rem, 6vw, 5.7rem)"
    fontWeight: 520
    lineHeight: 0.94
    letterSpacing: "-0.052em"
  headline:
    fontFamily: '"Fraunces Variable", Georgia, serif'
    fontSize: "clamp(2rem, 3.7vw, 3.35rem)"
    fontWeight: 530
    lineHeight: 1.04
  body:
    fontFamily: '"Manrope Variable", "Segoe UI", sans-serif'
    fontSize: "15px"
    lineHeight: 1.6
  label:
    fontFamily: '"Manrope Variable", "Segoe UI", sans-serif'
    fontSize: "0.75rem"
    fontWeight: 800
rounded:
  circle: "50%"
  pill: "999px"
  hero: "42px"
  card: "24px"
  field: "14px"
components:
  hero-shell:
    backgroundColor: "linear-gradient(126deg, #32173d 4%, #642653 56%, #8c3a70 100%)"
    textColor: "#fff9fc"
    typography: "{typography.display}"
    rounded: "{rounded.hero}"
    padding: "clamp(2rem, 6.5vw, 5.4rem)"
    height: "510px"
  nav-floating:
    backgroundColor: "rgba(255, 255, 255, 0.78)"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1rem 0.55rem 1.15rem"
    height: "72px"
  button-primary:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "#552345"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.74rem 1.15rem"
    height: "48px"
  button-glass:
    backgroundColor: "rgba(255, 255, 255, 0.13)"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.74rem 1.15rem"
    height: "48px"
  brand-launcher:
    backgroundColor: "rgba(255, 249, 255, 0.2)"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1rem 0.75rem 0.78rem"
    height: "86px"
  category-chip:
    backgroundColor: "rgba(255, 255, 255, 0.68)"
    textColor: "#3e2b45"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.58rem 0.88rem 0.58rem 0.55rem"
    height: "47px"
  product-image-well:
    backgroundColor: "linear-gradient(145deg, #f1e8f1, #eadde9 54%, #f9edf2)"
    rounded: "27px"
    size: "aspect-ratio 0.98 / 1"
  input-field:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0.65rem 0.72rem"
    height: "46px"
---

# Design System: BR · Bressy Rosse

## Overview

**Creative North Star: "El escaparate de luz fluida"**

Una portada une BR y Bressy Rosse en un recorrido de catálogo claro y contemporáneo. La composición deja aire entre secciones, reserva los titulares para una serif expresiva y mantiene las rutas de marca, categorías y descuentos fáciles de reconocer.

La luz suave y el vidrio translúcido dan profundidad a los controles flotantes sobre un campo ciruela y rosa. Las demás superficies permanecen claras, con contraste suficiente para leer nombres, precios y categorías. El contenido de productos proviene del catálogo autorizado.

**Key Characteristics:**
- Vitrina luminosa en ciruela y rosa, rodeada de superficies perladas.
- Fraunces para titulares y nombres destacados; Manrope para navegación y lectura.
- Formas circulares y tipo píldora en navegación, botones y accesos de categoría.

## Colors

La paleta combina tinta ciruela, acentos rosa y lavanda con fondos perlados y texto secundario ciruela grisáceo.

### Primary
- **Tinta ciruela** ({colors.primary}): texto principal y base oscura de las superficies de marca.

### Secondary
- **Rosa de señal** ({colors.rose-accent}): acento para la palabra destacada, navegación de descuentos y estados activos.
- **Berry profundo** ({colors.berry-deep}): parte de los fondos graduales de la portada y el panel de descuentos.

### Tertiary
- **Lavanda suave** ({colors.lilac-soft}): luz ambiental, monogramas y señales de marca secundarias.

### Neutral
- **Perla** ({colors.neutral-bg}): fondo general de la tienda.
- **Blanco** ({colors.neutral-surface}): superficies elevadas, botones principales y campos.
- **Ciruela apagado** ({colors.neutral-muted}): texto de apoyo y descripciones.

**The Rose-Signal Rule.** El rosa marca foco y promoción; los fondos amplios se mantienen perlados o ciruela para conservar una jerarquía tranquila.

## Typography

**Display Font:** Fraunces Variable (with Georgia, serif fallback)  
**Body Font:** Manrope Variable (with Segoe UI, sans-serif fallback)  
**Label/Mono Font:** Manrope Variable; no mono font is used.

**Character:** Fraunces aporta una voz editorial y amable a titulares y nombres. Manrope mantiene la navegación, los formularios y la lectura práctica y nítida.

### Hierarchy
- **Display** (weight 520, responsive clamp, line-height 0.94): titular principal de portada.
- **Headline** (weight 530, responsive clamp, line-height 1.04): encabezados de sección y paneles promocionales.
- **Title** (weight 530, 1.4rem, line-height 1.15): nombre de producto.
- **Body** (15px, line-height 1.6): texto general; los párrafos de portada usan una interlínea más abierta.
- **Label** (weight 800, 0.75rem): controles, enlaces de acción y etiquetas breves.

**The Two-Voice Rule.** Usa Fraunces para titulares y nombres destacados; usa Manrope para navegación, formularios, precios y texto de lectura.

## Layout

La cabecera llega hasta un contenedor máximo de 1340px; el contenido principal y el pie usan un ancho máximo de 1260px. En escritorio, la portada organiza texto y accesos de marca en dos columnas con una separación fluida. Las secciones dejan más espacio antes de cada título que después.

Por debajo de 900px se estrechan los márgenes y la portada conserva dos columnas más compactas. Hasta 680px, la portada pasa a una columna, la navegación se desplaza horizontalmente y las categorías forman una fila deslizable; las tarjetas de producto se muestran en dos columnas. Por debajo de 380px, las acciones principales se apilan.

## Elevation & Depth

El sistema combina sombras ambientales con capas tonales. La cabecera de vidrio usa una sombra suave; la portada y el panel de descuentos tienen sombras más amplias para separarse del fondo. El brillo de la portada se construye con campos radiales, círculos difusos y reflejos leves.

**The Glass-Control Rule.** Reserva el desenfoque translúcido para la cabecera flotante y los accesos de marca; deja el texto de catálogo sobre superficies claras y legibles.

## Shapes

La silueta dominante es circular o tipo píldora. Usa rounded.pill en navegación, botones, categorías y lanzadores de marca; usa rounded.circle en monogramas y destellos circulares. La portada y el panel de descuentos tienen esquinas amplias; tarjetas y campos usan radios más contenidos. Los bordes finos separan superficies perladas sin formar cuadrículas duras.

**The Soft-Edge Rule.** Mantén las acciones y la navegación redondeadas; aplica esquinas suaves a los bloques amplios y evita volver al aspecto de cajas cuadradas.

## Components

### Buttons
- **Shape:** Usa rounded.pill en las acciones.
- **Primary:** Botón blanco sobre el campo ciruela, texto ciruela profundo y altura cómoda.
- **Hover / Focus:** Eleva sutilmente el control y aclara su superficie; conserva el foco visible lavanda.
- **Secondary / Ghost:** El botón de vidrio usa una superficie translúcida con borde blanco; el botón claro sirve sobre paneles oscuros.

### Chips
- **Style:** Categorías en píldoras claras con un distintivo de marca.
- **State:** En reposo tienen borde tenue; al pasar el cursor o estar activas pasan a ciruela con texto blanco.
- **Mobile:** Se desplazan horizontalmente para mantener los nombres completos.

### Cards / Containers
- **Corner Style:** La portada y el panel promocional usan esquinas amplias; el estado vacío y la zona de imagen usan radios más compactos.
- **Background:** Contenido y estados vacíos se apoyan en superficies blancas o perladas; los paneles destacados usan gradientes ciruela y rosa.
- **Shadow Strategy:** Sombras ambientales en cabecera, escaparate, lanzadores y tarjetas de estado.
- **Border:** Trazos finos claros sobre fondos oscuros y tonos ciruela tenues sobre superficies blancas.
- **Internal Padding:** Espaciado fluido en la portada y el panel promocional; controles más compactos para navegación y campos.

### Inputs / Fields
- **Style:** Fondo blanco, borde ciruela tenue y radio de campo.
- **Focus:** Contorno lavanda visible y borde rosa ciruela.
- **Error / Disabled:** Los mensajes de error y éxito conservan fondos diferenciados y el texto del estado.

### Navigation
- **Style:** Cabecera flotante translúcida con una marca breve, dos enlaces de marca, descuentos y acceso administrativo.
- **States:** El enlace activo y el de descuentos se distinguen con color; el acceso administrativo conserva una píldora ciruela de alto contraste.
- **Mobile:** La marca ocupa la primera fila; los enlaces se desplazan horizontalmente en la segunda.

### Brand Launcher
Dos accesos translúcidos superpuestos presentan Bressy Rosse y BR dentro del escaparate de portada. Cada enlace combina un monograma circular, un rótulo, el nombre de marca y una flecha; el movimiento al pasar el cursor es breve y sutil.

## Do's and Don'ts

### Do:
- **Do**: Mantén los nombres y las categorías de BR y Bressy Rosse de acuerdo con el catálogo real.
- **Do**: Conserva texto legible y contraste claro sobre cada capa translúcida.
- **Do**: Usa la silueta de píldora en navegación, botones y categorías.
- **Do**: Muestra los precios en Bs cuando el catálogo autorizado los proporciona.

### Don't:
- **Don't**: No extiendas el desenfoque de vidrio a todo el contenido o a las fichas de producto.
- **Don't**: No inventes productos, fotografías, precios, testimonios o afirmaciones; usa solo datos y medios aprobados.
- **Don't**: No conviertas el catálogo de exploración en un flujo de compra o pago.
