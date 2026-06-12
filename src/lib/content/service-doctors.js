import { getSpecializationCategoryId } from './specialization-utils';

export function getServiceMatchedDoctors({
  doctors = [],
  specializations = [],
  categoryId = '',
  limit = 4,
} = {}) {
  if (!categoryId) return [];

  return doctors.filter((doctor) => {
    const spec = specializations.find((s) => s.id === doctor.specializationId);
    const doctorCategory =
      doctor.categoryId ||
      getSpecializationCategoryId(spec) ||
      doctor.category;
    return doctorCategory === categoryId;
  }).slice(0, limit);
}
