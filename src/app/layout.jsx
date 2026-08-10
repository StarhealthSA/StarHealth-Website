import Script from 'next/script';
import './globals.css';
import Providers from './providers';
import ScrollToTop from '@/components/scroll_to_top';
import ScrollTopButton from '@/components/scroll_top_button';
import RoutePrefetcher from '@/components/route_prefetcher';

const GA_MEASUREMENT_ID = 'G-ZXW6122Z4R';

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
        {/* Google tag (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}</Script>
      </head>
      <body>
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
