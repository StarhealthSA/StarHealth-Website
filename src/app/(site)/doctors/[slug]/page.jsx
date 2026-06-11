import { notFound } from 'next/navigation';
import DoctorDetailClient from '@/components/doctors/detail/doctor-detail-client';
import Whatnext from '@/components/what_next';
import { getDoctorBySlug } from '@/lib/content/doctors';
import { getPublishedServices } from '@/lib/content/services';
import { getLocalizedText } from '@/lib/content/localized';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) return { title: 'Doctor Not Found | Star Health' };

  return {
    title: getLocalizedText(doctor.metaTitle, 'en') || `${getLocalizedText(doctor.name, 'en')} | Star Health`,
    description:
      getLocalizedText(doctor.metaDescription, 'en') ||
      getLocalizedText(doctor.shortIntro, 'en') ||
      getLocalizedText(doctor.biography, 'en'),
  };
}

export default async function DoctorDetailPage({ params }) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);

  if (!doctor) {
    notFound();
  }

  const allServices = await getPublishedServices();
  const relatedServices = allServices.filter((s) =>
    (doctor.relatedServiceIds || []).includes(s.id)
  );

  const content =
    'Schedule your consultation, explore our specialties, or contact our care team for guidance.';

  return (
    <>
      <DoctorDetailClient doctor={doctor} relatedServices={relatedServices} />
      <Whatnext text={content} />
    </>
  );
}
