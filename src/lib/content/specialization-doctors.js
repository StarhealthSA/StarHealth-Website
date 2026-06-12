export function getSpecializationMatchedDoctors({
  doctors = [],
  specializationId = '',
  limit = 4,
} = {}) {
  if (!specializationId) return [];

  return doctors
    .filter(
      (doctor) =>
        doctor.specializationId === specializationId
        || doctor.subSpecializationId === specializationId
    )
    .slice(0, limit);
}
