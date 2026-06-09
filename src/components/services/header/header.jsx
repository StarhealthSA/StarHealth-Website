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
    <div className="relative overflow-hidden bg-[#062d2d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(174,213,198,0.18),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(3,123,118,0.35),transparent_40%)]" />

      <div className="relative">
        <div className='flex justify-between items-center pt-[15px] md:pt-[30px] lg:pt-[30px] pb-[30px] md:pb-[20px] lg:pb-[30px] px-[30px] lg:px-[100px]'>
          {open && (
            <div
              className="fixed inset-0 bg-transparentbg-opacity-50 z-40"
              onClick={() => setOpen(false)}
            />
          )}
          <Link to="/">
            <img src={logo} alt='logo' className='w-[102px] h-[32px] cursor-pointer hover:opacity-85 lg:w-[160px] lg:h-[58px]' />
          </Link>
          <div className='hidden sm:flex flex-row justify-end sm:w-3/3 items-end'>
            <ul className='text-white flex flex-row sm:text-[14px] md:text-[16px] lg:text-[16px] font-medium'>
              <li>
                <Link to="/" className='md:pr-[20px] hover:text-[#d6f0e7] lg:-pr[20px]'>
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className='md:pr-[20px] hover:text-[#d6f0e7] lg:-pr[20px]'>
                  {t('navigation.about')}
                </Link>
              </li>
              <li>
                <Link to="/services" className='md:pr-[20px] hover:text-[#d6f0e7] lg:-pr[20px]'>
                  {t('navigation.services')}
                </Link>
              </li>
              <li>
                <Link to="/doctors" className='md:pr-[20px] hover:text-[#d6f0e7] lg:-pr[20px]'>
                  {t('navigation.doctors')}
                </Link>
              </li>
              <li>
                <Link to="/blogs" className='md:pr-[20px] hover:text-[#d6f0e7] lg:-pr[20px]'>
                  {t('navigation.blogs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className='md:pr-[20px] hover:text-[#d6f0e7] lg:-pr[20px]'>
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

        <div className="px-[30px] lg:px-[120px] pb-16 md:pb-20 lg:pb-24">
          <p className="inline-flex rounded-full border border-[#8ec8b5] bg-white/10 px-4 py-2 text-[12px] md:text-[13px] font-semibold tracking-[0.12em] text-[#d4eee4]">
            STAR HEALTH SERVICES
          </p>
          <h1 className="mt-5 max-w-4xl text-[30px] leading-[38px] md:text-[48px] md:leading-[58px] font-semibold">
            Comprehensive Medical Services for Modern Families in Riyadh
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-[24px] md:text-[17px] md:leading-[28px] text-[#c9e2d9]">
            Explore premium outpatient services designed around speed, safety, and continuity of care. This SEO-focused services page helps users and search engines understand your treatment scope, specialties, and patient outcomes.
          </p>
        </div>
      </div>

      <Menulist open={open} setOpen={setOpen} />
    </div>
  );
}

export default Header;
