import dr_aljazi from "../../../assets/doctors/dr_aljazi.png"
import dr_hany from "../../../assets/doctors/dr_hany.png"
import dr_tanaa from "../../../assets/doctors/dr_thanaa.png"
import dr_asma from "../../../assets/doctors/dr_asma.png"
import dr_haifa from "../../../assets/doctors/dr_haifa.png"
import dr_waad from "../../../assets/doctors/dr_waad.png"
import Headerdata from '../header/header_data'
import DoctorsCard from '../../doctors_card'
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

function header() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const [selectedService, setSelectedService] = useState('all');

    const services = [
        { service: t('doctorsPage.services.all'), value: 'all' },
        { service: t('doctorsPage.services.generalMedicine'), value: 'generalMedicine' },
        { service: t('doctorsPage.services.paediatrics'), value: 'paediatrics' },
        // { service: t('doctorsPage.services.orthopaedics'), value: 'orthopaedics' },
        // { service: t('doctorsPage.services.internalMedicine'), value: 'internalMedicine' },
        { service: t('doctorsPage.services.dentistry'), value: 'dentistry' },
        // { service: t('doctorsPage.services.dermatology'), value: 'dermatology' },
        // { service: t('doctorsPage.services.cosmetology'), value: 'cosmetology' },
        // { service: t('doctorsPage.services.cardiology'), value: 'cardiology' }
    ]

    const handleServiceClick = (serviceValue) => {
        setSelectedService(serviceValue);
        console.log('Selected service:', serviceValue);
    };


    const doctors = [
        {
            imgDr: dr_aljazi,
            name: "Dr. Aljazi Al-Baqmi",
            specialty: "Dentist, 2 years of experience",
            category: 'dentistry'
        },
        {
            imgDr: dr_hany,
            name: "Dr. Hany Mostafa",
            specialty: "General Practitioner, 10 years of experience",
            category: 'generalMedicine'
        },
        {
            imgDr: dr_tanaa,
            name: "Dr. Thanaa Shehab Al-Din",
            specialty: "Obstetrics & Gynecology Specialist, 15 years of experience",
            category: 'generalMedicine'
        },
        {
            imgDr: dr_asma,
            name: "Dr. Asmaa Shawqi",
            specialty: "Family Medicine Specialist, 10 years of experience",
            category: 'generalMedicine'
        },
        {
            imgDr: dr_haifa,
            name: "Dr. Haifa Ali Khalid ",
            specialty: "Pediatrician, 30 years of experience",
            category: 'paediatrics'
        },
        {
            imgDr: dr_waad,
            name: "Dr. Waad Al-Sayed",
            specialty: "Dentist, 5 years of experience",
            category: 'dentistry'
        },
    ]

    const filteredDoctors = selectedService === 'all'
        ? doctors
        : doctors.filter(doctor => doctor.category === selectedService);

    return (
        <div className="bg-[#FFFFFF] w-full">
            <Headerdata />
            <div className={`w-full px-[30px] ${isRTL ? 'lg:pr-[120px]' : 'lg:pl-[120px]'} pt-[5px] lg:pt-[20px]`}>
                <div className="overflow-x-auto space-x-3 lg:space-x-5 py-4 md:py-0 lg:ml-2.5 flex flex-row sm:whitespace-normal scrollbar-hide">
                    {services.map((item, index) => (
                        <button
                            onClick={() => handleServiceClick(item.value)}
                            className={`${selectedService === item.value
                                ? 'bg-gradient-to-tl from-[#037B76] to-[#AED5C6] text-[#FFFFFF]'
                                : 'border-[#DAD8D7] border-[1px] text-[#687276] hover:bg-gray-50'
                                } whitespace-nowrap font-inter text-[14px] lg:text-[16px] font-weight-[400px] w-fit px-4 py-2 rounded-[8px] transition-all`}
                            key={index}
                        >
                            {item.service}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 md:mt-0 pb-[30px] pt-[25px] px-[20px] md:px-[60px] lg:px-[120px]">
                {filteredDoctors.map((item, index) => (
                    <DoctorsCard imgs={item.imgDr} name={item.name} specialty={item.specialty} key={index} />
                ))}
            </div>
        </div>
    )
}

export default header;  