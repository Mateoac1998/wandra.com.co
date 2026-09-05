import { Leaf, ShieldCheck, Truck, HeartPulse } from 'lucide-react';
import { valueItems } from '@/data/products';

const iconMap: Record<string, typeof Leaf> = {
  leaf: Leaf,
  'shield-check': ShieldCheck,
  truck: Truck,
  'heart-pulse': HeartPulse,
};

export default function ValueBar() {
  return (
    <section className="bg-white border-b border-whs-border-soft py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {valueItems.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={item.title}
                className={`reveal reveal-delay-${index + 1} flex flex-col items-center text-center group`}
              >
                <div className="w-14 h-14 rounded-full bg-whs-bg-warm border border-whs-border-soft flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-gold-gradient group-hover:border-transparent">
                  <Icon className="w-7 h-7 text-whs-gold transition-colors duration-300 group-hover:text-whs-dark" />
                </div>
                <h3 className="font-display text-lg font-semibold text-whs-dark mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-whs-text-muted leading-relaxed max-w-[200px]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
