import AppoinmentForm from '@/components/appointment_form';
import { ContentProvider } from '@/contexts/content-context';
import { getPublishedDoctors } from '@/lib/content/doctors';
import { getPublishedServices } from '@/lib/content/services';

export const revalidate = 60;

export default async function BookingPage() {
  const [doctors, services] = await Promise.all([
    getPublishedDoctors(),
    getPublishedServices(),
  ]);

  return (
    <ContentProvider doctors={doctors} services={services}>
      <AppoinmentForm />
    </ContentProvider>
  );
}
