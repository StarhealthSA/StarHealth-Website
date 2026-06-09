'use client';

import { createContext, useContext, useMemo } from 'react';
import { getLocalizedText } from '@/lib/content/localized';
import { resolveDoctorImage } from '@/lib/content/doctor-images';
import { resolveServiceIcon } from '@/lib/content/service-icons';

const ContentContext = createContext({ doctors: [], services: [] });

export function ContentProvider({ doctors = [], services = [], children }) {
  const value = useMemo(() => ({ doctors, services }), [doctors, services]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

export function useLocalizedDoctors(language) {
  const { doctors } = useContent();
  return doctors.map((doctor) => ({
    ...doctor,
    displayName: getLocalizedText(doctor.name, language),
    displaySpecialty: getLocalizedText(doctor.specialty, language),
    image: resolveDoctorImage(doctor),
  }));
}

export function useLocalizedServices(language) {
  const { services } = useContent();
  return services.map((service) => ({
    ...service,
    displayTitle: getLocalizedText(service.title, language),
    displayDescription: getLocalizedText(service.description, language),
    icon: resolveServiceIcon(service),
  }));
}
