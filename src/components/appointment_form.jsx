'use client';

import close from "../assets/contact/close_button.svg"
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import calender from '../assets/contact/calder.svg';
import React, { useState } from 'react';
import Button from "../components/web_button"


function appoinmentForm(props) {

    const [selectedDate, setSelectedDate] = useState(null);

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
        <div className="bg-white flex flex-col justify-center items-center rounded-[12px]">
            <div className="flex flex-row justify-end mt-[50px] items-center">
                <h1 className="text-[28px] font-weight-[500px] leading-[36px] text-inter text-[#002333]">Book an Appointment</h1>
                <button onClick={props.onClose}>
                    <img src={close} alt="close" className="h-[40px] absolute right-52 top-40 w-[40px]" />
                </button>
            </div>
            <p className="font-weight-[400px] text-[16px] text-inter leading-[24px] mt-5 w-full lg:w-1/2 text-center text-[#687276]">
                Choose from our network of qualified professionals, select a convenient time slot, your age and phone number, and book your appointment in just a few steps.
            </p>
            <div className="w-full mt-5 px-10 mb-10 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div>
                        <label className="block text-base font-medium text-[#002333] mb-3">
                            Speciality
                        </label>
                        <div className="relative">
                            <select className="w-full px-4 py-3 border border-[#DAD8D7] rounded-lg appearance-none focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276]">
                                <option value="" disabled selected className="text-gray-400">
                                    Select
                                </option>
                                {Speciality.map((item, index) => (
                                    <option key={index} value={item.sty}>
                                        {item.sty}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-[#687276]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-base font-medium text-[#002333] mb-3">
                            Doctor
                        </label>
                        <div className="relative">
                            <select className="w-full px-4 py-3 border border-[#DAD8D7] rounded-lg appearance-none focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276]">
                                <option value="" disabled selected className="text-gray-400">
                                    Select
                                </option>
                                {Doctors.map((item, index) => (
                                    <option key={index} value={item.sty}>
                                        {item.doc}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-[#687276]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-base font-medium text-[#002333] mb-3">
                            Full Name
                        </label>
                        <input
                            type="tel"
                            placeholder="Enter Name"
                            className="w-full px-4 py-3 border border-[#DAD8D7] rounded-lg focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276]"
                        />
                    </div>

                    <div>
                        <label className="block text-base font-medium text-[#002333] mb-3">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="Enter Phone Number"
                            className="w-full px-4 py-3 border border-[#DAD8D7] rounded-lg focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276]"
                        />
                    </div>

                    <div>
                        <label className="block text-base font-medium text-[#002333] mb-3">
                            age
                        </label>
                        <div className="relative">
                            <select className="w-full px-4 py-3 border border-[#DAD8D7] rounded-lg appearance-none focus:border-[#DAD8D7] focus:outline-none text-base font-normal text-[#687276]">
                                <option value="" disabled selected className="text-gray-400">
                                    Select
                                </option>
                                {Age.map((item, index) => (
                                    <option key={index} value={item.sty}>
                                        {item.age}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-[#687276]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="mt-0">
                        <label className="block text-base font-medium mb-3 text-[#002333]">
                            Date
                        </label>
                        <div className="relative w-full">
                            <DatePicker
                                readOnly={false}
                                keyboard={false}
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                placeholderText="Select Date"
                                className="w-full py-3 border border-[#DAD8D7] rounded-lg focus:outline-none text-base font-normal text-[#687276] pl-4 pr-10"
                                calendarClassName="font-inter bg-white text-[#002333] border border-[#DAD8D7] rounded-lg shadow-lg z-[100]"
                                showPopperArrow={false}
                                popperClassName="!z-50"
                            />
                            <div className="absolute inset-y-0 right-0 items-end px-3 pointer-events-none">
                                <img src={calender} alt="Calendar" className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row mt-10 justify-end items-end">
                    <Button text="Book Now" />
                </div>

            </div>
        </div>
    );
}

export default appoinmentForm
