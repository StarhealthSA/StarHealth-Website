'use client';

import InsuranceSection from '../insurance_section'
import AboveInsuranceSection from '../above_insurance_section';
import img from '../../assets/doctors/priority.png'
import { useTranslation } from 'react-i18next';

function priorities() {
    const { t } = useTranslation();

    const points = [
        { pointKey: t('doctorsPage.priorities.points.advancedTechnology') },
        { pointKey: t('doctorsPage.priorities.points.trustedReputation') },
        { pointKey: t('doctorsPage.priorities.points.compassionateCare') },
        { pointKey: t('doctorsPage.priorities.points.focusOnOutcomes') },
        { pointKey: t('doctorsPage.priorities.points.convenientLocation') },
        { pointKey: t('doctorsPage.priorities.points.qualityFocus') }
    ];

    return (
        <div className=" bg-[#063330] w-full overflow-x-hidden py-[40px] sm:py-[60px]">
            <AboveInsuranceSection
                img={img}
                heading={t('doctorsPage.priorities.heading')}
                paragraph={t('doctorsPage.priorities.paragraph')}
                points={points}
            />
            <InsuranceSection h2text={t('doctorsPage.priorities.callText')}/>
        </div>
    )
}
export default priorities;