'use client';

import { useState } from 'react';
import generalmedicine from '../../assets/home/general_medicine.svg';
import ortho from "../../assets/home/ortho.svg";
import obg from '../../assets/home/obg.svg';
import generaldentistry from '../../assets/home/generaldentistry.svg';
import internalmedicine from '../../assets/home/internalmedicine.svg';
import familyMedicine from '../../assets/home/familymedicine.svg';
import laboratory from '../../assets/home/laboratory.svg';
import pediatrics from '../../assets/home/pediatric.svg';
import Button from '../web_button'
import Servicescard from '../services_card'
import Link from 'next/link';
import downarrow from '../../assets/home/downarrow.svg';
import Reveal, { staggerDelay } from '../reveal';
import { useTranslation } from 'react-i18next';

const SpecializedServices = () => {
    const { t } = useTranslation();
    const [showAll, setShowAll] = useState(false);

    const services = [
        {
            imgSrc: generalmedicine,
            titleKey: 'services.service.generalMedicine.title',
            descriptionKey: 'services.service.generalMedicine.description'
        },
        {
            imgSrc: familyMedicine,
            titleKey: "services.service.familyMedicine.title",
            descriptionKey: 'services.service.familyMedicine.description'
        },
        {
            imgSrc: internalmedicine,
            titleKey: 'services.service.internalMedicine.title',
            descriptionKey: 'services.service.internalMedicine.description'
        },
        {
            imgSrc: obg,
            titleKey: 'services.service.obg.title',
            descriptionKey: 'services.service.obg.description'
        },
        {
            imgSrc: ortho,
            titleKey: "services.service.ortho.title",
            descriptionKey: 'services.service.ortho.description'
        },
        {
            imgSrc: generaldentistry,
            titleKey: 'services.service.generalDentistry.title',
            descriptionKey: 'services.service.generalDentistry.description'
        },
        {
            imgSrc: laboratory,
            titleKey: 'services.service.laboratory.title',
            descriptionKey: 'services.service.laboratory.description'
        },
        {
            imgSrc: pediatrics,
            titleKey: 'services.service.pediatrics.title',
            descriptionKey: 'services.service.pediatrics.description'
        }
    ];

    const displayedServices = showAll ? services : services.slice(0, 4);

    return (
        <div className="bg-[#E9E7E6] flex flex-col justify-start items-center px-[30px] md:px-[10px] py-[50px] lg:py-[80px]">
            <Reveal className="flex flex-col items-center">
                <h1 className="w-full text-center font-inter text-[24px] font-medium leading-[32px] text-[#002333] lg:text-[44px] lg:leading-[56px]">
                    {t('services.title')}
                </h1>
                <p className="mt-[5px] hidden w-full text-center font-inter text-[14px] font-normal leading-[20px] text-[#687276] md:block md:w-3/4 lg:mt-[20px] lg:w-3/5 lg:text-[16px]">
                    {t('services.description')}
                </p>
            </Reveal>

            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 w-full pb-[20px] pt-[30px] mb-5 lg:px-[120px]">
                {services.map((item, index) => (
                    <Servicescard
                        images={item.imgSrc}
                        title={t(item.titleKey)}
                        description={t(item.descriptionKey)}
                        link="/services"
                        revealDelay={staggerDelay(index)}
                        key={index}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:hidden md:grid-cols-4 gap-4 w-full pb-[20px] mb-5 pt-[30px]">
                {displayedServices.map((item, index) => (
                    <Servicescard
                        images={item.imgSrc}
                        title={t(item.titleKey)}
                        description={t(item.descriptionKey)}
                        link="/services"
                        revealDelay={staggerDelay(index)}
                        key={index}
                    />
                ))}
            </div>
            {!showAll && (
                <button
                    onClick={() => setShowAll(true)}
                    className="md:hidden mb-[20px] px-4 py-2 border border-[#037B76] rounded-md transition-colors hover:bg-[#037B76] hover:text-white"
                >
                    <div className='flex flex-row items-center'>
                        <p className="text-[14px] leading-[22px] font-inter">{t('services.showMore')}</p>
                        <img src={downarrow} alt='arrow' className='h-[15px] w-[25px]' />
                    </div>
                </button>
            )}
            {showAll && (
                <Link href={'/contact'}>
                    <Button text={t('services.contactUs')} />
                </Link>
            )}
            <Link href={'/contact'} className='hidden md:block'>
                <Button text={t('services.contactUs')} />
            </Link>
        </div>
    );
}

export default SpecializedServices;