'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { cartTotal, changeCartQuantity, useCart } from '@/lib/cart';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

type ShippingOption = {
  id: string;
  carrier: string;
  service: string;
  price: number;
  currency: string;
  deliveryDays?: number | null;
};

export default function CheckoutPage() {
  const lines = useCart();
  const productsTotal = useMemo(() => cartTotal(lines), [lines]);
  const quoteItems = useMemo(() => lines.map(({ sku, quantity }) => ({ sku, quantity })), [lines]);
  const quoteItemsKey = useMemo(() => quoteItems.map((item) => `${item.sku}:${item.quantity}`).join('|'), [quoteItems]);
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [shippingError, setShippingError] = useState('');
  const [selectedShippingId, setSelectedShippingId] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', documentType: 'CC', documentNumber: '', city: '', postalCode: '', address: '' });

  const selectedShipping = shippingOptions.find((option) => option.id === selectedShippingId);
  const total = productsTotal + (selectedShipping?.price || 0);
  const setField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    const city = form.city.trim();
    const postalCode = form.postalCode.replace(/\D/g, '');
    if (city.length < 2 || postalCode.length !== 6 || !quoteItems.length) {
      setShippingOptions([]);
      setSelectedShippingId('');
      setShippingError('');
      setQuoteLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setQuoteLoading(true);
      setShippingError('');

      try {
        const response = await fetch('/api/shipping/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ city, postalCode, items: quoteItems }),
        });
        const data = await response.json().catch(() => ({})) as { options?: ShippingOption[]; error?: string };
        if (!response.ok || !data.options?.length) throw new Error(data.error || 'No hay tarifas disponibles para este destino.');

        setShippingOptions(data.options);
        setSelectedShippingId((current) => data.options!.some((option) => option.id === current) ? current : data.options![0].id);
      } catch (reason) {
        if (controller.signal.aborted) return;
        setShippingOptions([]);
        setSelectedShippingId('');
        setShippingError(reason instanceof Error ? reason.message : 'No fue posible cotizar el envío.');
      } finally {
        if (!controller.signal.aborted) setQuoteLoading(false);
      }
    }, 500);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [form.city, form.postalCode, quoteItems, quoteItemsKey]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lines.length) return;
    if (!selectedShipping) {
      setError('Ingresa ciudad y código postal, y selecciona una tarifa de envío antes de continuar.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: quoteItems,
          customer: form,
          shipping: { optionId: selectedShipping.id },
        }),
      });
      const data = await response.json().catch(() => ({})) as { init_point?: string; error?: string };
      if (!response.ok) throw new Error(data.error || 'No fue posible iniciar el pago.');
      if (!data.init_point) throw new Error('Mercado Pago no devolvió la URL de pago.');
      window.location.href = data.init_point;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No fue posible abrir el pago.');
      setLoading(false);
    }
  };

  return <main className="checkout-page">
    <header className="checkout-top"><a href="/" className="brand-logo" aria-label="Volver a Wandra"><img src="/assets/wandra-logo-web.png" alt="Wandra" /></a><a href="/productos">← Seguir comprando</a></header>
    <div className="checkout-layout"><section className="checkout-form"><p className="eyebrow">Compra segura</p><h1>FINALIZA TU<br /><i>RITUAL</i></h1><p className="checkout-intro">Cotizamos tu envío en tiempo real antes de abrir Mercado Pago.</p>
      {!lines.length ? <div className="checkout-empty"><p>Tu bolsa está vacía.</p><a className="button button-dark" href="/productos">Ver productos</a></div> : <form onSubmit={submit}><fieldset><legend>Datos para compra, factura y envío</legend><label>Nombre completo<input required value={form.fullName} onChange={(event) => setField('fullName', event.target.value)} /></label><div className="checkout-two"><label>Correo electrónico<input type="email" required value={form.email} onChange={(event) => setField('email', event.target.value)} /></label><label>Celular<input inputMode="tel" required value={form.phone} onChange={(event) => setField('phone', event.target.value)} /></label></div><div className="checkout-two"><label>Tipo de documento<select value={form.documentType} onChange={(event) => setField('documentType', event.target.value)}><option value="CC">Cédula de ciudadanía</option><option value="CE">Cédula de extranjería</option><option value="NIT">NIT</option><option value="TI">Tarjeta de identidad</option></select></label><label>Número de documento<input required value={form.documentNumber} onChange={(event) => setField('documentNumber', event.target.value)} /></label></div><div className="checkout-two"><label>Ciudad o municipio<input required value={form.city} onChange={(event) => setField('city', event.target.value)} /></label><label>Código postal<input required inputMode="numeric" maxLength={6} value={form.postalCode} onChange={(event) => setField('postalCode', event.target.value.replace(/\D/g, ''))} /></label></div><label>Dirección de entrega<input required value={form.address} onChange={(event) => setField('address', event.target.value)} /></label></fieldset>
        <section className="checkout-shipping" aria-live="polite"><p className="eyebrow">Envío</p>{quoteLoading && <p>Cotizando opciones de envío…</p>}{shippingError && <p className="checkout-error" role="alert">{shippingError}</p>}{shippingOptions.length > 0 && <label>Elige tu envío<select value={selectedShippingId} onChange={(event) => setSelectedShippingId(event.target.value)}>{shippingOptions.map((option) => <option key={option.id} value={option.id}>{option.carrier} · {option.service} — {money.format(option.price)}{option.deliveryDays ? ` · ${option.deliveryDays} días` : ''}</option>)}</select></label>}</section>
        {error && <p className="checkout-error" role="alert">{error}</p>}<button className="button button-dark checkout-pay" disabled={loading || quoteLoading || !selectedShipping} type="submit">{loading ? 'Abriendo pago…' : quoteLoading ? 'Cotizando envío…' : !selectedShipping ? 'Cotiza tu envío para continuar' : `Pagar ${money.format(total)} con Mercado Pago`}</button></form>}</section>
      <aside className="checkout-summary"><p className="eyebrow">Tu bolsa</p>{lines.map((line) => <article key={line.sku}><img src={line.image} alt="" /><div><strong>{line.name}</strong><span>{line.variant}</span><small>{money.format(line.price)} c/u</small><div className="quantity-control"><button type="button" onClick={() => changeCartQuantity(line.sku, line.quantity - 1)} aria-label={`Quitar una unidad de ${line.name}`}>−</button><b>{line.quantity}</b><button type="button" onClick={() => changeCartQuantity(line.sku, line.quantity + 1)} aria-label={`Añadir una unidad de ${line.name}`}>+</button></div></div><b>{money.format(line.price * line.quantity)}</b></article>)}<div className="checkout-total"><span>Productos</span><strong>{money.format(productsTotal)}</strong><span>Envío</span><strong>{quoteLoading ? 'Cotizando…' : selectedShipping ? money.format(selectedShipping.price) : 'Pendiente'}</strong><span>Total</span><strong>{money.format(total)}</strong>{selectedShipping?.deliveryDays && <small>Entrega estimada: {selectedShipping.deliveryDays} días hábiles.</small>}</div></aside></div>
  </main>;
}
