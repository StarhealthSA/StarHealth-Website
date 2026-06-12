const LEGACY_SPEC_TO_CATEGORY = {
  'general-medicine': 'primary-care',
  'family-medicine': 'primary-care',
  paediatrics: 'pediatrics',
  dentistry: 'dental',
  orthodontics: 'dental',
  obg: 'womens-health',
};

export function getSpecializationCategoryId(spec) {
  if (!spec) return null;
  if (spec.categoryId) return spec.categoryId;
  if (LEGACY_SPEC_TO_CATEGORY[spec.id]) return LEGACY_SPEC_TO_CATEGORY[spec.id];
  if (spec.parentId && LEGACY_SPEC_TO_CATEGORY[spec.parentId]) {
    return LEGACY_SPEC_TO_CATEGORY[spec.parentId];
  }
  return null;
}

export function getSpecializationsByCategory(specializations, categoryId) {
  if (!categoryId) return [];
  return specializations.filter((spec) => getSpecializationCategoryId(spec) === categoryId);
}

export function getTopLevelSpecializations(specializations) {
  return specializations.filter((s) => !getSpecializationCategoryId(s));
}

export function getSubSpecializations(specializations, parentId) {
  return specializations.filter((s) => s.parentId === parentId);
}

export function findSpecializationName(specializations, id, language = 'en') {
  if (!id) return '';
  const spec = specializations.find((s) => s.id === id);
  if (!spec) return '';
  return spec.name?.[language] || spec.name?.en || '';
}

export function getSpecializationsForService(specializations, service) {
  if (!service?.id) return [];

  const byParent = specializations.filter(
    (spec) => spec.active !== false && spec.parentServiceId === service.id
  );
  if (byParent.length) return byParent;

  if (!service.categoryId) return [];

  return specializations.filter(
    (spec) =>
      spec.active !== false
      && !spec.parentServiceId
      && getSpecializationCategoryId(spec) === service.categoryId
  );
}
