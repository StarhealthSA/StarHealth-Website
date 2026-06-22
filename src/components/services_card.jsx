'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Reveal from './reveal';

function servicescard(props) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const card = (
    <Reveal delay={props.revealDelay ?? 0} className="h-full">
      <div className="flex h-full flex-col rounded-2xl border border-[#E9E7E6] bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg md:min-h-75 md:p-[30px] lg:min-h-80">
        <div className={`flex items-center gap-3 md:flex-col md:items-start md:gap-0 ${isRTL ? 'flex-row-reverse md:flex-col' : ''}`}>
          <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#C5E4DC] md:mb-3 lg:h-[60px] lg:w-[60px]">
            <img
              src={props.images}
              alt=""
              className="h-[26px] w-[26px] object-contain lg:h-[30px] lg:w-[30px]"
            />
          </div>
          <h1 className="font-inter text-[16px] font-medium leading-snug text-[#002333] md:mt-1 lg:text-[20px]">
            {props.title}
          </h1>
        </div>
        <p className="mt-2 font-inter text-[14px] font-normal leading-[22px] text-[#687276] md:mt-2 lg:text-[16px] lg:leading-[24px]">
          {props.description}
        </p>
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
