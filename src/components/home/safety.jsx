import safety from '../../assets/home/safety.png'
import mark from '../../assets/home/mark.svg'
import Button from '../web_button'
import safetymobile from '../../assets/home/safety_mobile_view.png'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

function Safety() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <div className={`bg-white flex flex-col md:items-center w-full lg:pr-[120px] pt-[60px] lg:py-0 lg:pt-[80px] ${isRTL ? 'md:flex-row' : 'md:flex-row-reverse'}`}>


            <div className='flex flex-col justify-start px-[30px] lg:px-[50px] lg:pb-[50px] w-full'>
                <h2 className='text-[24px] lg:text-[44px] font-medium leading-[32px] lg:leading-[1.2] text-[#002333] mb-3 md:mb-2 lg:mb-4 font-inter'>
                    {t('safety.title')}
                </h2>

                <p className='hidden md:block text-[14px] lg:text-[16px] lg:w-3/3 font-normal font-inter leading-[22px] lg:leading-6 text-[#687276] mb-2 md:mb-1 lg:mb-4'>
                    {t('safety.description')}
                </p>

                <div className='flex flex-row items-center mb-2 lg:mb-4'>
                    <img src={mark} alt='checkmark' className={`${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0 w-4 h-4 lg:w-6 lg:h-[11px]`} />
                    <p className='text-[14px] lg:text-[16px] lg:w-3/3 font-normal font-inter leading-[22px] lg:leading-6 text-[#002333]'>
                        {t('safety.point1')}
                    </p>
                </div>
                <div className='border-b border-[#DAD8D7] w-full lg:w-full md:w-full lg:my-1'></div>

                <div className='flex flex-row items-center my-3 lg:mb-4'>
                    <img src={mark} alt='checkmark' className={`${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0 w-4 h-4 lg:w-6 lg:h-[11px]`} />
                    <p className='text-[14px] lg:text-[16px] lg:w-3/6 font-normal font-inter leading-[22px] lg:leading-6 text-[#002333]'>
                        {t('safety.point2')}
                    </p>
                </div>
                <div className='border-b border-[#DAD8D7] w-full md:w-full lg:my-1'></div>

                <div className='flex flex-row items-center my-3 md:mb-5 lg:mb-10'>
                    <img src={mark} alt='checkmark' className={`${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0 w-4 h-4 lg:w-6 lg:h-[11px]`} />
                    <p className='text-[14px] lg:text-[16px] lg:w-3/5 font-normal font-inter leading-[22px] lg:leading-6 text-[#002333]'>
                        {t('safety.point3')}
                    </p>
                </div>
                <Link to={'/contact'}>
                <div className="w-full lg:w-auto mb-5 md:mb-7 lg:mb-0">
                    <Button text={t('safety.contactUs')} />
                </div>
                </Link>
            </div>
            <img
                src={safety}
                alt='safety'
                className='hidden md:block md:w-1/2 md:pr-[3px] lg:pr-0 lg:w-[50%] md:h-1/1'/>

            <img src={safetymobile} alt='safety mobile view' className='block md:hidden w-full h-fit object-fit'/>
        </div>
    );
}

export default Safety;