'use client';

import calender from '../assets/home/calender.svg'
import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import Reveal from './reveal';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import { useLocalizedDoctors } from '@/contexts/content-context';

function Mobviewform() {
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
        console.log('Email sent Successfully!', response);
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
        console.error('Error sending email:', error);
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
  ]

  const doctors = useLocalizedDoctors(i18n.language);

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
  ]

  return (
    <Reveal>
    <div className={`flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-tl from-[#037B76] to-[#AED5C6] px-[30px] py-[30px] ${isRTL ? 'text-right' : 'text-left'}`}>
      <h1 className="text-[#FFFFFF] font-medium text-[18px] leading-[26px] font-inter mb-2">{t('bookingForm.title')}</h1>
      <h2 className="text-[#FFFFFF] font-normal text-[14px] leading-[24px] font-inter mb-6">{t('bookingForm.subtitle')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full gap-4">
          <div className="relative w-full">
            <div className="flex flex-row w-full border border-[#FFFFFF66] rounded-lg">
              <select
                name='speciality'
                value={formData.speciality}
                onChange={handleChange}
                className={`w-full bg-transparent text-white placeholder-white font-inter text-base p-3 outline-none appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="" disabled className="text-[#FFFFFF]">{t('bookingForm.selectSpeciality')}</option>
                {Speciality.map((item, index) => (
                  <option
                    key={index}
                    value={item.sty}
                    className="text-white bg-[#037B76]"
                  >
                    {item.sty}
                  </option>
                ))}
              </select>
              <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-2 pointer-events-none`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative w-full">
            <div className="flex flex-row w-full border border-[#FFFFFF66] rounded-lg">
              <select
                name='doctor'
                value={formData.doctor}
                onChange={handleChange}
                className={`w-full bg-transparent text-white placeholder-white font-inter text-base p-3 outline-none appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="" disabled className="text-gray-400">{t('bookingForm.selectDoctor')}</option>
                {doctors.map((item) => (
                  <option
                    key={item.id}
                    value={item.displayName}
                    className="text-white bg-[#037B76]"
                  >
                    {item.displayName}
                  </option>
                ))}
              </select>
              <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-2 pointer-events-none`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <input
            name='name'
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder={t('bookingForm.yourName')}
            className={`w-full border border-[#FFFFFF66] rounded-lg bg-transparent text-white placeholder-white font-inter text-base p-3 outline-none ${isRTL ? 'text-right' : 'text-left'}`}
            required
          />
          <input
            name='phonenumber'
            value={formData.phonenumber}
            onChange={handleChange}
            type="tel"
            placeholder={t('bookingForm.yourPhone')}
            className={`w-full border border-[#FFFFFF66] rounded-lg bg-transparent text-white placeholder-white font-inter text-base p-3 outline-none ${isRTL ? 'text-right' : 'text-left'}`}
            required
          />
          <div className="relative w-full">
            <div className="flex flex-row w-full border border-[#FFFFFF66] rounded-lg">
              <select
                name='age'
                value={formData.age}
                onChange={handleChange}
                className={`w-full bg-transparent text-white placeholder-white font-inter text-base p-3 outline-none appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="" disabled className="text-gray-400">{t('bookingForm.selectAge')}</option>
                {Age.map((item, index) => (
                  <option
                    key={index}
                    value={item.age}
                    className="text-white bg-[#037B76]"
                  >
                    {item.age}
                  </option>
                ))}
              </select>
              <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-2 pointer-events-none`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="relative w-full">
            <DatePicker
              name='date'
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText={t('bookingForm.selectDate')}
              className={`w-full border border-[#FFFFFF66] rounded-lg bg-transparent text-white placeholder-white font-inter text-base p-3 outline-none ${isRTL ? 'text-right pl-35' : 'text-left pr-35'}`}
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

          <button
            type="submit"
            className="bg-white font-inter hover:bg-[#FFFFFFCC] font-semibold text-[#002333] mt-4 w-full h-14 rounded-lg transition-all duration-200"
          >
            {t('bookingForm.bookNow')}
          </button>
        </div>
      </form>
    </div>
    </Reveal>
  );
}
export default Mobviewform;