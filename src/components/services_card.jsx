'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

function servicescard(props) {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const card = (
            <div className="flex flex-row md:flex-col justify-start bg-[#FFFFFF] border-[1px] border-[#E9E7E6] rounded-[12px] p-[30px] md:min-h-75 lg:min-h-80 mb-0 transition-shadow duration-300 hover:shadow-lg">
                <img src={props.images} alt='icon' className={`w-[50px] h-[50px] lg:h-[60px] lg:w-[60px] ${isRTL ? 'pl-[10px]' : 'pr-[10px]'} md:pr-0 md:pl-0`} />
                <div>
                    <h1 className='font-medium text-[16px] lg:text-[20px] text-[#002333] font-inter mt-1 lg:mt-2'>{props.title}</h1>
                    <p className='font-normal text-[14px] lg:text-[16px] text-[#687276] font-inter mt-2'>{props.description}</p>
                </div>
            </div>
    );

    if (props.link) {
        return (
            <Link href={props.link} className="block">
                {card}
            </Link>
        );
    }

    return <div>{card}</div>;
}

export default servicescard;