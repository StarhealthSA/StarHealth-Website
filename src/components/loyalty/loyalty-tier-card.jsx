'use client';

import {
  ArrowRight,
  Crown,
  Gift,
  Sparkles,
  UserRound,
} from 'lucide-react';
import logo from '@/assets/home/logo.svg';
import burgundyImage from '@/assets/home/burgundy.png';
import blackImage from '@/assets/home/black.png';
import NavLink from '@/components/nav_link';

const BENEFIT_ICONS = {
  premium: Crown,
  care: UserRound,
  privileges: Gift,
  aesthetics: Sparkles,
};

export default function LoyaltyTierCard({
  tier,
  title,
  tagline,
  inviteOnly = '',
  pointsLabel,
  pointsDescription,
  benefits = [],
  cardTypeLabel,
  ctaLabel,
  ctaHref = '/contact',
}) {
  const isExternal = /^https?:\/\//.test(ctaHref);

  return (
    <article className={`loyalty-tier-card loyalty-tier-card--${tier}`}>
      <div className="loyalty-tier-card__media">
        <img
          src={burgundyImage}
          alt=""
          className="loyalty-tier-card__image loyalty-tier-card__image--primary"
        />
        <img
          src={blackImage}
          alt=""
          className="loyalty-tier-card__image loyalty-tier-card__image--hover"
        />
        <div className="loyalty-tier-card__media-overlay" aria-hidden />
        <div className="loyalty-tier-card__media-shine" aria-hidden />

        <div className="loyalty-tier-card__media-top">
          <img src={logo} alt="" className="loyalty-tier-card__logo" />
          <div className="loyalty-tier-card__points">
            <span className="loyalty-tier-card__points-label">{pointsLabel}</span>
            <span className="loyalty-tier-card__points-value">{pointsDescription}</span>
          </div>
        </div>

        <div className="loyalty-tier-card__media-bottom">
          <p className="loyalty-tier-card__tier-label">{cardTypeLabel}</p>
          <h2 className="loyalty-tier-card__title">{title}</h2>
          {inviteOnly ? (
            <span className="loyalty-tier-card__badge">{inviteOnly}</span>
          ) : (
            <span className="loyalty-tier-card__badge loyalty-tier-card__badge--placeholder" aria-hidden>
              &nbsp;
            </span>
          )}
        </div>
      </div>

      <div className="loyalty-tier-card__body">
        <p className="loyalty-tier-card__tagline">{tagline}</p>

        {benefits.length > 0 && (
          <ul className="loyalty-tier-card__benefits">
            {benefits.map((benefit) => {
              const Icon = BENEFIT_ICONS[benefit.icon] || Sparkles;
              return (
                <li key={benefit.label}>
                  <span className="loyalty-tier-card__benefit-icon-wrap" aria-hidden>
                    <Icon className="loyalty-tier-card__benefit-icon" />
                  </span>
                  <span>{benefit.label}</span>
                </li>
              );
            })}
          </ul>
        )}

        {isExternal ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="loyalty-tier-card__cta"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="loyalty-tier-card__cta-icon" aria-hidden />
          </a>
        ) : (
          <NavLink href={ctaHref} className="loyalty-tier-card__cta">
            <span>{ctaLabel}</span>
            <ArrowRight className="loyalty-tier-card__cta-icon" aria-hidden />
          </NavLink>
        )}
      </div>
    </article>
  );
}
