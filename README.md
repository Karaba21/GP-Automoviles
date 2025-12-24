# GP Automóviles - Next.js

Sitio web de GP Automóviles convertido a Next.js manteniendo toda la lógica y estética original.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
GP-Automoviles/
├── app/
│   ├── components/        # Componentes React
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Vehicles.tsx
│   │   ├── CeroKm.tsx
│   │   ├── Benefits.tsx
│   │   ├── Quote.tsx
│   │   ├── Reviews.tsx
│   │   ├── Location.tsx
│   │   ├── Footer.tsx
│   │   └── ServiceModal.tsx
│   ├── hooks/            # Custom hooks
│   │   └── useVehicleModal.ts
│   ├── lib/              # Utilidades
│   │   └── utils.ts
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx          # Página principal
│   └── globals.css       # Estilos globales
├── public/
│   └── assets/           # Imágenes y recursos estáticos
├── package.json
├── next.config.js
└── tsconfig.json
```

## 🛠️ Tecnologías

- **Next.js 14** - Framework React
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Supabase** - Base de datos y backend
- **Font Awesome** - Iconos
- **Google Fonts** - Tipografía Inter

## ✨ Características

- ✅ **Misma lógica**: Toda la funcionalidad original preservada
- ✅ **Misma estética**: Estilos CSS idénticos
- ✅ **SSR/SSG**: Renderizado del lado del servidor
- ✅ **SEO Optimizado**: Metadata y Open Graph configurados
- ✅ **Responsive**: Diseño adaptativo mantenido
- ✅ **Integración Supabase**: Carga de vehículos desde base de datos

## 📝 Notas

- Los estilos CSS se mantienen exactamente iguales en `app/globals.css`
- La lógica de JavaScript se ha convertido a React hooks y funciones
- Los modales de vehículos se generan dinámicamente como en la versión original
- Las imágenes se cargan desde Supabase y se muestran con Next.js Image

## 🔧 Configuración

### Variables de Entorno

No se requieren variables de entorno adicionales. Las credenciales de Supabase están configuradas directamente en el código (puedes moverlas a variables de entorno si lo prefieres).

### Personalización

- **Estilos**: Edita `app/globals.css`
- **Componentes**: Modifica los archivos en `app/components/`
- **Lógica**: Ajusta `app/lib/utils.ts` y los hooks en `app/hooks/`

## 📱 Secciones

1. **Inicio (Hero)** - Presentación de la empresa
2. **Vehículos** - Grid de vehículos desde Supabase
3. **0km** - Carrusel de marcas
4. **Facilidades** - Servicios con modales informativos
5. **Cotización** - Formulario de cotización por WhatsApp
6. **Reseñas** - Testimonios de Google
7. **Ubicación** - Mapa y datos de contacto
8. **Footer** - Enlaces y redes sociales

## 🚀 Despliegue

El proyecto está listo para desplegarse en:
- **Vercel** (recomendado para Next.js)
- **Netlify**
- **Cualquier plataforma que soporte Node.js**

## 📄 Licencia

Todos los derechos reservados - GP Automóviles

---

**Desarrollado con ❤️ para GP Automóviles**
