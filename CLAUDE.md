# GP Automóviles — CLAUDE.md

Sitio web de la concesionaria GP Automóviles (Uruguay), migrado de HTML/CSS/JS vanilla a Next.js 14. Muestra y gestiona el inventario de autos usados y 0km.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript 5.3
- **Base de datos**: Supabase (tablas: `Autos`, `leads`, `coupons_issued`)
- **Email / CRM**: Brevo (Sendinblue)
- **Deploy**: Netlify (`@netlify/plugin-nextjs`)
- **Package manager**: pnpm
- **CSS**: CSS puro en `app/globals.css` (~2 400 líneas) — sin framework de estilos
- **Íconos**: Font Awesome 6 via CDN
- **Fuente**: Inter via `next/font/google`
- **Analytics**: Google Tag Manager (GTM-K5HFNX5R)

## Comandos

```bash
pnpm dev      # servidor de desarrollo en http://localhost:3000
pnpm build    # build de producción
pnpm start    # servidor de producción
pnpm lint     # linting Next.js
```

No hay suite de tests.

## Variables de entorno

Crear `.env.local` (está en `.gitignore`; no existe `.env.example`):

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BREVO_API_KEY=
BREVO_FROM_EMAIL=
BREVO_FROM_NAME=
```

## Estructura del proyecto

```
app/
  api/
    vehicles/route.ts        # GET /api/vehicles — lista paginada desde Supabase
    vehicles/[id]/route.ts   # GET /api/vehicles/[id] — detalle de vehículo
    lead/route.ts            # POST /api/lead — captura de lead + cupón + email Brevo
  components/
    Header.tsx               # Nav con scroll suave y auto-hide
    Hero.tsx
    Vehicles.tsx             # Grid con paginación ("Cargar más", 6 por página)
    CeroKm.tsx               # Carrusel de marcas
    Benefits.tsx             # Cards de servicios con modales
    Quote.tsx                # Formulario de cotización (envía por WhatsApp)
    Reviews.tsx              # Testimonios de Google
    Location.tsx             # Info de contacto y mapa
    Footer.tsx
    ServiceModal.tsx         # Modales de información de servicios
    LeadCouponModal.tsx      # Pop-up de captura de lead (delay 1 s, control por localStorage)
  hooks/
    useVehicleModal.ts       # Expone funciones globales para modales de vehículos
  lib/
    utils.ts                 # Modales dinámicos, notificaciones toast, carrusel de imágenes, WhatsApp
    supabaseAdmin.ts         # Cliente Supabase server-side (solo para API routes)
    brevo.ts                 # Sincronización de contactos y envío de emails transaccionales
  layout.tsx                 # Layout raíz con metadata SEO y GTM
  page.tsx                   # Página principal (orquesta todos los componentes)
  globals.css                # Estilos globales — no tocar estructura, preservar estética original
public/
  assets/                    # Logo, OG image, logos de marcas (Toyota, Ford, VW, etc.)
  robots.txt
  sitemapGP.xml
```

## Flujo de datos principal

1. `Vehicles.tsx` fetea `/api/vehicles` → Supabase tabla `Autos`
2. Click en vehículo llama `showVehicleDetails()` (global desde `useVehicleModal`) → `/api/vehicles/[id]`
3. Modal se renderiza con HTML dinámico en `utils.ts` (layouts separados mobile/desktop)
4. `LeadCouponModal` → POST `/api/lead` → crea lead en Supabase, genera cupón `GP-XXXXXX`, sincroniza con Brevo, envía email transaccional

## Patrones arquitectónicos importantes

- **Server / Client split**: `layout.tsx` es Server Component; componentes interactivos usan `'use client'`
- **Funciones globales**: `useVehicleModal` expone `showVehicleDetails` en `window` para uso desde HTML dinámico generado en `utils.ts`
- **Modales dinámicos**: generados con string de HTML en `utils.ts`, con layouts separados para mobile (≤95vw) y desktop (1200px)
- **Caché**: todas las API routes usan `force-dynamic` / `revalidate: 0`
- **Deduplicación de leads**: lookup por email case-insensitive antes de insertar
- **Cupones**: formato `GP-XXXXXX`, validación de unicidad en Supabase
- **Imágenes**: `unoptimized: true` en `next.config.js`; CDN de Supabase en `avnpyazxusstgcdeufcw.supabase.co`

## Convenciones

- Preservar la estética y lógica del sitio original (HTML/CSS/JS vanilla) al hacer cambios
- No introducir frameworks de CSS ni librerías de componentes UI
- El CSS vive todo en `globals.css` — los componentes no tienen CSS Modules
- Path alias `@/*` apunta a la raíz del proyecto (`tsconfig.json`)
