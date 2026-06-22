'use client';

import whyuslogo from '../assets/home/whyuslogo.png'
import mark from '../assets/home/mark.svg'
import Button from './web_button'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

function AboveInsuranceSection(props){
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return(
            <div className={`flex flex-col ${isRTL ? 'md:flex-row' : 'md:flex-row-reverse'} py-[30px] items-center px-[30px] lg:px-[120px] relative`}>
                    <img
                        src={whyuslogo}
                        alt='whyuslogo'
                        className={`h-64 lg:h-120 w-[200px] lg:w-[350px] absolute ${isRTL ? 'left-[-20px] md:left-[-20px] lg:left-[-20px]' : 'right-[-20px] md:right-[-20px] lg:right-[-20px]'} top-[380px] md:top-[200px] lg:top-8`}
                    />
                    <div className={`mb-5 md:mb-0 ${isRTL ? 'md:mr-[20px]' : 'md:ml-[20px]'}`}>
                        <h1 className={`text-[24px] lg:text-[40px] w-full lg:w-5/6 ${isRTL ? 'text-start' : 'text-start'} font-medium text-white mb-4 sm:mb-5 leading-[32px] lg:leading-[52px] font-inter`}>
                            {props.heading}
                        </h1>
                        <p className="hidden md:block text-[14px] lg:text-[16px] leading-[22px] lg:leading-[24px] w-full lg:w-4/5 font-normal font-inter text-white mb-5">
                            {props.paragraph}
                        </p>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-1 md:gap-2 lg:gap-4 mb-10">
                            {props.points && props.points.map((point, index) => (
                                <div key={index} className="flex flex-row items-start">
                                    <img src={mark} alt="mark" className={`${isRTL ? 'ml-3' : 'mr-3'} mt-1 flex-shrink-0`} />
                                    <p className="text-[14px] lg:text-[16px] leading-[22px] lg:leading-[24px] font-normal font-inter text-start text-white">{t(point.pointKey)}</p>
                                </div>
                            ))}
                        </div>
                        <Link href={'/contact'}>
                        <Button text={t('safety.contactUs')}/>
                        </Link>
                    </div>

                    <img
                            src={props.img}
                            alt='imgs'
                            className={`lg:h-[520px] w-full md:w-1/2 lg:w-full ${isRTL ? 'lg:ml-4' : 'lg:mr-4'} object-cover object-top rounded-2xl`}
                        />
                </div>
    )
}

export default AboveInsuranceSection;