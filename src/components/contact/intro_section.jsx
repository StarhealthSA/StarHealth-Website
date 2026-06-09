'use client';

import phone from '../../assets/contact/contactus_phone.svg'
import mail from '../../assets/contact/contactus_mail.svg'
import location from '../../assets/contact/contactus_location.svg'
import Reveal, { staggerDelay } from '../reveal';
import { useTranslation } from 'react-i18next';

function IntroSection() {
    const { t } = useTranslation();

    const options = [
        {
            icon: phone,
            title: t('contactPage.header.phoneTitle'),
            link: "tel:+966505730003",
            description: t('contactPage.header.phoneNumber')
        },
        {
            icon: mail,
            title: t('contactPage.header.emailTitle'),
            link: "mailto:contact@starhealth.sa",
            description: t('contactPage.header.email')
        },
        {
            icon: location,
            title: t('contactPage.header.locationTitle'),
            link: "https://maps.app.goo.gl/fNDUmeW3QMxax97x5?g_st=ipc",
            description: t('contactPage.header.location')
        }
    ]

    return (
        <section>
            <Reveal className="flex flex-col items-center px-[30px] lg:px-[120px]">
                <h1 className="text-[24px] lg:text-[44px] text-[#002333] font-medium font-inter leading-[32px] lg:leading-[56px]">{t('contactPage.header.title')}</h1>
                <p className="text-[14px] lg:text-[16px] text-[#687276] font-normal text-center w-full md:w-3/4 lg:w-3/6 leading-[22px] sm:leading-[24px] font-inter mt-2 sm:mt-4 mb-3 sm:mb-6">
                    {t('contactPage.header.description')}
                </p>
            </Reveal>
            <div className='flex flex-col items-start justify-center gap-6 px-[30px] md:mb-3 lg:mb-0 lg:flex-row lg:items-center lg:gap-10 lg:px-[120px]'>
                {options.map((items, index) => (
                    <Reveal delay={staggerDelay(index)} className='mb-5 mt-4 flex flex-row items-center justify-start lg:mb-10 lg:mt-10 lg:justify-center' key={index}>
                        <a href={items.link}>
                            <img src={items.icon} alt={items.title} className='w-[50px] h-[50px] flex-shrink-0' />
                        </a>
                        <div className='flex flex-col items-start mx-4'>
                            <h2 className='text-[14px] lg:text-[16px] font-inter font-normal text-[#687276]'>{items.title}</h2>
                            {items.link ? (
                                <a href={items.link}>
                                    <p className='text-[14px] lg:text-[16px] font-inter font-medium text-[#002333]'>{items.description}</p>
                                </a>
                            ) : (
                                <p className='text-[14px] lg:text-[16px] font-inter font-medium text-[#002333]' dir='ltr'>{items.description}</p>
                            )}
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    )
}

export default IntroSection;