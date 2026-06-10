const SKIP_KEYS = new Set([
  'id',
  'slug',
  'imageKey',
  'profilePhotoUrl',
  'imageUrl',
  'galleryImages',
  'relatedServiceIds',
  'workingDays',
  'gender',
  'status',
  'order',
  'experienceYears',
  'onlineConsultationAvailable',
  'featured',
  'specializationId',
  'subSpecializationId',
  'medicalRegistrationNumber',
  'createdAt',
  'updatedAt',
  'year',
  'parentId',
  'active',
  'published',
  'iconKey',
]);

export function isLocalizedField(value) {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof value.en === 'string' &&
    Object.prototype.hasOwnProperty.call(value, 'ar')
  );
}

export function collectEnglishTexts(obj) {
  const results = [];

  function walk(value, path) {
    if (isLocalizedField(value)) {
      if (value.en?.trim()) {
        results.push({ path: [...path], text: value.en.trim() });
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, [...path, index]));
      return;
    }

    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, child]) => {
        if (SKIP_KEYS.has(key)) return;
        walk(child, [...path, key]);
      });
    }
  }

  walk(obj, []);
  return results;
}

export function applyArabicTranslations(obj, entries) {
  const clone = structuredClone(obj);

  entries.forEach(({ path, translation }) => {
    let target = clone;
    for (let i = 0; i < path.length - 1; i += 1) {
      target = target[path[i]];
    }
    const lastKey = path[path.length - 1];
    if (isLocalizedField(target[lastKey])) {
      target[lastKey] = { ...target[lastKey], ar: translation };
    }
  });

  return clone;
}
