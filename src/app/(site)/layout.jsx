import Topnav from '@/components/top_nav';
import Header from '@/components/header/header';
import Footer from '@/components/footer';
import FloatingWhatsAppButton from '@/components/floating-whatsapp-button';
import NationalDayThemeRoot from '@/components/national-day/national-day-theme-root';
import NationalDayBanner from '@/components/national-day/national-day-banner';
import NationalDayAccents from '@/components/national-day/national-day-accents';
import { ContentProvider } from '@/contexts/content-context';
import { getPublishedDoctors } from '@/lib/content/doctors';
import { getPublishedServices } from '@/lib/content/services';
import { getActiveSpecializations } from '@/lib/content/specializations';

export const revalidate = 60;

export default async function SiteLayout({ children }) {
  const [doctors, services, specializations] = await Promise.all([
    getPublishedDoctors(),
    getPublishedServices(),
    getActiveSpecializations(),
  ]);

  return (
    <ContentProvider
      doctors={doctors}
      services={services}
      specializations={specializations}
    >
      <NationalDayThemeRoot>
        <Topnav />
        <NationalDayBanner />
        <Header />
        {children}
        <Footer />
        <NationalDayAccents />
        <FloatingWhatsAppButton />
      </NationalDayThemeRoot>
    </ContentProvider>
  );
}
