// These are the approved public Wandra assets. Keep the delivery account fixed
// here: NEXT_PUBLIC_* values are compiled by Vercel and a stale project setting
// must never redirect the storefront to another Cloudinary account.
const cloudName = 'mk5klko9';
const uploadRoot = `https://res.cloudinary.com/${cloudName}/image/upload`;
const jamaicaImageRoot = `${uploadRoot}/c_limit,w_1600,q_auto`;

function cloudinaryAsset(version: string, publicId: string, format = 'f_auto,q_auto,w_1600,c_limit') {
  return `${uploadRoot}/${format}/${version}/${publicId}`;
}

// Public delivery URLs selected by Wandra. The version segment keeps the
// website cache aligned with the approved source image in Cloudinary.
export const media = {
  // Monograma WHS original, sin la ilustración de la india.
  logo: '/assets/wandra-logo-web.png',
  hero: cloudinaryAsset('v1788908562', 'MST0997911.jpg', 'f_auto,q_auto,w_2400,c_limit'),
  socialPreview: {
    url: cloudinaryAsset('v1788908562', 'MST0997911.jpg', 'c_fill,g_auto,w_1200,h_630,q_auto'),
    width: 1200,
    height: 630,
    alt: 'Botellas y caja de kombucha artesanal de Wandra',
  },
  origin: cloudinaryAsset('v1789126597', 'Scooby_Wandra.png'),
  ritualVideo: cloudinaryAsset('v1789127546', 'IMG20250227153443_1.jpg'),
  ritual: cloudinaryAsset('v1788908564', 'MST0009711.jpg'),
  coffee: cloudinaryAsset('v1788908564', 'MST0004711.jpg'),
  // Fotografía de la botella de café servida; no usar la imagen del SCOBY en catálogo.
  coffeeServed: `${uploadRoot}/f_auto,q_auto,w_1600,c_limit/Kombucha_cafe_500ml_Servida_en_copa`,
  pack280: cloudinaryAsset('v1788912441', 'SIX_PACK_280.jpg'),
  pack500: cloudinaryAsset('v1788908562', 'MST0998911.jpg'),
  delivery: cloudinaryAsset('v1788908564', 'Caja_sixPack_500ml_sostenida_en_el_aire.jpg'),
  ghee: cloudinaryAsset('v1788908093', 'GHEE.jpg'),
  coconutOil: cloudinaryAsset('v1788908088', 'ACEITE_DE_COCO_7.jpg'),
  goldenMilk: cloudinaryAsset('v1788908089', 'LECHE_DORADA_4.jpg'),
  sesameOil: cloudinaryAsset('v1788908090', 'AJONJOLI_4.jpg'),
  macadamiaCream: cloudinaryAsset('v1788908094', 'CREMA_DE_MACADAMIA.jpg'),
  tahini: cloudinaryAsset('v1788908095', 'DSCF3166.jpg'),
  ginger: cloudinaryAsset('v1788908563', 'MST0004511.jpg'),
  gingerAlternate: cloudinaryAsset('v1788908088', 'kombucha_jengibre_280_ml_3.jpg'),
  jamaicaGallery: [
    { src: `${jamaicaImageRoot}/MST0012811.jpg`, alt: 'Kombucha de flor de Jamaica cayendo de la botella a una copa' },
    { src: `${jamaicaImageRoot}/kombucha_F_jamaica_280_ml_2_1.jpg`, alt: 'Botella de kombucha de flor de Jamaica de 280 ml junto a flores secas' },
    { src: `${jamaicaImageRoot}/v1789127546/IMG20250227153443_1.jpg`, alt: 'Kombucha de flor de Jamaica servida en vaso con menta' },
    { src: `${jamaicaImageRoot}/2023_0915_16160300.jpg`, alt: 'Botella de kombucha de flor de Jamaica con tapa verde y un vaso al fondo' },
  ],
};
