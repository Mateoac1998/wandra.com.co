export type Logistics = { weight: number; length: number; width: number; height: number };
export type Variant = { label: string; price: number; sku: string; logistics: Logistics };

// Official Wandra measurements: kilograms and centimeters, including the container.
// Non-listed jar products temporarily use the coconut-oil profile of the same
// capacity; 100 ml jars use the smallest available (250 ml) coconut profile.
// Six-packs have their own BOX measurements and represent one shipping unit.
export const shippingProfiles = {
  "kombucha280": {
    "weight": 0.45,
    "length": 5.5,
    "width": 5.5,
    "height": 16.4
  },
  "kombucha500": {
    "weight": 0.82,
    "length": 6,
    "width": 6,
    "height": 24.4
  },
  "sixPack280": {
    "weight": 2.71,
    "length": 16.5,
    "width": 11,
    "height": 16.4
  },
  "sixPack500": {
    "weight": 5,
    "length": 18,
    "width": 12,
    "height": 24.4
  },
  "ghee250": {
    "weight": 0.36,
    "length": 5,
    "width": 5,
    "height": 11.8
  },
  "ghee500": {
    "weight": 0.66,
    "length": 7.3,
    "width": 7.3,
    "height": 14
  },
  "ghee1000": {
    "weight": 1.26,
    "length": 9.5,
    "width": 9.5,
    "height": 18
  },
  "coconut250": {
    "weight": 0.35,
    "length": 5,
    "width": 5,
    "height": 11.8
  },
  "coconut500": {
    "weight": 0.64,
    "length": 7.3,
    "width": 7.3,
    "height": 14
  },
  "coconut1000": {
    "weight": 1.27,
    "length": 9.5,
    "width": 9.5,
    "height": 18
  }
} satisfies Record<string, Logistics>;
import { media } from '@/lib/media';

export type Product = {
  slug: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  image: string;
  images?: string[];
  variants: Variant[];
  sanitaryRegistration?: string;
};

