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

function Footer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const services = useLocalizedServices(i18n.language);

  return (
    <div>
      <div className="bg-[#063330] w-full py-8 lg:py-20 px-6 lg:px-[120px]">

        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
          <div className="lg:w-1/1">
            <h3 className="text-sm lg:text-base text-[#FFFFFFCC] mb-2 lg:mb-4">{t('footer.appointments')}</h3>
            <p className="text-base lg:text-xl font-medium text-white">{t('footer.appointmentnumber')}</p>
          </div>
          <div className="lg:w-1/1">
            <h3 className="text-sm lg:text-base text-[#FFFFFFCC] mb-2 lg:mb-4">{t('footer.emergency')}</h3>
            <p className="text-base lg:text-xl font-medium text-white">{t('footer.emergencynumber')}</p>
          </div>
          <div className="lg:w-1/1">
            <h3 className="text-sm lg:text-base text-[#FFFFFFCC] mb-2 lg:mb-4">{t('footer.labResults')}</h3>
            <a href="mailto:labs@starhealth.sa">
              <p className="text-base lg:text-xl cursor-pointer font-medium text-white"
              >{t('footer.labMail')}</p>
            </a>
          </div>
          <div className="lg:w-1/1">
            <h3 className="text-sm lg:text-base text-[#FFFFFFCC] mb-2 lg:mb-4">{t('footer.patientEnquiries')}</h3>
            <a href="mailto:contact@starhealth.sa">
              <p className="text-base lg:text-xl cursor-pointer font-medium text-white"
              >{t('footer.enquirynumber')}</p>
            </a>
          </div>
        </div>

        <div className="border-b border-[#FFFFFF33] w-full my-8 lg:my-12"></div>

        <div className="flex flex-col md:flex-row gap-5 lg:gap-16">

          <div className="lg:w-1/4 md:w-1/4">
            <NavLink href="/">
              <img src={logo} alt="Star Health Logo" className="w-32 lg:w-40 mb-4 lg:mb-8" />
            </NavLink>
            <p className="text-sm lg:text-base text-[#FFFFFFCC] lg:mb-0">
              {t('footer.description')}
            </p>
          </div>

          <div className="lg:w-1/5 md:w-1/5">
            <h4 className="text-lg lg:text-xl font-medium text-white mb-2 lg:mb-6">{t('footer.quickLinks')}</h4>
            <ul className="grid grid-cols-3 md:grid-cols-1 gap-2 sm:gap-4">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.labelKey} className="text-sm lg:text-base text-[#FFFFFFCC] hover:text-[#FFFFFF]">
                  <NavLink href={link.href}>{t(link.labelKey)}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/5 md:w-1/5">
            <h4 className="text-lg lg:text-xl font-medium text-white mb-2 lg:mb-6">{t('footer.ourServices')}</h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 lg:gap-4">
              {services.map((service) => (
                <li key={service.id} className="text-sm lg:text-base text-[#FFFFFFCC] hover:text-[#FFFFFF]">
                  <NavLink href={`/services/${service.slug}`}>{service.displayTitle}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/3 md:w-2/4">
            <h4 className="text-lg lg:text-xl font-medium text-white mb-2 lg:mb-6">{t('footer.newsletter')}</h4>
            <div className="flex flex-row md:flex-row gap-2 mb-4">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className={`w-1/2 flex-grow h-10 lg:h-10 px-4 rounded-lg border border-[#FFFFFF4D] bg-transparent text-white placeholder-[#FFFFFF80] ${isRTL ? 'text-right' : 'text-left'}`}
              />
              <button className="cursor-pointer bg-gradient-to-tl from-[#037B76] to-[#AED5C6] hover:bg-gradient-to-br hover:from-[#037B76] hover:to-[#AED5C6] text-white h-10 lg:h-10 px-2 lg:px-6 rounded-lg font-medium">
                {t('footer.subscribe')}
              </button>
            </div>

            <h4 className="text-lg lg:text-xl font-medium text-white mb-4">{t('footer.socialMedia')}</h4>
            <div className="flex gap-4">
              <a href='https://www.instagram.com/starhealthmedical/'>
                <img src={instagram} alt="Instagram" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href='https://www.facebook.com/share/1BjorBuyr1/'>
                <img src={facebook} alt="Facebook" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href="https://wa.me/+966505730003"
                dir='ltr'>
                <img src={whatsapp} alt="WhatsApp" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href='https://www.tiktok.com/@starhealthmedicalcenter'>
                <img src={linkedin} alt="linkedin" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href='https://www.snapchat.com/@starhealth50/'>
                <img src={snapchat} alt="snapchat" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href='https://www.tiktok.com/@starhealthmedicalcenter'>
                <img src={tiktok} alt="tiktok" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Bottomnav />
    </div >
  );
}

export default Footer;
