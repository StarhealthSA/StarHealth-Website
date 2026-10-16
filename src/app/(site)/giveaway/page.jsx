import GiveawayPage from '@/components/giveaway/giveaway-page';
import { GIVEAWAY } from '@/lib/giveaway/config';
import { getPublishedOffers } from '@/lib/content/offers';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export const metadata = {
  title: 'Anniversary Giveaway | Star Health Medical Centre',
  description:
    'Celebrate one year of Star Health with our anniversary giveaway. Enter for a chance to win special care packages, exclusive offers, and more in Riyadh.',
  keywords:
    'star health giveaway, anniversary giveaway riyadh, medical center contest, star health offers',
  openGraph: {
    title: 'Anniversary Giveaway | Star Health Medical Centre',
    description:
      'Join Star Health’s anniversary giveaway — countdown live, special packages, and easy entry.',
    url: 'https://starhealth.sa/giveaway',
    type: 'website',
    images: ['https://starhealth.sa/socialimage.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anniversary Giveaway | Star Health Medical Centre',
    description:
      'Join Star Health’s anniversary giveaway — countdown live, special packages, and easy entry.',
  },
  alternates: {
    canonical: 'https://starhealth.sa/giveaway',
  },
};

export default async function GiveawayRoutePage() {
  if (!GIVEAWAY.enabled) notFound();

  const offers = await getPublishedOffers();

  return <GiveawayPage offers={offers} />;
}
