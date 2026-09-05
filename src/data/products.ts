export interface Product {
  id: string;
  name: string;
  flavor: string;
  description: string;
  price: number;
  badge: string | null;
  image: string;
  tags: string[];
}

export const products: Product[] = [
  {
    id: 'kombucha-original',
    name: 'Kombucha Original',
    flavor: 'Original',
    description: 'El sabor puro de la fermentación ancestral. Equilibrado, refrescante y lleno de probióticos vivos.',
    price: 18000,
    badge: 'MÁS VENDIDO',
    image: 'https://images.pexels.com/photos/8475717/pexels-photo-8475717.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Probióticos', 'Sin azúcar añadida'],
  },
  {
    id: 'kombucha-jengibre',
    name: 'Kombucha Jengibre',
    flavor: 'Jengibre',
    description: 'El toque picante del jengibre fresco se encuentra con la efervescencia natural del kombucha.',
    price: 19500,
    badge: '100% ARTESANAL',
    image: 'https://images.pexels.com/photos/14609143/pexels-photo-14609143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Jengibre fresco', 'Antiinflamatorio'],
  },
  {
    id: 'kombucha-flor-jamaica',
    name: 'Kombucha Flor de Jamaica',
    flavor: 'Flor de Jamaica',
    description: 'Notas florales y un color rubí intenso. Antioxidantes naturales con cada sorbo.',
    price: 19500,
    badge: 'EDICIÓN ESPECIAL',
    image: 'https://images.pexels.com/photos/8217309/pexels-photo-8217309.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Antioxidantes', 'Flor de Jamaica'],
  },
  {
    id: 'kombucha-cafe',
    name: 'Kombucha Café',
    flavor: 'Café',
    description: 'El espíritu del café colombiano en una bebida probiótica. Energía y sabor en cada botella.',
    price: 21000,
    badge: 'NUEVO',
    image: 'https://images.pexels.com/photos/6605199/pexels-photo-6605199.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Café colombiano', 'Energía natural'],
  },
];

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'probioticos-salud-digestiva',
    title: 'Probióticos y Salud Digestiva: La Ciencia detrás del Kombucha',
    excerpt: 'Descubre cómo los probióticos vivos del kombucha transforman tu microbiota intestinal y mejoran tu bienestar general.',
    category: 'Nutrición',
    readTime: '5 min',
    date: '12 Ago 2026',
    image: 'https://images.pexels.com/photos/7474042/pexels-photo-7474042.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'fermentacion-natural',
    title: 'Fermentación Natural: El Arte Ancestral que Nutre',
    excerpt: 'Un viaje por la historia de la fermentación y por qué este método milenario sigue siendo la clave para una bebida verdaderamente viva.',
    category: 'Bienestar',
    readTime: '7 min',
    date: '28 Jul 2026',
    image: 'https://images.pexels.com/photos/7636947/pexels-photo-7636947.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'ghee-beneficios',
    title: 'Ghee Artesanal: El Oro Líquido de la Despensa Saludable',
    excerpt: 'Conoce los beneficios del ghee tradicional, cómo diferenciarlo de la mantequilla común y por qué es un aliado en la cocina saludable.',
    category: 'Despensa',
    readTime: '4 min',
    date: '15 Jul 2026',
    image: 'https://images.pexels.com/photos/11842180/pexels-photo-11842180.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

export const valueItems: ValueItem[] = [
  {
    icon: 'leaf',
    title: '100% Natural',
    description: 'Sin conservantes ni azúcares añadidos. Solo ingredientes reales y fermentación viva.',
  },
  {
    icon: 'shield-check',
    title: 'Registro INVIMA',
    description: 'Garantía de calidad y estándar sanitario con código de barras trazable.',
  },
  {
    icon: 'truck',
    title: 'Envíos Nacionales',
    description: 'Despachos a toda Colombia desde el Quindío, con cobertura en capitales y municipios.',
  },
  {
    icon: 'heart-pulse',
    title: 'Salud Digestiva',
    description: 'Probióticos vivos que nutren tu microbiota y aportan energía vital diaria.',
  },
];

export const formatCOP = (value: number): string => {
  return '$' + value.toLocaleString('es-CO') + ' COP';
};
