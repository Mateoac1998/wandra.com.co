# Changelog

Todas las versiones relevantes de Wandra se registran aquí.

## 0.2.0 — 2026-09-10

### Añadido

- Nuevo recorrido editorial inspirado en las referencias aprobadas: hero por diapositivas, marqués, composición circular, carrusel de sabores, despensa, packs, guías y cierre de entrega.
- Bolsa de selección con presentaciones, cantidades y subtotal, preparada para una futura integración de pagos.
- Navegación responsive, controles táctiles y respeto por la preferencia de movimiento reducido.
- Sitemap dinámico, redirecciones desde las rutas temporales de Mateo, tipografías locales y datos estructurados actualizados.

### Mejorado

- Catálogo y fichas de producto con precios, tamaños y acciones de compra más claros en móvil.
- Optimización de las imágenes locales y espacios preparados para enlaces de Cloudinary o recursos transparentes.

### Pendiente de información comercial

- Integración de checkout, pagos, inventario, envíos y políticas definitivas.
- Recursos definitivos de Cloudinary para las fotografías de producto marcadas como pendientes.

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
