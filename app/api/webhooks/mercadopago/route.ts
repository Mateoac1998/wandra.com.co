import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getSupabaseAdmin } from '../../../../lib/supabase/admin';
import { processPaidOrder, type PaidOrder } from '../../../../lib/order-fulfillment';

export const runtime = 'nodejs';
export const maxDuration = 45;

type MercadoPagoNotification = { data?: { id?: string | number } };
type MercadoPagoPayment = {
  status?: string;
  live_mode?: boolean;
  external_reference?: string | null;
  currency_id?: string;
  transaction_amount?: string | number;
  transaction_amount_refunded?: number;
};

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
  let payment: MercadoPagoPayment;
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error('payment_lookup_failed');
    payment = await response.json();
    if (!payment || typeof payment.status !== 'string') throw new Error('invalid_payment_response');
  } catch {
    console.error('No fue posible consultar el pago', paymentId);
    return NextResponse.json({ error: 'No fue posible verificar el pago.' }, { status: 502 });
  }

  if (payment.status !== 'approved') return NextResponse.json({ received: true, status: payment.status });
  if (payment.live_mode === false) {
    return NextResponse.json({ received: true });
  }

  const orderId = payment.external_reference;
  const amount = Number(payment.transaction_amount);
  if (typeof orderId !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(orderId)
      || payment.currency_id !== 'COP' || !Number.isFinite(amount) || amount <= 0
      || Number(payment.transaction_amount_refunded ?? 0) !== 0) {
    console.error('Pago aprobado sin referencia o importes válidos para Wandra', paymentId);
    return NextResponse.json({ received: true });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('confirm_paid_order', {
      p_order_id: orderId,
      p_payment_id: paymentId,
      p_amount: amount,
    });
    if (error || !data) {
      console.error('No fue posible confirmar el pedido', orderId, error?.code);
      return NextResponse.json({ error: 'No fue posible confirmar el pedido.' }, { status: 503 });
    }
    if (data.state !== 'ready') {
      console.error('Pago requiere revisión', orderId, paymentId, data.state);
      return NextResponse.json({ received: true });
    }
    if (await processPaidOrder(supabase, data.order as PaidOrder)) {
      // Mercado Pago retries. Persisted claims keep completed actions from running again.
      return NextResponse.json({ received: true, status: 'paid', fulfillment: 'retry' }, { status: 503 });
    }
  } catch {
    console.error('No fue posible procesar el webhook', orderId, paymentId);
    return NextResponse.json({ error: 'Base de datos no disponible.' }, { status: 503 });
  }

  return NextResponse.json({ received: true, orderId, status: 'paid' });
}
