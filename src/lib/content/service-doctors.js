export function getServiceMatchedDoctors({
  doctors = [],
  categoryId = '',
  limit = 4,
} = {}) {
  if (!categoryId) return [];

  return doctors
    .filter((doctor) => doctor.categoryId === categoryId)
    .slice(0, limit);
}
