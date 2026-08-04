import Script from 'next/script';
import './globals.css';
import Providers from './providers';
import ScrollToTop from '@/components/scroll_to_top';
import ScrollTopButton from '@/components/scroll_top_button';
import RoutePrefetcher from '@/components/route_prefetcher';

const GTM_ID = 'GTM-KFFNVGVG';

export const metadata = {
  title: 'Star Health',
  description:
    'Star Health is here to do more than just treat. We listen, guide, and walk with you. Experience compassionate and expert care that\'s truly patient-first.',
  keywords:
    'Star Health, medical centre, Riyadh, family medicine, pediatrics, healthcare',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Star-Health',
    description:
      'Star Health is here to do more than just treat. We listen, guide, and walk with you. Experience compassionate and expert care that\'s truly patient-first.',
    images: ['https://starhealth.sa/socialimage.png'],
    url: 'https://starhealth.sa/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-head" strategy="beforeInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Providers>
          <RoutePrefetcher />
          <ScrollToTop />
          <ScrollTopButton />
          {children}
        </Providers>
      </body>
    </html>
  );
}
