'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { uploadAdminFile as uploadAdminFileApi } from '@/lib/admin-api';

const AdminUploadContext = createContext({
  isUploading: false,
  uploadLabel: 'Uploading file...',
  uploadFile: async () => '',
  runWithUpload: async () => undefined,
});

export function AdminUploadProvider({ children }) {
  const countRef = useRef(0);
  const [activeCount, setActiveCount] = useState(0);
  const [uploadLabel, setUploadLabel] = useState('Uploading file...');

  const beginUpload = useCallback((label = 'Uploading file...') => {
    countRef.current += 1;
    setUploadLabel(label);
    setActiveCount(countRef.current);
  }, []);

  const endUpload = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    setActiveCount(countRef.current);
  }, []);

  const runWithUpload = useCallback(async (fn, label = 'Uploading file...') => {
    beginUpload(label);
    try {
      return await fn();
    } finally {
      endUpload();
    }
  }, [beginUpload, endUpload]);

  const uploadFile = useCallback(async (file, folder, token, label = 'Uploading file...') => {
    return runWithUpload(() => uploadAdminFileApi(file, folder, token), label);
  }, [runWithUpload]);

  const value = useMemo(
    () => ({
      isUploading: activeCount > 0,
      uploadLabel,
      uploadFile,
      runWithUpload,
    }),
    [activeCount, uploadLabel, uploadFile, runWithUpload]
  );

  return (
    <AdminUploadContext.Provider value={value}>
      {children}
    </AdminUploadContext.Provider>
  );
}

export function useAdminUpload() {
  return useContext(AdminUploadContext);
}
