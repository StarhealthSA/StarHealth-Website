import InsuranceListing from '@/components/insurance/insurance-listing';
import WhatNext from '@/components/what_next';
import { getPublishedInsurancePartners } from '@/lib/content/insurance';

export const revalidate = 60;

export const metadata = {
  title: 'Insurance Partners | Star Health',
  description:
    'Explore trusted insurance partnerships at Star Health Medical Centre in Riyadh. We work with major insurers to simplify care access.',
  openGraph: {
    title: 'Insurance Partners | Star Health',
    description:
      'Explore trusted insurance partnerships at Star Health Medical Centre in Riyadh.',
    url: 'https://starhealth.sa/insurance',
    type: 'website',
    images: ['https://starhealth.sa/socialimage.png'],
  },
  alternates: {
    canonical: 'https://starhealth.sa/insurance',
  },
};

export default async function InsurancePage() {
  const partners = await getPublishedInsurancePartners();

  return (
    <div>
      <InsuranceListing partners={partners} />
      <WhatNext />
    </div>
  );
}
