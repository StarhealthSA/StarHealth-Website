'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { submitEnquiry } from '@/lib/contact/submit-enquiry';
import { useServiceCategories } from '@/contexts/content-context';
import notify from '@/lib/ui/notify';

function MobileViewForm() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const categories = useServiceCategories(i18n.language);

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

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            await submitEnquiry(formData);
            notify.success('Message sent successfully!');
            setFormData({
                name: '',
                phonenumber: '',
                mail: '',
                country: '',
                speciality: '',
                address: '',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            notify.error(error.message || 'Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF]">
            <div className="mx-[30px] lg:mx-[120px]">
                <form onSubmit={handleSubmit}>
                    <div className="rounded-[16px] border border-[#C5E4DC] bg-gradient-to-br from-[#E8F5F2] via-[#F3FAF8] to-[#D9EEE8] p-4 shadow-[0_8px_24px_rgba(3,123,118,0.1)] sm:p-16">
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6">
                            <div>
                                <label className="block text-[14px] font-inter font-medium text-[#002333] mb-3">
                                    {t('contactPage.form.fullName')}
                                </label>
                                <input
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    type="text"
                                    required
                                    placeholder={t('contactPage.form.fullNamePlaceholder')}
                                    className={`w-full bg-white px-4 py-3 border border-[#DAD8D7] focus:border-[#037B76] rounded-[8px] text-[14px] font-inter font-normal text-[#687276] outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-inter font-medium text-[#002333] mb-3">
                                    {t('contactPage.form.phoneNumber')}
                                </label>
                                <input
                                    name='phonenumber'
                                    value={formData.phonenumber}
                                    onChange={handleChange}
                                    type="tel"
                                    required
                                    placeholder={t('contactPage.form.phoneNumberPlaceholder')}
                                    className={`w-full bg-white px-4 py-3 border border-[#DAD8D7] focus:border-[#037B76] rounded-[8px] text-[14px] font-inter font-normal text-[#687276] outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-inter font-medium text-[#002333] mb-3">
                                    {t('contactPage.form.email')}
                                </label>
                                <input
                                    name='mail'
                                    value={formData.mail}
                                    onChange={handleChange}
                                    type="email"
                                    required
                                    placeholder={t('contactPage.form.emailPlaceholder')}
                                    className={`w-full bg-white px-4 py-3 border border-[#DAD8D7] focus:border-[#037B76] rounded-[8px] text-[14px] font-inter font-normal text-[#687276] outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-inter font-medium text-[#002333] mb-3">
                                    {t('contactPage.form.countryOfResidence')}
                                </label>
                                <input
                                    name='country'
                                    value={formData.country}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder={t('contactPage.form.countryOfResidencePlaceholder')}
                                    className={`w-full bg-white px-4 py-3 border border-[#DAD8D7] focus:border-[#037B76] rounded-[8px] text-[14px] font-inter font-normal text-[#687276] outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-inter font-medium text-[#002333] mb-3">
                                    {t('contactPage.form.speciality')}
                                </label>
                                <div className="relative">
                                    <select
                                        name='speciality'
                                        value={formData.speciality}
                                        onChange={handleChange}
                                        className={`w-full bg-white px-4 py-3 border border-[#DAD8D7] focus:border-[#037B76] rounded-[8px] appearance-none text-[14px] font-inter font-normal text-[#687276] outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                                    >
                                        <option value="">{t('contactPage.form.select')}</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.displayName}>
                                                {category.displayName}
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
                                <label className="block text-[14px] font-inter font-medium text-[#002333] mb-3">
                                    {t('contactPage.form.address')}
                                </label>
                                <input
                                    name='address'
                                    value={formData.address}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder={t('contactPage.form.addressPlaceholder')}
                                    className={`w-full bg-white px-4 py-3 border border-[#DAD8D7] focus:border-[#037B76] rounded-[8px] text-[14px] font-inter font-normal text-[#687276] outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-inter font-medium text-[#002333] mb-3">
                                    {t('contactPage.form.message')}
                                </label>
                                <textarea
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t('contactPage.form.messagePlaceholder')}
                                    rows={5}
                                    className={`w-full bg-white px-4 py-3 border border-[#DAD8D7] focus:border-[#037B76] rounded-[8px] text-[14px] font-inter font-normal text-[#687276] outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                                />
                            </div>
                        </div>

                        <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-3 bg-gradient-to-tl cursor-pointer from-[#037B76] to-[#AED5C6] hover:bg-gradient-to-br hover:from-[#037B76] hover:to-[#AED5C6] text-white font-medium rounded-lg text-[14px] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? '...' : t('contactPage.form.sendMessage')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MobileViewForm;