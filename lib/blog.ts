export type Article = { slug: string; title: string; description: string; published: string; category: string; body: { heading: string; text: string }[] };

export const articles: Article[] = [
  {
    slug: 'guia-definitiva-kombucha',
    title: 'Kombucha: guía para conocerla y disfrutarla',
    description: 'Una introducción clara a la bebida fermentada, su proceso y formas de servirla.',
    published: '2025-02-12', category: 'Kombucha',
    body: [
      { heading: '¿Qué es la kombucha?', text: 'La kombucha es una bebida fermentada que parte de té endulzado y un cultivo vivo conocido como SCOBY. El resultado es una bebida de sabor ácido, ligeramente dulce y con burbujas naturales.' },
      { heading: '¿Cómo se elabora?', text: 'El té preparado se deja fermentar con el cultivo. Después, se puede combinar con ingredientes que aportan distintos perfiles de sabor. En Wandra el tiempo y la refrigeración forman parte del cuidado del producto.' },
      { heading: 'Cómo disfrutarla', text: 'Sírvela bien fría. Puedes tomarla sola, acompañar una comida o usarla como base de una bebida sin alcohol. Si es la primera vez que la pruebas, empieza con una porción pequeña y observa cómo te sienta.' },
      { heading: 'Conservación', text: 'Mantén la kombucha refrigerada y consulta la etiqueta de cada producto para conocer sus ingredientes, fecha y recomendaciones de consumo.' },
    ],
  },
  {
    slug: 'que-es-la-kombucha',
    title: '¿Qué es la kombucha?',
    description: 'De dónde viene, qué papel cumple el SCOBY y qué esperar de su sabor.',
    published: '2025-01-28', category: 'Kombucha',
    body: [
      { heading: 'Una bebida fermentada', text: 'La kombucha se prepara tradicionalmente con té, azúcar y un cultivo simbiótico de bacterias y levaduras. Durante el proceso, el cultivo transforma el perfil del té.' },
      { heading: 'El sabor', text: 'Cada receta puede ser distinta: más cítrica, floral, frutal o especiada. La acidez y la efervescencia son parte de su carácter.' },
      { heading: 'Información responsable', text: 'La kombucha es un alimento, no un medicamento. Si tienes una condición de salud, estás en embarazo o tienes dudas sobre su consumo, consulta a un profesional de la salud.' },
    ],
  },
  {
    slug: 'ghee-en-la-cocina',
    title: 'Ghee en la cocina: una guía práctica',
    description: 'Qué es el ghee y maneras sencillas de incorporarlo a tus preparaciones.',
    published: '2024-12-18', category: 'Ghee',
    body: [
      { heading: 'Qué es el ghee', text: 'El ghee es mantequilla clarificada. Se usa por su sabor y por la forma en que acompaña preparaciones dulces y saladas.' },
      { heading: 'Ideas para usarlo', text: 'Puedes usarlo en salteados, arroces, vegetales asados o sobre una tostada. La cantidad y la receta dependen del gusto de cada persona.' },
      { heading: 'Elige con información', text: 'Revisa siempre la etiqueta del producto para conocer ingredientes, alérgenos, porción sugerida y modo de conservación.' },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

