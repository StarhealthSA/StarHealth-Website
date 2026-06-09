'use client';

import stars from '../../assets/home/stars.svg'
import avatar from '../../assets/home/avatar.svg'
import { useTranslation } from 'react-i18next'
import google from '../../assets/home/google.svg'

function Testimonials() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const Patients = [
        { commentKey: 'testimonials.patients.nadia.comment', imgSrc: avatar, nameKey: "testimonials.patients.nadia.name" },
        { commentKey: 'testimonials.patients.subi.comment', imgSrc: avatar, nameKey: "testimonials.patients.subi.name" },
        { commentKey: 'testimonials.patients.maria.comment', imgSrc: avatar, nameKey: "testimonials.patients.maria.name" },
        { commentKey: 'testimonials.patients.rajesh.comment', imgSrc: avatar, nameKey: "testimonials.patients.rajesh.name" },
        { commentKey: 'testimonials.patients.muntasr.comment', imgSrc: avatar, nameKey: "testimonials.patients.muntasr.name" },
        { commentKey: 'testimonials.patients.amar.comment', imgSrc: avatar, nameKey: "testimonials.patients.amar.name" }
    ]

    const loopedPatients = [...Patients, ...Patients];

    return (
        <div className='bg-[#FFFFFF] flex-col justify-start items-center py-[60px] lg:py-[80px]'>
            <div className="flex flex-col items-center mb-[35px]">
                <h1 className="text-[24px] lg:text-[44px] text-[#002333] font-medium font-inter leading-[32px] lg:leading-[54px]">
                    {t('testimonials.title')}
                </h1>
                <p className="text-[14px] lg:text-[16px] text-[#687276] font-normal text-center w-full lg:w-3/5 leading-[22px] lg:leading-[24px] px-[25px] font-inter mt-4 lg:mt-[10px]">
                    {t('testimonials.description')}
                </p>
            </div>

            <div
                className="w-full overflow-hidden"
                style={isRTL ? { transform: 'scaleX(-1)' } : {}}
            >
                <div
                    dir="ltr"
                    className="flex animate-marqueeAbout"
                    style={{ animationDuration: "30s" }}
                >
                    {loopedPatients.map((item, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 mx-4 flex flex-col min-h-[300px] w-[330px] border border-[#DAD8D7] p-5 rounded-[16px] justify-start items-start"
                            style={isRTL ? { transform: 'scaleX(-1)' } : {}}
                        >
                            <div className='flex flex-row items-center justify-between w-full mb-4'>
                                <div className='flex flex-row items-center'>
                                    <img src={item.imgSrc} alt='patient' className='h-[50px] rounded-full mr-3' />
                                    <h1 className='font-medium font-inter text-[14px] sm:text-[16px] text-[#002333]'>
                                        {t(item.nameKey)}
                                    </h1>
                                </div>
                                <img src={google} alt='google' className='h-[24px] w-[24px]' />
                            </div>
                            <img src={stars} alt='stars' className='h-[24px] w-[135px] mb-3' />
                            <p className='text-[14px] sm:text-[16px] text-[#687276] font-normal leading-[22px] sm:leading-[24px] font-inter line-clamp-6'>
                                {t(item.commentKey)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Testimonials;