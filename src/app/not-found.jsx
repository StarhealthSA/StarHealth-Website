import Topnav from '@/components/top_nav';
import Header from '@/components/header/header';
import Footer from '@/components/footer';
import NotFoundPage from '@/components/not-found-page';
import { ContentProvider } from '@/contexts/content-context';
import { getPublishedDoctors } from '@/lib/content/doctors';
import { getPublishedServices } from '@/lib/content/services';
import { getActiveSpecializations } from '@/lib/content/specializations';
import { getActiveServiceCategories } from '@/lib/content/service-categories';

export default async function RootNotFound() {
  const [doctors, services, specializations, serviceCategories] = await Promise.all([
    getPublishedDoctors(),
    getPublishedServices(),
    getActiveSpecializations(),
    getActiveServiceCategories(),
  ]);

  return (
    <ContentProvider
      doctors={doctors}
      services={services}
      specializations={specializations}
      serviceCategories={serviceCategories}
    >
      <Topnav />
      <Header />
      <NotFoundPage />
      <Footer />
    </ContentProvider>
  );
}
