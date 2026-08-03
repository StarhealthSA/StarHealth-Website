'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useLocalizedDoctors,
  useLocalizedServices,
  useSpecializations,
} from '@/contexts/content-context';
import {
  doctorBelongsToService,
  getBookableDoctors,
} from '@/lib/content/service-doctors';

export function useBookingServiceDoctors({
  preselectedDoctorId = '',
  preselectedServiceId = '',
  lockSelection = false,
  isActive = true,
} = {}) {
  const { i18n } = useTranslation();
  const doctors = useLocalizedDoctors(i18n.language);
  const allServices = useLocalizedServices(i18n.language);
  const specializations = useSpecializations(i18n.language);

  // Show every published service in the booking dropdown.
  const services = useMemo(() => allServices, [allServices]);

  const bookableDoctors = useMemo(
    () => getBookableDoctors(doctors, specializations),
    [doctors, specializations]
  );

  const preselectedDoctor = useMemo(
    () => bookableDoctors.find((doctor) => doctor.id === preselectedDoctorId)
      || doctors.find((doctor) => doctor.id === preselectedDoctorId),
    [bookableDoctors, doctors, preselectedDoctorId]
  );

  const resolvedServiceId = useMemo(() => {
    if (preselectedServiceId) return preselectedServiceId;

    const related = Array.isArray(preselectedDoctor?.relatedServiceIds)
      ? preselectedDoctor.relatedServiceIds
      : [];
    if (related[0]) return related[0];

    const specId = preselectedDoctor?.specializationId || preselectedDoctor?.subSpecializationId;
    if (!specId) return '';
    const spec = specializations.find((item) => item.id === specId);
    return spec?.parentServiceId || '';
  }, [preselectedServiceId, preselectedDoctor, specializations]);

  const [serviceId, setServiceId] = useState(resolvedServiceId);
  const [doctorId, setDoctorId] = useState(preselectedDoctorId || '');

  useEffect(() => {
    if (!isActive) return;

    if (lockSelection && preselectedDoctorId) {
      setDoctorId(preselectedDoctorId);
      setServiceId(resolvedServiceId);
      return;
    }

    if (preselectedDoctorId) {
      setDoctorId(preselectedDoctorId);
      if (resolvedServiceId) {
        setServiceId(resolvedServiceId);
      }
      return;
    }

    if (preselectedServiceId) {
      setServiceId(preselectedServiceId);
      setDoctorId('');
    }
  }, [
    isActive,
    lockSelection,
    preselectedDoctorId,
    preselectedServiceId,
    resolvedServiceId,
  ]);

  const filteredDoctors = useMemo(() => {
    if (!serviceId) return [];
    return doctors.filter((doctor) =>
      doctorBelongsToService(doctor, serviceId, specializations)
    );
  }, [doctors, serviceId, specializations]);

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === doctorId),
    [doctors, doctorId]
  );

  const selectedServiceName = useMemo(() => {
    const service = services.find((item) => item.id === serviceId);
    return service?.displayTitle || '';
  }, [services, serviceId]);

  const handleServiceChange = (nextServiceId) => {
    setServiceId(nextServiceId);
    if (!lockSelection) {
      setDoctorId('');
    }
  };

  const handleDoctorChange = (nextDoctorId) => {
    setDoctorId(nextDoctorId);
    if (lockSelection) return;

    const doctor = doctors.find((item) => item.id === nextDoctorId);
    if (!doctor) return;

    if (doctorBelongsToService(doctor, serviceId, specializations)) return;

    const related = Array.isArray(doctor.relatedServiceIds) ? doctor.relatedServiceIds : [];
    if (related[0]) {
      setServiceId(related[0]);
      return;
    }

    const specId = doctor.specializationId || doctor.subSpecializationId;
    const spec = specializations.find((item) => item.id === specId);
    if (spec?.parentServiceId) {
      setServiceId(spec.parentServiceId);
    }
  };

  const resetSelection = () => {
    if (lockSelection && preselectedDoctorId) {
      setDoctorId(preselectedDoctorId);
      setServiceId(resolvedServiceId);
      return;
    }

    setServiceId(preselectedServiceId || '');
    setDoctorId(preselectedDoctorId || '');
  };

  return {
    services,
    filteredDoctors,
    serviceId,
    doctorId,
    setServiceId: handleServiceChange,
    setDoctorId: handleDoctorChange,
    selectedDoctor,
    selectedServiceName,
    isDoctorLocked: lockSelection && Boolean(preselectedDoctorId),
    isServiceLocked: lockSelection && Boolean(resolvedServiceId || preselectedServiceId),
    resetSelection,
  };
}
