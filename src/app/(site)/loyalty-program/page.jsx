import LoyaltyProgramSection from '@/components/loyalty/loyalty-program-section';

export const metadata = {
  title: 'Nujoom by Star Health | Star Health Medical Centre',
  description:
    'Join Nujoom by Star Health and earn reward points every time you receive a service at Star Health Derma. Enjoy member prices, special offers, and redeem points on treatments.',
  keywords:
    'nujoom by star health, loyalty program, derma rewards, earn points riyadh, star health derma',
  openGraph: {
    title: 'Nujoom by Star Health | Star Health Medical Centre',
    description:
      'Earn Nujoom points on every Star Health Derma service and redeem them for exclusive member benefits.',
  },
};

export default function LoyaltyProgramPage() {
  return <LoyaltyProgramSection />;
}
