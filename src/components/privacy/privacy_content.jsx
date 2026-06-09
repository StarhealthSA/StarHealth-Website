'use client';

import website from "../../assets/privacy/website_icon_black.svg"
import mail from "../../assets/privacy/mail_icon_black.svg"
import phone from "../../assets/privacy/phone_icon_black.svg"
import location from "../../assets/privacy/location_icon_black.svg"
import { useTranslation } from 'react-i18next';

function PrivacyContent() {
    const { t, i18n } = useTranslation();

    return (
        <div className="px-[30px] lg:px-[120px] pb-[60px] lg:pb-[80px] bg-[#FFFFFF]">
            <h1 className="text-[24px] lg:text-[44px] text-[#002333] font-medium font-inter leading-[32px] lg:leading-[56px]">
                {t('privacyPolicy.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mt-2 sm:mt-4 mb-3 sm:mb-6">
                {t('privacyPolicy.intro.paragraph1')}
                <a href={t('privacyPolicy.intro.websiteUrl')}>
                    <span className="text-blue-800 underline">{t('privacyPolicy.intro.websiteUrl')} </span>
                </a>
                {t('privacyPolicy.intro.paragraph2')}
            </p>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mt-2 sm:mt-4 mb-6 sm:mb-12">
                {t('privacyPolicy.intro.consent')}
            </p>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.informationWeCollect.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.informationWeCollect.description')}
            </p>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.informationWeCollect.personalInfo.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.informationWeCollect.personalInfo.description')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-5 lg:ml-10 text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.informationWeCollect.personalInfo.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.informationWeCollect.personalInfo.collectedWhen')}
            </p>
            <ul className={`list-disc list-inside space-y-2 ml-5 lg:ml-10 text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6`}>
                {t('privacyPolicy.sections.informationWeCollect.personalInfo.collectionMethods', { returnObjects: true }).map((method, index) => (
                    <li key={index}>{method}</li>
                ))}
            </ul>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.informationWeCollect.automaticInfo.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.informationWeCollect.automaticInfo.description')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-5 lg:ml-10 text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.informationWeCollect.automaticInfo.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.informationWeCollect.automaticInfo.purpose')}
            </p>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.howWeUseInfo.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.howWeUseInfo.description')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-5 lg:ml-10 text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.howWeUseInfo.purposes', { returnObjects: true }).map((purpose, index) => (
                    <li key={index}>{purpose}</li>
                ))}
            </ul>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.howWeUseInfo.note')}
            </p>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.cookies.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter">
                {t('privacyPolicy.sections.cookies.intro')}
            </p>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.cookies.purposes')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-5 lg:ml-10 text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.cookies.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.cookies.note')}
            </p>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.sharingInfo.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter">
                {t('privacyPolicy.sections.sharingInfo.intro')}
            </p>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.sharingInfo.sharedWith')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-5 lg:ml-10 text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.sharingInfo.recipients', { returnObjects: true }).map((recipient, index) => (
                    <li key={index}>{recipient}</li>
                ))}
            </ul>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.sharingInfo.note')}
            </p>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.dataSecurity.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter">
                {t('privacyPolicy.sections.dataSecurity.description')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-5 lg:ml-10 text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.dataSecurity.measures', { returnObjects: true }).map((measure, index) => (
                    <li key={index}>{measure}</li>
                ))}
            </ul>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.dataSecurity.disclaimer')}
            </p>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.thirdPartyLinks.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.thirdPartyLinks.content')}
            </p>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.childrenPrivacy.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.childrenPrivacy.content')}
            </p>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.privacyRights.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter">
                {t('privacyPolicy.sections.privacyRights.description')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-5 lg:ml-10 text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-1 sm:mb-3">
                {t('privacyPolicy.sections.privacyRights.rights', { returnObjects: true }).map((right, index) => (
                    <li key={index}>{right}</li>
                ))}
            </ul>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.privacyRights.note')}
            </p>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.policyUpdates.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.policyUpdates.content')}
            </p>

            <h1 className="text-[18px] lg:text-[30px] text-[#002333] font-medium font-inter leading-[26px] lg:leading-[40px]">
                {t('privacyPolicy.sections.contactInfo.title')}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#002333] font-normal w-full leading-[22px] sm:leading-[24px] font-inter mb-3 sm:mb-6">
                {t('privacyPolicy.sections.contactInfo.intro')}
            </p>

            <p className="text-[14px] lg:text-[16px] text-[#002333] font-medium w-full leading-[22px] sm:leading-[24px] font-inter mb-3 lg:mb-4">
                {t('privacyPolicy.sections.contactInfo.companyName')}
            </p>

            <div className="flex flex-row items-center">
                <img
                    src={website}
                    alt="Website icon"
                    className="h-[20px] w-[20px] mx-2 mb-2"
                />
                <p className="text-[14px] lg:text-[16px] text-[#002333] font-medium w-full leading-[22px] sm:leading-[24px] font-inter mb-3">
                    Website:
                    <a href={t('privacyPolicy.sections.contactInfo.website')}>
                        <span className="text-blue-800 underline"> {t('privacyPolicy.sections.contactInfo.website')}</span>
                    </a>
                </p>
            </div>

            <div className="flex flex-row items-center">
                <img
                    src={mail}
                    alt="Email icon"
                    className="h-[20px] w-[20px] mx-2 mb-2"
                />
                <p className="text-[14px] lg:text-[16px] text-[#002333] font-medium w-full leading-[22px] sm:leading-[24px] font-inter mb-3">
                    Email: <span className="text-[#002333] font-normal">{t('privacyPolicy.sections.contactInfo.email')}</span>
                </p>
            </div>

            <div className="flex flex-row items-center">
                <img
                    src={phone}
                    alt="Phone icon"
                    className="h-[20px] w-[20px] mx-2 mb-2"
                />
                <p className="text-[14px] lg:text-[16px] text-[#002333] font-medium w-full leading-[22px] sm:leading-[24px] font-inter mb-3">
                    Phone: <span className="text-[#002333] font-normal">{t('privacyPolicy.sections.contactInfo.phone')}</span>
                </p>
            </div>

            <div className="flex flex-row items-center">
                <img
                    src={location}
                    alt="Location icon"
                    className="h-[20px] w-[20px] mx-2 mb-2"
                />
                <p className="text-[14px] lg:text-[16px] text-[#002333] font-medium w-full leading-[22px] sm:leading-[24px] font-inter">
                    Address: <span className="text-[#002333] font-normal">{t('privacyPolicy.sections.contactInfo.address')}</span>
                </p>
            </div>
        </div >
    )
}

export default PrivacyContent;