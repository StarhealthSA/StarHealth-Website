'use client';

import bigbrand from '../assets/home/bigbrand.png'
import anchor from '../assets/home/anchor.png'
import airtel from '../assets/home/Airtel.png'
import advancly from '../assets/home/advancly.png'
import aerobotics from '../assets/home/aerobotics.png'
import { useTranslation } from 'react-i18next'

function insuranceSection(props) {
    const { t } = useTranslation();

    const BrandsImages = [
        bigbrand,
        anchor,
        airtel,
        advancly,
        aerobotics,
    ]

    return (
        <div className="hidden">
            <div className="border-b border-[#FFFFFF33] w-full my-10 lg:my-20"></div>

            <div className="flex flex-col justify-start items-center px-[30px] lg:px-[120px]">
                <h1 className="text-[24px] lg:text-[44px] leading-[32px] lg:leading-[56px] font-medium text-white text-center font-inter">
                    {t('insurance.title')}
                </h1>
                <h2 className="text-[14px] lg:text-[16px] px-[30px] lg:px-[120px] leading-[22px] lg:leading-[24px] font-normal text-white mt-2 lg:mt-4 mb-20 lg:mb-20 text-center font-inter">
                    {props.h2text}
                </h2>
            </div>


            <div className="marquee-container w-full mb-5 sm:mb-10 overflow-hidden bg-transparent">
                <div className="marquee-wrapper flex">
                    <div
                        className="marquee-content flex animate-marqueeAbout"
                        style={{
                            width: "calc(100% * 5)",
                            animationDuration: "120s",
                        }}
                    >
                        {[
                            ...BrandsImages,
                            ...BrandsImages,
                            ...BrandsImages,
                            ...BrandsImages,
                            ...BrandsImages,
                            ...BrandsImages,
                            ...BrandsImages,
                        ].map((image, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 mx-5 sm:mx-10 flex justify-center items-center"
                            >
                                <img
                                    src={image}
                                    alt={`Brand ${(index % BrandsImages.length) + 2}`}
                                    className="h-8 w-auto"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default insuranceSection;