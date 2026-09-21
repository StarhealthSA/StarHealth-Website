'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import close from '@/assets/contact/close_button.svg';
import Button from '@/components/web_button';
import { submitOfferCallbackBooking } from '@/lib/booking/submit-offer-callback';
import { redirectToThankYou } from '@/lib/booking/thank-you-access';
import {
  resetAppointmentBookedTracking,
  trackAppointmentBooked,
} from '@/lib/analytics/track-appointment-booked';
import notify from '@/lib/ui/notify';

const AGE_RANGE_KEYS = [
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

export default function OfferAppointmentModal({
  isOpen,
  onClose,
  offers = [],
  preselectedOfferId = '',
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    offerId: '',
    name: '',
    phonenumber: '',
    age: '',
  });
  const wasOpenRef = useRef(false);

  const offerOptions = useMemo(
    () => offers.filter((offer) => offer?.id),
    [offers]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setFormData({
        offerId: preselectedOfferId || '',
        name: '',
        phonenumber: '',
        age: '',
      });
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, preselectedOfferId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedOffer = offerOptions.find((offer) => offer.id === formData.offerId);
  const selectedOfferLabel = selectedOffer
    ? (selectedOffer.treatment || selectedOffer.name || selectedOffer.id)
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.offerId || !formData.name.trim() || !formData.phonenumber.trim() || !formData.age) {
      return;
    }

    try {
      setSubmitting(true);
      resetAppointmentBookedTracking();
      await submitOfferCallbackBooking({
        offerId: formData.offerId,
        offerName: selectedOfferLabel,
        patientName: formData.name.trim(),
        phone: formData.phonenumber.trim(),
        age: formData.age,
      });
      trackAppointmentBooked();
      onClose();
      redirectToThankYou();
    } catch (error) {
      notify.error(error.message || t('offersPage.modal.bookingFailed'));
      setSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-[12px] bg-white">
        <div className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-6">
          <div className="w-10 sm:w-12" />
          <h1 className="text-center font-inter text-lg font-medium leading-tight text-[#002333] sm:text-xl lg:text-[28px]">
            {t('offersPage.modal.title')}
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-gray-100"
          >
            <img src={close} alt="close" className="h-8 w-8 sm:h-10 sm:w-10" />
          </button>
        </div>

        <div className="px-4 py-4 sm:px-6">
          <p className="text-center font-inter text-sm font-normal leading-relaxed text-[#687276] sm:text-base">
            {t('offersPage.modal.description')}
          </p>
          <p className="mt-3 rounded-lg border border-[#E9E7E6] bg-[#F8FBFA] px-4 py-3 text-center font-inter text-sm text-[#037B76]">
            {t('offersPage.modal.callbackNote')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-4 pb-6 sm:px-6 sm:pb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block font-inter text-sm font-medium text-[#002333] lg:text-base">
                  {t('offersPage.modal.offer')}
                </label>
                <select
                  name="offerId"
                  value={formData.offerId}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-lg border border-[#DAD8D7] bg-white px-4 py-3 text-sm text-[#687276] sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <option value="" disabled>
                    {t('offersPage.modal.selectOffer')}
                  </option>
                  {offerOptions.map((offer) => (
                    <option key={offer.id} value={offer.id}>
                      {offer.treatment || offer.name}
                      {offer.offerPriceLabel ? `: ${offer.offerPriceLabel}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block font-inter text-sm font-medium text-[#002333] lg:text-base">
                  {t('offersPage.modal.fullName')}
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder={t('offersPage.modal.enterFullName')}
                  className={`w-full rounded-lg border border-[#DAD8D7] px-4 py-3 text-sm text-[#687276] placeholder-gray-400 sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label className="mb-2 block font-inter text-sm font-medium text-[#002333] lg:text-base">
                  {t('offersPage.modal.phoneNumber')}
                </label>
                <input
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  type="tel"
                  required
                  placeholder={t('offersPage.modal.enterPhone')}
                  className={`w-full rounded-lg border border-[#DAD8D7] px-4 py-3 text-sm text-[#687276] placeholder-gray-400 sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label className="mb-2 block font-inter text-sm font-medium text-[#002333] lg:text-base">
                  {t('offersPage.modal.age')}
                </label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-lg border border-[#DAD8D7] bg-white px-4 py-3 text-sm text-[#687276] sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <option value="" disabled>
                    {t('offersPage.modal.selectAge')}
                  </option>
                  {AGE_RANGE_KEYS.map((key) => (
                    <option key={key} value={t(key)}>
                      {t(key)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-center sm:mt-8">
              <Button
                type="submit"
                text={submitting ? t('offersPage.modal.submitting') : t('offersPage.modal.submit')}
                className="!w-full px-8 py-3"
              />
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
