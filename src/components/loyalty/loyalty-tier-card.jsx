'use client';

import {
  Crown,
  Gift,
  Sparkles,
  UserRound,
} from 'lucide-react';
import logo from '@/assets/home/logo.svg';
import burgundyImage from '@/assets/home/burgundy.png';
import blackImage from '@/assets/home/black.png';
import NavLink from '@/components/nav_link';

const TIER_IMAGES = {
  burgundy: burgundyImage,
  black: blackImage,
};

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
}) {
  const cardImage = TIER_IMAGES[tier] || burgundyImage;

  return (
    <article className={`loyalty-tier-card loyalty-tier-card--${tier}`}>
      <div className="loyalty-tier-card__glow" aria-hidden />
      <div className="loyalty-tier-card__pattern" aria-hidden />

      <div className="loyalty-tier-card__header">
        <img src={logo} alt="" className="loyalty-tier-card__logo" />
        <div className="loyalty-tier-card__points">
          <span className="loyalty-tier-card__points-label">{pointsLabel}</span>
          <span className="loyalty-tier-card__points-value">{pointsDescription}</span>
        </div>
      </div>

      <div className="loyalty-tier-card__hero">
        <div className="loyalty-tier-card__copy">
          <h2 className="loyalty-tier-card__title">{title}</h2>
          <p className="loyalty-tier-card__tagline">{tagline}</p>
          <div className="loyalty-tier-card__badge-slot">
            {inviteOnly ? (
              <span className="loyalty-tier-card__badge">{inviteOnly}</span>
            ) : (
              <span className="loyalty-tier-card__badge loyalty-tier-card__badge--placeholder" aria-hidden>
                &nbsp;
              </span>
            )}
          </div>
        </div>

        <div className="loyalty-tier-card__visual">
          <img
            src={cardImage}
            alt=""
            className="loyalty-tier-card__image"
          />
        </div>
      </div>

      <div className="loyalty-tier-card__divider" aria-hidden>
        <span />
      </div>

      <div className="loyalty-tier-card__footer">
        <div className="loyalty-tier-card__meta">
          <div className="loyalty-tier-card__meta-item">
            <p className="loyalty-tier-card__meta-label">{cardTypeLabel}</p>
            <p className="loyalty-tier-card__meta-value">{title}</p>
          </div>
        </div>

        {benefits.length > 0 && (
          <ul className="loyalty-tier-card__benefits">
            {benefits.map((benefit) => {
              const Icon = BENEFIT_ICONS[benefit.icon] || Sparkles;
              return (
                <li key={benefit.label}>
                  <Icon className="loyalty-tier-card__benefit-icon" aria-hidden />
                  <span>{benefit.label}</span>
                </li>
              );
            })}
          </ul>
        )}

        <NavLink href="/contact" className="loyalty-tier-card__cta">
          {ctaLabel}
        </NavLink>
      </div>
    </article>
  );
}
