'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { translateTexts } from '@/lib/admin-translate';

export default function LocalizedListEditor({
  label,
  items = [],
  onChange,
  fields = ['en', 'ar'],
}) {
  const { getIdToken } = useAdminAuth();
  const [translating, setTranslating] = useState(false);

  const addItem = () => {
    const item = fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {});
    onChange([...items, item]);
  };

  const handleTranslateList = async () => {
    const englishTexts = items.map((item) => item.en || '').filter((text) => text.trim());
    if (!englishTexts.length) return;

    try {
      setTranslating(true);
      const token = await getIdToken();
      const translations = await translateTexts(
        items.map((item) => item.en || ''),
        token
      );
      onChange(
        items.map((item, index) => ({
          ...item,
          ar: translations[index] || item.ar || '',
        }))
      );
    } catch (error) {
      alert(error.message || 'Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-[#586971]">{label}</span>
        <div className="flex gap-3">
          {fields.includes('en') && fields.includes('ar') && (
            <button
              type="button"
              onClick={handleTranslateList}
              disabled={translating}
              className="text-xs font-medium text-[#037B76] hover:underline disabled:opacity-50"
            >
              {translating ? 'Translating...' : 'Auto-translate list'}
            </button>
          )}
          <button type="button" onClick={addItem} className="text-sm text-[#037B76] hover:underline">
            + Add
          </button>
        </div>
      </div>
      {items.map((item, index) => (
        <div key={index} className="grid gap-2 rounded-lg border border-[#eef4f2] p-3 md:grid-cols-2">
          {fields.includes('en') && (
            <input
              placeholder="English"
              value={item.en || ''}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...item, en: e.target.value };
                onChange(next);
              }}
              className="rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
            />
          )}
          {fields.includes('ar') && (
            <input
              placeholder="Arabic"
              dir="rtl"
              value={item.ar || ''}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...item, ar: e.target.value };
                onChange(next);
              }}
              className="rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
            />
          )}
          {fields.includes('year') && (
            <input
              placeholder="Year"
              value={item.year || ''}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...item, year: e.target.value };
                onChange(next);
              }}
              className="rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
            />
          )}
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="text-sm text-red-600 md:col-span-2"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
