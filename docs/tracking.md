# Medición, cookies y redirecciones

## Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Para qué | Si falta o está vacía |
| --- | --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID numérico del Píxel de Meta (solo dígitos, 8 a 20) | Meta Pixel no se carga ni se piden scripts a Meta |
| `NEXT_PUBLIC_GA4_ID` | ID de medición de GA4 (`G-XXXXXXXXXX`) | GA4 no se carga |

Son públicas (viajan al navegador) pero **no son secretos**. Por ser `NEXT_PUBLIC_*`, Next las incrusta al compilar: tras añadirlas o cambiarlas hay que **volver a desplegar**.

## Cómo funciona

- **Consentimiento** (`lib/consent.ts`, `components/consent-banner.tsx`): el banner guarda la decisión en `localStorage` (`wandra-consent-v1`). Categorías: necesarias (siempre activas), analítica y marketing. Se puede cambiar desde `/politicas#cookies` → «Gestionar cookies».
- **Meta Pixel** solo se carga con ID válido **y** consentimiento de *marketing*. **GA4** solo con ID válido **y** consentimiento de *analítica*.
- **Eventos** (`lib/analytics.ts`), siempre en `COP`:

  | Momento | Meta | GA4 |
  | --- | --- | --- |
  | Cada ruta | `PageView` | `page_view` |
  | Ficha de producto | `ViewContent` | `view_item` |
  | Añadir a la bolsa | `AddToCart` | `add_to_cart` |
  | Entrar a `/checkout` con bolsa | `InitiateCheckout` | `begin_checkout` |
  | Volver de Mercado Pago con pago aprobado | `Purchase` | `purchase` |

- `content_ids` / `item_id` son los SKU de cada presentación (`variants[].sku`).
- **Compra:** antes de enviar al visitante a Mercado Pago se guarda en su navegador qué compraba (`wandra-checkout-snapshot-v1`). Al volver con `estado=aprobado` se envía `Purchase` una sola vez por pedido, con el id del pedido como `eventID` / `transaction_id`. Esto mide el retorno del navegador; el pago se confirma de forma definitiva en el webhook. Para medir también compras que no vuelven al sitio, el siguiente paso es la API de Conversiones de Meta desde el webhook, usando el mismo `eventID` para deduplicar.

## Cómo probar

1. Crea `.env.local` con `NEXT_PUBLIC_META_PIXEL_ID=<tu id>` y ejecuta `npm run dev` (o abre un Preview de Vercel con la variable).
2. En una ventana de incógnito abre el sitio: debe verse el banner y **no** debe haber peticiones a `connect.facebook.net` (pestaña Network).
3. «Rechazar» → recarga y navega: sigue sin haber peticiones a Meta y el banner no vuelve.
4. `/politicas#cookies` → «Gestionar cookies» → activa *Marketing* → «Guardar selección»: aparece **una** petición a `fbevents.js` y un `PageView`.
5. Verifica los eventos con la extensión *Meta Pixel Helper* o en Meta → Administrador de eventos → *Probar eventos*.
6. Sin la variable: aunque aceptes todo, no debe haber peticiones a Meta ni errores en consola.

## Redirecciones 301

Las rutas heredadas de WordPress/WooCommerce están en `next.config.ts` (`legacyRedirects`). Las URLs viejas terminan en `/`: Next primero quita la barra final y luego aplica la redirección, así que esas URLs hacen **dos** saltos 308. Es correcto para SEO; la alternativa de un solo salto (`skipTrailingSlashRedirect`) haría que cualquier página actual también responda 200 con barra final, y no se aplicó.
