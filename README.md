# BR · Bressy Rosse

Catálogo público de BR y Bressy Rosse, con panel privado para administrar productos, precios, imágenes y descuentos. Los visitantes pueden explorar productos, ampliar sus imágenes y preparar consultas de compra por WhatsApp. No incluye pagos ni sincronización de inventario.

## Arquitectura

- **Cloudflare Workers** ejecuta la aplicación Next.js mediante OpenNext.
- **Cloudflare D1** almacena productos, usuarios administrativos y sesiones.
- **Cloudflare R2** almacena las fotografías de los productos.
- **Better Auth** gestiona el ingreso con usuario y contraseña dentro del Worker y guarda sus datos en D1.
- Los precios se guardan como centavos enteros y se muestran en bolivianos (Bs).

## Inicio local con Docker

Docker proporciona un entorno local de desarrollo. La aplicación publicada sigue ejecutándose en Cloudflare Workers; el contenedor no crea un servidor de producción alternativo.

1. Requiere Docker Desktop con Docker Compose v2. En Windows, usa el backend WSL 2.
2. Crea `.dev.vars` desde la plantilla y asigna secretos locales a `BETTER_AUTH_SECRET` y `BOOTSTRAP_ADMIN_TOKEN`:

   ```powershell
   Copy-Item .dev.vars.example .dev.vars
   ```

   Genera valores distintos con `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"` y pégalos en el archivo. No compartas ni subas `.dev.vars`.

3. Construye la imagen y arranca la app:

   ```powershell
   docker compose up --build
   ```

   Compose aplica las migraciones a D1 local y luego inicia Next.js con los bindings locales de Cloudflare. Abre `http://localhost:3000`. Wrangler conserva la base local en un volumen de Docker.

Para detener el contenedor, pulsa `Ctrl+C`. Los volúmenes mantienen las dependencias, la caché y los datos D1 locales entre reinicios. El directorio `.dev.vars` se lee desde el montaje local y está excluido de la imagen.

## Requisitos

- Node.js 22.12 o posterior si trabajas sin Docker.
- Cuenta de Cloudflare con Workers, D1 y R2 habilitados.
- Wrangler conectado a esa cuenta para crear recursos y desplegar.

## Configuración inicial de Cloudflare

1. Instala las dependencias con `npm.cmd ci`.
2. Conecta Wrangler a Cloudflare:

   ```powershell
   npm.cmd run cf -- login
   ```

   El proyecto mantiene los archivos de configuración, registro y caché de Wrangler dentro de `.wrangler/`, que está excluida de Git.

3. La base D1 `bressy-rosse-catalog` y el bucket R2 `bressy-rosse-product-images` ya están creados y vinculados en `wrangler.jsonc`. Para aprovisionar otra cuenta, crea los recursos con Wrangler:

   ```powershell
   npm.cmd run cf -- d1 create bressy-rosse-catalog --binding DB --update-config
   npm.cmd run cf -- r2 bucket create bressy-rosse-product-images
   ```

5. Crea `.dev.vars` a partir de `.dev.vars.example` para el desarrollo local. Genera dos secretos diferentes y largos; puedes obtener valores con:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
   ```

   Usa un valor para `BETTER_AUTH_SECRET` y otro para `BOOTSTRAP_ADMIN_TOKEN`. No los guardes en el repositorio.

6. Aplica la migración a la base local y ejecuta la app:

   ```powershell
   npm.cmd run db:migrate:local
   npm.cmd run dev
   ```

   `npm.cmd run preview` compila OpenNext y sirve la app con el runtime Workers para revisar el entorno Cloudflare local.

`BETTER_AUTH_URL` ya apunta a la URL pública de Workers. Si agregas un dominio personalizado, actualiza esa variable en `wrangler.jsonc` y vuelve a desplegar.

## Crear la cuenta administradora

El registro público está bloqueado. La primera cuenta se crea una sola vez mediante un endpoint protegido por `BOOTSTRAP_ADMIN_TOKEN`:

1. `BETTER_AUTH_SECRET` ya está guardado como secreto en Cloudflare. Cuando vayas a crear el administrador de producción, agrega un `BOOTSTRAP_ADMIN_TOKEN` largo con Wrangler:

   ```powershell
   npm.cmd run cf -- secret put BOOTSTRAP_ADMIN_TOKEN
   ```

2. Aplica nuevas migraciones remotas antes del siguiente despliegue:

   ```powershell
   npm.cmd run db:migrate:remote
   ```

3. Despliega la aplicación y crea la cuenta desde una terminal interactiva. El script oculta tanto la contraseña como el token:

   ```powershell
   npm.cmd run deploy
   npm.cmd run bootstrap-admin -- https://tu-dominio
   ```

4. Elimina inmediatamente el secreto de bootstrap:

   ```powershell
   npm.cmd run cf -- secret delete BOOTSTRAP_ADMIN_TOKEN
   ```

La cuenta local `admin` no se copia a producción. En producción, crea una cuenta distinta con una contraseña de al menos 12 caracteres; el correo técnico interno termina en `.invalid` y no se usa para iniciar sesión ni para enviar mensajes. Después se puede ingresar en `/admin/login`.

## Desarrollo y despliegue

- `npm.cmd run dev`: desarrollo Next.js con los bindings locales de Wrangler.
- `npm.cmd run typecheck`: comprobación estática de TypeScript.
- `npm.cmd run preview`: compilación y vista previa en el runtime de Workers.
- `npm.cmd run deploy`: compilación y despliegue en Cloudflare Workers.
- `npm.cmd run cf-typegen`: regenera los tipos de los bindings después de cambiar `wrangler.jsonc`.
- `npm.cmd run cf -- <comando>`: ejecuta cualquier comando de Wrangler con configuración local del proyecto.

El despliegue público actual usa `workers.dev`. El dominio personalizado se configura en Cloudflare Workers y luego se actualiza `BETTER_AUTH_URL` en `wrangler.jsonc`.

## Administración del catálogo

- **BR** incluye material escolar, juguetes, artículos de cocina y bisutería.
- **Bressy Rosse** incluye cosméticos.
- Solo los productos publicados aparecen en las colecciones públicas.
- Para aparecer en **Descuentos**, el producto necesita un precio promocional inferior al original y la opción de descuento activada.
- Las fechas promocionales son opcionales y usan hora de Bolivia (UTC−4).
- Las imágenes admiten JPG, PNG o WebP, hasta 8 MB. El servidor comprueba el tipo de archivo antes de guardarlo en R2.

## Carrito y pedidos por WhatsApp

- El carrito funciona en los catálogos de BR y Bressy Rosse, Descuentos y Planchas. La selección se guarda en el navegador del visitante; no crea una orden ni procesa pagos.
- Las imágenes se abren ampliadas al tocarlas, hacer clic o seleccionarlas con el teclado.
- Cuando se reciba el número de pedidos, configúralo en formato internacional usando solo dígitos (código de país seguido del número).
- Para desarrollo local, copia `.env.example` a `.env.local` y define `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Para producción, crea la variable de repositorio `NEXT_PUBLIC_WHATSAPP_NUMBER` en **GitHub → Settings → Secrets and variables → Actions → Variables**. El workflow de Cloudflare la incorpora durante la compilación; ejecuta el workflow de despliegue después de guardarla.
- El número es público porque se enlaza desde la página. No guardes credenciales ni tokens en esta variable.

## Integración futura

Las páginas consultan `CatalogRepository` en `src/lib/catalog/repository.ts`. Cuando se conozca la API del sistema existente, se puede reemplazar el proveedor sin rehacer las vistas del catálogo.
