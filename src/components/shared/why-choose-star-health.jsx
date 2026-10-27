'use client';

import { useMemo, useState } from 'react';
import Reveal, { staggerDelay } from '@/components/reveal';
import AnimatedCounter from '@/components/shared/animated-counter';
import AppointmentModal from '@/components/doctors/appointment-modal';
import { getCounterFallbackIcon } from '@/components/shared/why-choose-icons';
import { DEFAULT_WHY_CHOOSE_SETTINGS } from '@/lib/content/why-choose-defaults';
import { getWhatsAppNumber } from '@/lib/whatsapp';
import { useTranslation } from 'react-i18next';

const STATIC_COUNTERS = DEFAULT_WHY_CHOOSE_SETTINGS.counters;

/**
 * Shared "Why Choose Star Health" section (Home + About).
 * Static content from locale files + fixed counter values.
 */
export default function WhyChooseStarHealth({ className = '' }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const copy = useMemo(() => {
    const paragraphs = t('whyChooseStarHealth.paragraphs', { returnObjects: true });
    const body = Array.isArray(paragraphs) ? paragraphs.filter(Boolean) : [];

    const counters = STATIC_COUNTERS.map((counter) => ({
      ...counter,
      label: t(`whyChooseStarHealth.counters.${counter.id}.label`, {
        defaultValue: counter.label?.en || '',
      }),
    }));

    return {
      title: t('whyChooseStarHealth.title'),
      body,
      counters,
      bookNowLabel: t('whyChooseStarHealth.bookNow'),
      whatsappLabel: t('whyChooseStarHealth.whatsapp'),
      whatsappMessage: t('whyChooseStarHealth.whatsappMessage'),
      whatsappNumber: getWhatsAppNumber(),
    };
  }, [t]);

  const whatsappNumber = String(copy.whatsappNumber || '').replace(/\D/g, '') || getWhatsAppNumber();
  const whatsappHref = `https://wa.me/${whatsappNumber}${
    copy.whatsappMessage ? `?text=${encodeURIComponent(copy.whatsappMessage)}` : ''
  }`;

  const emphasis = copy.body[copy.body.length - 1];
  const leadParagraphs = copy.body.slice(0, -1);

  return (
    <section
      className={`why-choose-star-health ${className}`.trim()}
      aria-labelledby="why-choose-star-health-title"
    >
      <div className="why-choose-star-health__glow why-choose-star-health__glow--a" aria-hidden />
      <div className="why-choose-star-health__glow why-choose-star-health__glow--b" aria-hidden />

      <div className="why-choose-star-health__shell site-section-shell">
        <Reveal>
          <header className="why-choose-star-health__header">
            <p className="why-choose-star-health__eyebrow">
              {t('whyChooseStarHealth.eyebrow', { defaultValue: 'Star Health' })}
            </p>
            <h2 id="why-choose-star-health-title" className="why-choose-star-health__title">
              {copy.title}
            </h2>
            <span className="why-choose-star-health__rule" aria-hidden />
          </header>
        </Reveal>

        <div className="why-choose-star-health__main">
          <div className="why-choose-star-health__copy">
            {leadParagraphs.map((text, index) => (
              <Reveal key={index} delay={staggerDelay(index, 90)}>
                <p className="why-choose-star-health__paragraph">{text}</p>
              </Reveal>
            ))}
            {emphasis ? (
              <Reveal delay={staggerDelay(leadParagraphs.length, 90)}>
                <p className="why-choose-star-health__closing">{emphasis}</p>
              </Reveal>
            ) : null}
          </div>

          {copy.counters.length > 0 ? (
            <aside className="why-choose-star-health__proof" aria-label={copy.title}>
              <div className="why-choose-star-health__rail" role="list">
                {copy.counters.map((counter, index) => {
                  const FallbackIcon = getCounterFallbackIcon(counter.id, counter.suffix);
                  return (
                    <Reveal
                      key={counter.id || index}
                      delay={staggerDelay(index, 110)}
                      className="why-choose-star-health__rail-item"
                    >
                      <div role="listitem" className="why-choose-star-health__stat">
                        <div className="why-choose-star-health__stat-icon">
                          <FallbackIcon className="why-choose-star-health__metric-svg" />
                        </div>
                        <AnimatedCounter
                          value={counter.value}
                          prefix={counter.prefix}
                          suffix={counter.suffix}
                          decimals={counter.decimals}
                        />
                        <p className="why-choose-star-health__counter-label">{counter.label}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </aside>
          ) : null}
        </div>

        <Reveal delay={240}>
          <div className="why-choose-star-health__actions">
            <button
              type="button"
              className="why-choose-star-health__cta why-choose-star-health__cta--primary"
              onClick={() => setShowModal(true)}
            >
              {copy.bookNowLabel}
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="why-choose-star-health__cta why-choose-star-health__cta--whatsapp"
            >
              <span className="why-choose-star-health__wa-dot" aria-hidden />
              {copy.whatsappLabel}
            </a>
          </div>
        </Reveal>
      </div>

      <AppointmentModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}
