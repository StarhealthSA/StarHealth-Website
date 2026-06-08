import phone from '../../../assets/contact/contactus_phone.svg'
import mail from '../../../assets/contact/contactus_mail.svg'
import location from '../../../assets/contact/contactus_location.svg'
import { useTranslation } from 'react-i18next';

function HeaderData() {
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
        <div>
            <div className="flex flex-col px-[30px] lg:px-[120px] items-center">
                <h1 className="text-[24px] lg:text-[44px] text-[#002333] font-medium font-inter leading-[32px] lg:leading-[56px]">{t('contactPage.header.title')}</h1>
                <p className="text-[14px] lg:text-[16px] text-[#687276] font-normal text-center w-full md:w-3/4 lg:w-3/6 leading-[22px] sm:leading-[24px] font-inter mt-2 sm:mt-4 mb-3 sm:mb-6">
                    {t('contactPage.header.description')}
                </p>
            </div>
            <div className='flex flex-col lg:flex-row px-[30px] lg:px-[120px] md:mb-3 lg:mb-0 justify-center items-start lg:items-center gap-6 lg:gap-10'>
                {options.map((items, index) => (
                    <div className='flex flex-row justify-start lg:justify-center mt-4 lg:mt-10 items-center mb-5 lg:mb-10' key={index}>
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
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HeaderData;