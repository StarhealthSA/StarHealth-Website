import Contactform from '@/components/contact/contact_form_section';
import Faqsection from '@/components/contact/faq_section';
import IntroSection from '@/components/contact/intro_section';
import Mobileviewform from '@/components/contact/mobile_form_section';
import WhatNext from '@/components/what_next';

export default function ContactPage() {
  return (
    <div>
      <IntroSection />
      <div className="hidden md:block">
        <Contactform />
      </div>
      <div className="block sm:hidden">
        <Mobileviewform />
      </div>
      <Faqsection />
      <WhatNext />
    </div>
  );
}
