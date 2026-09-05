import { ArrowRight, Clock } from 'lucide-react';
import { blogPosts, type BlogPost } from '@/data/products';

export default function BlogDespensa() {
  return (
    <>
      {/* Despensa Section */}
      <section id="despensa" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="reveal relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <img
                src="https://images.pexels.com/photos/11842180/pexels-photo-11842180.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900"
                alt="Ghee artesanal Wandra"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 bg-gold-gradient text-whs-dark text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full font-body shadow-md">
                Despensa Saludable
              </div>
            </div>

            {/* Content */}
            <div className="reveal reveal-delay-2">
              <span className="font-body text-sm uppercase tracking-[0.2em] text-whs-gold font-medium mb-3 block">
                Más allá del Kombucha
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-whs-dark mb-5 leading-tight">
                Ghee Artesanal y Mantequillas Saludables
              </h2>
              <p className="font-body text-lg text-whs-text-muted font-light mb-6 leading-relaxed">
                El complemento perfecto para tu cocina consciente. Ghee elaborado con métodos tradicionales, sin lactosa ni caseína, conservando todos los nutrientes y un sabor dorado inconfundible.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Elaboración tradicional a fuego lento',
                  'Sin lactosa, sin caseína, sin conservantes',
                  'Alto punto de humo: ideal para cocinar',
                  'Fuente natural de vitaminas liposolubles',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
                      <span className="text-whs-dark text-[0.6rem] font-bold">✓</span>
                    </div>
                    <span className="font-body text-whs-text-body">{item}</span>
                  </li>
                ))}
              </ul>

              <a href="#" className="btn-outline-gold">
                Ver Despensa Saludable
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 lg:py-28 bg-whs-bg-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14 reveal">
            <span className="font-body text-sm uppercase tracking-[0.2em] text-whs-gold font-medium mb-3 block">
              Blog Wandra
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-whs-dark mb-4">
              Nutrición y Salud Digestiva
            </h2>
            <p className="font-body text-whs-text-muted max-w-2xl mx-auto text-lg font-light">
              Aprende cómo la fermentación, los probióticos y la despensa saludable pueden transformar tu día a día.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} delayClass={`reveal-delay-${index + 1}`} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function BlogCard({ post, delayClass }: { post: BlogPost; delayClass: string }) {
  return (
    <article className={`product-card reveal ${delayClass} bg-white rounded-2xl overflow-hidden border border-whs-border-soft group cursor-pointer`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="product-img w-full h-full object-cover"
        />
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-whs-gold text-[0.65rem] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full font-body">
          {post.category}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-whs-text-muted font-body mb-3">
          <span>{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-whs-text-muted" />
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime} lectura
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold text-whs-dark mb-3 leading-snug group-hover:text-whs-gold transition-colors">
          {post.title}
        </h3>
        <p className="font-body text-sm text-whs-text-muted leading-relaxed mb-4">
          {post.excerpt}
        </p>
        <span className="inline-flex items-center gap-1.5 font-body text-sm text-whs-gold font-medium uppercase tracking-wide group-hover:gap-2.5 transition-all">
          Leer artículo
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </article>
  );
}
