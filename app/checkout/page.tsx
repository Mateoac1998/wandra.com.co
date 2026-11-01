'use client';

import { ShippingRateOptions } from '@/components/shipping-rate-options';
import type { ShippingRate as ShippingOption } from '@/lib/envia';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { cartTotal, changeCartQuantity, useCart } from '@/lib/cart';
import { colombiaDepartments as departments, colombiaMunicipalities } from '@/lib/colombia';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export default function CheckoutPage() {
  const lines = useCart();
  const productsTotal = useMemo(() => cartTotal(lines), [lines]);
  const quoteItems = useMemo(() => lines.map(({ sku, quantity }) => ({ sku, quantity })), [lines]);
  const quoteItemsKey = useMemo(() => quoteItems.map((item) => `${item.sku}:${item.quantity}`).join('|'), [quoteItems]);
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [shippingError, setShippingError] = useState('');
  const [enviaError, setEnviaError] = useState('');
  const [quoteAttempt, setQuoteAttempt] = useState(0);
  const [selectedShippingId, setSelectedShippingId] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', documentType: 'CC', documentNumber: '', department: '', city: '', address: '' });

  const municipalities = colombiaMunicipalities[form.department] ?? [];
  const selectedShipping = shippingOptions.find((option) => option.id === selectedShippingId);
  const total = productsTotal + (selectedShipping?.price || 0);
  const setField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    const city = form.city.trim();
    const department = form.department.trim();
    if (city.length < 2 || !department || !quoteItems.length) {
      setShippingOptions([]);
      setSelectedShippingId('');
      setShippingError('');
      setEnviaError('');
      setQuoteLoading(false);
      return;
    }

    setShippingOptions([]);
    setSelectedShippingId('');
    setQuoteLoading(true);
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setQuoteLoading(true);
      setShippingError('');
      setEnviaError('');

      try {
        const response = await fetch('/api/shipping/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ department, city, address: form.address, items: quoteItems }),
        });
        const data = await response.json().catch(() => ({})) as { options?: ShippingOption[]; error?: string; enviaError?: unknown };
        if (controller.signal.aborted) return;
        if (!response.ok && Object.prototype.hasOwnProperty.call(data, 'enviaError')) {
          setShippingOptions([]);
          setSelectedShippingId('');
          setShippingError('');
          setEnviaError(JSON.stringify(data.enviaError, null, 2) ?? 'null');
          return;
        }
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
  }, [form.department, form.city, form.address, quoteItems, quoteItemsKey, quoteAttempt]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lines.length) return;
    if (!selectedShipping) {
      setError('Ingresa departamento y municipio, y selecciona una tarifa de envío antes de continuar.');
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
          shipping: { optionId: selectedShipping.id, price: selectedShipping.price },
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
      {!lines.length ? <div className="checkout-empty"><p>Tu bolsa está vacía.</p><a className="button button-dark" href="/productos">Ver productos</a></div> : <form onSubmit={submit}><fieldset><legend>Datos para compra, factura y envío</legend><label>Nombre completo<input required value={form.fullName} onChange={(event) => setField('fullName', event.target.value)} /></label><div className="checkout-two"><label>Correo electrónico<input type="email" required value={form.email} onChange={(event) => setField('email', event.target.value)} /></label><label>Celular<input inputMode="tel" required value={form.phone} onChange={(event) => setField('phone', event.target.value)} /></label></div><div className="checkout-two"><label>Tipo de documento<select value={form.documentType} onChange={(event) => setField('documentType', event.target.value)}><option value="CC">Cédula de ciudadanía</option><option value="CE">Cédula de extranjería</option><option value="NIT">NIT</option><option value="TI">Tarjeta de identidad</option></select></label><label>Número de documento<input required value={form.documentNumber} onChange={(event) => setField('documentNumber', event.target.value)} /></label></div><div className="checkout-two"><label>Departamento<select required autoComplete="address-level1" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value, city: '' }))}><option value="">Selecciona tu departamento</option>{departments.map((department) => <option key={department} value={department}>{department}</option>)}</select></label><label>Municipio / Ciudad<select required autoComplete="address-level2" disabled={!form.department} value={form.city} onChange={(event) => setField('city', event.target.value)}><option value="">{form.department ? 'Selecciona tu municipio' : 'Primero selecciona un departamento'}</option>{municipalities.map((municipality) => <option key={municipality.code} value={municipality.name}>{municipality.name}</option>)}</select></label></div><label>Dirección de entrega<input required value={form.address} onChange={(event) => setField('address', event.target.value)} /></label></fieldset>
        <section className="checkout-shipping" aria-live="polite"><p className="eyebrow">Envío</p><button type="button" className="button" disabled={!form.department || !form.city || quoteLoading} onClick={() => setQuoteAttempt((current) => current + 1)}>{quoteLoading ? 'Cotizando…' : 'Volver a cotizar envío'}</button>{enviaError && <div className="checkout-error" role="alert"><strong>Respuesta de Envia</strong><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxWidth: '100%', fontSize: '.85rem' }}>{enviaError}</pre></div>}{quoteLoading && <p>Cotizando opciones de envío…</p>}{shippingError && <p className="checkout-error" role="alert">{shippingError}</p>}{shippingOptions.length > 0 && <ShippingRateOptions options={shippingOptions} selectedId={selectedShippingId} onSelect={setSelectedShippingId} disabled={loading || quoteLoading} /> }</section>
        {error && <p className="checkout-error" role="alert">{error}</p>}<button className="button button-dark checkout-pay" disabled={loading || quoteLoading || !selectedShipping} type="submit">{loading ? 'Abriendo pago…' : quoteLoading ? 'Cotizando envío…' : !selectedShipping ? 'Cotiza tu envío para continuar' : `Pagar ${money.format(total)} con Mercado Pago`}</button></form>}</section>
      <aside className="checkout-summary"><p className="eyebrow">Tu bolsa</p>{lines.map((line) => <article key={line.sku}><img src={line.image} alt="" /><div><strong>{line.name}</strong><span>{line.variant}</span><small>{money.format(line.price)} c/u</small><div className="quantity-control"><button type="button" onClick={() => changeCartQuantity(line.sku, line.quantity - 1)} aria-label={`Quitar una unidad de ${line.name}`}>−</button><b>{line.quantity}</b><button type="button" onClick={() => changeCartQuantity(line.sku, line.quantity + 1)} aria-label={`Añadir una unidad de ${line.name}`}>+</button></div></div><b>{money.format(line.price * line.quantity)}</b></article>)}<div className="checkout-total"><span>Productos</span><strong>{money.format(productsTotal)}</strong><span>Envío</span><strong>{quoteLoading ? 'Cotizando…' : selectedShipping ? money.format(selectedShipping.price) : 'Pendiente'}</strong><span>Total</span><strong>{money.format(total)}</strong>{selectedShipping?.deliveryDays && <small>Entrega estimada: {selectedShipping.deliveryDays} días hábiles.</small>}</div></aside></div>
  </main>;
}
