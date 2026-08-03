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

  // Keep doctor selection in sync with the selected service.
  useEffect(() => {
    if (!isActive || lockSelection) return;
    if (!serviceId) {
      setDoctorId('');
      return;
    }
    if (
      doctorId
      && !doctorBelongsToService(
        doctors.find((doctor) => doctor.id === doctorId),
        serviceId,
        specializations
      )
    ) {
      setDoctorId('');
    }
  }, [isActive, lockSelection, serviceId, doctorId, doctors, specializations]);

  const filteredDoctors = useMemo(() => {
    // Doctors appear only after a service is selected.
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
    // Always reset doctor when service changes (service-first flow).
    if (!lockSelection) {
      setDoctorId('');
    }
  };

  const handleDoctorChange = (nextDoctorId) => {
    // Doctor can only be chosen after a service is selected.
    if (!serviceId && !lockSelection) return;
    setDoctorId(nextDoctorId);
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
