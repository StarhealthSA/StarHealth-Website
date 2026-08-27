import OffersListing from '@/components/offers/offers-listing';
import WhatNext from '@/components/what_next';
import { getPublishedOffers } from '@/lib/content/offers';

export const revalidate = 60;

export const metadata = {
  title: 'Offers | Star Health',
  description:
    'Discover current medical offers and treatment packages at Star Health Medical Centre in Riyadh.',
  openGraph: {
    title: 'Offers | Star Health',
    description:
      'Discover current medical offers and treatment packages at Star Health Medical Centre in Riyadh.',
    url: 'https://starhealth.sa/offers',
    type: 'website',
    images: ['https://starhealth.sa/socialimage.png'],
  },
  alternates: {
    canonical: 'https://starhealth.sa/offers',
  },
};

export default async function OffersPage() {
  const offers = await getPublishedOffers();

  return (
    <div>
      <OffersListing offers={offers} />
      <WhatNext />
    </div>
  );
}
