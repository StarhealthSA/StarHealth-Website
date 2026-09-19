import { notFound } from 'next/navigation';
import ServiceDetailClient from '@/components/services/detail/service-detail-client';
import { getPublishedDoctors } from '@/lib/content/doctors';
import { getServiceBySlug } from '@/lib/content/services';
import { getActiveSpecializations } from '@/lib/content/specializations';
import { getLocalizedText } from '@/lib/content/localized';
import { getPublishedPortfolioEntries } from '@/lib/content/portfolio';
import { resolvePortfolioCategoryForService } from '@/lib/content/portfolio-categories';

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

  const portfolioCategory = resolvePortfolioCategoryForService(service);

  const [doctors, specializations, portfolioEntries] = await Promise.all([
    getPublishedDoctors(),
    getActiveSpecializations(),
    portfolioCategory
      ? getPublishedPortfolioEntries({ category: portfolioCategory })
      : Promise.resolve([]),
  ]);

  return (
    <ServiceDetailClient
      service={service}
      doctors={doctors}
      specializations={specializations}
      portfolioEntries={portfolioEntries}
      portfolioCategory={portfolioCategory}
    />
  );
}
