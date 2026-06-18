export function doctorMatchesCategory(doctor, categoryId) {
  if (!doctor?.categoryId) return false;
  if (!categoryId || categoryId === 'all') return true;
  return doctor.categoryId === categoryId;
}

export function getDoctorsWithCategory(doctors = []) {
  return doctors.filter((doctor) => Boolean(doctor.categoryId));
}

export function getCategoriesWithDoctors(categories = [], doctors = []) {
  const doctorsWithCategory = getDoctorsWithCategory(doctors);
  return categories.filter((category) =>
    doctorsWithCategory.some((doctor) => doctor.categoryId === category.id)
  );
}
