import './globals.css';
import Providers from './providers';

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
