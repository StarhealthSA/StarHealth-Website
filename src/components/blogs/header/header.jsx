import logo from '../../../assets/doctors/logo1.svg'
import { Link } from 'react-router-dom';
import Menulist from '../../menulist/menu_list';
import menu from '../../../assets/doctors/secondmenu.svg'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function headerData() {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);



    return (

        <div>
            <div className='flex justify-between items-center pt-[15px] md:pt-[30px] lg:pt[30px] pb-[30px] md:pb-[20px] lg:pb-[30px] px-[30px] lg:px-[100px]'>
                {open && (
                    <div
                        className="fixed inset-0 bg-transparentbg-opacity-50 z-40"
                        onClick={() => setOpen(false)}
                    />
                )}
                <Link to="/">
                    <img src={logo} alt='logo' className='w-[102px] h-[32px] cursor-pointer hover:filter hover:brightness-90 hover:saturate(0) hover:invert-[0.3] lg:w-[160px] lg:h-[58px]'></img>
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
                            <Link to="/services" className='md:pr-[20px] hover:text-[#687276] lg:-pr[20px]'>
                                {t('navigation.services')}
                            </Link>
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
            <Menulist open={open} setOpen={setOpen} />
        </div>
    )
}

export default headerData;