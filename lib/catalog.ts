export type Variant = { label: string; price: number; sku: string };

export type Product = {
  slug: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  image: string;
  variants: Variant[];
};

// Precios y SKU importados del export de WooCommerce suministrado por Wandra.
export const products: Product[] = [
  { slug: 'aceite-de-ajonjoli', name: 'Aceite de Ajonjolí', sku: 'AA030-P1', category: 'Aceites naturales', description: 'Aceite de ajonjolí para acompañar preparaciones cotidianas.', image: 'https://wandra.com.co/wp-content/uploads/2023/09/AJONJOLI.jpg', variants: [{ label: '500 ml', price: 42000, sku: 'AA050-H' }, { label: '1000 ml', price: 80000, sku: 'AA010-H' }] },
  { slug: 'aceite-de-coco', name: 'Aceite de Coco', sku: 'AC', category: 'Aceites naturales', description: 'Aceite de coco en presentaciones para la cocina y el cuidado diario.', image: 'https://wandra.com.co/wp-content/uploads/2023/10/COCO.jpg', variants: [{ label: '250 ml', price: 30000, sku: 'AC025' }, { label: '500 ml', price: 50000, sku: 'AC050' }, { label: '1000 ml', price: 85000, sku: 'AC100' }] },
  { slug: 'aceite-de-macadamia', name: 'Aceite de Macadamia', sku: 'AM001', category: 'Aceites naturales', description: 'Aceite de macadamia para preparaciones de sabor suave.', image: 'https://wandra.com.co/wp-content/uploads/2023/10/ACEITE-DE-MACADAMIA.jpg', variants: [{ label: 'Presentación única', price: 30000, sku: 'AM001' }] },
  { slug: 'ghee', name: 'Ghee', sku: 'GH', category: 'Ghee', description: 'Mantequilla clarificada para cocinar y acompañar recetas.', image: 'https://wandra.com.co/wp-content/uploads/2023/10/GHEE.jpg', variants: [{ label: '250 ml', price: 21000, sku: 'GH025' }, { label: '500 ml', price: 40000, sku: 'GH050' }, { label: '1000 ml', price: 80000, sku: 'GH100' }] },
  { slug: 'kombucha-cafe', name: 'Kombucha Café', sku: 'KC', category: 'Kombucha', description: 'Kombucha artesanal con perfil de café, fría y lista para disfrutar.', image: '/assets/cloudinary-upload/wandra-origin-editorial.webp', variants: [{ label: '280 ml', price: 8000, sku: 'KC028' }, { label: '500 ml', price: 12000, sku: 'KC050' }] },
  { slug: 'kombucha-jengibre', name: 'Kombucha de Jengibre', sku: 'KJEN', category: 'Kombucha', description: 'Kombucha artesanal con un perfil fresco y especiado de jengibre.', image: '/assets/cloudinary-upload/wandra-pack-280-editorial.webp', variants: [{ label: '280 ml', price: 8000, sku: 'KJEN028' }, { label: '500 ml', price: 12000, sku: 'KJEN050' }] },
  { slug: 'kombucha-flor-de-jamaica', name: 'Kombucha Flor de Jamaica', sku: 'KKFJ', category: 'Kombucha', description: 'Kombucha artesanal de flor de jamaica, de sabor frutal y ácido.', image: '/assets/cloudinary-upload/wandra-pack-500-editorial.webp', variants: [{ label: '280 ml', price: 8000, sku: 'KKFJ028' }, { label: '500 ml', price: 12000, sku: 'KKFJ050' }] },
  { slug: 'leche-dorada', name: 'Leche Dorada', sku: 'LD', category: 'Bebidas funcionales', description: 'Mezcla de especias para preparar una bebida cálida y aromática.', image: 'https://wandra.com.co/wp-content/uploads/2023/10/LECHE-DORADA.jpg', variants: [{ label: '100 ml', price: 12000, sku: 'LD010' }, { label: '250 ml', price: 24000, sku: 'LD025' }] },
  { slug: 'mantequilla-de-almendra', name: 'Mantequilla de Almendra', sku: 'MA', category: 'Mantequillas', description: 'Mantequilla de almendra para untar, mezclar o cocinar.', image: 'https://wandra.com.co/wp-content/uploads/2023/10/crema-de-almendras.jpg', variants: [{ label: '100 ml', price: 16000, sku: 'MA010' }, { label: '250 ml', price: 30000, sku: 'MA025' }, { label: '500 ml', price: 55000, sku: 'MA050' }] },
  { slug: 'mantequilla-de-macadamia', name: 'Mantequilla de Macadamia', sku: 'MM', category: 'Mantequillas', description: 'Mantequilla de macadamia de textura cremosa.', image: 'https://wandra.com.co/wp-content/uploads/2023/10/crema-macadamia.jpg', variants: [{ label: '100 ml', price: 22000, sku: 'MM010' }, { label: '250 ml', price: 44000, sku: 'MM025' }, { label: '500 ml', price: 80000, sku: 'MM050' }] },
  { slug: 'mantequilla-de-mani', name: 'Mantequilla de Maní', sku: 'MMA', category: 'Mantequillas', description: 'Mantequilla de maní para desayunos, snacks y recetas.', image: 'https://wandra.com.co/wp-content/uploads/2023/10/mani.jpg', variants: [{ label: '100 ml', price: 8000, sku: 'MMA010' }, { label: '250 ml', price: 18000, sku: 'MMA025' }, { label: '500 ml', price: 30000, sku: 'MMA050' }, { label: '1000 ml', price: 50000, sku: 'MMA100' }] },
  { slug: 'tahini-mantequilla-de-ajonjoli', name: 'Tahini · mantequilla de ajonjolí', sku: 'TH', category: 'Mantequillas', description: 'Pasta de ajonjolí para recetas dulces y saladas.', image: 'https://wandra.com.co/wp-content/uploads/2023/10/PASTA-DE-SESAMO.jpg', variants: [{ label: '100 ml', price: 16000, sku: 'TH010' }, { label: '250 ml', price: 30000, sku: 'TH025' }, { label: '500 ml', price: 52000, sku: 'TH050' }] },
  { slug: 'six-pack-kombucha-280-ml', name: 'Six pack de Kombucha 280 ml', sku: 'KSX280', category: 'Kombucha', description: 'Seis kombuchas de 280 ml para armar tu ritual de sabores.', image: '/assets/cloudinary-upload/wandra-pack-280-editorial.webp', variants: [{ label: '6 botellas de 280 ml', price: 42000, sku: 'KSX280' }] },
  { slug: 'six-pack-kombucha-500-ml', name: 'Six pack de Kombucha 500 ml', sku: 'KSX500', category: 'Kombucha', description: 'Seis kombuchas de 500 ml para compartir o mantener tu nevera lista.', image: '/assets/cloudinary-upload/wandra-pack-500-editorial.webp', variants: [{ label: '6 botellas de 500 ml', price: 58000, sku: 'KSX500' }] },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}
