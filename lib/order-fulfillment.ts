import type { getSupabaseAdmin } from './supabase/admin';
import { FulfillmentError, purchaseShippingLabels, sendOrderEmail } from './fulfillment-providers';
import type { ShipmentSnapshot, ShippingRate } from './envia';

type Database = ReturnType<typeof getSupabaseAdmin>;
type Action = 'shipment' | 'admin_email' | 'customer_email';
type OrderLine = { title: string; quantity: number; unit_price: number };
type Receipt = { products: OrderLine[]; shipping: ShippingRate; shipment?: ShipmentSnapshot };

export type PaidOrder = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  total_amount: number;
  items: unknown;
};

function readReceipt(value: unknown): Receipt {
  const receipt = value as Partial<Receipt> | null;
  if (!receipt || !Array.isArray(receipt.products) || !receipt.products.length ||
      receipt.products.some((line) => typeof line?.title !== 'string' ||
        !Number.isInteger(line.quantity) || line.quantity < 1 ||
        !Number.isFinite(line.unit_price) || line.unit_price < 0) ||
      !receipt.shipping || receipt.shipping.currency?.toUpperCase() !== 'COP' ||
      !Number.isFinite(receipt.shipping.price) || receipt.shipping.price < 0) {
    throw new FulfillmentError('missing_order_receipt');
  }
  return receipt as Receipt;
}

const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 2 });

function buildEmail(action: 'admin_email' | 'customer_email', order: PaidOrder, receipt: Receipt) {
  const summary = [
    `Pedido: ${order.id}`,
    '',
    ...receipt.products.map((item) => `${item.quantity} × ${item.title} · ${cop.format(item.unit_price * item.quantity)} COP`),
    '',
    `Envío cobrado: ${cop.format(receipt.shipping.price)} COP`,
    `Total pagado: ${cop.format(order.total_amount)} COP`,
  ];
  if (action === 'admin_email') {
    return {
      to: process.env.ORDER_ADMIN_EMAIL?.trim() || 'Herenciawandra.ma@gmail.com',
      subject: `Nuevo pedido pagado · Wandra · ${order.id}`,
      text: [
        'Mercado Pago confirmó el pago de este pedido.',
        '',
        `Cliente: ${order.customer_name}`,
        `Teléfono: ${order.customer_phone}`,
        `Dirección: ${order.shipping_address}`,
        `Municipio y departamento: ${order.shipping_city}`,
        '',
        ...summary,
      ].join('\n'),
    };
  }
  if (!order.customer_email?.trim()) throw new FulfillmentError('missing_customer_email');
  return {
    to: order.customer_email,
    subject: `Pago confirmado · Wandra · ${order.id}`,
    text: [
      `Hola, ${order.customer_name}.`,
      'Confirmamos tu pago. Estamos preparando tu pedido.',
      '',
      ...summary,
      '',
      'Gracias por comprar en Wandra Herencia Saludable.',
    ].join('\n'),
  };
}

async function processAction(db: Database, order: PaidOrder, action: Action) {
  const { data, error } = await db.rpc('claim_order_fulfillment', { p_order_id: order.id, p_action: action });
  if (error || !data) throw new Error('claim_failed');
  if (data.state === 'busy') return true;
  if (data.state === 'review') console.error('Fulfillment requiere revisión', order.id, action);
  if (data.state !== 'claimed') return false;

  let status: 'done' | 'pending' | 'review' = 'done';
  let result: Record<string, unknown> | null = null;
  let trackingNumbers: string[] | null = null;
  let lastError: string | null = null;
  try {
    const receipt = readReceipt(order.items);
    if (action === 'shipment') {
      if (!receipt.shipment) throw new FulfillmentError('legacy_order_without_shipment_snapshot');
      const labels = await purchaseShippingLabels(order.id, receipt.shipment, receipt.shipping);
      result = { shipments: labels.shipments };
      trackingNumbers = labels.trackingNumbers;
    } else {
      const email = buildEmail(action, order, receipt);
      result = { emailId: await sendOrderEmail(`wandra/${order.id}/${action}`, email) };
    }
  } catch (error) {
    const failure = error instanceof FulfillmentError ? error : new FulfillmentError('unexpected_processing_error');
    status = failure.retry ? 'pending' : 'review';
    lastError = failure.code;
    trackingNumbers = failure.trackingNumbers.length ? failure.trackingNumbers : null;
    console.error('Fulfillment error', order.id, action, lastError);
  }

  const { data: saved, error: saveError } = await db.from('order_fulfillment')
    .update({
      status, result, tracking_numbers: trackingNumbers, last_error: lastError,
      claim_token: null, updated_at: new Date().toISOString(),
    })
    .eq('order_id', order.id).eq('action', action).eq('claim_token', data.token)
    .select('action').maybeSingle();
  if (saveError || !saved) throw new Error('result_not_saved');
  return status === 'pending';
}

export async function processPaidOrder(db: Database, order: PaidOrder) {
  const actions: Action[] = ['shipment', 'admin_email', 'customer_email'];
  const results = await Promise.allSettled(actions.map((action) => processAction(db, order, action)));
  return results.map((result, index) => {
    if (result.status === 'fulfilled') return result.value;
    console.error('Fulfillment no pudo guardar la acción', order.id, actions[index]);
    return true;
  }).some(Boolean);
}
