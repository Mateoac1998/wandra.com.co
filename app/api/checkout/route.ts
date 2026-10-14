import { NextResponse } from 'next/server';
import { products } from '@/lib/catalog';

export const runtime = 'nodejs';

type CheckoutInput = {
  items?: { sku?: string; quantity?: number }[];
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
    documentType?: string;
    documentNumber?: string;
    city?: string;
    address?: string;
  };
};

const variantIndex = new Map(
  products.flatMap((product) =>
    product.variants.map(
      (variant) => [variant.sku, { product, variant }] as const,
    ),
  ),
);

function required(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  const sandbox = process.env.VERCEL_ENV === 'preview';
  const mode = sandbox ? 'sandbox' : 'production';
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken)
    return NextResponse.json(
      {
        error:
          'El pago aún no está configurado. Agrega MERCADOPAGO_ACCESS_TOKEN en Vercel.',
      },
      { status: 503 },
    );

  let input: CheckoutInput;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }
  const customer = input?.customer;
  if (
    !customer ||
    !required(customer.fullName) ||
    !required(customer.email) ||
    !required(customer.phone) ||
    !required(customer.documentType) ||
    !required(customer.documentNumber) ||
    !required(customer.city) ||
    !required(customer.address)
  ) {
    return NextResponse.json(
      { error: 'Completa los datos requeridos para la compra y la factura.' },
      { status: 400 },
    );
  }
  if (!Array.isArray(input.items) || !input.items.length)
    return NextResponse.json(
      { error: 'Tu carrito está vacío.' },
      { status: 400 },
    );

  const requested = new Map<string, number>();
  for (const item of input.items) {
    const sku = item?.sku;
    const quantity = item?.quantity;
    if (
      !sku ||
      typeof quantity !== 'number' ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 24 ||
      !variantIndex.has(sku)
    ) {
      return NextResponse.json(
        {
          error:
            'Uno de los productos del carrito ya no está disponible. Actualiza la página e inténtalo de nuevo.',
        },
        { status: 400 },
      );
    }
    requested.set(sku, Math.min((requested.get(sku) || 0) + quantity, 24));
  }

  const items = [...requested.entries()].map(([sku, quantity]) => {
    const entry = variantIndex.get(sku)!;
    return {
      id: sku,
      title: `${entry.product.name} · ${entry.variant.label}`,
      description: entry.product.description,
      quantity,
      currency_id: 'COP',
      unit_price: entry.variant.price,
    };
  });
  const reference = `WHS-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const safeCustomer = customer as Required<
    NonNullable<CheckoutInput['customer']>
  >;
  const [firstName, ...lastName] = safeCustomer.fullName.trim().split(/\s+/);
  // Preview returns to its own host, even if it inherits the public production URL.
  const baseUrl = sandbox
    ? new URL(request.url).origin
    : process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  // Checkout Pro via Preferences keeps the classic redirect flow for this store.
  // Each Vercel environment must have the corresponding server-side credential.
  try {
    const response = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          items,
          external_reference: reference,
          payer: {
            name: firstName,
            surname: lastName.join(' '),
            email: safeCustomer.email.trim(),
            phone: { number: safeCustomer.phone.trim() },
            identification: {
              type: safeCustomer.documentType,
              number: safeCustomer.documentNumber.trim(),
            },
          },
          back_urls: {
            success: `${baseUrl}/compra/resultado?estado=aprobado&referencia=${reference}`,
            failure: `${baseUrl}/compra/resultado?estado=rechazado&referencia=${reference}`,
            pending: `${baseUrl}/compra/resultado?estado=pendiente&referencia=${reference}`,
          },
          auto_return: 'approved',
        }),
      },
    );
    const result = (await response.json().catch(() => null)) as {
      id?: string;
      init_point?: string;
      sandbox_init_point?: string;
    } | null;
    // Never fall back to the production checkout URL during a Preview test.
    const checkoutUrl = sandbox
      ? result?.sandbox_init_point
      : result?.init_point;
    if (!response.ok || typeof checkoutUrl !== 'string' || !checkoutUrl) {
      console.error('wandra.checkout.failed', {
        reference,
        mode,
        providerStatus: response.status,
        reason: !response.ok ? 'provider_rejected' : 'checkout_url_missing',
        durationMs: Date.now() - startedAt,
      });
      return NextResponse.json(
        {
          error:
            'No fue posible iniciar el pago. Verifica la configuración de Mercado Pago e inténtalo nuevamente.',
          reference,
          mode,
        },
        { status: 502 },
      );
    }
    console.info('wandra.checkout.created', {
      reference,
      mode,
      preferenceId: result?.id,
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json({
      checkoutUrl,
      reference,
      preferenceId: result?.id,
      mode,
    });
  } catch (reason) {
    const timedOut =
      reason instanceof Error &&
      (reason.name === 'TimeoutError' || reason.name === 'AbortError');
    console.error('wandra.checkout.failed', {
      reference,
      mode,
      reason: timedOut ? 'provider_timeout' : 'provider_unreachable',
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json(
      {
        error: timedOut
          ? 'El servicio de pago tardó demasiado en responder. Inténtalo de nuevo.'
          : 'No fue posible conectar con el servicio de pago. Inténtalo de nuevo.',
        reference,
        mode,
      },
      { status: timedOut ? 504 : 502 },
    );
  }
}
