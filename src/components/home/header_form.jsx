'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import calender from '../../assets/home/calender.svg';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';

function HeaderForm() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phonenumber: '',
    age: '',
    speciality: '',
    doctor: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceId = 'service_gr3hz0c';
    const templateId = 'template_zi5qnzk';
    const publicKey = '3hR26mPB0OTAoNfhQ';

    const formattedDate = selectedDate ? selectedDate.toLocaleDateString() : '';

    const templateParams = {
      name: formData.name,
      age: formData.age,
      phonenumber: formData.phonenumber,
      doctor: formData.doctor,
      speciality: formData.speciality,
      date: formattedDate,
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        alert('Appointment booked successfully!');
        setFormData({
          name: '',
          phonenumber: '',
          age: '',
          speciality: '',
          doctor: ''
        });
        setSelectedDate(null);
      })
      .catch((error) => {
        alert('Failed to book appointment. Please try again.');
      });
  };

  const Speciality = [
    { sty: "General Medicine" },
    { sty: "Internal Medicine" },
    { sty: "Pediatrics" },
    { sty: "Obstetrics & Gynecology (OBG)" },
    { sty: "General Dentistry" },
    { sty: "Orthodontics" },
    { sty: "Urology (Part-Time)" },
    { sty: "Laser Treatments" },
  ];

  const Doctors = [
    { doc: "Dr. Aljazi Al-Baqmi" },
    { doc: "Dr. Hany Mostafa" },
    { doc: "Dr. Thanaa Shehab Al-Din" },
    { doc: "Dr. Asmaa Shawqi" },
    { doc: "Dr. Haifa Ali Khalid " },
    { doc: "Dr. Waad Al-Sayed" },
  ];

  const Age = [
    { age: "1-10 years" },
    { age: "11-20 years" },
    { age: "21-30 years" },
    { age: "31-40 years" },
    { age: "41-50 years" },
    { age: "51-60 years" },
    { age: "61-70 years" },
    { age: "71-80 years" },
    { age: "81-90 years" },
    { age: "91-100 years" },
  ];

  return (
    <div className={`flex flex-col h-[420px] w-5/6 bg-gradient-to-tl from-[#037B76] to-[#AED5C6] items-center justify-center md:pt-[20px] lg:px-[30px] lg:-py-[20px] md:pb-[20px] md:pr-[20px] md:pl-[20px] rounded-lg mx-20 mt-[30px] mb-[80px] ${isRTL ? 'text-right' : 'text-left'}`}>
      <h1 className="text-white font-medium text-[18px] lg:text-[24px] font-family-inter">{t('bookingForm.title')}</h1>
      <h2 className="text-white font-weight-[400px] text-[14px] lg:text-[16px] font-family-inter mb-6">{t('bookingForm.subtitle')}</h2>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full md:gap-2">
          <div className="flex flex-row w-full justify-between md:gap-2">

            <div className="relative w-1/2">
              <div className="flex flex-row w-full border border-[#FFFFFF66] rounded-lg">
                <select
                  name='speciality'
                  value={formData.speciality}
                  onChange={handleChange}
                  className={`w-full bg-transparent text-white placeholder-white font-inter md:text-[14px] lg:px-[16px] p-3 outline-none appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <option value="" disabled className="text-gray-400">{t('bookingForm.selectSpeciality')}</option>
                  {Speciality.map((item, index) => (
                    <option key={index} value={item.sty} className="text-white bg-[#037B76]">
                      {item.sty}
                    </option>
                  ))}
                </select>
                <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-2 pointer-events-none`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative w-1/2">
              <div className="flex flex-row w-full border border-[#FFFFFF66] rounded-lg">
                <select
                  name='doctor'
                  value={formData.doctor}
                  onChange={handleChange}
                  className={`w-full bg-transparent text-white placeholder-white font-inter md:text-[14px] lg:px-[16px] p-3 outline-none appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <option value="" disabled className="text-gray-400">{t('bookingForm.selectDoctor')}</option>
                  {Doctors.map((item, index) => (
                    <option key={index} value={item.doc} className="text-white bg-[#037B76]">
                      {item.doc}
                    </option>
                  ))}
                </select>
                <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-2 pointer-events-none`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row w-full justify-between gap-2">
            <input
              name='name'
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('bookingForm.yourName')}
              className={`w-full border border-[#FFFFFF66] rounded-lg text-white placeholder-white font-inter md:text-[14px] lg:px-[16px] p-3 outline-none bg-transparent ${isRTL ? 'text-right' : 'text-left'}`}
              required
            />
            <input
              name='phonenumber'
              type="tel"
              value={formData.phonenumber}
              onChange={handleChange}
              placeholder={t('bookingForm.yourPhone')}
              className={`w-full border border-[#FFFFFF66] rounded-lg text-white placeholder-white font-inter md:text-[14px] lg:px-[16px] p-3 outline-none bg-transparent ${isRTL ? 'text-right' : 'text-left'}`}
              required
            />
          </div>

          <div className="flex flex-row w-full justify-between gap-2">
            <div className="relative w-1/2">
              <div className="flex flex-row w-full border border-[#FFFFFF66] rounded-lg">
                <select 
                  name='age'
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full bg-transparent text-white placeholder-white font-inter md:text-[14px] lg:px-[16px] p-3 outline-none appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <option value="" disabled className="text-gray-400">{t('bookingForm.selectAge')}</option>
                  {Age.map((item, index) => (
                    <option key={index} value={item.age} className="text-white bg-[#037B76]">
                      {item.age}
                    </option>
                  ))}
                </select>
                <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-2 pointer-events-none`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="relative w-1/2">
              <DatePicker
                name='date'
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText={t('bookingForm.selectDate')}
                className={`w-full border border-[#FFFFFF66] rounded-lg bg-transparent text-white placeholder-white font-inter text-base p-3 outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                calendarClassName="font-inter bg-[#037B76] text-white border border-[#FFFFFF66] rounded-lg"
                showPopperArrow={false}
                popperClassName="!z-50"
                minDate={new Date()}
                readOnly={false}
              />
              <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-3 pointer-events-none`}>
                <img src={calender} alt="Calendar" className="w-6 h-6" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="bg-white font-inter hover:bg-[#FFFFFFCC] font-semibold text-[#002333] mt-5 w-full h-14 rounded-lg transition-all duration-200"
          >
            {t('bookingForm.bookNow')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default HeaderForm;