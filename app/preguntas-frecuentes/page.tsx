import type { Metadata } from 'next';
import { site } from '@/lib/site';

const questions = [
  { question: '¿Qué es la kombucha?', answer: 'La kombucha es una bebida fermentada elaborada a partir de té endulzado y un cultivo vivo conocido como SCOBY. Su perfil suele ser ácido, ligeramente dulce y efervescente.' },
  { question: '¿Cómo se conserva la kombucha?', answer: 'Mantén el producto refrigerado entre 0 y 6 °C. Es un producto vivo, no pasteurizado. Su vida útil es de 4 meses desde la fecha de elaboración si se mantiene refrigerado.' },
  { question: '¿Qué sabores y tamaños de kombucha ofrece Wandra?', answer: 'La línea incluye Jengibre, Flor de Jamaica, Café, Original y Dragon Fruit. Para negocios se manejan formatos de 280 ml, 500 ml y 1.000 ml. La presentación de 750 ml está próxima a disponibilidad.' },
  { question: '¿Hacen envíos nacionales?', answer: 'Sí. Wandra despacha desde Armenia, Quindío, a nivel nacional. El valor del envío y el tiempo final se confirman en la cotización según el destino y el pedido.' },
  { question: '¿Wandra vende otros productos además de kombucha?', answer: 'Sí. El catálogo incluye ghee, aceites naturales, mantequillas de macadamia, maní y ajonjolí, y leche dorada.' },
  { question: '¿Dónde puedo consultar ingredientes y precios?', answer: 'Cada página de producto reúne sus presentaciones, precios desde el catálogo y una descripción. La información final de ingredientes y disponibilidad debe confirmarse en la etiqueta y durante la compra.' },
  { question: '¿Puedo consumir kombucha si tengo una condición médica?', answer: 'La kombucha es un alimento, no un medicamento. Si estás en embarazo, lactancia o tienes una condición médica, consulta a un profesional de la salud antes de cambiar tu alimentación.' },
];

export const metadata: Metadata = { title: `Preguntas frecuentes | ${site.shortName}`, description: 'Respuestas claras sobre kombucha, conservación, tamaños y el catálogo de Wandra.', alternates: { canonical: '/preguntas-frecuentes' } };

export default function FaqPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: questions.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) };
  return <main className="content-page article-page"><header className="article-header"><a className="mini-logo" href="/" aria-label="Volver al inicio">Wandra</a><p className="eyebrow">Información Wandra</p><h1>PREGUNTAS<br /><i>FRECUENTES</i></h1><p>Información simple y visible para elegir y disfrutar los productos Wandra.</p></header><section className="faq-list">{questions.map(({ question, answer }) => <article key={question}><h2>{question}</h2><p>{answer}</p></article>)}</section><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></main>;
}
