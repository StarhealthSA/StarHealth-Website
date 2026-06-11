'use client';

import LocalizedInput from '@/components/admin/localized-input';

export default function ServiceFaqsEditor({ faqs = [], onChange, disabled = false }) {
  const updateFaq = (index, patch) => {
    const next = [...faqs];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const addFaq = () => {
    onChange([
      ...faqs,
      { question: { en: '', ar: '' }, answer: { en: '', ar: '' } },
    ]);
  };

  const removeFaq = (index) => {
    onChange(faqs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#002f3b]">Frequently Asked Questions</h3>
        <button
          type="button"
          onClick={addFaq}
          disabled={disabled}
          className="text-sm font-medium text-[#037B76] hover:underline disabled:opacity-50"
        >
          + Add FAQ
        </button>
      </div>

      {faqs.length === 0 && (
        <p className="text-sm text-[#586971]">No FAQs added yet.</p>
      )}

      {faqs.map((faq, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-[#d7e6e2] bg-[#f8fbfa] p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#002f3b]">FAQ {index + 1}</p>
            <button
              type="button"
              onClick={() => removeFaq(index)}
              disabled={disabled}
              className="text-sm text-red-600 hover:underline disabled:opacity-50"
            >
              Remove
            </button>
          </div>
          <LocalizedInput
            label="Question"
            value={faq.question || { en: '', ar: '' }}
            onChange={(question) => updateFaq(index, { question })}
          />
          <LocalizedInput
            label="Answer"
            value={faq.answer || { en: '', ar: '' }}
            onChange={(answer) => updateFaq(index, { answer })}
            multiline
          />
        </div>
      ))}
    </div>
  );
}
