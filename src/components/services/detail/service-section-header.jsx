'use client';

export default function ServiceSectionHeader({
  label,
  title,
  description,
  align = 'start',
  className = '',
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-start';
  const widthClass = className.includes('max-w-') ? '' : 'max-w-2xl';

  return (
    <div className={`service-section-header ${widthClass} ${alignClass} ${className}`.trim()}>
      {label ? (
        <p className="font-inter text-xs font-semibold uppercase tracking-[0.18em] text-[#037B76]">
          {label}
        </p>
      ) : null}
      <h2 className="service-display-title mt-2 text-2xl font-semibold text-[#002333] md:text-[2rem] md:leading-tight">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 font-inter text-base font-normal leading-relaxed text-[#687276] text-justify">
          {description}
        </p>
      ) : null}
    </div>
  );
}
