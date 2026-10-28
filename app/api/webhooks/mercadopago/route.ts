import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getSupabaseAdmin } from '../../../../lib/supabase/admin';

export const runtime = 'nodejs';

type MercadoPagoNotification = { data?: { id?: string | number } };
type MercadoPagoPayment = { status?: string; external_reference?: string | null };

function isValidMercadoPagoSignature({ signature, requestId, dataId, secret }: { signature: string | null; requestId: string | null; dataId: string; secret: string }) {
  if (!signature || !dataId) return false;

  const parts = Object.fromEntries(signature.split(',').map((part) => {
    const [key, value] = part.trim().split('=');
    return [key, value];
  }));
  const timestamp = parts.ts;
  const receivedHash = parts.v1;
  if (!timestamp || !receivedHash) return false;

  const manifest = [`id:${dataId};`, requestId ? `request-id:${requestId};` : '', `ts:${timestamp};`].join('');
  const expectedHash = createHmac('sha256', secret).update(manifest).digest('hex');
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const receivedBuffer = Buffer.from(receivedHash, 'hex');

  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!webhookSecret || !accessToken) {
    console.error('Faltan variables de Mercado Pago para el webhook.');
    return NextResponse.json({ error: 'Webhook no configurado.' }, { status: 503 });
  }

  const payload = await request.json().catch(() => null) as MercadoPagoNotification | null;
  const url = new URL(request.url);
  const paymentId = url.searchParams.get('data.id') || (payload?.data?.id ? String(payload.data.id) : '');

  if (!isValidMercadoPagoSignature({
    signature: request.headers.get('x-signature'),
    requestId: request.headers.get('x-request-id'),
    dataId: paymentId,
    secret: webhookSecret,
  })) {
    return NextResponse.json({ error: 'Firma de webhook inválida.' }, { status: 401 });
  }
  if (!/^\d+$/.test(paymentId)) return NextResponse.json({ error: 'Identificador de pago inválido.' }, { status: 400 });

  // Do not trust the browser return or webhook body alone: verify the payment with Mercado Pago.
  const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!paymentResponse.ok) {
    console.error('No fue posible consultar el pago', paymentId);
    return NextResponse.json({ error: 'No fue posible verificar el pago.' }, { status: 502 });
  }

  const payment = await paymentResponse.json() as MercadoPagoPayment;
  if (payment.status !== 'approved') return NextResponse.json({ received: true, status: payment.status });

  const orderId = payment.external_reference;
  if (!orderId) {
    console.error('Pago aprobado sin external_reference', paymentId);
    return NextResponse.json({ received: true });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('orders').update({ status: 'paid' }).eq('id', orderId);
    if (error) {
      console.error('No fue posible actualizar la orden', error);
      return NextResponse.json({ error: 'No fue posible actualizar la orden.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Supabase webhook error', error);
    return NextResponse.json({ error: 'Base de datos no disponible.' }, { status: 503 });
  }

  return NextResponse.json({ received: true, orderId, status: 'paid' });
}
