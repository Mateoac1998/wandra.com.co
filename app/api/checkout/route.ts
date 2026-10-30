import { NextResponse } from 'next/server';
import { products } from '../../../lib/catalog';
import { getSupabaseAdmin } from '../../../lib/supabase/admin';
import { getShippingRates, ShippingQuoteError, type ShippingRate, type ShippingQuoteInput } from '../../../lib/envia';

export const runtime = 'nodejs';

type CheckoutInput = {
  items?: { sku?: string; quantity?: number }[];
  customer?: { fullName?: string; email?: string; phone?: string; documentType?: string; documentNumber?: string; department?: string; city?: string; address?: string };
  shipping?: { optionId?: string };
};

const variantIndex = new Map(products.flatMap((product) => product.variants.map((variant) => [variant.sku, { product, variant }] as const)));

function required(value: unknown) { return typeof value === 'string' && value.trim().length > 0; }

export async function POST(request: Request) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) return NextResponse.json({ error: 'El pago aún no está configurado. Agrega MERCADOPAGO_ACCESS_TOKEN en Vercel.' }, { status: 503 });

  let input: CheckoutInput;
  try { input = await request.json(); } catch { return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 }); }
  const customer = input.customer;
  if (!customer || !required(customer.fullName) || !required(customer.email) || !required(customer.phone) || !required(customer.documentType) || !required(customer.documentNumber) || !required(customer.city) || !required(customer.department) || !required(customer.address)) {
    return NextResponse.json({ error: 'Completa los datos requeridos para la compra, la factura y el envío.' }, { status: 400 });
  }
  if (!Array.isArray(input.items) || !input.items.length) return NextResponse.json({ error: 'Tu carrito está vacío.' }, { status: 400 });

  const requested = new Map<string, number>();
  for (const item of input.items) {
    const sku = item?.sku;
    const quantity = item?.quantity;
    if (!sku || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > 24 || !variantIndex.has(sku)) {
      return NextResponse.json({ error: 'Uno de los productos del carrito ya no está disponible. Actualiza la página e inténtalo de nuevo.' }, { status: 400 });
    }
    requested.set(sku, Math.min((requested.get(sku) || 0) + quantity, 24));
  }

  // Prices are rebuilt from the server catalog, never trusted from the browser.
  const items = [...requested.entries()].map(([sku, quantity]) => {
    const entry = variantIndex.get(sku)!;
    return { id: sku, title: `${entry.product.name} · ${entry.variant.label}`, description: entry.product.description, quantity, currency_id: 'COP', unit_price: entry.variant.price };
  });
  const safeCustomer = customer as Required<NonNullable<CheckoutInput['customer']>>;

  let shippingRate: ShippingRate;
  try {
    const shippingInput: ShippingQuoteInput = {
      city: safeCustomer.city,
      department: safeCustomer.department,
      address: safeCustomer.address,
      items,
    };
    const rates = await getShippingRates(shippingInput);
    const selectedRate = rates.find((rate) => rate.id === input.shipping?.optionId);
    if (!selectedRate) {
      return NextResponse.json({ error: 'La tarifa seleccionada ya no está disponible. Vuelve a cotizar el envío.' }, { status: 400 });
    }
    shippingRate = selectedRate;
  } catch (error) {
    const message = error instanceof ShippingQuoteError
      ? error.message
      : 'No fue posible verificar la tarifa de envío.';
    console.error('Shipping checkout error', error);
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const shippingItem = {
    id: `shipping-${shippingRate.id}`,
    title: `Envío · ${shippingRate.carrier} ${shippingRate.service}`,
    description: shippingRate.deliveryDays ? `Entrega estimada: ${shippingRate.deliveryDays} días` : 'Entrega nacional',
    quantity: 1,
    currency_id: 'COP',
    unit_price: shippingRate.price,
  };
  const paymentItems = [...items, shippingItem];
  const totalAmount = paymentItems.reduce((total, item) => total + (item.unit_price * item.quantity), 0);

  let orderId: string;
  try {
    const supabase = getSupabaseAdmin();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: safeCustomer.fullName.trim(),
        customer_email: safeCustomer.email.trim(),
        customer_phone: safeCustomer.phone.trim(),
        shipping_address: safeCustomer.address.trim(),
        shipping_city: `${safeCustomer.city.trim()}, ${safeCustomer.department.trim()}`,
        total_amount: totalAmount,
        status: 'pending',
        items: { products: items, shipping: shippingRate },
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Supabase order error', orderError);
      return NextResponse.json({ error: 'No fue posible registrar el pedido.' }, { status: 500 });
    }
    orderId = order.id;
  } catch (error) {
    console.error('Supabase configuration error', error);
    return NextResponse.json({ error: 'La base de datos no está configurada correctamente.' }, { status: 503 });
  }

  const [firstName, ...lastName] = safeCustomer.fullName.trim().split(/\s+/);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: paymentItems,
      external_reference: orderId,
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      payer: { name: firstName, surname: lastName.join(' '), email: safeCustomer.email.trim(), phone: { number: safeCustomer.phone.trim() }, identification: { type: safeCustomer.documentType, number: safeCustomer.documentNumber.trim() } },
      back_urls: { success: `${baseUrl}/compra/resultado?estado=aprobado&referencia=${orderId}`, failure: `${baseUrl}/compra/resultado?estado=rechazado&referencia=${orderId}`, pending: `${baseUrl}/compra/resultado?estado=pendiente&referencia=${orderId}` },
      auto_return: 'approved',
    }),
  });
  const result = await response.json().catch(() => null) as { init_point?: string } | null;
  if (!response.ok || !result?.init_point) {
    console.error('Mercado Pago preference error', response.status, result);
    return NextResponse.json({ error: 'No fue posible iniciar el pago. Verifica la configuración de Mercado Pago e inténtalo nuevamente.' }, { status: 502 });
  }

  return NextResponse.json({ init_point: result.init_point, orderId });
}
