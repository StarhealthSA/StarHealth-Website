'use client';

import logo from '../assets/home/logo.svg';
import instagram from '../assets/home/instagram1.svg';
import facebook from '../assets/home/facebook1.svg';
import whatsapp from '../assets/home/whatsapp1.svg';
import linkedin from '../assets/home/linkedin1.svg';
import snapchat from '../assets/home/snapchat1.svg';
import tiktok from '../assets/home/tiktok1.svg';
import Bottomnav from './bottom_nav';
import NavLink from './nav_link';
import { useTranslation } from 'react-i18next';
import { FOOTER_QUICK_LINKS } from '@/constants/nav_routes';
import { useLocalizedServices } from '@/contexts/content-context';
import { NATIONAL_DAY } from '@/lib/national-day/config';

function Footer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const services = useLocalizedServices(i18n.language);
  const isNationalDay = NATIONAL_DAY.enabled;

  return (
    <div>
      <div
        className={`nd-footer relative w-full bg-[#063330] px-6 py-8 lg:px-[120px] lg:py-20${
          isNationalDay ? ' nd-footer--festive pb-14 lg:pb-24' : ' pb-12 lg:pb-24'
        }`}
      >
        {isNationalDay ? (
          <div className="nd-footer__edge nd-footer__edge--top" aria-hidden />
        ) : null}

        {isNationalDay ? (
          <div className="nd-footer__badge">
            <span className="nd-footer__motif" aria-hidden />
            <p className="nd-footer__badge-text" lang="ar">
              {NATIONAL_DAY.sloganAr}
              <span className="nd-footer__badge-sep">·</span>
              {t('nationalDay.yearLabel')}
            </p>
            <span className="nd-footer__motif" aria-hidden />
          </div>
        ) : null}

        <div className="flex flex-col justify-between gap-8 md:flex-row md:gap-0">
          <div className="lg:w-1/1">
            <h3 className="mb-2 text-sm text-[#FFFFFFCC] lg:mb-4 lg:text-base">{t('footer.appointments')}</h3>
            <p className="text-base font-medium text-white lg:text-xl">{t('footer.appointmentnumber')}</p>
          </div>
          <div className="lg:w-1/1">
            <h3 className="mb-2 text-sm text-[#FFFFFFCC] lg:mb-4 lg:text-base">{t('footer.emergency')}</h3>
            <p className="text-base font-medium text-white lg:text-xl">{t('footer.emergencynumber')}</p>
          </div>
          <div className="lg:w-1/1">
            <h3 className="mb-2 text-sm text-[#FFFFFFCC] lg:mb-4 lg:text-base">{t('footer.labResults')}</h3>
            <a href="mailto:labs@starhealth.sa">
              <p className="cursor-pointer text-base font-medium text-white lg:text-xl">{t('footer.labMail')}</p>
            </a>
          </div>
          <div className="lg:w-1/1">
            <h3 className="mb-2 text-sm text-[#FFFFFFCC] lg:mb-4 lg:text-base">{t('footer.patientEnquiries')}</h3>
            <a href="mailto:contact@starhealth.sa">
              <p className="cursor-pointer text-base font-medium text-white lg:text-xl">{t('footer.enquirynumber')}</p>
            </a>
          </div>
        </div>

        <div className="my-8 w-full border-b border-[#FFFFFF33] lg:my-12" />

        <div className="flex flex-col gap-5 md:flex-row lg:gap-16">
          <div className="md:w-1/4 lg:w-1/4">
            <NavLink href="/">
              <img src={logo} alt="Star Health Logo" className="mb-4 w-32 lg:mb-8 lg:w-40" />
            </NavLink>
            <p className="text-sm text-[#FFFFFFCC] lg:mb-0 lg:text-base">
              {t('footer.description')}
            </p>
          </div>

          <div className="md:w-1/5 lg:w-1/5">
            <h4 className="mb-2 text-lg font-medium text-white lg:mb-6 lg:text-xl">{t('footer.quickLinks')}</h4>
            <ul className="grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-1">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.labelKey} className="text-sm text-[#FFFFFFCC] hover:text-[#FFFFFF] lg:text-base">
                  <NavLink href={link.href}>{t(link.labelKey)}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:w-1/5 lg:w-1/5">
            <h4 className="mb-2 text-lg font-medium text-white lg:mb-6 lg:text-xl">{t('footer.ourServices')}</h4>
            <ul className="grid grid-cols-2 gap-2 md:grid-cols-1 lg:gap-4">
              {services.map((service) => (
                <li key={service.id} className="text-sm text-[#FFFFFFCC] hover:text-[#FFFFFF] lg:text-base">
                  <NavLink href={`/services/${service.slug}`}>{service.displayTitle}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:w-2/4 lg:w-1/3">
            <h4 className="mb-2 text-lg font-medium text-white lg:mb-6 lg:text-xl">{t('footer.newsletter')}</h4>
            <div className="mb-4 flex flex-row gap-2">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className={`h-10 w-1/2 flex-grow rounded-lg border border-[#FFFFFF4D] bg-transparent px-4 text-white placeholder-[#FFFFFF80] lg:h-10 ${isRTL ? 'text-right' : 'text-left'}`}
              />
              <button className="h-10 cursor-pointer rounded-lg bg-gradient-to-tl from-[#037B76] to-[#AED5C6] px-2 font-medium text-white hover:bg-gradient-to-br hover:from-[#037B76] hover:to-[#AED5C6] lg:h-10 lg:px-6">
                {t('footer.subscribe')}
              </button>
            </div>

            <h4 className="mb-4 text-lg font-medium text-white lg:text-xl">{t('footer.socialMedia')}</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/starhealthmedical/">
                <img src={instagram} alt="Instagram" className="h-10 w-10 hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href="https://www.facebook.com/share/1BjorBuyr1/">
                <img src={facebook} alt="Facebook" className="h-10 w-10 hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href="https://wa.me/+966505730003" dir="ltr">
                <img src={whatsapp} alt="WhatsApp" className="h-10 w-10 hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href="https://www.tiktok.com/@starhealthmedicalcenter">
                <img src={linkedin} alt="linkedin" className="h-10 w-10 hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href="https://www.snapchat.com/@starhealth50/">
                <img src={snapchat} alt="snapchat" className="h-10 w-10 hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href="https://www.tiktok.com/@starhealthmedicalcenter">
                <img src={tiktok} alt="tiktok" className="h-10 w-10 hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
            </div>
          </div>
        </div>

        {isNationalDay ? (
          <div className="nd-footer__edge nd-footer__edge--bottom" aria-hidden />
        ) : null}
      </div>
      <Bottomnav />
    </div>
  );
}

export default Footer;
