import { CartProvider } from '@/context/CartContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ValueBar from '@/components/ValueBar';
import ProductShowcase from '@/components/ProductShowcase';
import B2BSection from '@/components/B2BSection';
import BlogDespensa from '@/components/BlogDespensa';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

function App() {
  useScrollReveal();

  return (
    <CartProvider>
      <div className="min-h-screen bg-whs-bg-warm">
        <Header />
        <main>
          <Hero />
          <ValueBar />
          <ProductShowcase />
          <B2BSection />
          <BlogDespensa />
        </main>
        <Footer />
        <CartDrawer />
        <FloatingWhatsApp />
      </div>
    </CartProvider>
  );
}

export default App;
