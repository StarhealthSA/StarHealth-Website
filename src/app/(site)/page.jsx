import HeroSection from '@/components/home/hero_section';
import { getHomeSettings } from '@/lib/content/site-settings';
import WelcomePart from '@/components/home/welcome_part';
import Safety from '@/components/home/safety';
import SpecializedServices from '@/components/home/specialized_services';
import MedTeam from '@/components/home/med_team';
import Testimonials from '@/components/home/testomonials';
import Whatnext from '@/components/what_next';
import Mobviewform from '@/components/mob_view_form';

export const revalidate = 60;

export default async function HomePage() {
  const homeSettings = await getHomeSettings();
  const content =
    'Start by scheduling your consultation, explore our specialties for insights, or access resources to make confident and informed decisions you need.';

  return (
    <div>
      <HeroSection homeSettings={homeSettings} />
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
