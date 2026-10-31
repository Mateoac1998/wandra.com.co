import type { Logistics } from './catalog';

export type QuoteItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  logistics: Logistics;
};

export type ShippingRate = {
  id: string;
  carrier: string;
  service: string;
  price: number;
  currency: string;
  deliveryDays?: number | null;
};

// Shared contract for checkout and shipping quote routes. Postal code is resolved
// server-side and is not required from the buyer.
export type ShippingQuoteInput = {
  city: string;
  department?: string;
  stateCode?: string;
  address?: string;
  items: QuoteItem[];
};

type EnviaRecord = Record<string, unknown>;

export class ShippingQuoteError extends Error {}

const ENVIA_RATE_URL = 'https://api.envia.com/ship/rate/';
const ENVIA_LOCATE_URL = 'https://api.envia.com/locate';
const ENVIA_STATES_URL = 'https://queries.envia.com/state?country_code=CO';

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

export function normalizeLocationName(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim().replace(/\s+/g, ' ').toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function normalized(value: string) {
  return normalizeLocationName(value).toLowerCase().replace(/[^a-z0-9]/g, '')
    .replace(/^bogotadc$/, 'bogota');
}

async function resolveDestination(department: string, cityName: string, stateCode?: string) {
  const statesResponse = await fetch(ENVIA_STATES_URL, { next: { revalidate: 86400 } });
  const statesPayload: unknown = await statesResponse.json().catch(() => null);
  if (!statesResponse.ok) {
    console.error('Envia API Error:', statesPayload);
    throw new ShippingQuoteError('No fue posible consultar los departamentos. Intenta nuevamente.');
  }
  const stateRecord = asArray(asRecord(statesPayload)?.data).map(asRecord).find((state) =>
    state && (department ? normalized(text(state, ['name'])) === normalized(department) : text(state, ['code_2_digits']) === stateCode));
  const state = stateRecord ? text(stateRecord, ['code_2_digits']) : '';
  if (!state) throw new ShippingQuoteError('Selecciona un departamento válido de Colombia.');

  const response = await fetch(ENVIA_LOCATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ country: 'CO', state, city: cityName.trim() }),
    cache: 'no-store',
  });
  const payload: unknown = await response.json().catch(() => null);
  const root = asRecord(payload);
  if (!response.ok || root?.meta === 'error') {
    console.error('Envia API Error:', payload);
    throw new ShippingQuoteError('No pudimos validar ese municipio en el departamento seleccionado. Revisa su nombre completo.');
  }
  const candidates = [root, asRecord(root?.data), ...asArray(root?.data).map(asRecord)].filter((item): item is EnviaRecord => Boolean(item));
  const location = candidates.find((item) =>
    /^\d{8}$/.test(text(item, ['city', 'stat_8digit'])) &&
    text(item, ['state']) === state &&
    normalized(text(item, ['name'])) === normalized(cityName));
  if (!location) throw new ShippingQuoteError('Escribe el nombre completo del municipio y verifica su departamento.');

  return {
    countryCode: 'CO',
    department: normalizeLocationName(stateRecord ? text(stateRecord, ['name']) : department),
    stateCode: state,
    city: normalizeLocationName(text(location, ['name'])),
    daneCode: text(location, ['city', 'stat_8digit']),
    // /locate may omit postalCode for Colombia; never invent one.
    postalCode: text(location, ['postalCode', 'postal_code', 'zipcode']),
  };
}

export function buildShippingPackages(items: QuoteItem[]) {
  return items.flatMap((item) => {
    const { weight, length, width, height } = item.logistics ?? {};
    if (!Number.isInteger(item.quantity) || item.quantity < 1 ||
        ![weight, length, width, height].every((value) => Number.isFinite(value) && value > 0)) {
      throw new ShippingQuoteError('Hay un producto sin medidas de envío válidas.');
    }
    return Array.from({ length: item.quantity }, () => ({
      type: 'box',
      content: 'Alimentos',
      amount: 1,
      declaredValue: item.unit_price,
      weight,
      dimensions: { length, width, height },
      weightUnit: 'KG',
      lengthUnit: 'CM',
    }));
  });
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
  department,
  stateCode,
  address,
  items,
}: ShippingQuoteInput): Promise<ShippingRate[]> {
  const token = process.env.ENVIA_API_TOKEN;
  if (!token) throw new ShippingQuoteError('La cotización de envíos aún no está configurada.');

  const cleanCity = typeof city === 'string' ? normalizeLocationName(city) : '';
  const cleanDepartment = typeof department === 'string' ? normalizeLocationName(department) : '';
  const cleanStateCode = typeof stateCode === 'string' ? stateCode.trim().toUpperCase() : undefined;
  if (cleanCity.length < 2 || (!cleanDepartment && !cleanStateCode) || !items.length) {
    throw new ShippingQuoteError('Ingresa departamento, municipio y al menos un producto.');
  }
  const packages = buildShippingPackages(items);
  const destinationLocation = await resolveDestination(cleanDepartment, cleanCity, cleanStateCode);
  if (cleanStateCode !== undefined && cleanStateCode !== destinationLocation.stateCode) {
    throw new ShippingQuoteError('El código de departamento no coincide con el municipio seleccionado.');
  }

  const originPostalCode = process.env.ENVIA_ORIGIN_POSTAL_CODE || '630001';
  const originStreet = process.env.ENVIA_ORIGIN_STREET?.trim();
  const originNumber = process.env.ENVIA_ORIGIN_NUMBER?.trim();
  if (!originStreet || !originNumber || !/^\d{6}$/.test(originPostalCode)) {
    throw new ShippingQuoteError('La dirección de despacho aún no está configurada correctamente.');
  }
  const origin = {
    countryCode: 'CO', stateCode: 'QU', department: 'Quindio', city: 'Armenia',
    postalCode: originPostalCode, street: originStreet, number: originNumber,
  };

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
        street: origin.street,
        number: origin.number,
        district: 'Centro',
        city: '63001000',
        state: origin.stateCode,
        country: origin.countryCode,
        postalCode: origin.postalCode,
      },
      destination: {
        name: 'Cliente Wandra',
        phone: '+573000000000',
        street: address?.trim() || 'Dirección por confirmar',
        number: 'S/N',
        district: 'Por confirmar',
        city: destinationLocation.daneCode,
        state: destinationLocation.stateCode,
        country: destinationLocation.countryCode,
        postalCode: destinationLocation.postalCode,
      },
      packages,
      shipment: { type: 1 },
      settings: { currency: 'COP' },
    }),
    cache: 'no-store',
  });

  const ratePayload = await rateResponse.json().catch(() => null);
  if (!rateResponse.ok || asRecord(ratePayload)?.meta === 'error') {
    console.error('Envia API Error:', ratePayload);
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
