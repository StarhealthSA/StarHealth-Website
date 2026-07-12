'use client';

import { useState } from 'react';
import calender from '@/assets/contact/calder.svg';
import Button from '@/components/web_button';
import AppointmentDatePicker from '@/components/booking/appointment-date-picker';
import AppointmentSlotPicker from '@/components/booking/appointment-slot-picker';
import { useTranslation } from 'react-i18next';
import { submitAppointmentBooking } from '@/lib/booking/submit-appointment';
import { useDoctorBookingSchedule } from '@/hooks/use-doctor-booking-schedule';
import { useBookingCategoryDoctors } from '@/hooks/use-booking-category-doctors';
import notify from '@/lib/ui/notify';

export default function AppointmentBookingForm({
  preselectedDoctorId = '',
  preselectedCategoryId = '',
  lockSelection = false,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phonenumber: '',
    age: '',
  });

  const {
    categories,
    filteredDoctors,
    categoryId,
    doctorId,
    setCategoryId,
    setDoctorId,
    selectedDoctor,
    selectedCategoryName,
    isDoctorLocked,
    isCategoryLocked,
    resetSelection,
  } = useBookingCategoryDoctors({
    preselectedDoctorId,
    preselectedCategoryId,
    lockSelection,
  });

  const { isConfigured, isOpenSchedule, loading: scheduleLoading } = useDoctorBookingSchedule(doctorId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId || !categoryId || scheduleLoading) return;

    if (isConfigured && (!selectedDate || !selectedSlot)) {
      notify.warning(t('doctorModal.selectSlotRequired'));
      return;
    }

    try {
      setSubmitting(true);
      await submitAppointmentBooking({
        doctorId,
        doctorName: selectedDoctor?.displayName || '',
        date: selectedDate,
        slot: selectedSlot,
        patientName: formData.name,
        phone: formData.phonenumber,
        age: formData.age,
        speciality: selectedCategoryName,
        requiresSchedule: isConfigured,
      });
      notify.success(t('doctorModal.bookingSuccess'));
      setFormData({ name: '', phonenumber: '', age: '' });
      setSelectedDate(null);
      setSelectedSlot(null);
      resetSelection();
    } catch (error) {
      notify.error(error.message || t('doctorModal.bookingFailed'));
    } finally {
      setSubmitting(false);
    }
  };

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
            <span className="mb-2 block text-sm font-medium text-[#002333]">{t('doctorModal.serviceCategory')}</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={isCategoryLocked}
              className={`w-full rounded-lg border border-[#DAD8D7] px-4 py-3 text-sm text-[#687276] disabled:bg-[#F6F4F3] ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <option value="" disabled>{t('doctorModal.selectServiceCategory')}</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>{item.displayName}</option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="mb-2 block text-sm font-medium text-[#002333]">{t('doctorModal.doctor')}</span>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
              disabled={isDoctorLocked || !categoryId}
              className={`w-full rounded-lg border border-[#DAD8D7] px-4 py-3 text-sm text-[#687276] disabled:bg-[#F6F4F3] ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <option value="" disabled>
                {categoryId ? t('doctorModal.selectDoctor') : t('doctorModal.selectCategoryFirst')}
              </option>
              {filteredDoctors.map((item) => (
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
                doctorId={doctorId}
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

        {scheduleLoading && doctorId && (
          <p className="mt-4 text-sm text-[#687276]">{t('doctorModal.checkingSchedule')}</p>
        )}

        {isOpenSchedule && doctorId && !scheduleLoading && (
          <p className="mt-4 rounded-lg border border-[#E9E7E6] bg-[#F8FBFA] px-4 py-3 text-sm text-[#687276]">
            {t('doctorModal.openScheduleNote')}
          </p>
        )}

        {isConfigured && (
          <div className="mt-6">
            <AppointmentSlotPicker
              doctorId={doctorId}
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
