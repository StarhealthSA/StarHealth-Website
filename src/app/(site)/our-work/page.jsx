import PortfolioListing from '@/components/portfolio/portfolio-listing';
import WhatNext from '@/components/what_next';
import { getPublishedPortfolioEntries } from '@/lib/content/portfolio';

export const revalidate = 60;

export const metadata = {
  title: 'Our Work Portfolio | Star Health',
  description:
    'Explore approved dental and dermatology work cases from Star Health Medical Centre in Riyadh.',
  openGraph: {
    title: 'Our Work Portfolio | Star Health',
    description:
      'Explore approved dental and dermatology work cases from Star Health Medical Centre in Riyadh.',
    url: 'https://starhealth.sa/our-work',
    type: 'website',
    images: ['https://starhealth.sa/socialimage.png'],
  },
  alternates: {
    canonical: 'https://starhealth.sa/our-work',
  },
};

export default async function OurWorkPage() {
  const entries = await getPublishedPortfolioEntries();

  return (
    <div>
      <PortfolioListing entries={entries} />
      <WhatNext />
    </div>
  );
}
