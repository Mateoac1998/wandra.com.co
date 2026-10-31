export type Logistics = { weight: number; length: number; width: number; height: number };

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

/** Classify capacity and packaging, independently of the kombucha flavor. */
export function inferShippingLogistics(productName: string, variantLabel: string): Logistics {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const name = normalize(productName);
  const variant = normalize(variantLabel);
  // A variant's capacity takes precedence over numbers in a product's name.
  const capacity = variant.match(/(?:^|\D)(1000|500|280|250|100)(?!\d)/)?.[1]
    ?? name.match(/(?:^|\D)(1000|500|280|250|100)(?!\d)/)?.[1];
  const pack = /six[\s-]*pack|6\s*(?:botellas|pack)/.test(name + ' ' + variant);
  if (pack && capacity === '280') return { ...shippingProfiles.sixPack280 };
  if (pack && capacity === '500') return { ...shippingProfiles.sixPack500 };
  if (pack) throw new Error('No hay medidas para esa presentación de six-pack.');
  if (name.includes('kombucha')) {
    if (capacity === '280') return { ...shippingProfiles.kombucha280 };
    if (capacity === '500') return { ...shippingProfiles.kombucha500 };
    throw new Error('Esa presentación de kombucha no está habilitada para envío nacional.');
  }
  if (name.includes('ghee')) {
    if (capacity === '250') return { ...shippingProfiles.ghee250 };
    if (capacity === '500') return { ...shippingProfiles.ghee500 };
    if (capacity === '1000') return { ...shippingProfiles.ghee1000 };
  } else {
    // Temporary coconut-oil profiles for the remaining jar products.
    if (capacity === '100' || capacity === '250') return { ...shippingProfiles.coconut250 };
    if (capacity === '500') return { ...shippingProfiles.coconut500 };
    if (capacity === '1000') return { ...shippingProfiles.coconut1000 };
  }
  throw new Error('No hay medidas de envío para esa presentación.');
}
