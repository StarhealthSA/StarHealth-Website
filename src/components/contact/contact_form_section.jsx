'use client';

import Reveal from '../reveal';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import emailjs from '@emailjs/browser';

function ContactForm() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    phonenumber: '',
    mail: '',
    country: '',
    speciality: '',
    address: '',
    message: ''
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
    const templateId = 'template_jdttqx9';
    const publicKey = '3hR26mPB0OTAoNfhQ';

    const templateParams = {
      name: formData.name,
      phonenumber: formData.phonenumber,
      mail: formData.mail,
      country: formData.country,
      speciality: formData.speciality,
      address: formData.address,
      message: formData.message
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully!', response);
        alert('Message sent successfully!');
        setFormData({
          name: '',
          phonenumber: '',
          mail: '',
          country: '',
          speciality: '',
          address: '',
          message: ''
        });
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        alert('Failed to send message. Please try again.');
      });
  };

  const Speciality = [
    { sty: t('contactPage.form.specialties.generalMedicine') },
    { sty: t('contactPage.form.specialties.internalMedicine') },
    { sty: t('contactPage.form.specialties.pediatrics') },
    { sty: t('contactPage.form.specialties.obg') },
    { sty: t('contactPage.form.specialties.generalDentistry') },
    { sty: t('contactPage.form.specialties.orthodontics') },
    { sty: t('contactPage.form.specialties.urology') },
    { sty: t('contactPage.form.specialties.laserTreatments') },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <Reveal>
        <form onSubmit={handleSubmit}>
          <div className="bg-[#F6F4F3] rounded-2xl shadow-sm p-8 sm:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
              <div>
                <label className="block text-base font-family-inter font-medium text-[#002333] mb-3">
                  {t('contactPage.form.fullName')}
                </label>
                <input
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder={t('contactPage.form.fullNamePlaceholder')}
                  className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label className="block text-base font-family-inter font-medium text-[#002333] mb-3">
                  {t('contactPage.form.phoneNumber')}
                </label>
                <input
                  name='phonenumber'
                  value={formData.phonenumber}
                  onChange={handleChange}
                  type="tel"
                  required
                  placeholder={t('contactPage.form.phoneNumberPlaceholder')}
                  className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-base font-family-inter font-medium text-[#002333] mb-3">
                  {t('contactPage.form.email')}
                </label>
                <input
                  name='mail'
                  value={formData.mail}
                  onChange={handleChange}
                  type="email"
                  required
                  placeholder={t('contactPage.form.emailPlaceholder')}
                  className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-base font-family-inter font-medium text-[#002333] mb-3">
                  {t('contactPage.form.countryOfResidence')}
                </label>
                <input
                  name='country'
                  value={formData.country}
                  onChange={handleChange}
                  type="text"
                  placeholder={t('contactPage.form.countryOfResidencePlaceholder')}
                  className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label className="block text-base font-family-inter font-medium text-[#002333] mb-3">
                  {t('contactPage.form.speciality')}
                </label>
                <div className="relative">
                  <select
                    name='speciality'
                    value={formData.speciality}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg appearance-none focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <option value="" disabled className="text-gray-400">
                      {t('contactPage.form.select')}
                    </option>
                    {Speciality.map((item, index) => (
                      <option key={index} value={item.sty}>
                        {item.sty}
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

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-base font-family-inter font-medium text-[#002333] mb-3">
                  {t('contactPage.form.address')}
                </label>
                <input
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  type="text"
                  placeholder={t('contactPage.form.addressPlaceholder')}
                  className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-base font-family-inter font-medium text-[#002333] mb-3">
                {t('contactPage.form.message')}
              </label>
              <textarea
                name='message'
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contactPage.form.messagePlaceholder')}
                rows={5}
                className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'text-right' : 'text-left'}`}
              />
            </div>

            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <button
                type="submit"
                className="px-6 md:px-8 py-3 bg-gradient-to-tl cursor-pointer from-[#037B76] to-[#AED5C6] hover:bg-gradient-to-br hover:from-[#037B76] hover:to-[#AED5C6] text-white font-family-inter font-medium rounded-lg transition-all duration-200"
              >
                {t('contactPage.form.sendMessage')}
              </button>
            </div>
          </div>
        </form>
        </Reveal>
      </div>
    </div>
  )
}

export default ContactForm;