import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222s-99.6-222-222.1-222zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.4-28.2-98.3 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.7-186.6 184.7zm101.7-138c-5.6-2.8-33.4-16.5-38.6-18.4-5.2-1.9-9-2.8-12.8 2.8-3.7 5.6-14.3 18.4-17.6 22.2-3.2 3.7-6.5 4.2-12.1 1.4-33.1-16.5-54.9-29.5-76.8-66.9-5.8-10 5.8-9.3 16.5-30.9 1.9-3.7 1-7-.5-9.8-1.4-2.8-12.8-30.9-17.5-42.3-4.6-11.2-9.3-9.7-12.8-9.9-3.3-.2-7-.2-10.7-.2-3.7 0-9.8 1.4-14.9 7-5.1 5.6-19.6 19.2-19.6 46.8s20.1 54.3 22.9 58.1c2.8 3.7 39.5 60.3 95.7 84.6 35.5 15.3 49.4 16.6 67.2 14 10.8-1.6 33.4-13.7 38.1-27 4.7-13.3 4.7-24.7 3.3-27-1.4-2.3-5.1-3.7-10.7-6.5z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.7" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4V10H8.3v3h2.6v8h2.8Z" />
    </svg>
  );
}
