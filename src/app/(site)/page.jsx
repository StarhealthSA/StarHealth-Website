import { Suspense } from 'react';
import HeroSection from '@/components/home/hero_section';
import { getHomeSettings } from '@/lib/content/site-settings';
import { getActiveHeroSlides } from '@/lib/content/hero-slides';
import { preload } from 'react-dom';
import WelcomePart from '@/components/home/welcome_part';
import Safety from '@/components/home/safety';
import SpecializedServices from '@/components/home/specialized_services';
import MedTeam from '@/components/home/med_team';
import Testimonials from '@/components/home/testomonials';
import Whatnext from '@/components/what_next';
import Mobviewform from '@/components/mob_view_form';

export const revalidate = 60;

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
