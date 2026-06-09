'use client';

import Topnav from '@/components/top_nav';
import Footer from '@/components/footer';

export default function SiteLayout({ children }) {
  return (
    <>
      <Topnav />
      {children}
      <Footer />
    </>
  );
}
