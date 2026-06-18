'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedDoctors, useServiceCategories } from '@/contexts/content-context';
import {
  getCategoriesWithDoctors,
  getDoctorsWithCategory,
} from '@/lib/content/doctor-category-utils';

export function useBookingCategoryDoctors({
  preselectedDoctorId = '',
  preselectedCategoryId = '',
  lockSelection = false,
  isActive = true,
} = {}) {
  const { i18n } = useTranslation();
  const doctors = useLocalizedDoctors(i18n.language);
  const allCategories = useServiceCategories(i18n.language);

  const bookableDoctors = useMemo(() => getDoctorsWithCategory(doctors), [doctors]);

  const preselectedDoctor = useMemo(
    () => bookableDoctors.find((doctor) => doctor.id === preselectedDoctorId),
    [bookableDoctors, preselectedDoctorId]
  );

  const resolvedCategoryId =
    preselectedCategoryId || preselectedDoctor?.categoryId || '';

  const categories = useMemo(() => {
    const visible = getCategoriesWithDoctors(allCategories, bookableDoctors);
    const visibleIds = new Set(visible.map((category) => category.id));
    const extraIds = [resolvedCategoryId, preselectedCategoryId].filter(Boolean);
    const extras = extraIds
      .filter((id) => !visibleIds.has(id))
      .map((id) => allCategories.find((category) => category.id === id))
      .filter(Boolean);

    return [...visible, ...extras];
  }, [allCategories, bookableDoctors, resolvedCategoryId, preselectedCategoryId]);

  const [categoryId, setCategoryId] = useState(resolvedCategoryId);
  const [doctorId, setDoctorId] = useState(preselectedDoctorId || '');

  useEffect(() => {
    if (!isActive) return;

    if (lockSelection && preselectedDoctorId) {
      setDoctorId(preselectedDoctorId);
      setCategoryId(resolvedCategoryId);
      return;
    }

    if (preselectedDoctorId) {
      setDoctorId(preselectedDoctorId);
      if (resolvedCategoryId) {
        setCategoryId(resolvedCategoryId);
      }
      return;
    }

    if (preselectedCategoryId) {
      setCategoryId(preselectedCategoryId);
      setDoctorId('');
    }
  }, [
    isActive,
    lockSelection,
    preselectedDoctorId,
    preselectedCategoryId,
    resolvedCategoryId,
  ]);

  const filteredDoctors = useMemo(() => {
    if (!categoryId) return [];
    return bookableDoctors.filter((doctor) => doctor.categoryId === categoryId);
  }, [bookableDoctors, categoryId]);

  const selectedDoctor = useMemo(
    () => bookableDoctors.find((doctor) => doctor.id === doctorId),
    [bookableDoctors, doctorId]
  );

  const selectedCategoryName = useMemo(() => {
    const category =
      categories.find((item) => item.id === categoryId) ||
      allCategories.find((item) => item.id === categoryId);
    return category?.displayName || '';
  }, [categories, allCategories, categoryId]);

  const handleCategoryChange = (nextCategoryId) => {
    setCategoryId(nextCategoryId);
    if (!lockSelection) {
      setDoctorId('');
    }
  };

  const handleDoctorChange = (nextDoctorId) => {
    setDoctorId(nextDoctorId);
    if (lockSelection) return;

    const doctor = bookableDoctors.find((item) => item.id === nextDoctorId);
    if (doctor?.categoryId) {
      setCategoryId(doctor.categoryId);
    }
  };

  const resetSelection = () => {
    if (lockSelection && preselectedDoctorId) {
      setDoctorId(preselectedDoctorId);
      setCategoryId(resolvedCategoryId);
      return;
    }

    setCategoryId(preselectedCategoryId || '');
    setDoctorId(preselectedDoctorId || '');
  };

  return {
    categories,
    filteredDoctors,
    categoryId,
    doctorId,
    setCategoryId: handleCategoryChange,
    setDoctorId: handleDoctorChange,
    selectedDoctor,
    selectedCategoryName,
    isDoctorLocked: lockSelection && Boolean(preselectedDoctorId),
    isCategoryLocked: lockSelection && Boolean(resolvedCategoryId),
    resetSelection,
  };
}
