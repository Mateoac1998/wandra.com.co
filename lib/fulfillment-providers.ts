import type { ShipmentSnapshot, ShippingRate } from './envia';

export class FulfillmentError extends Error {
  constructor(
    public readonly code: string,
    public readonly retry = false,
    public readonly trackingNumbers: string[] = [],
  ) {
    super(code);
  }
}

type EnviaLabel = {
  trackingNumber?: string | number;
  shipmentId?: string | number;
  trackUrl?: string;
  label?: string;
};

export async function purchaseShippingLabels(orderId: string, shipment: ShipmentSnapshot, rate: ShippingRate) {
  const token = process.env.ENVIA_API_TOKEN?.trim();
  if (!token) throw new FulfillmentError('envia_missing_token', true);
  if (!/^[0-9]{8}$/.test(shipment.destination.city) || shipment.destination.country !== 'CO'
      || !shipment.destination.street || !shipment.packages.length || !rate.carrier || !rate.service) {
    throw new FulfillmentError('invalid_shipment_snapshot');
  }

  // A lost response may still represent a paid label. Never resubmit that purchase.
  let response: Response;
  try {
    response = await fetch('https://api.envia.com/ship/generate/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...shipment,
        shipment: { type: 1, carrier: rate.carrier, service: rate.service },
        settings: { currency: 'COP', comments: `Wandra ${orderId}`, printFormat: 'PDF', printSize: 'PAPER_4X6' },
      }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new FulfillmentError('envia_result_unconfirmed');
  }
  const body = await response.json().catch(() => null) as { meta?: string; data?: EnviaLabel[] } | null;
  const labels = Array.isArray(body?.data) ? body.data : [];
  const shipments = labels.flatMap((label) => {
    const tracking = label?.trackingNumber;
    if (typeof tracking !== 'string' && typeof tracking !== 'number') return [];
    const trackingNumber = String(tracking).trim();
    if (!trackingNumber) return [];
    return [{ trackingNumber, shipmentId: label.shipmentId, trackUrl: label.trackUrl, labelUrl: label.label }];
  });
  const trackingNumbers = [...new Set(shipments.map(({ trackingNumber }) => trackingNumber))];
  if (!response.ok || body?.meta !== 'generate' || !trackingNumbers.length || shipments.length !== labels.length) {
    throw new FulfillmentError(`envia_${response.status}_check_labels`, false, trackingNumbers);
  }
  return { shipments, trackingNumbers };
}

export async function sendOrderEmail(
  idempotencyKey: string,
  email: { to: string; subject: string; text: string },
) {
  const token = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ORDER_EMAIL_FROM?.trim();
  if (!token || !from) throw new FulfillmentError('resend_missing_config', true);

  let response: Response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({ from, ...email }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new FulfillmentError('resend_result_unconfirmed', true);
  }
  const body = await response.json().catch(() => null) as { id?: string; name?: string } | null;
  if (response.ok && typeof body?.id === 'string' && body.id) return body.id;
  const retry = response.ok || response.status >= 500 || [401, 403, 429].includes(response.status)
    || body?.name === 'concurrent_idempotent_requests';
  throw new FulfillmentError(`resend_${response.status}`, retry);
}
