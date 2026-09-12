import { NextResponse } from 'next/server';
import { products } from '@/lib/catalog';

export const runtime = 'nodejs';

type CheckoutInput = {
  items?: { sku?: string; quantity?: number }[];
  customer?: { fullName?: string; email?: string; phone?: string; documentType?: string; documentNumber?: string; city?: string; address?: string };
};

const variantIndex = new Map(products.flatMap((product) => product.variants.map((variant) => [variant.sku, { product, variant }] as const)));

function required(value: unknown) { return typeof value === 'string' && value.trim().length > 0; }

export async function POST(request: Request) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) return NextResponse.json({ error: 'El pago aún no está configurado. Agrega MERCADOPAGO_ACCESS_TOKEN en Vercel.' }, { status: 503 });

  let input: CheckoutInput;
  try { input = await request.json(); } catch { return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 }); }
  const customer = input.customer;
  if (!customer || !required(customer.fullName) || !required(customer.email) || !required(customer.phone) || !required(customer.documentType) || !required(customer.documentNumber) || !required(customer.city) || !required(customer.address)) {
    return NextResponse.json({ error: 'Completa los datos requeridos para la compra y la factura.' }, { status: 400 });
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

  const items = [...requested.entries()].map(([sku, quantity]) => {
    const entry = variantIndex.get(sku)!;
    return { external_code: sku, title: `${entry.product.name} · ${entry.variant.label}`, description: entry.product.description, quantity, unit_price: String(entry.variant.price) };
  });
  const total = items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0);
  const reference = `WHS-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const safeCustomer = customer as Required<NonNullable<CheckoutInput['customer']>>;
  const [firstName, ...lastName] = safeCustomer.fullName.trim().split(/\s+/);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  const response = await fetch('https://api.mercadopago.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', 'X-Idempotency-Key': crypto.randomUUID() },
    body: JSON.stringify({
      type: 'online', processing_mode: 'manual', capture_mode: 'automatic_async', total_amount: String(total), external_reference: reference,
      payer: { email: safeCustomer.email.trim(), first_name: firstName, last_name: lastName.join(' '), phone: { number: safeCustomer.phone.trim() }, identification: { type: safeCustomer.documentType, number: safeCustomer.documentNumber.trim() }, address: { street_name: safeCustomer.address.trim(), city: safeCustomer.city.trim() } },
      items,
      config: { online: { success_url: `${baseUrl}/compra/resultado?estado=aprobado&referencia=${reference}`, failure_url: `${baseUrl}/compra/resultado?estado=rechazado&referencia=${reference}`, pending_url: `${baseUrl}/compra/resultado?estado=pendiente&referencia=${reference}`, auto_return: 'approved' } },
    }),
  });
  const result = await response.json().catch(() => null) as { checkout_url?: string } | null;
  if (!response.ok || !result?.checkout_url) {
    console.error('Mercado Pago order error', response.status, result);
    return NextResponse.json({ error: 'No fue posible iniciar el pago. Verifica la configuración de Mercado Pago e inténtalo nuevamente.' }, { status: 502 });
  }
  return NextResponse.json({ checkoutUrl: result.checkout_url, reference });
}
