import welcomeimg from "../../assets/home/welcomeimg.png"
import { useTranslation } from 'react-i18next';

function WelcomePart() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-[#F6F4F3] flex justify-center">
      <div className="mx-auto max-w-[1200px] px-[30px] py-[60px] lg:px-[120px] text-center">
        <img src={welcomeimg} alt="Welcome Image" className="w-full h-fit mb-6 md:hidden" />
        <p className="md:hidden linear-text text-[14px] sm:text-[16px] mb-6 font-normal font-inter">
          {t('welcome.title')}
        </p>
        <p className="hidden md:block text-[#AFAEAD] text-[14px] sm:text-[16px] mb-6 font-normal font-inter">
          {t('welcome.title')}
        </p>
        <p className="text-[#002333] text-[20px] lg:text-[32px] font-normal mx-auto md:w-5/6 lg:w-3/3 leading-[28px] lg:leading-[44px] font-inter text-center">
          {t('welcome.description')}
        </p>
      </div>
    </div>
  );
}
export default WelcomePart;