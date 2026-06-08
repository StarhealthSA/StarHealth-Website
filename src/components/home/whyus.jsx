import whyus from '../../assets/home/whyus.png'
import InsuranceSection from '../insurance_section'
import AboveInsuranceSection from '../above_insurance_section'
import { useTranslation } from 'react-i18next'

function WhyUs() {
    const { t } = useTranslation();

    const points = [
        {
            pointKey: "whyUs.points.patientFirst"
        },
        {
            pointKey: "whyUs.points.safetyAccountability"
        },
        {
            pointKey: "whyUs.points.cleanCalm"
        },
        {
            pointKey: "whyUs.points.simpleClear"
        },
        {
            pointKey: "whyUs.points.convenientLocation"
        },
        {
            pointKey: "whyUs.points.safetyAccountability2"
        }
    ]

    return (
        <div className="bg-[#063330] w-full overflow-x-hidden py-[50px] lg:py-[80px]">
            <AboveInsuranceSection
                img={whyus}
                heading={t('whyUs.heading')}
                paragraph={t('whyUs.paragraph')}
                points={points}
            />
            <InsuranceSection h2text={t('insurance.description')}/>
        </div>
    )
}

export default WhyUs;