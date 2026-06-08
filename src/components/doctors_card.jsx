import arrow from '../assets/home/arrow_right.svg'
import { useState } from 'react';
import close from "../assets/contact/close_button.svg"
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import calender from '../assets/contact/calder.svg';
import Button from "../components/web_button";
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';

function DoctorsCard(props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phonenumber: '',
    age: '',
    speciality: '',
    doctor: ''
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
        handleCloseModal(); 
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        alert('Failed to book appointment. Please try again.');
      });
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

  return (
    <div className="flex flex-col justify-between lg:mb-1 bg-[#FFFFFF] border-[1px] border-[#E9E7E6] rounded-[12px] py-[30px] px-[20px]">
      <img src={props.imgs} alt='doctor' className="w-full h-auto object-cover" />
      <h1 className='font-medium text-[16px] lg:text-[20px] text-[#002333] font-inter mt-4'>{props.name}</h1>
      <p className='font-medium lg:font-normal text-[12px] lg:text-[16px] text-[#687276] font-inter mt-2'>{props.specialty}</p>
      <div className='flex flex-row justify-between items-center mt-8 md:mt-4 lg:mt-8'>
        <h1 className='text-[14px] lg:text-[16px] text-[#002333] font-medium font-inter'>{t('medicalTeam.appointment')}</h1>
        <img src={arrow} alt='arrow' onClick={() => setShowModal(true)} className='w-[30px] h-[30px] cursor-pointer hover:filter hover:brightness-90 hover:saturate(0) hover:invert-[0.3]' />
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white flex flex-col rounded-[12px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 border-b border-gray-100">
              <div className="w-10 sm:w-12"></div>
              <h1 className="text-lg sm:text-xl lg:text-[28px] font-medium text-center text-[#002333] font-inter leading-tight">
                {t('doctorModal.title')}
              </h1>
              <button
                onClick={handleCloseModal}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <img src={close} alt="close" className="h-8 w-8 sm:h-10 sm:w-10" />
              </button>
            </div>

            <div className="px-4 sm:px-6 lg:px-20 py-4 sm:py-6 whitespace-normal">
              <div className="text-sm sm:text-base font-normal font-inter leading-relaxed text-center text-[#687276]">
                {t('doctorModal.description')}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex-1 px-4 sm:px-6 lg:px-10 pb-6 sm:pb-8 lg:pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {/* Specialty */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm lg:text-base font-medium text-[#002333] mb-2 font-inter">
                      {t('doctorModal.specialty')}
                    </label>
                    <div className="relative">
                      <select
                        name='speciality'
                        value={formData.speciality}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg appearance-none focus:border-[#4A90E2] focus:outline-none focus:ring-1 focus:ring-[#4A90E2] text-sm sm:text-base text-[#687276] bg-white ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        <option value="" disabled>
                          {t('doctorModal.selectSpecialty')}
                        </option>
                        {Speciality.map((item, index) => (
                          <option key={index} value={item.sty}>
                            {t(item.sty)}
                          </option>
                        ))}
                      </select>
                      <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-3 pointer-events-none`}>
                        <svg className="w-4 h-4 text-[#687276]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm lg:text-base font-medium text-[#002333] mb-2 font-inter">
                      {t('doctorModal.doctor')}
                    </label>
                    <div className="relative">
                      <select
                        name='doctor'
                        value={formData.doctor}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg appearance-none focus:border-[#4A90E2] focus:outline-none focus:ring-1 focus:ring-[#4A90E2] text-sm sm:text-base text-[#687276] bg-white ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        <option value="" disabled>
                          {t('doctorModal.selectDoctor')}
                        </option>
                        {Doctors.map((item, index) => (
                          <option key={index} value={item.doc}>
                            {item.doc}
                          </option>
                        ))}
                      </select>
                      <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-3 pointer-events-none`}>
                        <svg className="w-4 h-4 text-[#687276]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm lg:text-base font-medium text-[#002333] mb-2 font-inter">
                      {t('doctorModal.fullName')}
                    </label>
                    <input
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      required
                      placeholder={t('doctorModal.enterFullName')}
                      className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg focus:border-[#4A90E2] focus:outline-none focus:ring-1 focus:ring-[#4A90E2] text-sm sm:text-base text-[#687276] placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm lg:text-base font-medium text-[#002333] mb-2 font-inter">
                      {t('doctorModal.phoneNumber')}
                    </label>
                    <input
                      name='phonenumber'
                      value={formData.phonenumber}
                      onChange={handleChange}
                      type="tel"
                      required
                      placeholder={t('doctorModal.enterPhone')}
                      className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg focus:border-[#4A90E2] focus:outline-none focus:ring-1 focus:ring-[#4A90E2] text-sm sm:text-base text-[#687276] placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                  </div>

                  <div className="sm:col-span-1 lg:col-span-1">
                    <label className="block text-sm lg:text-base font-medium text-[#002333] mb-2 font-inter">
                      {t('doctorModal.age')}
                    </label>
                    <div className="relative">
                      <select
                        name='age'
                        value={formData.age}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border border-[#DAD8D7] rounded-lg appearance-none focus:border-[#4A90E2] focus:outline-none focus:ring-1 focus:ring-[#4A90E2] text-sm sm:text-base text-[#687276] bg-white ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        <option value="" disabled>
                          {t('doctorModal.selectAge')}
                        </option>
                        {Age.map((item, index) => (
                          <option key={index} value={item.age}>
                            {t(item.age)}
                          </option>
                        ))}
                      </select>
                      <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-3 pointer-events-none`}>
                        <svg className="w-4 h-4 text-[#687276]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="mt-0">
                    <label className="block text-[14px] lg:text-[16px] font-inter font-medium text-[#002333] mb-2">
                      {t('doctorModal.date')}
                    </label>
                    <div className="relative">
                      <DatePicker
                        name='date'
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        placeholderText={t('doctorModal.selectDate')}
                        className={`w-full py-2 lg:py-3 border border-[#DAD8D7] rounded-lg focus:outline-none text-base font-normal text-[#687276] ${isRTL ? 'pr-4 pl-50 lg:pl-30' : 'pl-4 pr-50 lg:pr-30'}`}
                        calendarClassName="font-inter bg-white w-full text-[#002333] border border-[#DAD8D7] rounded-lg shadow-lg items-center"
                        showPopperArrow={false}
                        popperClassName="!z-50"
                        minDate={new Date()}
                        required
                      />
                      <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-3 pointer-events-none`}>
                        <img src={calender} alt="Calendar" className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`flex mt-6 sm:mt-8 ${isRTL ? 'justify-start sm:justify-start' : 'justify-end sm:justify-end'}`}>
                  <Button
                    text={t('doctorModal.bookNow')}
                    onClick={handleSubmit}
                    className="w-full sm:w-auto px-8 py-3"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorsCard;