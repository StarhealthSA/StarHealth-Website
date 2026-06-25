'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage({ variant = 'site' }) {
  const { t } = useTranslation();

  if (variant === 'admin') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-6xl font-semibold text-[#037B76]">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-[#002f3b]">{t('notFoundPage.title')}</h1>
        <p className="mt-3 max-w-md text-sm text-[#586971]">{t('notFoundPage.adminDescription')}</p>
        <Link
          href="/admin"
          className="mt-8 rounded-lg bg-[#037B76] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#026a66]"
        >
          {t('notFoundPage.backToDashboard')}
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-[#FAFAF9] px-6 py-20 md:py-28">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="font-inter text-7xl font-semibold tracking-tight text-[#037B76] md:text-8xl">404</p>
        <h1 className="mt-6 font-inter text-3xl font-semibold text-[#002333] md:text-4xl">
          {t('notFoundPage.title')}
        </h1>
        <p className="mt-4 max-w-lg font-inter text-base leading-relaxed text-[#687276] md:text-lg">
          {t('notFoundPage.description')}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-gradient-to-tl from-[#037B76] to-[#AED5C6] px-8 py-3 font-inter text-sm font-medium text-white transition-opacity hover:opacity-90 md:text-base"
          >
            {t('notFoundPage.backHome')}
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-[#037B76] px-8 py-3 font-inter text-sm font-medium text-[#037B76] transition-colors hover:bg-[#037B76] hover:text-white md:text-base"
          >
            {t('notFoundPage.contactUs')}
          </Link>
        </div>
      </div>
    </section>
  );
}
