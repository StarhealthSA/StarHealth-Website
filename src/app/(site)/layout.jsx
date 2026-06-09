import Topnav from '@/components/top_nav';
import Header from '@/components/header/header';

export default function SiteLayout({ children }) {
  return (
    <>
      <Topnav />
      <Header />
      {children}
    </>
  );
}
