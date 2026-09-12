'use client';

import { FormEvent, useMemo, useState } from 'react';
import { cartTotal, changeCartQuantity, useCart } from '@/lib/cart';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export default function CheckoutPage() {
  const lines = useCart();
  const total = useMemo(() => cartTotal(lines), [lines]);
  const shippingMessage = total >= 250000
    ? 'Envío incluido desde $250.000, sujeto a cobertura y destinos especiales.'
    : 'El envío no está incluido en este pago; Wandra lo confirma antes del despacho.';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', documentType: 'CC', documentNumber: '', city: '', address: '' });
  const setField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lines.length) return;
    setError(''); setLoading(true);
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: lines.map(({ sku, quantity }) => ({ sku, quantity })), customer: form }) });
      const result = await response.json() as { checkoutUrl?: string; error?: string };
      if (!response.ok || !result.checkoutUrl) throw new Error(result.error || 'No fue posible abrir el pago.');
      window.location.assign(result.checkoutUrl);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No fue posible abrir el pago.');
      setLoading(false);
    }
  };
  return <main className="checkout-page">
    <header className="checkout-top"><a href="/" className="brand-logo" aria-label="Volver a Wandra"><img src="/assets/wandra-logo-web.png" alt="Wandra" /></a><a href="/productos">← Seguir comprando</a></header>
    <div className="checkout-layout"><section className="checkout-form"><p className="eyebrow">Compra segura</p><h1>FINALIZA TU<br /><i>RITUAL</i></h1><p className="checkout-intro">Pagarás tus productos por Mercado Pago. {shippingMessage}</p>
      {!lines.length ? <div className="checkout-empty"><p>Tu bolsa está vacía.</p><a className="button button-dark" href="/productos">Ver productos</a></div> : <form onSubmit={submit}><fieldset><legend>Datos para compra y facturación</legend><label>Nombre completo<input required value={form.fullName} onChange={(event) => setField('fullName', event.target.value)} /></label><div className="checkout-two"><label>Correo electrónico<input type="email" required value={form.email} onChange={(event) => setField('email', event.target.value)} /></label><label>Celular<input inputMode="tel" required value={form.phone} onChange={(event) => setField('phone', event.target.value)} /></label></div><div className="checkout-two"><label>Tipo de documento<select value={form.documentType} onChange={(event) => setField('documentType', event.target.value)}><option value="CC">Cédula de ciudadanía</option><option value="CE">Cédula de extranjería</option><option value="NIT">NIT</option><option value="TI">Tarjeta de identidad</option></select></label><label>Número de documento<input required value={form.documentNumber} onChange={(event) => setField('documentNumber', event.target.value)} /></label></div><label>Ciudad o municipio<input required value={form.city} onChange={(event) => setField('city', event.target.value)} /></label><label>Dirección de entrega<input required value={form.address} onChange={(event) => setField('address', event.target.value)} /></label></fieldset>{error && <p className="checkout-error" role="alert">{error}</p>}<button className="button button-dark checkout-pay" disabled={loading} type="submit">{loading ? 'Abriendo pago…' : `Pagar ${money.format(total)} con Mercado Pago`}</button></form>}</section>
      <aside className="checkout-summary"><p className="eyebrow">Tu bolsa</p>{lines.map((line) => <article key={line.sku}><img src={line.image} alt="" /><div><strong>{line.name}</strong><span>{line.variant}</span><small>{money.format(line.price)} c/u</small><div className="quantity-control"><button type="button" onClick={() => changeCartQuantity(line.sku, line.quantity - 1)} aria-label={`Quitar una unidad de ${line.name}`}>−</button><b>{line.quantity}</b><button type="button" onClick={() => changeCartQuantity(line.sku, line.quantity + 1)} aria-label={`Añadir una unidad de ${line.name}`}>+</button></div></div><b>{money.format(line.price * line.quantity)}</b></article>)}<div className="checkout-total"><span>Productos</span><strong>{money.format(total)}</strong><small>{shippingMessage}</small></div></aside></div>
  </main>;
}
