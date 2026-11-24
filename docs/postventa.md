# Postventa de Wandra

## Activación

1. Aplica la migración [de Supabase](../supabase/migrations/202611160001_paid_order_fulfillment.sql) al proyecto que usa Vercel antes de desplegar el PR. Añade la referencia del pago y la fecha de aprobación a `orders`, y crea `order_fulfillment` para registrar los resultados por separado.
2. Verifica el dominio remitente en Resend. Configura `RESEND_API_KEY` y `ORDER_EMAIL_FROM` como variables de servidor de Vercel. `ORDER_ADMIN_EMAIL` usa el correo habitual de Wandra si se deja vacío.
3. Confirma que `ENVIA_API_TOKEN`, `ENVIA_ORIGIN_STREET`, `ENVIA_ORIGIN_NUMBER` y `ENVIA_ORIGIN_POSTAL_CODE` corresponden a la cuenta y dirección desde las que se despacha. Si el barrio difiere del de la cotización actual, configura `ENVIA_ORIGIN_DISTRICT`.
4. Configura el evento **Pagos** en Mercado Pago para `https://www.wandra.com.co/api/webhooks/mercadopago`. El servidor requiere las credenciales de Mercado Pago y Supabase de [`.env.example`](../.env.example).

## Operación

En Supabase, filtra `order_fulfillment` por el ID del pedido. La fila `shipment` guarda `tracking_numbers` y en `result.shipments` el detalle de cada guía devuelta por Envia. Las filas de correo guardan el ID de Resend cuando acepta el mensaje. `orders.status = 'paid'` indica que se confirmó el pago, independientemente de la preparación del envío.

Los fallos transitorios de correo se reintentan cuando Mercado Pago reenvía el webhook. Si una compra de guía quedó sin confirmación, revisa primero el historial de Envia con la referencia del pedido, transportadora y destinatario. Si Envia ya emitió las guías, registra sus números en la fila de envío y márcala como `done`. Si confirmas que no existe ninguna guía, corrige la causa, cambia esa fila a `pending`, limpia `claim_token` y `last_error`, y reenvía la notificación del pago desde Mercado Pago. Las acciones `done` se conservan.

Para un pedido anterior al despliegue que ya figura como pagado, verifica el pago y si existe una guía en los paneles antes de gestionar el caso individualmente. El checkout anterior no guardaba los paquetes ni la dirección validada por Envia. Si un pedido anterior se paga después del despliegue, el envío queda en `review` para completar esos datos y los correos se intentan con el resumen guardado.

Usa las pruebas locales del webhook con proveedores simulados para verificar el flujo sin comprar guías. Para verificar una solicitud real de etiqueta sin cargo, usa el [sandbox de Envia](https://docs.envia.com/reference/create-shipping-label). El sitio utiliza la API de producción de Envia, donde solicitar una guía puede generar un cargo.
