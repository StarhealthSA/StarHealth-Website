'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/reveal';
import { GIVEAWAY, getGiveawayEntryWhatsAppUrl } from '@/lib/giveaway/config';
import { staggerDelay } from '@/lib/stagger_delay';

const FAQ_KEYS = ['open', 'enter', 'winners', 'multiple'];

export default function GiveawayFaqSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeIndex, setActiveIndex] = useState(0);
  const whatsappUrl = getGiveawayEntryWhatsAppUrl(t('giveawayPage.whatsappMessage'));

  const items = FAQ_KEYS.map((key) => ({
    key,
    question: t(`giveawayPage.faq.items.${key}.question`),
    answer: t(`giveawayPage.faq.items.${key}.answer`),
    actions: key === 'multiple' ? ['enter', 'call', 'whatsapp'] : ['enter', 'call'],
  }));

  return (
    <section className="giveaway-faq" id="faq">
      <div className="giveaway-faq__glow" aria-hidden />
      <Reveal className="giveaway-faq__intro">
        <p className="giveaway-faq__eyebrow">{t('giveawayPage.faq.eyebrow')}</p>
        <h2 className="giveaway-faq__title">{t('giveawayPage.faq.title')}</h2>
      </Reveal>

      <div className="giveaway-faq__list">
        {items.map((item, index) => {
          const isOpen = activeIndex === index;
          const panelId = `giveaway-faq-panel-${item.key}`;
          const buttonId = `giveaway-faq-button-${item.key}`;

          return (
            <Reveal
              key={item.key}
              delay={staggerDelay(index, 70)}
              className="giveaway-faq__item-wrap"
            >
              <div className={`giveaway-faq__item${isOpen ? ' is-open' : ''}`}>
                <button
                  id={buttonId}
                  type="button"
                  className="giveaway-faq__question"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                >
                  <span className="giveaway-faq__index" aria-hidden>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="giveaway-faq__question-text">{item.question}</span>
                  <span className="giveaway-faq__chevron" aria-hidden>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="giveaway-faq__panel"
                  hidden={!isOpen}
                >
                  <p className={`giveaway-faq__answer${isRTL ? ' is-rtl' : ''}`}>{item.answer}</p>
                  <div className="giveaway-faq__actions">
                    {item.actions.includes('enter') && (
                      <a href="#how-to-enter" className="giveaway-cta giveaway-cta--faq">
                        {t('giveawayPage.cta.enter')}
                      </a>
                    )}
                    {item.actions.includes('call') && (
                      <a
                        href={`tel:${GIVEAWAY.phoneTel}`}
                        className="giveaway-cta giveaway-cta--faq-ghost"
                      >
                        {t('giveawayPage.howToEnter.callNow')}
                      </a>
                    )}
                    {item.actions.includes('whatsapp') && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="giveaway-cta giveaway-cta--faq-ghost"
                      >
                        {t('giveawayPage.cta.whatsapp')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
