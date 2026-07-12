'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import close from '@/assets/contact/close_button.svg';
import calender from '@/assets/contact/calder.svg';
import Button from '@/components/web_button';
import AppointmentDatePicker from '@/components/booking/appointment-date-picker';
import AppointmentSlotPicker from '@/components/booking/appointment-slot-picker';
import { useTranslation } from 'react-i18next';
import { submitAppointmentBooking } from '@/lib/booking/submit-appointment';
import { useDoctorBookingSchedule } from '@/hooks/use-doctor-booking-schedule';
import { useBookingCategoryDoctors } from '@/hooks/use-booking-category-doctors';
import notify from '@/lib/ui/notify';

export default function AppointmentModal({
  isOpen,
  onClose,
  preselectedDoctor = '',
  preselectedDoctorId = '',
  preselectedCategoryId = '',
  lockSelection = false,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [mounted, setMounted] = useState(false);
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
    isActive: isOpen,
  });

  const { isConfigured, isOpenSchedule, loading: scheduleLoading } = useDoctorBookingSchedule(doctorId);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setSelectedDate(null);
      setSelectedSlot(null);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const resetForm = () => {
    setFormData({ name: '', phonenumber: '', age: '' });
    setSelectedDate(null);
    setSelectedSlot(null);
    resetSelection();
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
        doctorName: selectedDoctor?.displayName || preselectedDoctor,
        date: selectedDate,
        slot: selectedSlot,
        patientName: formData.name,
        phone: formData.phonenumber,
        age: formData.age,
        speciality: selectedCategoryName,
        requiresSchedule: isConfigured,
      });
      notify.success(t('doctorModal.bookingSuccess'));
      resetForm();
      onClose();
    } catch (error) {
      notify.error(error.message || t('doctorModal.bookingFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const Age = [
    { age: 'ageRanges.1-10' },
    { age: 'ageRanges.11-20' },
    { age: 'ageRanges.21-30' },
    { age: 'ageRanges.31-40' },
    { age: 'ageRanges.41-50' },
    { age: 'ageRanges.51-60' },
    { age: 'ageRanges.61-70' },
    { age: 'ageRanges.71-80' },
    { age: 'ageRanges.81-90' },
    { age: 'ageRanges.91-100' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-[12px] bg-white">
        <div className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          <div className="w-10 sm:w-12" />
          <h1 className="text-center font-inter text-lg font-medium leading-tight text-[#002333] sm:text-xl lg:text-[28px]">
            {t('doctorModal.title')}
          </h1>
          <button type="button" onClick={onClose} className="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-gray-100">
            <img src={close} alt="close" className="h-8 w-8 sm:h-10 sm:w-10" />
          </button>
        </div>

        <div className="whitespace-normal px-4 py-4 sm:px-6 sm:py-6 lg:px-20">
          <div className="text-center font-inter text-sm font-normal leading-relaxed text-[#687276] sm:text-base">
            {t('doctorModal.description')}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex-1 px-4 pb-6 sm:px-6 sm:pb-8 lg:px-10 lg:pb-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="mb-2 block font-inter text-sm font-medium text-[#002333] lg:text-base">
                  {t('doctorModal.serviceCategory')}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  disabled={isCategoryLocked}
                  className={`w-full rounded-lg border border-[#DAD8D7] bg-white px-4 py-3 text-sm text-[#687276] disabled:bg-[#F6F4F3] sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <option value="" disabled>{t('doctorModal.selectServiceCategory')}</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>{item.displayName}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="mb-2 block font-inter text-sm font-medium text-[#002333] lg:text-base">
                  {t('doctorModal.doctor')}
                </label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  required
                  disabled={isDoctorLocked || !categoryId}
                  className={`w-full rounded-lg border border-[#DAD8D7] bg-white px-4 py-3 text-sm text-[#687276] disabled:bg-[#F6F4F3] sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <option value="" disabled>
                    {categoryId ? t('doctorModal.selectDoctor') : t('doctorModal.selectCategoryFirst')}
                  </option>
                  {filteredDoctors.map((item) => (
                    <option key={item.id} value={item.id}>{item.displayName}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="mb-2 block font-inter text-sm font-medium text-[#002333] lg:text-base">
                  {t('doctorModal.fullName')}
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder={t('doctorModal.enterFullName')}
                  className={`w-full rounded-lg border border-[#DAD8D7] px-4 py-3 text-sm text-[#687276] placeholder-gray-400 sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="mb-2 block font-inter text-sm font-medium text-[#002333] lg:text-base">
                  {t('doctorModal.phoneNumber')}
                </label>
                <input
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  type="tel"
                  required
                  placeholder={t('doctorModal.enterPhone')}
                  className={`w-full rounded-lg border border-[#DAD8D7] px-4 py-3 text-sm text-[#687276] placeholder-gray-400 sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div className="sm:col-span-1 lg:col-span-1">
                <label className="mb-2 block font-inter text-sm font-medium text-[#002333] lg:text-base">
                  {t('doctorModal.age')}
                </label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-lg border border-[#DAD8D7] bg-white px-4 py-3 text-sm text-[#687276] sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <option value="" disabled>{t('doctorModal.selectAge')}</option>
                  {Age.map((item, index) => (
                    <option key={index} value={t(item.age)}>{t(item.age)}</option>
                  ))}
                </select>
              </div>

              {isConfigured && (
                <div>
                  <label className="mb-2 block font-inter text-sm font-medium text-[#002333] lg:text-base">
                    {t('doctorModal.date')}
                  </label>
                  <AppointmentDatePicker
                    doctorId={doctorId}
                    selectedDate={selectedDate}
                    onChange={handleDateChange}
                    isRTL={isRTL}
                    inputClassName={`w-full rounded-lg border border-[#DAD8D7] py-2 text-base font-normal text-[#687276] lg:py-3 ${isRTL ? 'pr-4 pl-50 lg:pl-30' : 'pl-4 pr-50 lg:pr-30'}`}
                    calendarIcon={<img src={calender} alt="Calendar" className="h-5 w-5" />}
                  />
                </div>
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

            <div className={`mt-6 flex sm:mt-8 ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <Button
                text={submitting ? t('doctorModal.booking') : t('doctorModal.bookNow')}
                onClick={handleSubmit}
                className="w-full px-8 py-3 sm:w-auto"
              />
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
