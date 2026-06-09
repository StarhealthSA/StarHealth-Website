'use client';

import { useEffect } from 'react';
import Header from './header/header';
import Whatnext from '../what_next';

function AboutSection() {
  useEffect(() => {
    document.title = 'About Star Health | Premium Medical Care in Riyadh';

    const setMeta = (name, content, attr = 'name') => {
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('description', 'Learn about Star Health Medical Centre in Riyadh: our mission, specialties, patient process, quality standards, and trusted care model for families.');
    setMeta('keywords', 'about star health, medical centre riyadh, family medicine, pediatrics, dentistry, women health, trusted clinic');
    setMeta('og:title', 'About Star Health | Premium Medical Care in Riyadh', 'property');
    setMeta('og:description', 'Discover Star Health values, services, quality approach, and patient-first care in Riyadh.', 'property');
  }, []);

  const content = 'Book your consultation, explore our specialties, or speak to our team. We are here to guide every step of your healthcare journey.';

  const specialties = [
    'General Medicine',
    'Family Medicine',
    'Internal Medicine',
    'Obstetrics & Gynecology',
    'Dentistry & Orthodontics',
    'Pediatrics',
    'Orthopedics',
    'Laboratory Services'
  ];

  const process = [
    {
      title: '1. Simple Appointment Access',
      body: 'Book online or by phone and get support selecting the right specialty based on your need.'
    },
    {
      title: '2. Thorough Clinical Review',
      body: 'Our doctors listen carefully, review your history, and explain diagnosis and options with clarity.'
    },
    {
      title: '3. Coordinated Treatment Plan',
      body: 'From tests to follow-ups, your care is organized across departments for better continuity.'
    },
    {
      title: '4. Follow-up and Prevention',
      body: 'We do not stop at treatment. Preventive guidance and long-term monitoring protect your health outcomes.'
    }
  ];

  const faq = [
    {
      q: 'What makes Star Health different?',
      a: 'We combine compassionate care, experienced doctors, and practical convenience in one integrated clinic environment.'
    },
    {
      q: 'Do you support insured and cash patients?',
      a: 'Yes. We support major insurance workflows and also provide clear options for self-pay patients.'
    },
    {
      q: 'Can families access multiple specialties in one visit cycle?',
      a: 'Yes. Our setup is optimized for family healthcare, reducing the need to visit multiple facilities.'
    }
  ];

  return (
    <div className="bg-[#f8fbfa]">
      <Header />

      <section className="px-[20px] md:px-[30px] lg:px-[120px] py-14 lg:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-[#dce9e5] bg-white p-6">
            <h2 className="text-[20px] font-semibold text-[#002333]">Our Vision</h2>
            <p className="mt-3 text-[15px] leading-[25px] text-[#58696f]">To become the most trusted neighborhood healthcare destination in Riyadh by delivering clinical excellence with genuine human care.</p>
          </article>
          <article className="rounded-2xl border border-[#dce9e5] bg-white p-6">
            <h2 className="text-[20px] font-semibold text-[#002333]">Our Mission</h2>
            <p className="mt-3 text-[15px] leading-[25px] text-[#58696f]">Provide accessible, preventive, and personalized healthcare for families through modern diagnostics and multidisciplinary expertise.</p>
          </article>
          <article className="rounded-2xl border border-[#dce9e5] bg-white p-6">
            <h2 className="text-[20px] font-semibold text-[#002333]">Our Promise</h2>
            <p className="mt-3 text-[15px] leading-[25px] text-[#58696f]">Clear communication, ethical practice, and continuity of care from first consultation through recovery and long-term wellness.</p>
          </article>
        </div>
      </section>

      <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
        <div className="overflow-hidden rounded-3xl bg-[#063330] text-white">
          <div className="grid gap-8 p-8 md:grid-cols-2 lg:p-12">
            <div>
              <h2 className="text-[28px] leading-[36px] font-semibold">Built for Premium Patient Experience</h2>
              <p className="mt-4 text-[15px] leading-[25px] text-[#d0e2dc]">From reception flow to consultation rooms, every touchpoint is designed for calm, privacy, and confidence. We focus on reducing waiting friction and improving communication across the complete care path.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-[12px] uppercase tracking-[0.12em] text-[#aed5c6]">Average Wait</p>
                <p className="mt-2 text-[26px] font-semibold">15-20 min</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-[12px] uppercase tracking-[0.12em] text-[#aed5c6]">Patient Follow-ups</p>
                <p className="mt-2 text-[26px] font-semibold">48 hrs</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-[12px] uppercase tracking-[0.12em] text-[#aed5c6]">Specialties</p>
                <p className="mt-2 text-[26px] font-semibold">8+</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-[12px] uppercase tracking-[0.12em] text-[#aed5c6]">Care Model</p>
                <p className="mt-2 text-[26px] font-semibold">Family-first</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
        <h2 className="text-[28px] font-semibold text-[#002333]">Core Medical Specialties</h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-[25px] text-[#5b6a71]">Our multidisciplinary services support preventive care, acute treatment, chronic condition management, and long-term family wellness.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map((item) => (
            <div key={item} className="rounded-xl border border-[#d8e6e2] bg-white px-4 py-3 text-[15px] font-medium text-[#123f49]">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
        <h2 className="text-[28px] font-semibold text-[#002333]">How Care Works at Star Health</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {process.map((item) => (
            <article key={item.title} className="rounded-2xl bg-white p-6 border border-[#dfebe7]">
              <h3 className="text-[19px] font-semibold text-[#02353f]">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-[25px] text-[#5a6b72]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-16 lg:pb-20">
        <h2 className="text-[28px] font-semibold text-[#002333]">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <article key={item.q} className="rounded-2xl border border-[#dbe8e4] bg-white p-6">
              <h3 className="text-[18px] font-semibold text-[#033a45]">{item.q}</h3>
              <p className="mt-2 text-[15px] leading-[25px] text-[#607179]">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <Whatnext text={content} />
    </div>
  );
}

export default AboutSection;