// Precios y SKU importados del export de WooCommerce suministrado por Wandra.
export const products: Product[] = [
  { slug: 'aceite-de-ajonjoli', name: 'Aceite de Ajonjolí', sku: 'AA030-P1', category: 'Aceites naturales', description: 'Aceite de ajonjolí para acompañar preparaciones cotidianas.', image: media.sesameOil, variants: [{ label: '500 ml', price: 42000, sku: 'AA050-H', logistics: shippingProfiles.coconut500 }, { label: '1000 ml', price: 80000, sku: 'AA010-H', logistics: shippingProfiles.coconut1000 }] },
  { slug: 'aceite-de-coco', name: 'Aceite de Coco', sku: 'AC', category: 'Aceites naturales', description: 'Aceite de coco en presentaciones para la cocina y el cuidado diario.', image: media.coconutOil, variants: [{ label: '250 ml', price: 30000, sku: 'AC025', logistics: shippingProfiles.coconut250 }, { label: '500 ml', price: 50000, sku: 'AC050', logistics: shippingProfiles.coconut500 }, { label: '1000 ml', price: 85000, sku: 'AC100', logistics: shippingProfiles.coconut1000 }] },
  { slug: 'ghee', name: 'Ghee', sku: 'GH', category: 'Ghee', description: 'Mantequilla clarificada para cocinar y acompañar recetas.', image: media.ghee, variants: [{ label: '250 ml', price: 21000, sku: 'GH025', logistics: shippingProfiles.ghee250 }, { label: '500 ml', price: 40000, sku: 'GH050', logistics: shippingProfiles.ghee500 }, { label: '1000 ml', price: 80000, sku: 'GH100', logistics: shippingProfiles.ghee1000 }] },
  { slug: 'kombucha-cafe', name: 'Kombucha Café', sku: 'KC', category: 'Kombucha', description: 'Kombucha artesanal con perfil de café, fría y lista para disfrutar.', image: media.coffeeServed, variants: [{ label: '280 ml', price: 8000, sku: 'KC028', logistics: shippingProfiles.kombucha280 }, { label: '500 ml', price: 12000, sku: 'KC050', logistics: shippingProfiles.kombucha500 }], sanitaryRegistration: 'RSA-1563-2025' },
  { slug: 'kombucha-jengibre', name: 'Kombucha de Jengibre', sku: 'KJ', category: 'Kombucha', description: 'Kombucha artesanal con un perfil fresco y especiado de jengibre.', image: media.ginger, images: [media.ginger, media.gingerAlternate], variants: [{ label: '280 ml', price: 8000, sku: 'KJ028', logistics: shippingProfiles.kombucha280 }, { label: '500 ml', price: 12000, sku: 'KJ050', logistics: shippingProfiles.kombucha500 }], sanitaryRegistration: 'RSA-1563-2025' },
  { slug: 'kombucha-flor-de-jamaica', name: 'Kombucha Flor de Jamaica', sku: 'KFJ', category: 'Kombucha', description: 'Kombucha artesanal de flor de jamaica, de sabor frutal y ácido.', image: media.pack500, variants: [{ label: '280 ml', price: 8000, sku: 'KFJ028', logistics: shippingProfiles.kombucha280 }, { label: '500 ml', price: 12000, sku: 'KFJ050', logistics: shippingProfiles.kombucha500 }], sanitaryRegistration: 'RSA-1563-2025' },
  { slug: 'leche-dorada', name: 'Leche Dorada', sku: 'LD', category: 'Bebidas funcionales', description: 'Mezcla de especias para preparar una bebida cálida y aromática.', image: media.goldenMilk, variants: [{ label: '100 ml', price: 12000, sku: 'LD010', logistics: shippingProfiles.coconut250 }, { label: '250 ml', price: 24000, sku: 'LD025', logistics: shippingProfiles.coconut250 }] },
  { slug: 'mantequilla-de-macadamia', name: 'Mantequilla de Macadamia', sku: 'MM', category: 'Mantequillas', description: 'Mantequilla de macadamia de textura cremosa.', image: media.macadamiaCream, variants: [{ label: '100 ml', price: 22000, sku: 'MM010', logistics: shippingProfiles.coconut250 }, { label: '250 ml', price: 44000, sku: 'MM025', logistics: shippingProfiles.coconut250 }, { label: '500 ml', price: 80000, sku: 'MM050', logistics: shippingProfiles.coconut500 }] },
  { slug: 'mantequilla-de-mani', name: 'Mantequilla de Maní', sku: 'MMA', category: 'Mantequillas', description: 'Mantequilla de maní para desayunos, snacks y recetas.', image: 'https://wandra.com.co/wp-content/uploads/2023/10/mani.jpg', variants: [{ label: '100 ml', price: 8000, sku: 'MMA010', logistics: shippingProfiles.coconut250 }, { label: '250 ml', price: 18000, sku: 'MMA025', logistics: shippingProfiles.coconut250 }, { label: '500 ml', price: 30000, sku: 'MMA050', logistics: shippingProfiles.coconut500 }, { label: '1000 ml', price: 50000, sku: 'MMA100', logistics: shippingProfiles.coconut1000 }] },
  { slug: 'tahini-mantequilla-de-ajonjoli', name: 'Tahini · mantequilla de ajonjolí', sku: 'TH', category: 'Mantequillas', description: 'Pasta de ajonjolí para recetas dulces y saladas.', image: media.tahini, variants: [{ label: '100 ml', price: 16000, sku: 'TH010', logistics: shippingProfiles.coconut250 }, { label: '250 ml', price: 30000, sku: 'TH025', logistics: shippingProfiles.coconut250 }, { label: '500 ml', price: 52000, sku: 'TH050', logistics: shippingProfiles.coconut500 }] },
  { slug: 'six-pack-kombucha-280-ml', name: 'Six pack de Kombucha 280 ml', sku: 'KSX280', category: 'Kombucha', description: 'Seis kombuchas de 280 ml para armar tu ritual de sabores.', image: media.pack280, variants: [{ label: '6 botellas de 280 ml', price: 42000, sku: 'KSX280', logistics: shippingProfiles.sixPack280 }] },
  { slug: 'six-pack-kombucha-500-ml', name: 'Six pack de Kombucha 500 ml', sku: 'KSX500', category: 'Kombucha', description: 'Seis kombuchas de 500 ml para compartir o mantener tu nevera lista.', image: media.pack500, variants: [{ label: '6 botellas de 500 ml', price: 62000, sku: 'KSX500', logistics: shippingProfiles.sixPack500 }] },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}
