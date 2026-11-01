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
  carrierName?: string;
  deliveryEstimate?: string;
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

// Keep the upstream JSON attached until the quote route can return it to the UI.
export class EnviaApiError extends ShippingQuoteError {
  constructor(message: string, public readonly enviaError: unknown, public readonly upstreamStatus: number) {
    super(message);
    this.name = 'EnviaApiError';
  }
}

const ENVIA_RATE_URL = 'https://api.envia.com/ship/rate/';
const ENVIA_LOCATE_URL = 'https://api.envia.com/locate';
const ENVIA_CARRIERS_URL = 'https://queries.envia.com/carrier?country_code=CO';
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
    throw new EnviaApiError('No fue posible consultar los departamentos. Intenta nuevamente.', statesPayload, statesResponse.status);
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
    throw new EnviaApiError('No pudimos validar ese municipio en el departamento seleccionado. Revisa su nombre completo.', payload, response.status);
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

function normalizeRate(value: unknown, requestedCarrier = '', carrierName = ''): ShippingRate | null {
  const record = asRecord(value);
  if (!record) return null;

  const carrier = text(record, ['carrier', 'provider', 'carrierName']) || requestedCarrier;
  const service = text(record, ['service', 'serviceName', 'service_name']);
  const rawPrice = record.totalPrice ?? record.total_price ?? record.price ?? record.amount;
  if (rawPrice === null || rawPrice === undefined || rawPrice === '') return null;
  const price = Number(rawPrice);
  if (!carrier || !service || !Number.isFinite(price) || price < 0) return null;

  const days = Number(record.deliveryDays ?? record.delivery_days ?? record.estimatedDeliveryDays);
  return {
    id: `${carrier}::${service}`,
    carrier,
    service,
    carrierName: carrierName || text(record, ['carrierDescription', 'carrierName']) || carrier,
    deliveryEstimate: text(record, ['deliveryEstimate', 'delivery_estimate', 'estimatedDelivery']),
    price,
    currency: text(record, ['currency']) || 'COP',
    deliveryDays: Number.isFinite(days) && days > 0 ? days : null,
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

  const payload = {
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
      settings: { currency: 'COP' },
  };

  async function requestRates(carrier?: string, carrierName?: string) {
    const response = await fetch(ENVIA_RATE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...payload, shipment: carrier ? { carrier, type: 1 } : { type: 1 } }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    const body: unknown = await response.json().catch(() => null);
    const root = asRecord(body);
    if (!response.ok || root?.meta === 'error') {
      console.error('Envia API Error:', body);
      throw new EnviaApiError('Envia no pudo cotizar este destino en este momento.', body, response.status);
    }
    return asArray(root?.data ?? root?.rates)
      .map((rate) => normalizeRate(rate, carrier, carrierName))
      .filter((rate): rate is ShippingRate => Boolean(rate))
      .filter((rate) => rate.currency.toUpperCase() === 'COP');
  }

  let generalError: unknown = null;
  try {
    const generalRates = await requestRates();
    if (generalRates.length) return deduplicateRates(generalRates);
  } catch (error) {
    if (!(error instanceof EnviaApiError) || !/carrier/i.test(JSON.stringify(error.enviaError)) ||
        !/missing|required|obligatori/i.test(JSON.stringify(error.enviaError))) throw error;
    generalError = error.enviaError;
  }

  // Some accounts require a specific carrier. Discover the catalog and aggregate
  // per-carrier quotes instead of pinning the checkout to a single provider.
  const carrierResponse = await fetch(ENVIA_CARRIERS_URL, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(10000),
  });
  const carrierPayload: unknown = await carrierResponse.json().catch(() => null);
  const carrierRoot = asRecord(carrierPayload);
  if (!carrierResponse.ok || carrierRoot?.meta === 'error') {
    throw new EnviaApiError('No fue posible consultar las transportadoras disponibles.', carrierPayload, carrierResponse.status);
  }
  const names = new Map<string, string>();
  for (const entry of asArray(carrierRoot?.data ?? carrierRoot?.carriers ?? carrierPayload)) {
    const record = asRecord(entry);
    if (!record || record.active === false || record.active === 0 || record.active === '0' || record.active === 'false') continue;
    const name = text(record, ['name', 'carrier']);
    if (name) names.set(name, text(record, ['description', 'displayName']) || name);
  }
  if (!names.size) throw new EnviaApiError('No hay transportadoras habilitadas.', carrierPayload, carrierResponse.status);

  const rates: ShippingRate[] = [];
  const diagnostics: unknown[] = [];
  const carriers = [...names.entries()];
  for (let index = 0; index < carriers.length; index += 4) {
    const batch = carriers.slice(index, index + 4);
    const results = await Promise.allSettled(batch.map(([carrier, label]) => requestRates(carrier, label)));
    results.forEach((result, position) => {
      if (result.status === 'fulfilled') {
        rates.push(...result.value);
      } else {
        const error = result.reason;
        diagnostics.push({
          carrier: batch[position][0],
          error: error instanceof EnviaApiError ? error.enviaError : { message: 'La transportadora no respondió a tiempo.' },
        });
      }
    });
  }
  if (!rates.length) throw new EnviaApiError('No hay tarifas disponibles para este envío.', { general: generalError, carriers: diagnostics }, 422);
  return deduplicateRates(rates);
}

function deduplicateRates(rates: ShippingRate[]) {
  const unique = new Map<string, ShippingRate>();
  for (const rate of rates) {
    const existing = unique.get(rate.id);
    if (!existing || rate.price < existing.price) unique.set(rate.id, rate);
  }
  return [...unique.values()].sort((a, b) => a.price - b.price);
}
