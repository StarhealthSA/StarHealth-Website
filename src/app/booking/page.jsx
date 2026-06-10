import AppoinmentForm from '@/components/appointment_form';
import { ContentProvider } from '@/contexts/content-context';
import { getPublishedDoctors } from '@/lib/content/doctors';
import { getPublishedServices } from '@/lib/content/services';
import { getActiveSpecializations } from '@/lib/content/specializations';
import { getActiveServiceCategories } from '@/lib/content/service-categories';

export const revalidate = 60;

export default async function BookingPage() {
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
      <AppoinmentForm />
    </ContentProvider>
  );
}
