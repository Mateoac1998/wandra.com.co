# Changelog

Todas las versiones relevantes de Wandra se registran aquí.

## 0.1.2 — 2026-09-05

### Corregido

- Anulada la carpeta de salida `dist` heredada en Vercel para permitir que Next.js use su salida de despliegue nativa.

## 0.1.1 — 2026-09-05

### Corregido

- Migrado el proceso de build de Vinext/Cloudflare a Next.js estándar para compatibilidad directa con Vercel.
- La página de inicio, catálogo, guías, FAQ y páginas de producto se generan como HTML estático durante el build.
- Añadida la configuración PostCSS requerida por Tailwind en el entorno de Next.js.

## 0.1.0 — 2026-09-05

### Añadido

- Landing editorial de Wandra con navegación, rituales, sabores, packs y newsletter.
- Catálogo de 14 productos importado del export de WooCommerce, con SKU, formatos y precios.
- Rutas individuales indexables para cada producto.
- Blog con guías de kombucha y ghee, además de preguntas frecuentes visibles.
- Metadatos SEO, canonical, Open Graph, Twitter Cards, `robots.txt`, `sitemap.xml` y datos estructurados de tienda, productos, artículos y FAQ.
- Imágenes WebP optimizadas para la portada y carpeta preparada para carga en Cloudinary.

### Mejorado

- Identidad visual Wandra: paleta, tipografías, logo blanco y fotografías editoriales.
- Fichas de sabor con tamaños, precios y llamados a la acción más claros en móvil.
- Packshots específicos para los six packs de 280 ml y 500 ml.
- Carga diferida para imágenes no prioritarias.

### Pendiente de información comercial

- Políticas definitivas de envío, devoluciones, privacidad y términos.
- Datos legales y de contacto para completar la ficha de organización y el checkout.
- URLs finales de Cloudinary, disponibilidad en inventario, ingredientes, alérgenos y tablas nutricionales por producto.
