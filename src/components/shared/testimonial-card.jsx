import google from '@/assets/home/google.svg';
import StarRating from './star-rating';

function PatientAvatar({ name }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="testimonial-card__avatar" aria-hidden>
      <span>{initial}</span>
    </div>
  );
}

export default function TestimonialCard({ name, quote, isRTL = false }) {
  return (
    <article className={`testimonial-card${isRTL ? ' testimonial-card--rtl' : ''}`}>
      <div className="testimonial-card__quote-mark" aria-hidden>
        &ldquo;
      </div>

      <div className="testimonial-card__top">
        <div className="testimonial-card__profile">
          <PatientAvatar name={name} />
          <div className="min-w-0">
            <h3 className="testimonial-card__name">{name}</h3>
            <StarRating className="mt-1.5" />
          </div>
        </div>
        <img src={google} alt="" className="testimonial-card__google" />
      </div>

      <p className="testimonial-card__text">{quote}</p>
    </article>
  );
}
