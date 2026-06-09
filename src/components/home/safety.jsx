'use client';

import safety from '../../assets/home/safety.png'
import mark from '../../assets/home/mark.svg'
import Button from '../web_button'
import safetymobile from '../../assets/home/safety_mobile_view.png'
import Link from 'next/link'
import Reveal from '../reveal';
import { useTranslation } from 'react-i18next';

function Safety() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <div className={`flex w-full flex-col bg-white pt-[60px] md:items-center lg:py-0 lg:pt-[80px] lg:pr-[120px] ${isRTL ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            <Reveal className='flex w-full flex-col justify-start px-[30px] lg:px-[50px] lg:pb-[50px]'>
                <h2 className='text-[24px] lg:text-[44px] font-medium leading-[32px] lg:leading-[1.2] text-[#002333] mb-3 md:mb-2 lg:mb-4 font-inter'>
                    {t('safety.title')}
                </h2>

                <p className='hidden md:block text-[14px] lg:text-[16px] lg:w-3/3 font-normal font-inter leading-[22px] lg:leading-6 text-[#687276] mb-2 md:mb-1 lg:mb-4'>
                    {t('safety.description')}
                </p>

                <div className='flex flex-row items-center mb-2 lg:mb-4'>
                    <img src={mark} alt='checkmark' className={`${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0 w-4 h-4 lg:w-6 lg:h-[11px]`} />
                    <p className='text-[14px] lg:text-[16px] lg:w-3/3 font-normal font-inter leading-[22px] lg:leading-6 text-[#002333]'>
                        {t('safety.point1')}
                    </p>
                </div>
                <div className='border-b border-[#DAD8D7] w-full lg:w-full md:w-full lg:my-1'></div>

                <div className='flex flex-row items-center my-3 lg:mb-4'>
                    <img src={mark} alt='checkmark' className={`${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0 w-4 h-4 lg:w-6 lg:h-[11px]`} />
                    <p className='text-[14px] lg:text-[16px] lg:w-3/6 font-normal font-inter leading-[22px] lg:leading-6 text-[#002333]'>
                        {t('safety.point2')}
                    </p>
                </div>
                <div className='border-b border-[#DAD8D7] w-full md:w-full lg:my-1'></div>

                <div className='flex flex-row items-center my-3 md:mb-5 lg:mb-10'>
                    <img src={mark} alt='checkmark' className={`${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0 w-4 h-4 lg:w-6 lg:h-[11px]`} />
                    <p className='text-[14px] lg:text-[16px] lg:w-3/5 font-normal font-inter leading-[22px] lg:leading-6 text-[#002333]'>
                        {t('safety.point3')}
                    </p>
                </div>
                <Link href={'/contact'}>
                <div className="w-full lg:w-auto mb-5 md:mb-7 lg:mb-0">
                    <Button text={t('safety.contactUs')} />
                </div>
                </Link>
            </Reveal>
            <Reveal delay={120} className="w-full md:w-1/2 lg:w-[50%]">
            <img
                src={safety}
                alt='safety'
                className='hidden md:block md:w-full md:pr-[3px] lg:pr-0 md:h-1/1'/>

            <img src={safetymobile} alt='safety mobile view' className='block h-fit w-full object-fit md:hidden'/>
            </Reveal>
        </div>
    );
}

export default Safety;