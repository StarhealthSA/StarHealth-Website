'use client';

import calender from '../assets/home/calender.svg'
import React, { useMemo, useState } from 'react';
import Reveal from './reveal';
import { useTranslation } from 'react-i18next';
import AppointmentDatePicker from '@/components/booking/appointment-date-picker';
import AppointmentSlotPicker from '@/components/booking/appointment-slot-picker';
import { useLocalizedDoctors } from '@/contexts/content-context';
import { submitAppointmentBooking } from '@/lib/booking/submit-appointment';
import { useDoctorBookingSchedule } from '@/hooks/use-doctor-booking-schedule';

function Mobviewform() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phonenumber: '',
    age: '',
    speciality: '',
    doctorId: '',
  });

  const doctors = useLocalizedDoctors(i18n.language);
  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === formData.doctorId),
    [doctors, formData.doctorId]
  );
  const { isConfigured, isOpenSchedule, loading: scheduleLoading } = useDoctorBookingSchedule(formData.doctorId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'doctorId') {
      setSelectedSlot(null);
      setSelectedDate(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctorId || scheduleLoading) return;

    if (isConfigured && (!selectedDate || !selectedSlot)) {
      alert(t('doctorModal.selectSlotRequired'));
      return;
    }

    try {
      setSubmitting(true);
      await submitAppointmentBooking({
        doctorId: formData.doctorId,
        doctorName: selectedDoctor?.displayName || '',
        date: selectedDate,
        slot: selectedSlot,
        patientName: formData.name,
        phone: formData.phonenumber,
        age: formData.age,
        speciality: formData.speciality,
        requiresSchedule: isConfigured,
      });
      alert(t('doctorModal.bookingSuccess'));
      setFormData({ name: '', phonenumber: '', age: '', speciality: '', doctorId: '' });
      setSelectedDate(null);
      setSelectedSlot(null);
    } catch (error) {
      alert(error.message || t('doctorModal.bookingFailed'));
    } finally {
      setSubmitting(false);
    }
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
                name='doctorId'
                value={formData.doctorId}
                onChange={handleChange}
                required
                className={`w-full bg-transparent text-white placeholder-white font-inter text-base p-3 outline-none appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="" disabled className="text-gray-400">{t('bookingForm.selectDoctor')}</option>
                {doctors.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
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
          {isConfigured && (
            <AppointmentDatePicker
              doctorId={formData.doctorId}
              selectedDate={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedSlot(null);
              }}
              variant="onDark"
              isRTL={isRTL}
              inputClassName={`w-full border border-[#FFFFFF66] rounded-lg bg-transparent text-white placeholder-white font-inter text-base p-3 outline-none ${isRTL ? 'text-right pl-35' : 'text-left pr-35'}`}
              calendarIcon={<img src={calender} alt="Calendar" className="w-6 h-6" />}
            />
          )}

          {scheduleLoading && formData.doctorId && (
            <p className="mt-2 text-sm text-white/80">{t('doctorModal.checkingSchedule')}</p>
          )}

          {isOpenSchedule && formData.doctorId && !scheduleLoading && (
            <p className="mt-2 text-sm text-white/80">{t('doctorModal.openScheduleNote')}</p>
          )}

          {isConfigured && (
            <AppointmentSlotPicker
              doctorId={formData.doctorId}
              date={selectedDate}
              selectedSlot={selectedSlot?.index ?? null}
              onSelect={setSelectedSlot}
              variant="onDark"
              className="mt-2"
            />
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-white font-inter hover:bg-[#FFFFFFCC] font-semibold text-[#002333] mt-4 w-full h-14 rounded-lg transition-all duration-200 disabled:opacity-60"
          >
            {submitting ? t('doctorModal.booking') : t('bookingForm.bookNow')}
          </button>
        </div>
      </form>
    </div>
    </Reveal>
  );
}
export default Mobviewform;