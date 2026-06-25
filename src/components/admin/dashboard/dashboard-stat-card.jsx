'use client';

import Link from 'next/link';

function formatNumber(value) {
  return new Intl.NumberFormat().format(value ?? 0);
}

export default function DashboardStatCard({
  href,
  title,
  description,
  count,
  countLabel,
  badge,
  accent = 'teal',
  external = false,
}) {
  const accentClasses = {
    teal: 'from-[#f3faf8] to-white border-[#cfe7df] text-[#037B76]',
    slate: 'from-white to-[#f8fbfa] border-[#d7e6e2] text-[#037B76]',
    amber: 'from-[#fff8ef] to-white border-[#f2dfc0] text-[#b45309]',
  };

  const className = `group rounded-2xl border bg-gradient-to-br p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${accentClasses[accent] || accentClasses.slate}`;

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {badge ? (
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-[#b45309]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#002f3b]">
        {countLabel || formatNumber(count)}
      </p>
      <p className="mt-2 text-sm text-[#586971]">{description}</p>
      <span className="mt-4 inline-flex text-sm font-medium text-[#037B76] opacity-0 transition-opacity group-hover:opacity-100">
        Open section →
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
