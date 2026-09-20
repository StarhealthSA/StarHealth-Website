'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  value,
  onChange,
  required = false,
  minLength,
  placeholder,
  id,
  name = 'password',
  autoComplete,
  className = 'w-full rounded-lg border border-[#d7e6e2] px-3 py-2 pe-11',
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative mt-1">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        required={required}
        minLength={minLength}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={className}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute inset-y-0 end-0 flex items-center px-3 text-[#586971] hover:text-[#037B76]"
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={0}
      >
        {visible ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
      </button>
    </div>
  );
}
