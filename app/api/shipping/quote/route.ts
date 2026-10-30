import { NextResponse } from 'next/server';
import { products } from '../../../../lib/catalog';
import { getShippingRates, ShippingQuoteError, type ShippingQuoteInput } from '../../../../lib/envia';

export const runtime = 'nodejs';

type QuoteInput = {
  city?: string;
  department?: string;
  address?: string;
  items?: { sku?: string; quantity?: number }[];
};

const variantIndex = new Map(
  products.flatMap((product) =>
    product.variants.map((variant) => [variant.sku, { product, variant }] as const),
  ),
);

export async function POST(request: Request) {
  let input: QuoteInput;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud de envío inválida.' }, { status: 400 });
  }

  if (typeof input.city !== 'string' || !input.city.trim() || typeof input.department !== 'string' || !input.department.trim() || !Array.isArray(input.items) || !input.items.length) {
    return NextResponse.json({ error: 'Ingresa departamento, municipio y productos para cotizar.' }, { status: 400 });
  }

  const requested = new Map<string, number>();
  for (const item of input.items) {
    const sku = item?.sku;
    const quantity = item?.quantity;
    if (!sku || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > 24 || !variantIndex.has(sku)) {
      return NextResponse.json({ error: 'Hay un producto no disponible en la bolsa.' }, { status: 400 });
    }
    requested.set(sku, Math.min((requested.get(sku) || 0) + quantity, 24));
  }

  const items = [...requested.entries()].map(([sku, quantity]) => {
    const entry = variantIndex.get(sku)!;
    return {
      id: sku,
      title: `${entry.product.name} · ${entry.variant.label}`,
      quantity,
      unit_price: entry.variant.price,
      logistics: entry.variant.logistics,
    };
  });

  try {
    // getShippingRates reads ENVIA_ORIGIN_STREET, ENVIA_ORIGIN_NUMBER and
    // ENVIA_ORIGIN_POSTAL_CODE on the server; these never reach the browser.
    const shippingInput: ShippingQuoteInput = {
      city: input.city,
      department: input.department,
      address: input.address,
      items,
    };
    const options = await getShippingRates(shippingInput);

    return NextResponse.json({ options });
  } catch (error) {
    const message = error instanceof ShippingQuoteError
      ? error.message
      : 'No fue posible cotizar el envío en este momento.';
    console.error('Shipping quote error', error);
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
