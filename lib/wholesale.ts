export type WholesalePresentation = {
  label: string;
  distributorPrice: number;
  suggestedRetailPrice: number;
  distributorMargin: string;
  availability: 'available' | 'coming-soon';
};

export type WholesaleFlavor = {
  name: string;
  skus: Record<string, string>;
};

// Datos confirmados en la lista de precios de distribuidor de Wandra.
// El precio para distribuidor incluye IVA. El PVP es una sugerencia, no un
// precio final de checkout; su vigencia se confirma en cada cotización.
export const wholesalePresentations: WholesalePresentation[] = [
  { label: '280 ml', distributorPrice: 6500, suggestedRetailPrice: 10000, distributorMargin: '35%', availability: 'available' },
  { label: '500 ml', distributorPrice: 10000, suggestedRetailPrice: 15000, distributorMargin: '33%', availability: 'available' },
  { label: '750 ml', distributorPrice: 14000, suggestedRetailPrice: 22000, distributorMargin: '36%', availability: 'coming-soon' },
  { label: '1.000 ml', distributorPrice: 16000, suggestedRetailPrice: 24000, distributorMargin: '33%', availability: 'available' },
];

export const wholesaleFlavors: WholesaleFlavor[] = [
  { name: 'Jengibre', skus: { '280 ml': 'KJ028', '500 ml': 'KJ050', '750 ml': 'KJ075', '1.000 ml': 'KJ100' } },
  { name: 'Flor de Jamaica', skus: { '280 ml': 'KFJ028', '500 ml': 'KFJ050', '750 ml': 'KFJ075', '1.000 ml': 'KFJ100' } },
  { name: 'Café', skus: { '280 ml': 'KC028', '500 ml': 'KC050', '750 ml': 'KC075', '1.000 ml': 'KC100' } },
  { name: 'Original', skus: { '280 ml': 'KSO028', '500 ml': 'KSO050', '750 ml': 'KSO075', '1.000 ml': 'KSO100' } },
  { name: 'Dragon Fruit', skus: { '280 ml': 'KDF028', '500 ml': 'KDF050', '750 ml': 'KDF075', '1.000 ml': 'KDF100' } },
];

export const wholesaleTerms = {
  sanitaryRegistration: 'RSA-1563-2025',
  deliveryEstimate: '3 a 5 días hábiles desde la confirmación del pedido',
  payment: 'Contraentrega, sujeto a negociación según historial comercial.',
  storage: 'Refrigeración obligatoria entre 0 y 6 °C.',
  shelfLife: '4 meses desde la fecha de elaboración, refrigerado.',
  returns: 'Producto defectuoso reportado dentro de las 48 horas de recibido.',
  priceValidity: 'Los precios mayoristas están sujetos a la vigencia del catálogo y a confirmación en la cotización.',
};
