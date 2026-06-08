import dr_aljazi from "../../assets/doctors/dr_aljazi.png"
import dr_hany from "../../assets/doctors/dr_hany.png"
import dr_tanaa from "../../assets/doctors/dr_thanaa.png"
import dr_asma from "../../assets/doctors/dr_asma.png"
import Button from '../web_button'
import DoctorsCard from '../doctors_card'
import { Link } from 'react-router-dom'
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
            <div className="flex flex-col items-center">
                <h1 className="text-[24px] lg:text-[44px] text-[#002333] font-medium font-inter leading-[32px] lg:leading-[54px]">{t('medicalTeam.title')}</h1>
                <p className="text-[14px] lg:text-[16px] text-[#687276] font-normal text-center w-full lg:w-3/5 leading-[22px] lg:leading-[24px] px-[30px] font-inter mt-4 sm:mt-[10px] mb-0 md:mb-0">
                    {t('medicalTeam.description')}</p>
            </div>
            <div className="w-full px-[30px] lg:px-[120px] pt-0 lg:pt-0">
                <div className="overflow-x-auto whitespace-nowrap py-8 md:grid grid-cols-4 md:gap-4 md:whitespace-normal scrollbar-hide">
                    {doctors.map((item, index) => (
                        <div key={index} className="inline-block w-[80%] sm:w-full sm:inline-flex mx-3 sm:mx-0">
                            <DoctorsCard imgs={item.imgDr} name={t(item.nameKey)} specialty={t(item.specialtyKey)} />
                        </div>
                    ))}
                </div>
            </div>
            <Link to='/doctors'>
                <Button text={t('medicalTeam.viewAll')} />
            </Link>
        </div>
    )
}
export default medTeam;