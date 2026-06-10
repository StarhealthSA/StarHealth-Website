import { notFound } from 'next/navigation';
import ServiceDetailClient from '@/components/services/detail/service-detail-client';
import Whatnext from '@/components/what_next';
import { getActiveServiceCategories } from '@/lib/content/service-categories';
import { getPublishedServices, getServiceBySlug } from '@/lib/content/services';
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

  const [categories, allServices] = await Promise.all([
    getActiveServiceCategories(),
    getPublishedServices(),
  ]);

  const similarServices = allServices.filter((s) =>
    (service.similarServiceIds || []).includes(s.id)
  );
  const recommendedServices = allServices.filter((s) =>
    (service.recommendedServiceIds || []).includes(s.id)
  );

  const content =
    'Explore more services, book your appointment, or contact our care team for personalized guidance.';

  return (
    <>
      <ServiceDetailClient
        service={service}
        categories={categories}
        similarServices={similarServices}
        recommendedServices={recommendedServices}
      />
      <Whatnext text={content} />
    </>
  );
}
