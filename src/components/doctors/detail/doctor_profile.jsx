'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

export default function DoctorProfile({ doctor }) {
  const { t, i18n } = useTranslation();

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

  return (
    <section className="px-[20px] py-14 md:px-[60px] lg:px-[120px] lg:py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        {doctor.displayBiography && (
          <Reveal>
            <h2 className="font-inter text-2xl font-semibold text-[#002333]">{t('doctorDetail.biography')}</h2>
            <p className="mt-4 font-inter text-base leading-relaxed text-[#687276]">{doctor.displayBiography}</p>
          </Reveal>
        )}

        {expertise.length > 0 && (
          <Reveal delay={staggerDelay(1)}>
            <h2 className="font-inter text-2xl font-semibold text-[#002333]">{t('doctorDetail.expertise')}</h2>
            <ul className="mt-4 grid gap-2 md:grid-cols-2">
              {expertise.map((item, i) => (
                <li key={i} className="flex items-start gap-2 font-inter text-[#687276]">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#037B76]" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {certifications.length > 0 && (
          <Reveal delay={staggerDelay(2)}>
            <h2 className="font-inter text-2xl font-semibold text-[#002333]">{t('doctorDetail.certifications')}</h2>
            <div className="mt-4 space-y-3">
              {certifications.map((item, i) => (
                <div key={i} className="rounded-xl border border-[#E9E7E6] bg-white p-4">
                  <p className="font-medium text-[#002333]">{item.title}</p>
                  {item.year && <p className="text-sm text-[#687276]">{item.year}</p>}
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {awards.length > 0 && (
          <Reveal delay={staggerDelay(3)}>
            <h2 className="font-inter text-2xl font-semibold text-[#002333]">{t('doctorDetail.awards')}</h2>
            <div className="mt-4 space-y-3">
              {awards.map((item, i) => (
                <div key={i} className="rounded-xl border border-[#E9E7E6] bg-white p-4">
                  <p className="font-medium text-[#002333]">{item.title}</p>
                  {item.year && <p className="text-sm text-[#687276]">{item.year}</p>}
                  {item.description && <p className="mt-1 text-sm text-[#687276]">{item.description}</p>}
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {languages.length > 0 && (
          <Reveal delay={staggerDelay(4)}>
            <h2 className="font-inter text-2xl font-semibold text-[#002333]">{t('doctorDetail.languages')}</h2>
            <p className="mt-3 font-inter text-[#687276]">{languages.join(' · ')}</p>
          </Reveal>
        )}

        {(doctor.galleryImages || []).length > 0 && (
          <Reveal delay={staggerDelay(5)}>
            <h2 className="font-inter text-2xl font-semibold text-[#002333]">{t('doctorDetail.gallery')}</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {doctor.galleryImages.map((url) => (
                <img key={url} src={url} alt="" className="h-32 w-full rounded-xl object-cover" />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
