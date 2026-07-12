'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { translateFormToArabic } from '@/lib/admin-translate';
import notify from '@/lib/ui/notify';

export default function AutoTranslateBar({ form, onTranslated }) {
  const { getIdToken } = useAdminAuth();
  const [translating, setTranslating] = useState(false);

  const handleTranslateAll = async () => {
    try {
      setTranslating(true);
      const token = await getIdToken();
      const translated = await translateFormToArabic(form, token);
      onTranslated(translated);
    } catch (error) {
      notify.error(error.message || 'Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d7e6e2] bg-[#f0f9f8] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-[#002f3b]">Arabic auto-translation</p>
        <p className="text-xs text-[#586971]">
          Fills all Arabic fields from English entries (Saudi Arabic / Modern Standard Arabic).
        </p>
      </div>
      <button
        type="button"
        onClick={handleTranslateAll}
        disabled={translating}
        className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {translating ? 'Translating...' : 'Translate all EN → AR'}
      </button>
    </div>
  );
}
