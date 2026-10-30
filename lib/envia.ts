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

// Shared contract for checkout and shipping quote routes. Postal code is resolved
// server-side and is not required from the buyer.
export type ShippingQuoteInput = {
  city: string;
  department: string;
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

function normalized(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function resolveDestination(department: string, cityName: string) {
  const statesResponse = await fetch(ENVIA_STATES_URL, { next: { revalidate: 86400 } });
  const statesPayload: unknown = await statesResponse.json().catch(() => null);
  if (!statesResponse.ok) {
    console.error('Envia API Error:', statesPayload);
    throw new ShippingQuoteError('No fue posible consultar los departamentos. Intenta nuevamente.');
  }
  const stateRecord = asArray(asRecord(statesPayload)?.data).map(asRecord).find((state) =>
    state && normalized(text(state, ['name'])) === normalized(department));
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
    department: department.trim(),
    stateCode: state,
    city: text(location, ['name']),
    daneCode: text(location, ['city', 'stat_8digit']),
    // /locate may omit postalCode for Colombia; never invent one.
    postalCode: text(location, ['postalCode', 'postal_code', 'zipcode']),
  };
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
  department,
  stateCode,
  address,
  items,
}: ShippingQuoteInput): Promise<ShippingRate[]> {
  const token = process.env.ENVIA_API_TOKEN;
  if (!token) throw new ShippingQuoteError('La cotización de envíos aún no está configurada.');

  if (typeof city !== 'string' || city.trim().length < 2 || typeof department !== 'string' || !department.trim() || !items.length) {
    throw new ShippingQuoteError('Ingresa departamento, municipio y al menos un producto.');
  }
  const destinationLocation = await resolveDestination(department, city);
  if (stateCode !== undefined && stateCode !== destinationLocation.stateCode) {
    throw new ShippingQuoteError('El código de departamento no coincide con el municipio seleccionado.');
  }

  const declaredValue = items.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const weight = packageWeightKg(items);
  const originPostalCode = process.env.ENVIA_ORIGIN_POSTAL_CODE || '630001';
  const originStreet = process.env.ENVIA_ORIGIN_STREET?.trim();
  const originNumber = process.env.ENVIA_ORIGIN_NUMBER?.trim();
  if (!originStreet || !originNumber || !/^\d{6}$/.test(originPostalCode)) {
    throw new ShippingQuoteError('La dirección de despacho aún no está configurada correctamente.');
  }
  const origin = {
    countryCode: 'CO', stateCode: 'QU', department: 'Quindío', city: 'Armenia',
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
