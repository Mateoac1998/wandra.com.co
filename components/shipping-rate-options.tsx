'use client';

import type { ShippingRate } from '@/lib/envia';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const carrierNames: Record<string, string> = {
  coordinadora: 'Coordinadora', interrapidisimo: 'Interrapidísimo', tcc: 'TCC', envia: 'Envía Colvanes',
  servientrega: 'Servientrega', dhl: 'DHL',
};

const serviceNames: Record<string, string> = {
  ground_small: 'Paquetes pequeños', mensajeria_do: 'Mensajería', ground: 'Terrestre',
  ecommerce: 'Comercio electrónico', mensajeria: 'Mensajería', premier: 'Premier',
  industrial: 'Carga industrial', normal: 'Estándar',
};

export function ShippingRateOptions({ options, selectedId, onSelect, disabled = false }: {
  options: ShippingRate[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}) {
  return <fieldset className="shipping-options" disabled={disabled}>
    <legend>Elige tu transportadora</legend>
    {options.map((option) => <label className="shipping-choice" key={option.id}>
      <input type="radio" name="shipping-rate" value={option.id} checked={selectedId === option.id} onChange={() => onSelect(option.id)} required />
      <span><strong>{carrierNames[option.carrier.toLowerCase()] || option.carrierName || option.carrier}</strong>
        <small>{serviceNames[option.service.toLowerCase()] || option.service.replace(/_/g, ' ')}</small>
        {(option.deliveryDays || option.deliveryEstimate) && <small>Entrega estimada: {option.deliveryDays ? `${option.deliveryDays} días hábiles` : option.deliveryEstimate}</small>}
      </span>
      <b>{money.format(option.price)}</b>
    </label>)}
  </fieldset>;
}
