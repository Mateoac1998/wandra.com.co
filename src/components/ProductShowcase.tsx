import { Plus, MessageCircle } from 'lucide-react';
import { products, formatCOP, type Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ProductShowcase() {
  const { addItem } = useCart();

  return (
    <section id="kombucha" className="py-20 lg:py-28 bg-whs-bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 reveal">
          <span className="font-body text-sm uppercase tracking-[0.2em] text-whs-gold font-medium mb-3 block">
            Nuestra Colección
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-whs-dark mb-4">
            Kombuchas Artesanales
          </h2>
          <p className="font-body text-whs-text-muted max-w-2xl mx-auto text-lg font-light">
            Cuatro sabores únicos, nacidos de la fermentación natural y ingredientes seleccionados. Cada botella es una invitación al bienestar.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => addItem(product)}
              delayClass={`reveal-delay-${(index % 4) + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onAdd,
  delayClass,
}: {
  product: Product;
  onAdd: () => void;
  delayClass: string;
}) {
  const whatsappLink = `https://wa.me/5730000000000?text=Hola%20Wandra%2C%20quiero%20comprar%20${encodeURIComponent(product.name)}`;

  return (
    <div className={`product-card reveal ${delayClass} bg-white rounded-2xl overflow-hidden border border-whs-border-soft flex flex-col`}>
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-whs-bg-warm">
        <img
          src={product.image}
          alt={product.name}
          className="product-img w-full h-full object-cover"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 bg-gold-gradient text-whs-dark text-[0.65rem] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full font-body shadow-md">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl font-semibold text-whs-dark mb-2">
          {product.name}
        </h3>
        <p className="font-body text-sm text-whs-text-muted mb-3 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="text-[0.65rem] font-body uppercase tracking-wide text-whs-gold bg-whs-cream/40 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="font-display text-2xl font-bold text-whs-dark">
            {formatCOP(product.price)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={onAdd}
            className="btn-gold w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            Añadir al carrito
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold w-full justify-center"
          >
            <MessageCircle className="w-4 h-4" />
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
