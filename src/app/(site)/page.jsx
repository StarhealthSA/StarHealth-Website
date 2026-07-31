import { Suspense } from 'react';
import HeroSection from '@/components/home/hero_section';
import { getHomeSettings } from '@/lib/content/site-settings';
import { getActiveHeroSlides } from '@/lib/content/hero-slides';
import { getLocalizedText } from '@/lib/content/localized';
import { preload } from 'react-dom';
import WelcomePart from '@/components/home/welcome_part';
import Safety from '@/components/home/safety';
import SpecializedServices from '@/components/home/specialized_services';
import MedTeam from '@/components/home/med_team';
import Testimonials from '@/components/home/testomonials';
import PrivilegeMembershipBanner from '@/components/home/privilege-membership-banner';
import Whatnext from '@/components/what_next';
import Mobviewform from '@/components/mob_view_form';

export const revalidate = 60;

const DEFAULT_HOME_TITLE = 'Star Health';
const DEFAULT_HOME_DESCRIPTION =
  "Star Health is here to do more than just treat. We listen, guide, and walk with you. Experience compassionate and expert care that's truly patient-first.";

export async function generateMetadata() {
  const homeSettings = await getHomeSettings();
  const title = getLocalizedText(homeSettings?.metaTitle, 'en') || DEFAULT_HOME_TITLE;
  const description =
    getLocalizedText(homeSettings?.metaDescription, 'en') || DEFAULT_HOME_DESCRIPTION;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://starhealth.sa/',
      type: 'website',
      images: ['https://starhealth.sa/socialimage.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

async function DynamicHeroSection() {
  const homeSettings = await getHomeSettings();
  const slides = getActiveHeroSlides(homeSettings?.heroSlides || []);
  const firstImage = slides.find((slide) => slide.mediaType === 'image' && slide.src);

  if (firstImage?.src) {
    preload(firstImage.src, { as: 'image' });
  }

  return <HeroSection homeSettings={homeSettings} />;
}

export default function HomePage() {
  const content =
    'Start by scheduling your consultation, explore our specialties for insights, or access resources to make confident and informed decisions you need.';

  return (
    <div>
      <Suspense fallback={<HeroSection />}>
        <DynamicHeroSection />
      </Suspense>
      <div className="sm:hidden">
        <Mobviewform />
      </div>
      <div id="about">
        <WelcomePart />
      </div>
      <PrivilegeMembershipBanner />
      <Safety />
      <div id="services">
        <SpecializedServices />
      </div>
      <MedTeam />
      <Testimonials />
      <Whatnext text={content} />
    </div>
  );
}
