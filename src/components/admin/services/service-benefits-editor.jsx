'use client';

export default function ServiceBenefitsEditor({ items = [], onChange }) {
  const addItem = () => {
    onChange([...items, { en: '', ar: '' }]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-[#586971]">Service Benefits</span>
        <button type="button" onClick={addItem} className="text-sm text-[#037B76] hover:underline">
          + Add
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="space-y-2 rounded-lg border border-[#eef4f2] p-3">
          <div className="grid gap-2 md:grid-cols-2">
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
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="text-sm text-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
