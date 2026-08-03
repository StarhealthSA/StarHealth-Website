export function getTopLevelSpecializations(specializations) {
  return specializations.filter((s) => !s.parentId);
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

  return specializations.filter(
    (spec) => spec.active !== false && spec.parentServiceId === service.id
  );
}

export function getSpecializationsByParentService(specializations, serviceId) {
  if (!serviceId) return [];
  return specializations.filter(
    (spec) => spec.active !== false && spec.parentServiceId === serviceId
  );
}
