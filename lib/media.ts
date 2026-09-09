const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER?.replace(/^\/+|\/+$/g, '');

function asset(publicId: string, fallback: string) {
  if (!cloudName || !folder) return fallback;
  return 'https://res.cloudinary.com/' + cloudName + '/image/upload/f_auto,q_auto/' + folder + '/' + publicId;
}

export const media = {
  logo: asset('wandra-logo-web', '/assets/cloudinary-upload/wandra-logo-web.webp'),
  hero: asset('wandra-hero-editorial', '/assets/cloudinary-upload/wandra-hero-editorial.webp'),
  origin: asset('wandra-origin-editorial', '/assets/cloudinary-upload/wandra-origin-editorial.webp'),
  ritual: asset('wandra-ritual-editorial', '/assets/cloudinary-upload/wandra-ritual-editorial.webp'),
  pack280: asset('wandra-pack-280-editorial', '/assets/cloudinary-upload/wandra-pack-280-editorial.webp'),
  pack500: asset('wandra-pack-500-editorial', '/assets/cloudinary-upload/wandra-pack-500-editorial.webp'),
  delivery: asset('wandra-delivery-editorial', '/assets/cloudinary-upload/wandra-delivery-editorial.webp'),
};

