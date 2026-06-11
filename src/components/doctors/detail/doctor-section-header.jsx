'use client';

export default function DoctorSectionHeader({ eyebrow, title, description, className = '' }) {
  return (
    <div className={`doctor-section-header ${className}`}>
      {eyebrow && (
        <p className="font-inter text-xs font-semibold uppercase tracking-[0.2em] text-[#037B76]">
          {eyebrow}
        </p>
      )}
      <h2 className="doctor-display-title mt-2 text-2xl font-semibold text-[#002333] md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl font-inter text-base leading-relaxed text-[#687276]">
          {description}
        </p>
      )}
    </div>
  );
}
