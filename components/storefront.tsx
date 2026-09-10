'use client';

import MediaImage from '@/components/media-image';

import Link from 'next/link';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { ShoppingBag, Plus, Minus, ArrowUpRight, Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { formatCOP, products, type Product } from '@/lib/catalog';

type Line = { sku: string; quantity: number };
type Store = {
  add: (sku: string) => void;
  lines: Line[];
  setOpen: (open: boolean) => void;
};
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('wandra-bag-v1') || '[]');
      // Hydrate browser storage only after SSR so the initial markup is deterministic.
      if (Array.isArray(saved))
        // oxlint-disable-next-line react/react-compiler
        setLines(
          saved
            .filter(
              (l: Line) =>
                products.some((p) => p.variants.some((v) => v.sku === l.sku)) &&
                Number.isInteger(l.quantity) &&
                l.quantity > 0,
            )
            .map((l: Line) => ({
              sku: l.sku,
              quantity: Math.min(l.quantity, 99),
            })),
        );
    } catch {
      /* A blocked or empty store must never prevent shopping. */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem('wandra-bag-v1', JSON.stringify(lines));
      } catch {
        /* Session-only basket remains usable. */
      }
    }
  }, [lines, ready]);
  function add(sku: string) {
    setLines((current) =>
      current.some((l) => l.sku === sku)
        ? current.map((l) =>
            l.sku === sku
              ? { ...l, quantity: Math.min(99, l.quantity + 1) }
              : l,
          )
        : [...current, { sku, quantity: 1 }],
    );
    setOpen(true);
  }
  function change(sku: string, delta: number) {
    setLines((current) =>
      current
        .map((l) =>
          l.sku === sku
            ? { ...l, quantity: Math.min(99, l.quantity + delta) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }
  const items = lines.flatMap((line) => {
    const product = products.find((p) =>
      p.variants.some((v) => v.sku === line.sku),
    );
    const variant = product?.variants.find((v) => v.sku === line.sku);
    return product && variant ? [{ ...line, product, variant }] : [];
  });
  const total = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0,
  );
  return (
    <StoreContext.Provider value={{ add, lines, setOpen }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="bag-sheet" showCloseButton={false}>
          <div className="bag-heading">
            <SheetTitle>Tu ritual</SheetTitle>
            <SheetClose className="icon-button" aria-label="Cerrar bolsa">
              <X />
            </SheetClose>
          </div>
          <SheetDescription>Una selección con mucho sabor.</SheetDescription>
          {items.length ? (
            <>
              <ul className="bag-lines">
                {items.map((item) => (
                  <li key={item.sku}>
                    <MediaImage
                      src={item.product.image}
                      alt=""
                      width="80"
                      height="96"
                      sizes="80px"
                    />
                    <div>
                      <h3>{item.product.name}</h3>
                      <p>
                        {item.variant.label} · {formatCOP(item.variant.price)}
                      </p>
                      <div className="quantity">
                        <button
                          onClick={() => change(item.sku, -1)}
                          aria-label={`Quitar una unidad de ${item.product.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => change(item.sku, 1)}
                          aria-label={`Añadir una unidad de ${item.product.name}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-line"
                      onClick={() =>
                        setLines((current) =>
                          current.filter((l) => l.sku !== item.sku),
                        )
                      }
                      aria-label={`Eliminar ${item.product.name}`}
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="bag-total">
                <span>Subtotal</span>
                <strong>{formatCOP(total)}</strong>
              </div>
              <p className="fine-print">
                El envío y la disponibilidad se confirman con Wandra. La compra
                en línea todavía no está habilitada.
              </p>
              <Link
                prefetch={false}
                className="button"
                href="https://wandra.com.co/contacto/"
              >
                Consultar mi pedido <ArrowUpRight size={18} />
              </Link>
            </>
          ) : (
            <div className="bag-empty">
              <ShoppingBag size={42} />
              <h3>Algo rico está por llegar.</h3>
              <p>Elige un sabor o explora nuestra despensa.</p>
              <SheetClose className="button">Seguir explorando</SheetClose>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </StoreContext.Provider>
  );
}

export function Navigation() {
  const store = useContext(StoreContext)!;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const count = store.lines.reduce((n, l) => n + l.quantity, 0);
  const links = [
    ['Tienda', '/productos'],
    ['Nuestro origen', '/#origen'],
    ['La despensa', '/#despensa'],
    ['Guías', '/blog'],
  ];
  return (
    <>
      <div className="announcement">
        Hecho en Colombia <span>✳</span> Un ritual para disfrutar todos los días
      </div>
      <header className={`navigation ${scrolled ? 'compact' : ''}`}>
        <Link
          prefetch={false}
          href="/"
          className="official-logo"
          aria-label="Wandra, inicio"
        >
          <MediaImage
            src="/assets/cloudinary-upload/wandra-logo-web.webp"
            alt="Wandra Herencia Saludable"
            width="62"
            height="64"
            sizes="64px"
          />
        </Link>
        <nav aria-label="Navegación principal" className="desktop-nav">
          {links.map(([label, href]) => (
            <Link prefetch={false} key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="bag-button"
            onClick={() => store.setOpen(true)}
            aria-label={`Abrir bolsa, ${count} productos`}
          >
            <ShoppingBag size={19} />
            <span className="bag-label">Mi bolsa</span>
            <span className="bag-count">{count}</span>
          </button>
          <button
            className="icon-button menu-toggle"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </header>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent className="menu-sheet" showCloseButton={false}>
          <div className="bag-heading">
            <SheetTitle>Explora Wandra</SheetTitle>
            <SheetClose className="icon-button" aria-label="Cerrar menú">
              <X />
            </SheetClose>
          </div>
          <SheetDescription>
            Sabor, origen y un poco de curiosidad.
          </SheetDescription>
          <nav aria-label="Navegación móvil">
            {links.map(([label, href]) => (
              <Link
                prefetch={false}
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
                <ArrowUpRight />
              </Link>
            ))}
          </nav>
          <Link
            prefetch={false}
            href="/preguntas-frecuentes"
            onClick={() => setMenuOpen(false)}
          >
            Preguntas frecuentes
          </Link>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function BuyProduct({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const store = useContext(StoreContext)!;
  const [selected, setSelected] = useState(0);
  const variant = product.variants[selected];
  return (
    <div className={`buy-product ${compact ? 'small' : ''}`}>
      <fieldset>
        <legend>Elige tu presentación</legend>
        <div className="size-options">
          {product.variants.map((v, i) => (
            <label className={selected === i ? 'selected' : ''} key={v.sku}>
              <input
                type="radio"
                name={`size-${product.slug}`}
                checked={selected === i}
                onChange={() => setSelected(i)}
              />
              <span>{v.label}</span>
              <strong>{formatCOP(v.price)}</strong>
            </label>
          ))}
        </div>
      </fieldset>
      <button className="button" onClick={() => store.add(variant.sku)}>
        Agregar a mi bolsa <Plus size={18} />
      </button>
    </div>
  );
}
