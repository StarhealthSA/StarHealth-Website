'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Reveal from './reveal';

function servicescard(props) {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const card = (
        <Reveal delay={props.revealDelay ?? 0} className="h-full">
            <div className="flex h-full flex-row justify-start rounded-[12px] border-[1px] border-[#E9E7E6] bg-[#FFFFFF] p-[30px] transition-shadow duration-300 hover:shadow-lg md:min-h-75 md:flex-col lg:min-h-80">
                <img src={props.images} alt='icon' className={`h-[50px] w-[50px] lg:h-[60px] lg:w-[60px] ${isRTL ? 'pl-[10px]' : 'pr-[10px]'} md:pl-0 md:pr-0`} />
                <div>
                    <h1 className='mt-1 font-inter text-[16px] font-medium text-[#002333] lg:mt-2 lg:text-[20px]'>{props.title}</h1>
                    <p className='mt-2 font-inter text-[14px] font-normal text-[#687276] lg:text-[16px]'>{props.description}</p>
                </div>
            </div>
        </Reveal>
    );

    if (props.link) {
        return (
            <Link href={props.link} className="block h-full">
                {card}
            </Link>
        );
    }

    return card;
}

export default servicescard;
