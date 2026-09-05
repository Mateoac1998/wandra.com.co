import { X, Plus, Minus, Trash2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCOP } from '@/data/products';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  const whatsappMessage = items.length > 0
    ? `https://wa.me/5730000000000?text=${encodeURIComponent(
        `Hola Wandra, quiero hacer este pedido:\n\n${items
          .map((i) => `• ${i.name} x${i.quantity} - ${formatCOP(i.price * i.quantity)}`)
          .join('\n')}\n\nTotal: ${formatCOP(totalPrice)}`
      )}`
    : 'https://wa.me/5730000000000';

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-whs-dark/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-whs-border-soft">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-whs-gold" />
            <h3 className="font-display text-xl font-semibold text-whs-dark">
              Carrito {totalItems > 0 && `(${totalItems})`}
            </h3>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-whs-text-muted hover:text-whs-dark transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-whs-bg-warm flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-whs-text-muted" />
              </div>
              <p className="font-display text-lg text-whs-dark mb-2">Tu carrito está vacío</p>
              <p className="font-body text-sm text-whs-text-muted mb-6">
                Descubre nuestras kombuchas artesanales
              </p>
              <button onClick={closeCart} className="btn-outline-gold">
                Ver productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-whs-bg-warm rounded-xl p-3 animate-fade-in"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-base font-semibold text-whs-dark mb-1 truncate">
                      {item.name}
                    </h4>
                    <p className="font-body text-sm text-whs-gold font-medium mb-2">
                      {formatCOP(item.price)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-md bg-white border border-whs-border-soft flex items-center justify-center hover:border-whs-gold transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-whs-dark" />
                      </button>
                      <span className="font-body text-sm font-medium text-whs-dark w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-md bg-white border border-whs-border-soft flex items-center justify-center hover:border-whs-gold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-whs-dark" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1 text-whs-text-muted hover:text-red-500 transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-whs-border-soft px-6 py-5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-sm uppercase tracking-wide text-whs-text-muted">
                Total
              </span>
              <span className="font-display text-2xl font-bold text-whs-dark">
                {formatCOP(totalPrice)}
              </span>
            </div>
            <a
              href={whatsappMessage}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full justify-center mb-2"
            >
              <MessageCircle className="w-5 h-5" />
              Finalizar por WhatsApp
            </a>
            <p className="font-body text-xs text-whs-text-muted text-center mt-2">
              Envíos a toda Colombia · Pago seguro
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
