export function doctorBelongsToService(doctor, serviceId, specializations = []) {
  if (!doctor || !serviceId) return false;

  const related = Array.isArray(doctor.relatedServiceIds) ? doctor.relatedServiceIds : [];
  if (related.includes(serviceId)) return true;

  // Fallback: doctor specialization linked to this service via parentServiceId
  const specId = doctor.specializationId || doctor.subSpecializationId;
  if (!specId || !specializations.length) return false;

  const spec = specializations.find((item) => item.id === specId);
  return Boolean(spec?.parentServiceId && spec.parentServiceId === serviceId);
}

export function getBookableDoctors(doctors = [], specializations = []) {
  return doctors.filter((doctor) => {
    const related = Array.isArray(doctor.relatedServiceIds) ? doctor.relatedServiceIds : [];
    if (related.length > 0) return true;

    const specId = doctor.specializationId || doctor.subSpecializationId;
    if (!specId) return false;
    return specializations.some(
      (spec) => spec.id === specId && Boolean(spec.parentServiceId)
    );
  });
}

/** @deprecated use getBookableDoctors */
export function getDoctorsWithServices(doctors = []) {
  return getBookableDoctors(doctors);
}

export function getServiceMatchedDoctors({
  doctors = [],
  serviceId = '',
  specializations = [],
  limit = 4,
} = {}) {
  if (!serviceId) return [];

  return doctors
    .filter((doctor) => doctorBelongsToService(doctor, serviceId, specializations))
    .slice(0, limit);
}
