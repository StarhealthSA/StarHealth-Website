'use client';

import { useState } from 'react';
import Reveal, { staggerDelay } from '@/components/reveal';
import DoctorSectionHeader from './doctor-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

function GalleryLightbox({ images, initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#002333]/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full bg-white/10 px-3 py-1 font-inter text-sm text-white"
      >
        ✕
      </button>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + images.length) % images.length); }}
            className="absolute left-4 rounded-full bg-white/10 px-3 py-2 text-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % images.length); }}
            className="absolute right-4 rounded-full bg-white/10 px-3 py-2 text-white"
          >
            ›
          </button>
        </>
      )}
      <img
        src={images[index]}
        alt=""
        className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default function DoctorProfile({ doctor }) {
  const { t, i18n } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const expertise = (doctor.areasOfExpertise || []).map((item) =>
    getLocalizedText(item, i18n.language)
  ).filter(Boolean);

  const certifications = (doctor.certifications || []).map((item) => ({
    title: getLocalizedText(item.title || item, i18n.language),
    year: item.year,
  }));

  const awards = (doctor.awards || []).map((item) => ({
    title: getLocalizedText(item.title || item, i18n.language),
    year: item.year,
    description: getLocalizedText(item.description, i18n.language),
  }));

  const languages = (doctor.languagesKnown || []).map((item) =>
    getLocalizedText(item, i18n.language)
  ).filter(Boolean);

  const gallery = doctor.galleryImages || [];
  const hasAbout = doctor.displayBiography || expertise.length > 0 || languages.length > 0;
  const hasCredentials = certifications.length > 0 || awards.length > 0;

  return (
    <>
      {doctor.displayBiography && (
        <section id="about" className="doctor-detail-section scroll-mt-32">
          <Reveal>
            <DoctorSectionHeader
              eyebrow={t('doctorDetail.aboutDoctor')}
              title={t('doctorDetail.biography')}
              description={t('doctorDetail.biographyLead')}
            />
            <div className="doctor-content-card mt-8">
              <p className="font-inter text-base leading-[1.9] text-[#586971] md:text-lg">
                {doctor.displayBiography}
              </p>
            </div>
          </Reveal>
        </section>
      )}

      {expertise.length > 0 && (
        <section id="expertise" className="doctor-detail-section scroll-mt-32">
          <Reveal delay={staggerDelay(1)}>
            <DoctorSectionHeader
              eyebrow={t('doctorDetail.careHighlights')}
              title={t('doctorDetail.expertise')}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {expertise.map((item, i) => (
                <span key={i} className="doctor-expertise-pill">
                  <span className="doctor-expertise-dot" aria-hidden />
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {languages.length > 0 && (
        <section className="doctor-detail-section">
          <Reveal delay={staggerDelay(2)}>
            <DoctorSectionHeader title={t('doctorDetail.languages')} />
            <div className="mt-6 flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span key={lang} className="rounded-full border border-[#D7E6E2] bg-white px-4 py-2 font-inter text-sm text-[#586971]">
                  {lang}
                </span>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {hasCredentials && (
        <section id="credentials" className="doctor-detail-section scroll-mt-32">
          <Reveal delay={staggerDelay(3)}>
            <DoctorSectionHeader
              eyebrow={t('doctorDetail.credentials')}
              title={t('doctorDetail.credentialsTitle')}
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {certifications.map((item, i) => (
                <article key={`cert-${i}`} className="doctor-credential-card">
                  <p className="font-inter text-xs font-semibold uppercase tracking-wide text-[#037B76]">
                    {t('doctorDetail.certifications')}
                  </p>
                  <p className="doctor-display-title mt-2 text-lg font-semibold text-[#002333]">{item.title}</p>
                  {item.year && <p className="mt-1 font-inter text-sm text-[#687276]">{item.year}</p>}
                </article>
              ))}
              {awards.map((item, i) => (
                <article key={`award-${i}`} className="doctor-credential-card">
                  <p className="font-inter text-xs font-semibold uppercase tracking-wide text-[#037B76]">
                    {t('doctorDetail.awards')}
                  </p>
                  <p className="doctor-display-title mt-2 text-lg font-semibold text-[#002333]">{item.title}</p>
                  {item.year && <p className="mt-1 font-inter text-sm text-[#687276]">{item.year}</p>}
                  {item.description && (
                    <p className="mt-2 font-inter text-sm leading-relaxed text-[#687276]">{item.description}</p>
                  )}
                </article>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {gallery.length > 0 && (
        <section id="gallery" className="doctor-detail-section scroll-mt-32">
          <Reveal delay={staggerDelay(4)}>
            <DoctorSectionHeader
              eyebrow={t('doctorDetail.inPractice')}
              title={t('doctorDetail.gallery')}
              description={t('doctorDetail.galleryLead')}
            />
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {gallery.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
                >
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-[#002333]/0 transition group-hover:bg-[#002333]/20" />
                </button>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {!hasAbout && !hasCredentials && gallery.length === 0 && (
        <section id="about" className="doctor-detail-section scroll-mt-32">
          <Reveal>
            <div className="doctor-content-card text-center">
              <p className="font-inter text-[#687276]">{t('doctorDetail.profileComingSoon')}</p>
            </div>
          </Reveal>
        </section>
      )}

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
