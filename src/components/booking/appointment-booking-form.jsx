'use client';

import { useMemo, useState } from 'react';
import calender from '@/assets/contact/calder.svg';
import Button from '@/components/web_button';
import AppointmentDatePicker from '@/components/booking/appointment-date-picker';
import AppointmentSlotPicker from '@/components/booking/appointment-slot-picker';
import { useTranslation } from 'react-i18next';
import { useLocalizedDoctors } from '@/contexts/content-context';
import { submitAppointmentBooking } from '@/lib/booking/submit-appointment';
import { useDoctorBookingSchedule } from '@/hooks/use-doctor-booking-schedule';

export default function AppointmentBookingForm({ preselectedDoctorId = '' }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const doctors = useLocalizedDoctors(i18n.language);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phonenumber: '',
    age: '',
    speciality: '',
    doctorId: preselectedDoctorId || '',
  });

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
      setFormData({ name: '', phonenumber: '', age: '', speciality: '', doctorId: preselectedDoctorId || '' });
      setSelectedDate(null);
      setSelectedSlot(null);
    } catch (error) {
      alert(error.message || t('doctorModal.bookingFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const Speciality = [
    'specialties.generalMedicine',
    'specialties.internalMedicine',
    'specialties.pediatrics',
    'specialties.obg',
    'specialties.generalDentistry',
    'specialties.orthodontics',
    'specialties.urology',
    'specialties.laserTreatments',
  ];

  const Age = [
    'ageRanges.1-10',
    'ageRanges.11-20',
    'ageRanges.21-30',
    'ageRanges.31-40',
    'ageRanges.41-50',
    'ageRanges.51-60',
    'ageRanges.61-70',
    'ageRanges.71-80',
    'ageRanges.81-90',
    'ageRanges.91-100',
  ];

  return (
    <div className="mx-auto max-w-4xl rounded-[12px] bg-white p-6 shadow-sm md:p-10">
      <h1 className="text-center font-inter text-2xl font-medium text-[#002333] md:text-[28px]">
        {t('doctorModal.title')}
      </h1>
      <p className="mt-4 text-center font-inter text-sm text-[#687276] md:text-base">
        {t('doctorModal.description')}
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="mb-2 block text-sm font-medium text-[#002333]">{t('doctorModal.specialty')}</span>
            <select
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border border-[#DAD8D7] px-4 py-3 text-sm text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <option value="" disabled>{t('doctorModal.selectSpecialty')}</option>
              {Speciality.map((key) => (
                <option key={key} value={t(key)}>{t(key)}</option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="mb-2 block text-sm font-medium text-[#002333]">{t('doctorModal.doctor')}</span>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border border-[#DAD8D7] px-4 py-3 text-sm text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <option value="" disabled>{t('doctorModal.selectDoctor')}</option>
              {doctors.map((item) => (
                <option key={item.id} value={item.id}>{item.displayName}</option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="mb-2 block text-sm font-medium text-[#002333]">{t('doctorModal.fullName')}</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              required
              placeholder={t('doctorModal.enterFullName')}
              className={`w-full rounded-lg border border-[#DAD8D7] px-4 py-3 text-sm text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </label>

          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="mb-2 block text-sm font-medium text-[#002333]">{t('doctorModal.phoneNumber')}</span>
            <input
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              type="tel"
              required
              placeholder={t('doctorModal.enterPhone')}
              className={`w-full rounded-lg border border-[#DAD8D7] px-4 py-3 text-sm text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#002333]">{t('doctorModal.age')}</span>
            <select
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border border-[#DAD8D7] px-4 py-3 text-sm text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <option value="" disabled>{t('doctorModal.selectAge')}</option>
              {Age.map((key) => (
                <option key={key} value={t(key)}>{t(key)}</option>
              ))}
            </select>
          </label>

          {isConfigured && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#002333]">{t('doctorModal.date')}</span>
              <AppointmentDatePicker
                doctorId={formData.doctorId}
                selectedDate={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
                isRTL={isRTL}
                inputClassName={`w-full rounded-lg border border-[#DAD8D7] py-3 text-sm text-[#687276] ${isRTL ? 'pr-4 pl-10' : 'pl-4 pr-10'}`}
                calendarIcon={<img src={calender} alt="Calendar" className="h-5 w-5" />}
              />
            </label>
          )}
        </div>

        {scheduleLoading && formData.doctorId && (
          <p className="mt-4 text-sm text-[#687276]">{t('doctorModal.checkingSchedule')}</p>
        )}

        {isOpenSchedule && formData.doctorId && !scheduleLoading && (
          <p className="mt-4 rounded-lg border border-[#E9E7E6] bg-[#F8FBFA] px-4 py-3 text-sm text-[#687276]">
            {t('doctorModal.openScheduleNote')}
          </p>
        )}

        {isConfigured && (
          <div className="mt-6">
            <AppointmentSlotPicker
              doctorId={formData.doctorId}
              date={selectedDate}
              selectedSlot={selectedSlot?.index ?? null}
              onSelect={setSelectedSlot}
            />
          </div>
        )}

        <div className={`mt-8 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <Button
            text={submitting ? t('doctorModal.booking') : t('doctorModal.bookNow')}
            onClick={handleSubmit}
            className="w-full px-8 py-3 sm:w-auto"
          />
        </div>
      </form>
    </div>
  );
}
