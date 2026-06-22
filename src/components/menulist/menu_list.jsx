'use client';

import NavLink from '@/components/nav_link';
import { HEADER_NAV_LINKS } from '@/constants/nav_routes';
import { useEffect } from 'react';
import logo from '../../assets/home/logo.svg';
import cancel from '../../assets/home/cancel.svg';
import instagram from '../../assets/home/instagram.svg';
import facebook from '../../assets/home/facebook.svg';
import whatsapp from '../../assets/home/whatsapp.svg';
import x from '../../assets/home/x.svg';
import phone from '../../assets/home/phone.svg';
import mail from '../../assets/home/mail.svg';
import biglogo from '../../assets/home/whyuslogo.png';
import { useTranslation } from 'react-i18next';

function Menulist({ open, setOpen }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        if (open) {
            setOpen(false);
        }
    }, [i18n.language]);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLang;
        setOpen(false);
    };

    return (
        <div className={`
            fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} z-50 w-full
            transform ${open ? 'translate-x-0' : (isRTL ? '-translate-x-full' : 'translate-x-full')}
            transition-transform duration-300 ease-in-out bg-[#063330] h-screen overflow-y-auto`}>

            <div className='flex justify-between items-center pt-[30px] sm:pt-[60px] pb-[30px] sm:pb-[60px] px-[30px] sm:px-[115px]'>
                <NavLink href="/" onClick={() => setOpen(false)}>
                    <img src={logo} alt='logo' className='w-[102px] h-[32px] sm:w-[192px] sm:h-[58px] cursor-pointer hover:opacity-80' />
                </NavLink>
                <button
                    onClick={() => setOpen(false)}
                    className='hover:opacity-80 transition-opacity duration-200'
                    aria-label='Close menu'
                >
                    <img src={cancel} alt='close menu' className='w-[30px] h-[30px] mt-0.9' />
                </button>
            </div>

            <img src={biglogo} alt='biglogo' className={`h-[280px] w-[180px] absolute ${isRTL ? 'left-[-15px]' : 'right-[-15px]'} top-45 opacity-50`} />
            <div className='border-b border-[#FFFFFF33] w-full sm:hidden'></div>

            <ul className='text-white flex flex-col text-[16px] font-medium px-[30px] py-[10px]'>
                {HEADER_NAV_LINKS.map((link) => (
                    <li key={link.href} className='mb-[30px]'>
                        <NavLink
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className='transition-colors hover:text-[#FFFFFF99]'
                            activeClassName='font-semibold text-[#AED5C6]'
                        >
                            {t(link.labelKey)}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* Language Toggle Button */}
            <div className='px-[30px] pb-[15px]'>
                <button
                    onClick={toggleLanguage}
                    className='bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded text-[14px] font-inter font-medium transition-all duration-200 w-fit'
                    aria-label='Toggle Language'
                >
                    {i18n.language === 'en' ? 'العربية' : 'English'}
                </button>
            </div>

            <div className='flex flex-row justify-between w-2/4 items-start px-[30px] pt-[30px] pb-[20px]'>
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='transition-opacity duration-200 hover:opacity-70'
                >
                    <img src={instagram} alt='instagram' className='w-[18px] h-[18px]' />
                </a>
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='transition-opacity duration-200 hover:opacity-70'
                >
                    <img src={facebook} alt='facebook' className='w-[18px] h-[18px]' />
                </a>
                <a
                    href="https://wa.me/+966505730003"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='transition-opacity duration-200 hover:opacity-70'
                >
                    <img src={whatsapp} alt='whatsapp' className='w-[18px] h-[18px]' />
                </a>
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='transition-opacity duration-200 hover:opacity-70'
                >
                    <img src={x} alt='twitter' className='w-[18px] h-[18px]' />
                </a>
            </div>

            <div className='flex flex-col items-start px-[30px] py-[10px]'>
                <h1 className='text-sm lg:text-base text-[#FFFFFFCC] mb-2'>For Appointments</h1>
                <div className='flex items-center group'>
                    <img src={phone} alt='phone' className={`w-[18px] h-[18px] ${isRTL ? 'ml-2' : 'mr-2'} group-hover:opacity-60`} />
                    <a
                        href="tel:+966505730003"
                        className='text-white text-[14px] font-medium font-inter group-hover:text-[#FFFFFF99] transition-colors duration-200'
                    >
                        +966 505 730 003
                    </a>
                </div>
            </div>
            <div className='flex flex-col items-start px-[30px] py-[10px]'>
                <h1 className='text-sm lg:text-base text-[#FFFFFFCC] mb-2'>For Lab Results</h1>
                <div className='flex items-center group'>
                    <img src={mail} alt='mail' className={`w-[18px] h-[18px] ${isRTL ? 'ml-2' : 'mr-2'} group-hover:opacity-60`} />
                    <a
                        href="mailto:labs@starhealth.sa"
                        className='text-white text-[14px] font-medium font-inter group-hover:text-[#FFFFFF99] transition-colors duration-200'
                    >
                        labs@starhealth.sa
                    </a>
                </div>
            </div>
            <div className='flex flex-col items-start px-[30px] py-[10px]'>
                <h1 className='text-sm lg:text-base text-[#FFFFFFCC] mb-2'>For Job Enquiries</h1>
                <div className='flex items-center group'>
                    <img src={mail} alt='mail' className={`w-[18px] h-[18px] ${isRTL ? 'ml-2' : 'mr-2'} group-hover:opacity-60`} />
                    <a
                        href="mailto:contact@starhealth.sa"
                        className='text-white text-[14px] font-medium font-inter group-hover:text-[#FFFFFF99] transition-colors duration-200'
                    >
                        contact@starhealth.sa
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Menulist;