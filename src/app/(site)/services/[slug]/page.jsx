import { notFound } from 'next/navigation';
import ServiceDetailClient from '@/components/services/detail/service-detail-client';
import { getPublishedDoctors } from '@/lib/content/doctors';
import { getServiceBySlug } from '@/lib/content/services';
import { getActiveSpecializations } from '@/lib/content/specializations';
import { getLocalizedText } from '@/lib/content/localized';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: 'Service Not Found | Star Health' };

  return {
    title: getLocalizedText(service.metaTitle, 'en') || `${getLocalizedText(service.title, 'en')} | Star Health`,
    description:
      getLocalizedText(service.metaDescription, 'en')
      || getLocalizedText(service.shortDescription || service.description, 'en'),
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const [doctors, specializations] = await Promise.all([
    getPublishedDoctors(),
    getActiveSpecializations(),
  ]);

  return (
    <ServiceDetailClient
      service={service}
      doctors={doctors}
      specializations={specializations}
    />
  );
}
