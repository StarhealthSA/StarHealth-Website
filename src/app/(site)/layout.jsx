import Topnav from '@/components/top_nav';
import Header from '@/components/header/header';
import Footer from '@/components/footer';
import { ContentProvider } from '@/contexts/content-context';
import { getPublishedDoctors } from '@/lib/content/doctors';
import { getPublishedServices } from '@/lib/content/services';

export const revalidate = 60;

export default async function SiteLayout({ children }) {
  const [doctors, services] = await Promise.all([
    getPublishedDoctors(),
    getPublishedServices(),
  ]);

  return (
    <ContentProvider doctors={doctors} services={services}>
      <Topnav />
      <Header />
      {children}
      <Footer />
    </ContentProvider>
  );
}
