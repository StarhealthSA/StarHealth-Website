'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirebaseAuth, isFirebaseClientConfigured } from '@/lib/firebase/client';
import { getAssignableRoles, ROLES } from '@/lib/firebase/roles';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    if (!isFirebaseClientConfigured()) {
      setConfigured(false);
      setLoading(false);
      return;
    }

    setConfigured(true);
    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const tokenResult = await firebaseUser.getIdTokenResult(true);
      const userRole = tokenResult.claims.role || null;

      if (!userRole) {
        await signOut(auth);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);
      setRole(userRole);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    const auth = getFirebaseAuth();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const tokenResult = await credential.user.getIdTokenResult(true);
    const userRole = tokenResult.claims.role;

    if (!userRole) {
      await signOut(auth);
      throw new Error('Your account does not have admin access.');
    }

    setRole(userRole);
    return credential.user;
  }, []);

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    setUser(null);
    setRole(null);
  }, []);

  const getIdToken = useCallback(async () => {
    if (!user) return null;
    return user.getIdToken(true);
  }, [user]);

  const value = useMemo(() => {
    const isSuperAdmin = role === ROLES.SUPER_ADMIN;
    const isAdmin = role === ROLES.ADMIN;
    const canManageUsers = isSuperAdmin || isAdmin;
    const canDeleteContent = isSuperAdmin || isAdmin;
    const canWrite = isSuperAdmin || isAdmin || role === ROLES.EDITOR;
    const assignableRoles = role ? getAssignableRoles(role) : [];

    return {
      user,
      role,
      loading,
      configured,
      login,
      logout,
      getIdToken,
      isSuperAdmin,
      isAdmin,
      canManageUsers,
      canDeleteContent,
      canWrite,
      assignableRoles,
    };
  }, [user, role, loading, configured, login, logout, getIdToken]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
