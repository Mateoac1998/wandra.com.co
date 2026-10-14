# Wandra — pruebas del checkout

Preparación del 14 de octubre de 2026, a partir de la auditoría de este chat.
Rama: `codex/wandra-checkout-pruebas`. Base comprobada: `304225e` (v0.3.1).

## Configuración del Preview

1. En Vercel, asignar `MERCADOPAGO_ACCESS_TOKEN` con la credencial de prueba únicamente a **Preview**. Mantener la credencial vigente del comercio en **Production**. El propietario configura el secreto directamente en Vercel.
2. Activar **Automatically expose System Environment Variables**. El servidor usa `VERCEL_ENV=preview` para elegir `sandbox_init_point`; el navegador usa `NEXT_PUBLIC_VERCEL_ENV=preview` para mostrar el aviso de pruebas.
3. Crear un despliegue **Preview** de esta rama y abrir la URL que Vercel muestre. Al iniciar un pago, la respuesta de `POST /api/checkout` debe incluir `mode: "sandbox"` y una URL sandbox. Si el aviso no aparece o el modo es `production`, revisar la configuración antes de continuar.
4. Las URLs de retorno del Preview se construyen con el dominio de esa solicitud. No es necesario sustituir `NEXT_PUBLIC_SITE_URL`, que sigue describiendo la web publicada.
5. Usar el comprador de prueba de Colombia y las tarjetas/escenarios de la documentación de **Checkout Pro vía Preferencias**. Mantener el navegador del vendedor separado de la sesión del comprador, por ejemplo usando una ventana de incógnito. Comprobar la compatibilidad de las credenciales con este flujo: el panel de la aplicación revisada mostraba **Checkout API**, dato aún por contrastar.

## Evidencia por intento

Anotar hora, código HTTP, referencia `WHS-…`, ID de preferencia, ID de pago y estado obtenido de Mercado Pago. No copiar tokens, contraseñas, códigos de verificación ni datos de tarjeta.

- **Request Logs** de Vercel: localizar `POST /api/checkout`.
- **Runtime Logs**: `wandra.checkout.created` incluye referencia, modo e ID de preferencia; `wandra.checkout.failed` incluye referencia, modo, motivo técnico y duración. Los datos del comprador y las credenciales no se registran.
- En caso de rechazo al crear la preferencia, consultar `providerStatus`. Si el proveedor no devuelve URL sandbox, el Preview responde con error en lugar de abrir el checkout normal.

## Pruebas y alcance

Ejecutar `npm run test:checkout` para verificar selección de URL/retorno, recálculo del precio, ausencia de fallback a producción, rechazo del proveedor, fallo de red, timeout y entrada inválida sin contactar a Mercado Pago. Las respuestas del proveedor están simuladas en estas pruebas locales.

Después, verificar con Mercado Pago escenarios aprobado, rechazado, pendiente y abandono, en escritorio y móvil. El estado final debe corroborarse con el proveedor, no solo con la URL de regreso.

La auditoría completa sigue pendiente: aún faltan persistencia de pedidos y datos de entrega, recepción y validación de webhooks y consulta del estado real en la página de resultado. El código actual de resultado interpreta `estado` en la URL y vacía el carrito al recibir `aprobado`; eso no constituye confirmación de un cobro. Las pruebas sandbox de esta rama no certifican por sí solas el flujo comercial completo.

## Fuentes

- https://www.mercadopago.com.co/developers/es/reference/online-payments/checkout-pro-preferences/create-preference/post
- https://www.mercadopago.com.co/developers/en/docs/checkout-pro-preferences/integration-test/test-purchases
- https://vercel.com/docs/environment-variables/system-environment-variables
