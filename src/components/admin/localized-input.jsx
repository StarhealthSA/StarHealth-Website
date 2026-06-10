'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { translateSingleText } from '@/lib/admin-translate';

export default function LocalizedInput({ label, value, onChange, multiline = false }) {
  const { getIdToken } = useAdminAuth();
  const [translating, setTranslating] = useState(false);
  const Tag = multiline ? 'textarea' : 'input';

  const handleTranslate = async () => {
    if (!value?.en?.trim()) return;

    try {
      setTranslating(true);
      const token = await getIdToken();
      const ar = await translateSingleText(value.en, token);
      onChange({ ...value, ar });
    } catch (error) {
      alert(error.message || 'Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-[#586971]">{label}</span>
        <button
          type="button"
          onClick={handleTranslate}
          disabled={translating || !value?.en?.trim()}
          className="text-xs font-medium text-[#037B76] hover:underline disabled:opacity-50"
        >
          {translating ? 'Translating...' : 'Auto-translate to Arabic'}
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="text-xs text-[#586971]">English</span>
          <Tag
            value={value?.en || ''}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            rows={multiline ? 3 : undefined}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-xs text-[#586971]">Arabic (Saudi)</span>
          <Tag
            value={value?.ar || ''}
            onChange={(e) => onChange({ ...value, ar: e.target.value })}
            rows={multiline ? 3 : undefined}
            dir="rtl"
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>
      </div>
    </div>
  );
}
