'use client';

import InsuranceSection from '../insurance_section'
import AboveInsuranceSection from '../above_insurance_section';
import img from '../../assets/doctors/priority.png'
import Reveal from '../reveal';
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
        <div className=" w-full overflow-x-hidden bg-[#063330] py-[40px] sm:py-[60px]">
            <Reveal>
            <AboveInsuranceSection
                img={img}
                heading={t('doctorsPage.priorities.heading')}
                paragraph={t('doctorsPage.priorities.paragraph')}
                points={points}
            />
            <InsuranceSection h2text={t('doctorsPage.priorities.callText')}/>
            </Reveal>
        </div>
    )
}
export default priorities;