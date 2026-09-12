'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { clearCart } from '@/lib/cart';

const content = { aprobado: ['Pago en verificación', 'Mercado Pago registró tu retorno. Wandra verificará el estado final del pago y coordinará el envío por WhatsApp antes del despacho.'], pendiente: ['Pago pendiente', 'Tu pago está siendo procesado por Mercado Pago. Te escribiremos cuando se confirme para coordinar el envío.'], rechazado: ['No se completó el pago', 'No se realizó ningún cobro confirmado. Puedes intentarlo de nuevo o escribirnos para ayudarte.'] };

export function PurchaseResult() {
  const params = useSearchParams();
  const status = params.get('estado') === 'aprobado' ? 'aprobado' : params.get('estado') === 'pendiente' ? 'pendiente' : 'rechazado';
  const [title, message] = content[status];
  useEffect(() => { if (status === 'aprobado') clearCart(); }, [status]);
  return <main className="purchase-result"><a className="brand-logo" href="/" aria-label="Volver a Wandra"><img src="/assets/wandra-logo-web.png" alt="Wandra" /></a><p className="eyebrow">Compra Wandra</p><h1>{title}</h1><p>{message}</p>{params.get('referencia') && <small>Referencia: {params.get('referencia')}</small>}<div><a className="button button-dark" href="https://wa.me/573214320429?text=Hola%2C%20quiero%20confirmar%20mi%20pedido%20Wandra." target="_blank" rel="noreferrer">Confirmar envío por WhatsApp</a><a className="text-link" href="/productos">Seguir comprando ↗</a></div></main>;
}
