'use client';

import contactBanner from '@/assets/home/contctpage.jpg';
import phone from '../../assets/contact/contactus_phone.svg';
import mail from '../../assets/contact/contactus_mail.svg';
import location from '../../assets/contact/contactus_location.svg';
import Reveal, { staggerDelay } from '../reveal';
import { useTranslation } from 'react-i18next';

function IntroSection() {
  const { t } = useTranslation();

  const options = [
    {
      icon: phone,
      title: t('contactPage.header.phoneTitle'),
      link: 'tel:+966505730003',
      description: t('contactPage.header.phoneNumber'),
    },
    {
      icon: mail,
      title: t('contactPage.header.emailTitle'),
      link: 'mailto:contact@starhealth.sa',
      description: t('contactPage.header.email'),
    },
    {
      icon: location,
      title: t('contactPage.header.locationTitle'),
      link: 'https://maps.app.goo.gl/fNDUmeW3QMxax97x5?g_st=ipc',
      description: t('contactPage.header.location'),
    },
  ];

  return (
    <section>
      <div
        className="relative min-h-[60vh] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${contactBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#002333]/70 via-[#002333]/55 to-[#002333]/65" />

        <Reveal className="relative flex min-h-[inherit] flex-col items-center justify-center px-[30px] py-14 text-center md:py-18 lg:px-[120px] lg:py-22">
          <p className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] text-white backdrop-blur-sm md:text-[13px]">
            STAR HEALTH MEDICAL CENTRE
          </p>
          <h1 className="mt-4 max-w-4xl text-[30px] font-semibold leading-[38px] text-white md:text-[44px] md:leading-[56px]">
            {t('contactPage.header.title')}
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-[24px] text-white/90 md:text-[17px] md:leading-[28px]">
            {t('contactPage.header.description')}
          </p>
        </Reveal>
      </div>

      <div className="flex flex-col items-start justify-center gap-6 px-[30px] md:mb-3 lg:mb-0 lg:flex-row lg:items-center lg:gap-10 lg:px-[120px]">
        {options.map((items, index) => (
          <Reveal
            delay={staggerDelay(index)}
            className="mb-5 mt-4 flex flex-row items-center justify-start lg:mb-10 lg:mt-10 lg:justify-center"
            key={items.title}
          >
            <a href={items.link}>
              <img src={items.icon} alt={items.title} className="h-[50px] w-[50px] flex-shrink-0" />
            </a>
            <div className="mx-4 flex flex-col items-start">
              <h2 className="font-inter text-[14px] font-normal text-[#687276] lg:text-[16px]">{items.title}</h2>
              {items.link ? (
                <a href={items.link}>
                  <p className="font-inter text-[14px] font-medium text-[#002333] lg:text-[16px]">{items.description}</p>
                </a>
              ) : (
                <p className="font-inter text-[14px] font-medium text-[#002333] lg:text-[16px]" dir="ltr">
                  {items.description}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default IntroSection;
