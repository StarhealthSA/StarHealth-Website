'use client';

import { createContext, useContext, useMemo } from 'react';
import { getLocalizedText } from '@/lib/content/localized';
import { resolveDoctorImage } from '@/lib/content/doctor-images';
import { resolveServiceBannerImage, resolveServiceIcon } from '@/lib/content/service-icons';
import { getDoctorDisplayLine } from '@/lib/content/normalize-doctor';
import { findSpecializationName } from '@/lib/content/specialization-utils';
import { findServiceCategoryName } from '@/lib/content/service-category-utils';

const ContentContext = createContext({
  doctors: [],
  services: [],
  specializations: [],
  serviceCategories: [],
});

export function ContentProvider({
  doctors = [],
  services = [],
  specializations = [],
  serviceCategories = [],
  children,
}) {
  const value = useMemo(
    () => ({ doctors, services, specializations, serviceCategories }),
    [doctors, services, specializations, serviceCategories]
  );
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

export function useLocalizedDoctors(language) {
  const { doctors, specializations } = useContent();
  return doctors.map((doctor) => ({
    ...doctor,
    displayName: getLocalizedText(doctor.name, language),
    displaySpecialty: getDoctorDisplayLine(doctor, language),
    displayQualification: getLocalizedText(doctor.qualification, language),
    displayDesignation: getLocalizedText(doctor.designation, language),
    displayShortIntro: getLocalizedText(doctor.shortIntro, language),
    displayBiography: getLocalizedText(doctor.biography, language),
    displaySpecialization: findSpecializationName(specializations, doctor.specializationId, language),
    displaySubSpecialization: findSpecializationName(specializations, doctor.subSpecializationId, language),
    image: resolveDoctorImage(doctor),
  }));
}

export function useLocalizedServices(language) {
  const { services, serviceCategories } = useContent();
  return services.map((service) => ({
    ...service,
    displayTitle: getLocalizedText(service.title, language),
    displayDescription: getLocalizedText(service.shortDescription || service.description, language),
    displayShortDescription: getLocalizedText(service.shortDescription || service.description, language),
    displayFullDescription: getLocalizedText(service.fullDescription, language),
    displayCategory: findServiceCategoryName(serviceCategories, service.categoryId, language),
    icon: resolveServiceIcon(service),
    bannerImage: resolveServiceBannerImage(service),
  }));
}

export function useServiceCategories(language) {
  const { serviceCategories } = useContent();
  return serviceCategories.map((category) => ({
    ...category,
    displayName: getLocalizedText(category.name, language),
    displayDescription: getLocalizedText(category.description, language),
  }));
}

export function useSpecializations(language) {
  const { specializations } = useContent();
  return specializations.map((spec) => ({
    ...spec,
    displayName: getLocalizedText(spec.name, language),
  }));
}
