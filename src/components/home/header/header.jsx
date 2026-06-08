import HeaderForm from './header_form';
import logo from '../../../assets/home/logo.svg';
import Button from '../../web_button';
import menu from '../../../assets/home/menu.svg';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Menulist from '../../menulist/menu_list';
import { useTranslation } from 'react-i18next';

function Header() {

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className='home-header h-[70vh] sm:h-fit lg:h-screen bground flex flex-col w-full bg-cover relative'>

      {open && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div className='flex justify-between items-center pt-[15px] md:pt-[30px] lg:pt-[30px] pb-[30px] px-[30px] md:px-[30px] lg:px-[100px]'>
        <Link to="/">
          <img
            src={logo}
            alt='logo'
            className='w-[102px] h-[32px] cursor-pointer hover:opacity-80 transition-opacity duration-200 lg:w-[160px] lg:h-[58px]'
          />
        </Link>

        <div className='hidden md:flex flex-row justify-end items-center'>
          <ul className='text-white flex flex-row md:text-[14px] lg:text-[16px] font-medium font-inter'>
            <li className='md:pr-[20px] lg:pr-[20px]'>
              <Link to="/" className='hover:text-[#FFFFFF99] transition-colors duration-200'>
                {t('navigation.home')}
              </Link>
            </li>
            <li className='md:pr-[20px] lg:pr-[20px]'>
              <a href="/#about" className='hover:text-[#FFFFFF99] transition-colors duration-200'>
                {t('navigation.about')}
              </a>
            </li>
            <li className='md:pr-[20px] lg:pr-[20px]'>
              <a href="/#services" className='hover:text-[#FFFFFF99] transition-colors duration-200'>
                {t('navigation.services')}
              </a>
            </li>
            <li className='md:pr-[20px] lg:pr-[20px]'>
              <Link to="/doctors" className='hover:text-[#FFFFFF99] transition-colors duration-200'>
                {t('navigation.doctors')}
              </Link>
            </li>
            <li className='md:pr-[20px] lg:pr-[20px]'>
              <Link to="/blogs" className='hover:text-[#FFFFFF99] transition-colors duration-200'>
                {t('navigation.blogs')}
              </Link>
            </li>
            <li className='md:pr-[15px] lg:pr-[15px]'>
              <Link to="/contact" className='hover:text-[#FFFFFF99] transition-colors duration-200'>
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

      <div className='border-b border-[#FFFFFF33] w-full sm:hidden'></div>

      <div className='flex flex-col sm:flex-row w-full mt-5 md:mt-0 justify-between items-center px-[30px] lg:px-[100px]'>
        <div className='flex flex-col w-full sm:w-2/3 justify-evenly mb-20 sm:mb-20 mt-6 sm:mt-0'>
          <div className='mt-[30px] sm:mt-[30px]'>
            <p className='md:hidden text-white text-[32px] lg:text-[64px] font-medium leading-[40px] font-nudica lg:leading-[72px] mb-4 lg:mb-[19px] w-full lg:w-3/4'>
              {t('hero.title')}
            </p>
            <p className='hidden md:block text-white text-[32px] lg:text-[64px] font-medium leading-[40px] font-nudica lg:leading-[72px] mb-4 lg:mb-[19px] w-full lg:w-3/4'>
              {t('hero.title')}
            </p>
            <p className='text-white text-[16px] lg:text-[23px] font-normal mb-5 lg:mb-6 w-full lg:w-3/4 leading-[24px] lg:leading-[28px]'>
              {t('hero.subtitle')}
            </p>
            <a href='/#services'>
              <Button text={t('hero.cta')} />
            </a>
          </div>
        </div>
        <div className='hidden sm:block'>
          <HeaderForm />
        </div>
      </div>

      <Menulist open={open} setOpen={setOpen} />
    </div>
  );
}

export default Header;