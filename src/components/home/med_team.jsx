'use client';

import dr_aljazi from "../../assets/doctors/dr_aljazi.png"
import dr_hany from "../../assets/doctors/dr_hany.png"
import dr_tanaa from "../../assets/doctors/dr_thanaa.png"
import dr_asma from "../../assets/doctors/dr_asma.png"
import Button from '../web_button'
import DoctorsCard from '../doctors_card'
import Link from 'next/link'
import Reveal, { staggerDelay } from '../reveal';
import { useTranslation } from 'react-i18next'


function medTeam() {
    const { t } = useTranslation();

    const doctors = [
        {
            imgDr: dr_aljazi,
            nameKey: "Dr. Aljazi Al-Baqmi",
            specialtyKey: "Dentist, 2 years of experience",
        },
        {
            imgDr: dr_hany,
            nameKey: "Dr. Hany Mostafa",
            specialtyKey: "General Practitioner, 10 years of experience"
        },
        {
            imgDr: dr_tanaa,
            nameKey: "Dr. Thanaa Shehab Al-Din",
            specialtyKey: "Obstetrics & Gynecology Specialist, 15 years of experience"
        },
        {
            imgDr: dr_asma,
            nameKey: "Dr. Asmaa Shawqi",
            specialtyKey: "Family Medicine Specialist, 10 years of experience",
        },
    ]
    return (
        <div className="bg-[#FFFFFF] flex flex-col justify-start items-center py-[60px] lg:py-[80px]">
            <Reveal className="flex flex-col items-center">
                <h1 className="font-inter text-[24px] font-medium leading-[32px] text-[#002333] lg:text-[44px] lg:leading-[54px]">{t('medicalTeam.title')}</h1>
                <p className="mb-0 mt-4 w-full px-[30px] text-center font-inter text-[14px] font-normal leading-[22px] text-[#687276] sm:mt-[10px] md:mb-0 lg:w-3/5 lg:text-[16px] lg:leading-[24px]">
                    {t('medicalTeam.description')}</p>
            </Reveal>
            <div className="w-full px-[30px] lg:px-[120px] pt-0 lg:pt-0">
                <div className="overflow-x-auto whitespace-nowrap py-8 md:grid grid-cols-4 md:gap-4 md:whitespace-normal scrollbar-hide">
                    {doctors.map((item, index) => (
                        <div key={index} className="inline-block w-[80%] sm:w-full sm:inline-flex mx-3 sm:mx-0">
                            <DoctorsCard imgs={item.imgDr} name={t(item.nameKey)} specialty={t(item.specialtyKey)} revealDelay={staggerDelay(index)} />
                        </div>
                    ))}
                </div>
            </div>
            <Link href='/doctors'>
                <Button text={t('medicalTeam.viewAll')} />
            </Link>
        </div>
    )
}
export default medTeam;