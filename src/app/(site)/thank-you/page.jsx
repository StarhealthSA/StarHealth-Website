import ThankYouContent from '@/components/thank_you_content';

export const metadata = {
  title: 'Thank You | Star Health',
  description: 'Your appointment request has been received. Our team will confirm your booking shortly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return <ThankYouContent />;
}
