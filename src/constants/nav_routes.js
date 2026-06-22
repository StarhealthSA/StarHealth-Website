export const PREFETCH_ROUTES = [
  '/',
  '/about',
  '/services',
  '/doctors',
  '/blogs',
  '/contact',
  '/privacy',
];

export const HEADER_NAV_LINKS = [
  { href: '/', labelKey: 'navigation.home' },
  { href: '/about', labelKey: 'navigation.about' },
  { href: '/services', labelKey: 'navigation.services' },
  { href: '/doctors', labelKey: 'navigation.doctors' },
  { href: '/blogs', labelKey: 'navigation.blogs' },
  { href: '/contact', labelKey: 'navigation.contact' },
];

export function isNavLinkActive(href, pathname = '') {
  if (!pathname) return false;

  if (href === '/') {
    return pathname === '/';
  }

  if (href === '/blogs') {
    return pathname === '/blogs' || pathname.startsWith('/blog/');
  }

  if (href === '/services') {
    return (
      pathname === '/services'
      || pathname.startsWith('/services/')
      || pathname.startsWith('/specializations/')
    );
  }

  if (href === '/doctors') {
    return pathname === '/doctors' || pathname.startsWith('/doctors/');
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export const FOOTER_QUICK_LINKS = [
  { href: '/', labelKey: 'footer.quickLink.home' },
  { href: '/about', labelKey: 'footer.quickLink.aboutUs' },
  { href: '/services', labelKey: 'footer.quickLink.services' },
  { href: '/doctors', labelKey: 'footer.quickLink.doctors' },
  { href: '/blogs', labelKey: 'footer.quickLink.blogs' },
  { href: '/contact', labelKey: 'footer.quickLink.contactUs' },
  { href: '/privacy', labelKey: 'footer.quickLink.privacy' },
];

export const FOOTER_SERVICE_LINKS = [
  { href: '/services', labelKey: 'footer.services.generalMedicine' },
  { href: '/services', labelKey: 'footer.services.paediatrics' },
  { href: '/services', labelKey: 'footer.services.orthopaedics' },
  { href: '/services', labelKey: 'footer.services.internalMedicine' },
  { href: '/services', labelKey: 'footer.services.dentistry' },
  { href: '/services', labelKey: 'footer.services.dermatology' },
  { href: '/services', labelKey: 'footer.services.pediatrics' },
];
