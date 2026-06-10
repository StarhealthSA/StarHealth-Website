import AppoinmentForm from '@/components/appointment_form';
import { ContentProvider } from '@/contexts/content-context';
import { getPublishedDoctors } from '@/lib/content/doctors';
import { getPublishedServices } from '@/lib/content/services';
import { getActiveSpecializations } from '@/lib/content/specializations';

export const revalidate = 60;

export default async function BookingPage() {
  const [doctors, services, specializations] = await Promise.all([
    getPublishedDoctors(),
    getPublishedServices(),
    getActiveSpecializations(),
  ]);

  return (
    <ContentProvider doctors={doctors} services={services} specializations={specializations}>
      <AppoinmentForm />
    </ContentProvider>
  );
}
