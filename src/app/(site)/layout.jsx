'use client';

import Topnav from '@/components/top_nav';
import Header from '@/components/header/header';
import Footer from '@/components/footer';

export default function SiteLayout({ children }) {
  return (
    <>
      <Topnav />
      <Header />
      {children}
      <Footer />
    </>
  );
}
