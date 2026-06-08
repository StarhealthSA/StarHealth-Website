import logo from '../assets/home/logo.svg';
import instagram from '../assets/home/instagram1.svg';
import facebook from '../assets/home/facebook1.svg';
import whatsapp from '../assets/home/whatsapp1.svg';
import linkedin from '../assets/home/linkedin1.svg';
import snapchat from '../assets/home/snapchat1.svg';
import tiktok from '../assets/home/tiktok1.svg';
import Bottomnav from './bottom_nav';
import React, { useState } from 'react';
import close from "../assets/contact/close_button.svg"
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import calender from '../assets/contact/calder.svg';
import Button from "../components/web_button";
import { useTranslation } from 'react-i18next';
import path from 'node:path';

function Footer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    specialty: '',
    doctor: '',
    fullName: '',
    phoneNumber: '',
    age: ''
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData, 'Selected Date:', selectedDate);
    setShowModal(false);
  };

  const Speciality = [
    { sty: "specialties.generalMedicine" },
    { sty: "specialties.internalMedicine" },
    { sty: "specialties.pediatrics" },
    { sty: "specialties.obg" },
    { sty: "specialties.generalDentistry" },
    { sty: "specialties.orthodontics" },
    { sty: "specialties.urology" },
    { sty: "specialties.laserTreatments" },
  ];

  const Doctors = [
    { doc: "Dr. Anjali Menon" },
    { doc: "Dr. Vikram Krishnan" },
    { doc: "Dr. Leela Joseph" },
    { doc: "Dr. Rajeev Kurian" },
  ];

  const Age = [
    { age: "ageRanges.1-10" },
    { age: "ageRanges.11-20" },
    { age: "ageRanges.21-30" },
    { age: "ageRanges.31-40" },
    { age: "ageRanges.41-50" },
    { age: "ageRanges.51-60" },
    { age: "ageRanges.61-70" },
    { age: "ageRanges.71-80" },
    { age: "ageRanges.81-90" },
    { age: "ageRanges.91-100" },
  ];

  const services = [
    { key: 'footer.services.generalMedicine' },
    { key: 'footer.services.paediatrics' },
    { key: 'footer.services.orthopaedics' },
    { key: 'footer.services.internalMedicine' },
    { key: 'footer.services.dentistry' },
    { key: 'footer.services.dermatology' },
    { key: 'footer.services.pediatrics' }
  ];

  const quicklinks = [
    { nameKey: 'footer.quickLink.home', path: '/' },
    { nameKey: 'footer.quickLink.aboutUs', path: '/about' },
    { nameKey: 'footer.quickLink.services', path: '/#services' },
    { nameKey: 'footer.quickLink.doctors', path: '/doctors' },
    {nameKey: 'footer.quickLink.blogs', path: '/blogs'},
    { nameKey: 'footer.quickLink.contactUs', path: '/contact' },
    { nameKey: 'footer.quickLink.privacy', path: '/privacy' }
  ];

  return (
    <div>
      <div className="bg-[#063330] w-full py-8 lg:py-20 px-6 lg:px-[120px]">

        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
          <div className="lg:w-1/1">
            <h3 className="text-sm lg:text-base text-[#FFFFFFCC] mb-2 lg:mb-4">{t('footer.appointments')}</h3>
            <p className="text-base lg:text-xl font-medium text-white">{t('footer.appointmentnumber')}</p>
          </div>
          <div className="lg:w-1/1">
            <h3 className="text-sm lg:text-base text-[#FFFFFFCC] mb-2 lg:mb-4">{t('footer.emergency')}</h3>
            <p className="text-base lg:text-xl font-medium text-white">{t('footer.emergencynumber')}</p>
          </div>
          <div className="lg:w-1/1">
            <h3 className="text-sm lg:text-base text-[#FFFFFFCC] mb-2 lg:mb-4">{t('footer.labResults')}</h3>
            <a href="mailto:labs@starhealth.sa">
              <p className="text-base lg:text-xl cursor-pointer font-medium text-white"
              >{t('footer.labMail')}</p>
            </a>
          </div>
          <div className="lg:w-1/1">
            <h3 className="text-sm lg:text-base text-[#FFFFFFCC] mb-2 lg:mb-4">{t('footer.patientEnquiries')}</h3>
            <a href="mailto:contact@starhealth.sa">
              <p className="text-base lg:text-xl cursor-pointer font-medium text-white"
              >{t('footer.enquirynumber')}</p>
            </a>
          </div>
        </div>

        <div className="border-b border-[#FFFFFF33] w-full my-8 lg:my-12"></div>

        <div className="flex flex-col md:flex-row gap-5 lg:gap-16">

          <div className="lg:w-1/4 md:w-1/4">
            <img src={logo} alt="Star Health Logo" className="w-32 lg:w-40 mb-4 lg:mb-8" />
            <p className="text-sm lg:text-base text-[#FFFFFFCC] lg:mb-0">
              {t('footer.description')}
            </p>
          </div>

          <div className="lg:w-1/5 md:w-1/5">
            <h4 className="text-lg lg:text-xl font-medium text-white mb-2 lg:mb-6">{t('footer.quickLinks')}</h4>
            <ul className="grid grid-cols-3 md:grid-cols-1 gap-2 sm:gap-4">
              {quicklinks.map((link, index) => (
                <li key={index} className="text-sm lg:text-base text-[#FFFFFFCC] hover:text-[#FFFFFF] transition">
                  <a href={link.path}>{t(link.nameKey)}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/5 md:w-1/5">
            <h4 className="text-lg lg:text-xl font-medium text-white mb-2 lg:mb-6">{t('footer.ourServices')}</h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 lg:gap-4">
              {services.map((service, index) => (
                <li key={index} onClick={() => setShowModal(true)} className="text-sm cursor-pointer lg:text-base text-[#FFFFFFCC] hover:text-[#FFFFFF] transition">
                  {t(service.key)}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/3 md:w-2/4">
            <h4 className="text-lg lg:text-xl font-medium text-white mb-2 lg:mb-6">{t('footer.newsletter')}</h4>
            <div className="flex flex-row md:flex-row gap-2 mb-4">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className={`w-1/2 flex-grow h-10 lg:h-10 px-4 rounded-lg border border-[#FFFFFF4D] bg-transparent text-white placeholder-[#FFFFFF80] ${isRTL ? 'text-right' : 'text-left'}`}
              />
              <button className="cursor-pointer bg-gradient-to-tl from-[#037B76] to-[#AED5C6] hover:bg-gradient-to-br hover:from-[#037B76] hover:to-[#AED5C6] text-white h-10 lg:h-10 px-2 lg:px-6 rounded-lg font-medium">
                {t('footer.subscribe')}
              </button>
            </div>

            <h4 className="text-lg lg:text-xl font-medium text-white mb-4">{t('footer.socialMedia')}</h4>
            <div className="flex gap-4">
              <a href='https://www.instagram.com/starhealthmedical/'>
                <img src={instagram} alt="Instagram" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href='https://www.facebook.com/share/1BjorBuyr1/'>
                <img src={facebook} alt="Facebook" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href="https://wa.me/+966505730003"
                dir='ltr'>
                <img src={whatsapp} alt="WhatsApp" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href='https://www.tiktok.com/@starhealthmedicalcenter'>
                <img src={linkedin} alt="linkedin" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href='https://www.snapchat.com/@starhealth50/'>
                <img src={snapchat} alt="snapchat" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
              <a href='https://www.tiktok.com/@starhealthmedicalcenter'>
                <img src={tiktok} alt="tiktok" className="h-10 w-10 hover:filter hover:brightness-90 hover:saturate(30) hover:invert-[0.2]" />
              </a>
            </div>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white flex flex-col justify-center items-center rounded-[12px] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex flex-row justify-between w-full items-center px-3 pt-30 sm:pt-[10px] md:pt-[10px] lg:px-10 lg:pt-10 relative">
                <div className="w-10"></div>
                <h1 className="text-[16px] lg:text-[28px] font-medium items-center leading-[32px] lg:leading-[36px] font-inter text-[#002333]">
                  {t('doctorModal.title')}
                </h1>
                <button onClick={handleCloseModal}>
                  <img src={close} alt="close" className="h-[40px] w-[40px]" />
                </button>
              </div>

              <p className="font-normal text-[14px] lg:text-[16px] font-inter leading-[22px] lg:leading-[24px] mt-5 w-full lg:w-full px-4 lg:px-20 text-center text-[#687276]">
                {t('whatNextSection.modalDescription')}
              </p>

              <div className="w-full mt-5 px-4 lg:px-10 mb-10 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4">
                  <div>
                    <label className="block text-[14px] lg:text-[16px] font-inter font-medium text-[#002333] mb-3">
                      {t('doctorModal.specialty')}
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full px-4 py-2 lg:py-3 border border-[#DAD8D7] rounded-lg appearance-none focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
                        value={formData.specialty}
                        onChange={(e) => handleInputChange('specialty', e.target.value)}
                      >
                        <option value="" disabled className="text-gray-400">
                          {t('doctorModal.selectSpecialty')}
                        </option>
                        {Speciality.map((item, index) => (
                          <option key={index} value={item.sty}>
                            {t(item.sty)}
                          </option>
                        ))}
                      </select>
                      <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-2 pointer-events-none`}>
                        <svg className="w-4 h-4 text-[#687276]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] lg:text-[16px] font-inter font-medium text-[#002333] mb-3">
                      {t('doctorModal.doctor')}
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full px-4 py-2 lg:py-3 border border-[#DAD8D7] rounded-lg appearance-none focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
                        value={formData.doctor}
                        onChange={(e) => handleInputChange('doctor', e.target.value)}
                      >
                        <option value="" disabled className="text-gray-400">
                          {t('doctorModal.selectDoctor')}
                        </option>
                        {Doctors.map((item, index) => (
                          <option key={index} value={item.doc}>
                            {item.doc}
                          </option>
                        ))}
                      </select>
                      <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-2 pointer-events-none`}>
                        <svg className="w-4 h-4 text-[#687276]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] lg:text-[16px] font-inter font-medium text-[#002333] mb-3">
                      {t('doctorModal.fullName')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('doctorModal.enterFullName')}
                      className={`w-full px-4 py-2 lg:py-3 border border-[#DAD8D7] rounded-lg focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] lg:text-[16px] font-inter font-medium text-[#002333] mb-3">
                      {t('doctorModal.phoneNumber')}
                    </label>
                    <input
                      type="tel"
                      placeholder={t('doctorModal.enterPhone')}
                      className={`w-full px-4 py-2 lg:py-3 border border-[#DAD8D7] rounded-lg focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] lg:text-[16px] font-inter font-medium text-[#002333] mb-3">
                      {t('doctorModal.age')}
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full px-4 py-2 lg:py-3 border border-[#DAD8D7] rounded-lg appearance-none focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                      >
                        <option value="" disabled className="text-gray-400">
                          {t('doctorModal.selectAge')}
                        </option>
                        {Age.map((item, index) => (
                          <option key={index} value={item.age}>
                            {t(item.age)}
                          </option>
                        ))}
                      </select>
                      <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-2 pointer-events-none`}>
                        <svg className="w-4 h-4 text-[#687276]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="mt-0">
                    <label className="block text-[14px] lg:text-[16px] font-inter font-medium text-[#002333] mb-3">
                      {t('doctorModal.date')}
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        placeholderText={t('doctorModal.selectDate')}
                        className={`w-full py-2 lg:py-3 border border-[#DAD8D7] rounded-lg focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'pr-4 pl-50' : 'pl-4 pr-50'}`}
                        calendarClassName="font-inter bg-white w-full text-[#002333] border border-[#DAD8D7] rounded-lg shadow-lg items-center"
                        showPopperArrow={false}
                        popperClassName="!z-50"
                        minDate={new Date()}
                      />
                      <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-3 pointer-events-none`}>
                        <img src={calender} alt="Calendar" className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`flex flex-row mt-10 items-end ${isRTL ? 'justify-start' : 'justify-end'}`}>
                  <div>
                    <Button text={t('doctorModal.bookNow')} onClick={handleSubmit} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Bottomnav />
    </div >
  );
}

export default Footer;