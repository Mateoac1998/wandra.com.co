# Changelog

Todas las versiones relevantes de Wandra se registran aquí.

## 0.2.2 — 2026-09-11

### Corregido

- Las imágenes públicas de Wandra usan de forma consistente la cuenta aprobada de Cloudinary, sin depender de una variable de entorno pública de Vercel que pueda redirigirlas a otra cuenta.
- Los recursos de imagen ahora muestran un respaldo visual si su carga falla, en lugar de dejar una sección rota.
- Los íconos de redes sociales tienen dimensiones explícitas para impedir que un estilo incompleto o en caché los expanda sobre el hero.

## 0.2.1 — 2026-09-11

### Añadido

- Catálogo B2B para restaurantes, cafés, hoteles y tiendas saludables, con sabores, formatos, precios de distribuidor, PVP sugerido y márgenes confirmados.
- Página de políticas que cubre envíos, conservación, devoluciones, términos de compra y tratamiento de datos.
- Datos de contacto comercial, ubicación en Armenia, Quindío, y accesos directos por WhatsApp para compra y mayoristas.
- Registro sanitario INVIMA de la línea de kombucha en las fichas de producto y datos estructurados de la tienda.

### Mejorado

- Sección B2B de la portada y página mayorista con condiciones comerciales verificadas: conservación, vida útil, pagos, devolución y plazo estimado.
- Navegación móvil con un panel de alto contraste, enlaces visibles y sin superposición del contenido.
- SEO técnico: `sitemap.xml` ampliado, enlaces de políticas y datos estructurados de organización actualizados.
- Botones de producto que preparan el mensaje de WhatsApp con el artículo consultado; redes sociales fijas y botón de WhatsApp refinado.

### Pendiente de información comercial

- Códigos de barras, umbral definitivo de envío gratuito para distribuidores y condiciones/capacidades del Tap System.
- Vigencia final de los precios sugeridos al consumidor y fotografías de barriles.

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
- Blog con guías de Mateo y ghee, además de preguntas frecuentes visibles.
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
