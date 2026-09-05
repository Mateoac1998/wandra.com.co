import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, ChevronDown, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Inicio', href: '#inicio' },
    {
      label: 'Kombucha',
      href: '#kombucha',
      children: [
        { label: 'Original', href: '#kombucha' },
        { label: 'Jengibre', href: '#kombucha' },
        { label: 'Flor de Jamaica', href: '#kombucha' },
        { label: 'Café', href: '#kombucha' },
      ],
    },
    {
      label: 'Despensa Saludable',
      href: '#despensa',
      children: [{ label: 'Ghee Artesanal', href: '#despensa' }],
    },
    { label: 'Mayoristas / B2B', href: '#b2b' },
    { label: 'Blog', href: '#blog' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-whs-cream text-whs-dark text-center py-2 px-4 text-xs sm:text-sm font-medium tracking-wide relative z-50">
        <p className="font-body">
          Envíos a toda Colombia <span className="mx-1.5 opacity-40">|</span> 100% Fermentación Natural y Saludable
        </p>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#inicio" className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl lg:text-2xl font-bold text-whs-dark tracking-tight">
                  Wandra
                </span>
                <span className="font-body text-[0.6rem] lg:text-[0.65rem] uppercase tracking-[0.2em] text-whs-gold font-medium">
                  Herencia Saludable
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative dropdown-trigger group">
                  <a
                    href={item.href}
                    className="nav-link flex items-center gap-1"
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    )}
                  </a>
                  {item.children && (
                    <div className="dropdown-menu absolute top-full left-0 mt-1 min-w-[200px] bg-white rounded-lg shadow-xl border border-whs-border-soft py-2">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm font-body text-whs-text-body hover:text-whs-gold hover:bg-whs-bg-warm transition-colors"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-whs-dark hover:text-whs-gold transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={openCart}
                className="relative p-2 text-whs-dark hover:text-whs-gold transition-colors"
                aria-label="Carrito"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="cart-badge absolute -top-0.5 -right-0.5 bg-gold-gradient text-whs-dark text-[0.65rem] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <a
                href="https://wa.me/5730000000000?text=Hola%20Wandra%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 text-whs-dark hover:text-whs-gold transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-whs-dark"
                aria-label="Menú"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-whs-border-soft animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-whs-text-muted" />
                <input
                  type="text"
                  placeholder="Buscar kombuchas, ghee, blog..."
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 bg-whs-bg-warm rounded-lg border border-whs-border-soft focus:border-whs-gold focus:outline-none font-body text-whs-dark placeholder-whs-text-muted"
                />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-whs-border-soft animate-fade-in max-h-[80vh] overflow-y-auto no-scrollbar">
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 font-body text-whs-dark hover:text-whs-gold font-medium uppercase text-sm tracking-wide border-b border-whs-border-soft/50"
                  >
                    {item.label}
                  </a>
                  {item.children && (
                    <div className="pl-4 pb-2 space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-sm font-body text-whs-text-muted hover:text-whs-gold"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="https://wa.me/5730000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-3 font-body text-whs-dark hover:text-whs-gold font-medium uppercase text-sm tracking-wide"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
