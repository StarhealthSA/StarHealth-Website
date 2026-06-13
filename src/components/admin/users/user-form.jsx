'use client';

import { useEffect, useState } from 'react';
import { ROLE_LABELS } from '@/lib/firebase/roles';

export default function UserForm({
  mode,
  initial,
  assignableRoles,
  isSuperAdmin,
  onSubmit,
  onCancel,
  saving,
}) {
  const [email, setEmail] = useState(initial?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initial?.role || assignableRoles[0] || '');
  const [disabled, setDisabled] = useState(initial?.disabled || false);

  useEffect(() => {
    setEmail(initial?.email || '');
    setPassword('');
    setRole(initial?.role || assignableRoles[0] || '');
    setDisabled(initial?.disabled || false);
  }, [initial, assignableRoles, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'create') {
      onSubmit({ email, password, role });
      return;
    }

    const payload = { role, disabled };
    if (password.trim()) {
      payload.password = password;
    }
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'create' && (
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>
      )}

      {mode === 'create' && (
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>
      )}

      {mode === 'edit' && isSuperAdmin && (
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">New password (optional)</span>
          <input
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>
      )}

      <label className="block">
        <span className="text-sm font-medium text-[#586971]">Role</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
        >
          {assignableRoles.map((item) => (
            <option key={item} value={item}>
              {ROLE_LABELS[item] || item}
            </option>
          ))}
        </select>
      </label>

      {mode === 'edit' && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
            className="rounded border-[#d7e6e2]"
          />
          <span className="text-sm text-[#586971]">Disabled account</span>
        </label>
      )}

      <p className="text-xs text-[#586971]">
        After a role change, the user must sign out and sign in again for it to take effect.
      </p>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : mode === 'create' ? 'Create user' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#d7e6e2] px-4 py-2 text-sm font-medium text-[#586971]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
