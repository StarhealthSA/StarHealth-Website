import { notFound } from 'next/navigation';
import SpecializationDetailClient from '@/components/specializations/detail/specialization-detail-client';
import { getPublishedDoctors } from '@/lib/content/doctors';
import { getServiceById } from '@/lib/content/services';
import { getLocalizedText } from '@/lib/content/localized';
import { getSpecializationBySlug } from '@/lib/content/specializations';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const specialization = await getSpecializationBySlug(slug);
  if (!specialization) return { title: 'Specialization Not Found | Star Health' };

  return {
    title:
      getLocalizedText(specialization.metaTitle, 'en')
      || `${getLocalizedText(specialization.name, 'en')} | Star Health`,
    description:
      getLocalizedText(specialization.metaDescription, 'en')
      || getLocalizedText(specialization.shortDescription, 'en'),
  };
}

export default async function SpecializationDetailPage({ params }) {
  const { slug } = await params;
  const specialization = await getSpecializationBySlug(slug);

  if (!specialization) {
    notFound();
  }

  const [doctors, parentService] = await Promise.all([
    getPublishedDoctors(),
    specialization.parentServiceId
      ? getServiceById(specialization.parentServiceId)
      : Promise.resolve(null),
  ]);

  return (
    <SpecializationDetailClient
      specialization={specialization}
      parentService={parentService}
      doctors={doctors}
    />
  );
}
