import LoyaltyProgramSection from '@/components/loyalty/loyalty-program-section';

export const metadata = {
  title: 'Loyalty Program | Star Health Medical Centre',
  description:
    'Discover Star Health Burgundy and Black Privilege loyalty programs. Earn points, enjoy aesthetic treatments, and access exclusive member benefits in Riyadh.',
  keywords:
    'star health loyalty program, burgundy privilege, black privilege, aesthetic treatments riyadh, botox fillers loyalty',
  openGraph: {
    title: 'Loyalty Program | Star Health Medical Centre',
    description:
      'Explore Burgundy and Black Privilege membership tiers with exclusive treatments and dedicated care at Star Health.',
  },
};

export default function LoyaltyProgramPage() {
  return <LoyaltyProgramSection />;
}
