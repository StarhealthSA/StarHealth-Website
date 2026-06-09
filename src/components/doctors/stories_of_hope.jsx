'use client';

import stars from '../../assets/home/stars.svg'
import cameron from '../../assets/home/cameron_williamson1.png'
import courtney from '../../assets/home/Courtney_Henry.png'
import kristin from '../../assets/home/Kristin_Watson.png'
import Reveal from '../reveal';
import { useTranslation } from 'react-i18next';

function storiesOfHope() {
    const { t } = useTranslation();

    const Patients = [
        {
            comment: t('doctorsPage.storiesOfHope.patients.kristin.comment'),
            imgSrc: kristin,
            name: t('doctorsPage.storiesOfHope.patients.kristin.name')
        },
        {
            comment: t('doctorsPage.storiesOfHope.patients.cameron.comment'),
            imgSrc: cameron,
            name: t('doctorsPage.storiesOfHope.patients.cameron.name')
        },
        {
            comment: t('doctorsPage.storiesOfHope.patients.courtney.comment'),
            imgSrc: courtney,
            name: t('doctorsPage.storiesOfHope.patients.courtney.name')
        },
        {
            comment: t('doctorsPage.storiesOfHope.patients.kristin.comment'),
            imgSrc: kristin,
            name: t('doctorsPage.storiesOfHope.patients.kristin.name')
        }
    ]

    return (
        <div className="bg-[#FFFFFF] hidden flex-col justify-start items-center py-[40px] lg:py-[80px]">
            <Reveal className="flex flex-col items-center px-[30px] sm:px-[120px]">
                <h1 className="text-[24px] lg:text-[44px] text-[#002333] font-medium font-inter text-center leading-[32px] lg:leading-[54px]">{t('doctorsPage.storiesOfHope.title')}</h1>
                <p className="text-[14px] lg:text-[16px] text-[#687276] font-weight-[400] text-center mb-5 lg:mb-10  w-full lg:w-3/5 leading-[24px] font-family-inter mt-4 ">
                    {t('doctorsPage.storiesOfHope.description')}</p>
            </Reveal>

            <div className={`marquee-container w-full overflow-hidden bg-transparent`}>
                <div className="marquee-wrapper flex">
                    <div
                        className="marquee-content flex animate-marqueeAbout"
                        style={{
                            width: "calc(100% * 5)",
                            animationDuration: "160s",
                        }}
                    >
                        {[
                            ...Patients,
                            ...Patients,
                            ...Patients,
                            ...Patients,
                            ...Patients,
                            ...Patients,
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 mx-4 flex flex-col h-[400px] w-[240px] justify-between items-center"
                            >
                                <img src={stars} alt='star' className='h-[14px] sm:h-[20px]'></img>
                                <p className='text-[14px] lg:text-[16px] text-[#687276] font-weight-[400] text-center leading-[22px] lg:leading-[24px] mt-6 font-family-inter'>{item.comment}</p>
                                <img src={item.imgSrc} alt='patients' className='h-[50px] lg:h-[50px] rounded-full mt-6 mb-3' />
                                <h1 className='font-weight-[500px] font-family-inter text-center text-[14px] lg:text-[16px] text-[#002333]'>{item.name}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default storiesOfHope;