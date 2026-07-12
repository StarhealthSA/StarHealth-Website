'use client';

import { useCallback, useEffect, useState } from 'react';
import UserForm from '@/components/admin/users/user-form';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { AdminActionButton, AdminActionGroup } from '@/components/admin/admin-action-button';
import { canModifyUser, ROLE_LABELS } from '@/lib/firebase/roles';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
}

export default function AdminUsersPage() {
  const {
    user,
    role: actorRole,
    getIdToken,
    canManageUsers,
    isSuperAdmin,
    assignableRoles,
  } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await adminFetch('/api/admin/users', { token });
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (canManageUsers) {
      loadUsers();
    }
  }, [canManageUsers, loadUsers]);

  const handleCreate = async (payload) => {
    try {
      setSaving(true);
      const token = await getIdToken();
      await adminFetch('/api/admin/users', {
        method: 'POST',
        body: payload,
        token,
      });
      setShowForm(false);
      setError('');
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing) return;
    try {
      setSaving(true);
      const token = await getIdToken();
      await adminFetch(`/api/admin/users/${editing.uid}`, {
        method: 'PUT',
        body: payload,
        token,
      });
      setEditing(null);
      setError('');
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (targetUser) => {
    if (!window.confirm(`Delete user ${targetUser.email}?`)) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/users/${targetUser.uid}`, {
        method: 'DELETE',
        token,
      });
      setError('');
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!canManageUsers) {
    return (
      <div>
        <h1 className="text-3xl font-semibold text-[#002f3b]">Users</h1>
        <p className="mt-4 text-[#586971]">You do not have permission to manage users.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">Users</h1>
          <p className="mt-1 text-sm text-[#586971]">
            Manage admin panel access and roles.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
        >
          Add user
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {showForm && (
        <div className="mt-6 rounded-2xl border border-[#d7e6e2] bg-white p-6">
          <h2 className="text-lg font-semibold text-[#002f3b]">Create user</h2>
          <div className="mt-4">
            <UserForm
              mode="create"
              assignableRoles={assignableRoles}
              isSuperAdmin={isSuperAdmin}
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              saving={saving}
            />
          </div>
        </div>
      )}

      {editing && (
        <div className="mt-6 rounded-2xl border border-[#d7e6e2] bg-white p-6">
          <h2 className="text-lg font-semibold text-[#002f3b]">Edit user</h2>
          <p className="mt-1 text-sm text-[#586971]">{editing.email}</p>
          <div className="mt-4">
            <UserForm
              mode="edit"
              initial={editing}
              assignableRoles={assignableRoles}
              isSuperAdmin={isSuperAdmin}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[#d7e6e2] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#d7e6e2] bg-[#f8fbfa]">
            <tr>
              <th className="px-4 py-3 font-medium text-[#586971]">Email</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Role</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Status</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Created</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <AdminPageLoader
                    variant="table"
                    label="Loading users..."
                    description="Fetching admin users from Firebase Auth."
                  />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-[#586971]">No users found.</td>
              </tr>
            ) : (
              users.map((item) => {
                const canEdit = canModifyUser(actorRole, item.role) && item.uid !== user?.uid;

                return (
                  <tr key={item.uid} className="border-b border-[#eef4f2]">
                    <td className="px-4 py-3 font-medium text-[#002f3b]">{item.email}</td>
                    <td className="px-4 py-3 text-[#586971]">
                      {ROLE_LABELS[item.role] || item.role || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          item.disabled
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {item.disabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#586971]">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      {canEdit ? (
                        <AdminActionGroup>
                          <AdminActionButton
                            action="edit"
                            onClick={() => {
                              setShowForm(false);
                              setEditing(item);
                            }}
                          />
                          <AdminActionButton action="delete" onClick={() => handleDelete(item)} />
                        </AdminActionGroup>
                      ) : (
                        <span className="text-xs text-[#586971]">
                          {item.uid === user?.uid ? 'You' : 'Read only'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
