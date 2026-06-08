import phone from '../assets/home/phone.svg';
import mail from '../assets/home/mail.svg';
import instagram from '../assets/home/instagram.svg';
import facebook from '../assets/home/facebook.svg';
import whatsapp from '../assets/home/whatsapp.svg';
import linkedin from '../assets/home/linkedin.svg';
import snapchat from '../assets/home/snapchat.svg';
import tiktok from '../assets/home/tiktok.svg';
import { useTranslation } from 'react-i18next';

function Topnav() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);

    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div className='flex flex-row items-center justify-between w-full h-[44px] lg:h-[62px] bg-gradient-to-l from-[#037B76] to-[#AED5C6] px-[20px] md:px-[30px] lg:px-[100px]'>
      <div className='flex justify-between w-full items-center'>
        <div className='flex items-center gap-3 md:gap-5'>
          <div className='flex items-center group'>
            <img
              src={phone}
              alt='phone'
              dir='ltr'
              className='w-[14px] h-[14px] md:w-[18px] md:h-[18px] transition-opacity duration-200 group-hover:opacity-60'
            />
            <a
              href="tel:+966505730003"
              dir='ltr'
              className={`text-white text-[12px] md:text-[14px] font-normal transition-colors duration-200 group-hover:text-[#FFFFFF99] font-inter ${isRTL ? 'mr-2' : 'ml-2'
                }`}
            >
              +966 505 730 003
            </a>
          </div>
        </div>

        <button
          onClick={toggleLanguage}
          className='sm:hidden bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-[12px] font-inter font-medium transition-all duration-200'
          aria-label='Toggle Language'
        >
          {i18n.language === 'en' ? 'AR' : 'EN'}
        </button>

        <div className='hidden sm:flex flex-row items-center gap-3 md:gap-4'>
          <a
            href="https://www.instagram.com/starhealthmedical/"
            target="_blank"
            rel="noopener noreferrer"
            className='transition-opacity duration-200 hover:opacity-70'
          >
            <img
              src={instagram}
              alt='instagram'
              className='w-[18px] h-[18px] cursor-pointer'
            />
          </a>
          <a
            href='https://www.facebook.com/share/1BjorBuyr1/'
            target="_blank"
            rel="noopener noreferrer"
            className='transition-opacity duration-200 hover:opacity-70'
          >
            <img
              src={facebook}
              alt='facebook'
              className='w-[18px] h-[18px] cursor-pointer'
            />
          </a>
          <a
            href="https://wa.me/+966505730003"
            target="_blank"
            rel="noopener noreferrer"
            className='transition-opacity duration-200 hover:opacity-70'
          >
            <img
              src={whatsapp}
              alt='whatsapp'
              className='w-[18px] h-[18px] cursor-pointer'
            />
          </a>
          <a
            href="https://www.linkedin.com/company/star-health-clinics/"
            target="_blank"
            rel="noopener noreferrer"
            className='transition-opacity duration-200 hover:opacity-70'
          >
            <img
              src={linkedin}
              alt='linkedin'
              className='w-[18px] h-[18px] cursor-pointer'
            />
          </a>
          <a
            href="https://www.snapchat.com/@starhealth50/"
            target="_blank"
            rel="noopener noreferrer"
            className='transition-opacity duration-200 hover:opacity-70'
          >
            <img
              src={snapchat}
              alt='snapchat'
              className='w-[18px] h-[18px] cursor-pointer'
            />
          </a>
          <a
            href="https://www.tiktok.com/@starhealthmedicalcenter"
            target="_blank"
            rel="noopener noreferrer"
            className='transition-opacity duration-200 hover:opacity-70'
          >
            <img
              src={tiktok}
              alt='tiktok'
              className='w-[18px] h-[18px] cursor-pointer'
            />
          </a>

          <button
            onClick={toggleLanguage}
            className='bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-[12px] md:text-[14px] font-inter font-medium transition-all duration-200'
            aria-label='Toggle Language'
          >
            {i18n.language === 'en' ? 'AR' : 'EN'}
          </button>
        </div>
      </div>
    </div >
  );
}

export default Topnav;