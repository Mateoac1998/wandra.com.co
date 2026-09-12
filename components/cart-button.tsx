'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { cartTotal, changeCartQuantity, useCart } from '@/lib/cart';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function CartButton() {
  const [open, setOpen] = useState(false);
  const lines = useCart();
  const quantity = lines.reduce((total, item) => total + item.quantity, 0);
  const total = cartTotal(lines);
  const drawer = open ? <div className="cart-drawer-layer" role="presentation" onMouseDown={() => setOpen(false)}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Tu bolsa" onMouseDown={(event) => event.stopPropagation()}><header><div><p className="eyebrow">Tu ritual</p><h2>MI BOLSA <span>{quantity}</span></h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar bolsa">×</button></header>{lines.length ? <><div className="cart-drawer-items">{lines.map((line) => <article key={line.sku}><img src={line.image} alt="" /><div><strong>{line.name}</strong><span>{line.variant}</span><div className="quantity-control"><button type="button" onClick={() => changeCartQuantity(line.sku, line.quantity - 1)} aria-label={`Quitar una unidad de ${line.name}`}>−</button><b>{line.quantity}</b><button type="button" onClick={() => changeCartQuantity(line.sku, line.quantity + 1)} aria-label={`Añadir una unidad de ${line.name}`}>+</button></div><button className="cart-item-remove" type="button" onClick={() => changeCartQuantity(line.sku, 0)}>Eliminar</button></div><b>{money.format(line.price * line.quantity)}</b></article>)}</div><footer><div><span>Productos</span><strong>{money.format(total)}</strong></div><small>{total >= 250000 ? 'Envío incluido, sujeto a cobertura.' : 'El envío se confirma antes del despacho.'}</small><a className="button button-dark" href="/checkout" onClick={() => setOpen(false)}>Ir a pagar <span>→</span></a><button className="cart-continue" type="button" onClick={() => setOpen(false)}>Seguir comprando</button></footer></> : <div className="cart-drawer-empty"><p>Aún no hay productos en tu bolsa.</p><a className="button button-dark" href="/productos" onClick={() => setOpen(false)}>Ver productos</a></div>}</aside></div> : null;
  return <>{<button className="cart-button" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-label={`Abrir mi bolsa${quantity ? `, ${quantity} productos` : ''}`}>Mi bolsa <span aria-hidden="true">{quantity || '0'}</span></button>}{drawer && createPortal(drawer, document.body)}</>;
}
