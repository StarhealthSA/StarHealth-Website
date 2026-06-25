'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'star-health-admin-theme';

const AdminThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function AdminThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      setThemeState(stored);
    }
    setReady(true);
  }, []);

  const setTheme = (next) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div
        data-admin-theme={ready ? theme : 'light'}
        className="admin-panel-root min-h-screen"
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
