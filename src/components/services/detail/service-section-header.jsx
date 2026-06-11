'use client';

export default function ServiceSectionHeader({ label, title, description, align = 'start', className = '' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : '';

  return (
    <div className={`service-section-header max-w-2xl ${alignClass} ${className}`}>
      {label && (
        <p className="font-inter text-xs font-semibold uppercase tracking-[0.18em] text-[#037B76]">
          {label}
        </p>
      )}
      <h2 className="service-display-title mt-2 text-2xl font-semibold text-[#002333] md:text-[2rem] md:leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 font-inter text-base leading-relaxed text-[#687276]">
          {description}
        </p>
      )}
    </div>
  );
}
