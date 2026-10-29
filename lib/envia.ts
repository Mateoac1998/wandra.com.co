export type QuoteItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
};

export type ShippingRate = {
  id: string;
  carrier: string;
  service: string;
  price: number;
  currency: string;
  deliveryDays?: number | null;
};

type EnviaRecord = Record<string, unknown>;

export class ShippingQuoteError extends Error {}

const ENVIA_RATE_URL = 'https://api.envia.com/ship/rate/';
const ENVIA_GEOCODES_URL = 'https://geocodes.envia.com/zipcode/CO/';

function asRecord(value: unknown): EnviaRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as EnviaRecord : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function text(record: EnviaRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return '';
}

function getDaneLocation(payload: unknown) {
  const root = asRecord(payload);
  if (!root) return null;

  const candidates = [
    root,
    ...asArray(root.data),
    ...asArray(root.zip_codes),
  ].flatMap((candidate) => {
    const record = asRecord(candidate);
    return record ? [record, asRecord(record.info)].filter(Boolean) as EnviaRecord[] : [];
  });

  for (const candidate of candidates) {
    const city = text(candidate, ['stat_8digit', 'city_dane', 'dane_code', 'cityCode', 'city_code']);
    const state = text(candidate, ['state_code', 'stateCode', 'state']);
    if (/^\d{8}$/.test(city) && state) return { city, state };
  }

  return null;
}

function packageWeightKg(items: QuoteItem[]) {
  const milliliters = items.reduce((total, item) => {
    const sixPack = item.title.match(/(\d+)\s*botellas[^\d]*(\d+)\s*ml/i);
    const standard = item.title.match(/(\d+)\s*ml/i);
    const volume = sixPack ? Number(sixPack[1]) * Number(sixPack[2]) : (standard ? Number(standard[1]) : 500);
    return total + (volume * item.quantity);
  }, 0);

  // Product + glass/container + one carton. Replace with measured profiles when available.
  return Math.max(0.5, Number((milliliters / 1000 + items.reduce((total, item) => total + item.quantity, 0) * 0.12 + 0.35).toFixed(2)));
}

function normalizeRate(value: unknown): ShippingRate | null {
  const record = asRecord(value);
  if (!record) return null;

  const carrier = text(record, ['carrier', 'carrierName', 'provider']);
  const service = text(record, ['service', 'serviceName', 'service_name']);
  const price = Number(record.totalPrice ?? record.total_price ?? record.price ?? record.amount);
  if (!carrier || !service || !Number.isFinite(price) || price < 0) return null;

  const days = Number(record.deliveryDays ?? record.delivery_days ?? record.estimatedDeliveryDays);
  return {
    id: `${carrier}::${service}`,
    carrier,
    service,
    price,
    currency: text(record, ['currency']) || 'COP',
    deliveryDays: Number.isFinite(days) ? days : null,
  };
}

export async function getShippingRates({
  city,
  postalCode,
  address,
  items,
}: {
  city: string;
  postalCode: string;
  address?: string;
  items: QuoteItem[];
}) {
  const token = process.env.ENVIA_API_TOKEN;
  if (!token) throw new ShippingQuoteError('La cotización de envíos aún no está configurada.');

  const cleanPostalCode = postalCode.replace(/\D/g, '');
  if (!/^\d{6}$/.test(cleanPostalCode) || city.trim().length < 2 || !items.length) {
    throw new ShippingQuoteError('Ingresa una ciudad, código postal colombiano válido y al menos un producto.');
  }

  const locationResponse = await fetch(`${ENVIA_GEOCODES_URL}${cleanPostalCode}`, { cache: 'no-store' });
  const locationPayload = await locationResponse.json().catch(() => null);
  const destinationLocation = locationResponse.ok ? getDaneLocation(locationPayload) : null;
  if (!destinationLocation) {
    throw new ShippingQuoteError('No fue posible validar ese código postal en Envia. Revisa la ciudad y el código postal.');
  }

  const declaredValue = items.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const weight = packageWeightKg(items);
  const originPostalCode = process.env.ENVIA_ORIGIN_POSTAL_CODE || '630001';
  const originStreet = process.env.ENVIA_ORIGIN_STREET || 'Armenia, Quindío';

  const rateResponse = await fetch(ENVIA_RATE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      origin: {
        name: 'Wandra',
        phone: '+573214320429',
        street: originStreet,
        number: process.env.ENVIA_ORIGIN_NUMBER || 'S/N',
        district: 'Centro',
        city: '63001000',
        state: 'QD',
        country: 'CO',
        postalCode: originPostalCode,
      },
      destination: {
        name: 'Cliente Wandra',
        phone: '+573000000000',
        street: address?.trim() || 'Dirección por confirmar',
        number: 'S/N',
        district: 'Por confirmar',
        city: destinationLocation.city,
        state: destinationLocation.state,
        country: 'CO',
        postalCode: cleanPostalCode,
      },
      packages: [{
        type: 'box',
        content: 'Productos Wandra',
        amount: quantity,
        declaredValue,
        lengthUnit: 'CM',
        weightUnit: 'KG',
        weight,
        dimensions: { length: 35, width: 25, height: Math.min(60, 12 + Math.ceil(quantity / 3) * 8) },
      }],
      shipment: { type: 1 },
      settings: { currency: 'COP' },
    }),
    cache: 'no-store',
  });

  const ratePayload = await rateResponse.json().catch(() => null);
  if (!rateResponse.ok) {
    console.error('Envia rate error', rateResponse.status, ratePayload);
    throw new ShippingQuoteError('Envia no pudo cotizar este destino en este momento.');
  }

  const root = asRecord(ratePayload);
  const rates = asArray(root?.data ?? root?.rates)
    .map(normalizeRate)
    .filter((rate): rate is ShippingRate => Boolean(rate))
    .filter((rate) => rate.currency === 'COP')
    .sort((a, b) => a.price - b.price);

  if (!rates.length) throw new ShippingQuoteError('No hay opciones de envío disponibles para este destino.');

  return rates;
}
