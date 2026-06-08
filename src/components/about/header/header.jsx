import logo from '../../../assets/doctors/logo1.svg';
import { Link } from 'react-router-dom';
import Menulist from '../../menulist/menu_list';
import menu from '../../../assets/doctors/secondmenu.svg';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#f4faf9] via-[#ffffff] to-[#e6f3ef]">
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#037B76]/10 blur-3xl" />
      <div className="absolute bottom-0 -right-16 h-56 w-56 rounded-full bg-[#AED5C6]/40 blur-3xl" />

      <div className="relative">
        <div className='flex justify-between items-center pt-[15px] md:pt-[30px] lg:pt-[30px] pb-[30px] md:pb-[20px] lg:pb-[30px] px-[30px] lg:px-[100px]'>
          {open && (
            <div
              className="fixed inset-0 bg-transparentbg-opacity-50 z-40"
              onClick={() => setOpen(false)}
            />
          )}
          <Link to="/">
            <img src={logo} alt='logo' className='w-[102px] h-[32px] cursor-pointer hover:filter hover:brightness-90 hover:saturate(0) hover:invert-[0.3] lg:w-[160px] lg:h-[58px]' />
          </Link>
          <div className='hidden sm:flex flex-row justify-end sm:w-3/3 items-end'>
            <ul className='text-[#002333] flex flex-row sm:text-[14px] md:text-[16px] lg:text-[16px] font-medium'>
              <li>
                <Link to="/" className='md:pr-[20px] hover:text-[#687276] lg:-pr[20px]'>
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className='md:pr-[20px] hover:text-[#687276] lg:-pr[20px]'>
                  {t('navigation.about')}
                </Link>
              </li>
              <li>
                <a href="/#services" className='md:pr-[20px] hover:text-[#687276] lg:-pr[20px]'>
                  {t('navigation.services')}
                </a>
              </li>
              <li>
                <Link to="/doctors" className='md:pr-[20px] hover:text-[#687276] lg:-pr[20px]'>
                  {t('navigation.doctors')}
                </Link>
              </li>
              <li>
                <Link to="/blogs" className='md:pr-[20px] hover:text-[#687276] lg:-pr[20px]'>
                  {t('navigation.blogs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className='md:pr-[20px] hover:text-[#687276] lg:-pr[20px]'>
                  {t('navigation.contact')}
                </Link>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className='w-[30px] h-[30px] md:hidden focus:outline-none'
          >
            <img src={menu} alt='menu' className='w-full h-full' />
          </button>
        </div>

        <div className="px-[30px] lg:px-[120px] pb-14 md:pb-18 lg:pb-22">
          <p className="inline-flex rounded-full border border-[#037B76]/25 bg-white/75 px-4 py-2 text-[12px] md:text-[13px] font-semibold tracking-[0.12em] text-[#037B76]">
            STAR HEALTH MEDICAL CENTRE
          </p>
          <h1 className="mt-4 max-w-4xl text-[30px] leading-[38px] md:text-[44px] md:leading-[56px] font-semibold text-[#002333]">
            Premium Family Healthcare Designed Around Your Everyday Life
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-[24px] md:text-[17px] md:leading-[28px] text-[#4f5f66]">
            Star Health combines trusted doctors, modern diagnostics, and patient-first service in one seamless experience. This page is structured with clear sections and keyword-rich content to support your SEO strategy for healthcare services in Riyadh.
          </p>
        </div>
      </div>

      <Menulist open={open} setOpen={setOpen} />
    </div>
  );
}

export default Header;
