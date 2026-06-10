export const FALLBACK_SPECIALIZATIONS = [
  {
    id: 'general-medicine',
    slug: 'general-medicine',
    name: { en: 'General Medicine', ar: 'الطب العام' },
    parentId: null,
    order: 1,
    active: true,
  },
  {
    id: 'paediatrics',
    slug: 'paediatrics',
    name: { en: 'Paediatrics', ar: 'طب الأطفال' },
    parentId: null,
    order: 2,
    active: true,
  },
  {
    id: 'dentistry',
    slug: 'dentistry',
    name: { en: 'Dentistry', ar: 'طب الأسنان' },
    parentId: null,
    order: 3,
    active: true,
  },
  {
    id: 'obg',
    slug: 'obg',
    name: { en: 'Obstetrics & Gynecology', ar: 'التوليد وأمراض النساء' },
    parentId: null,
    order: 4,
    active: true,
  },
  {
    id: 'family-medicine',
    slug: 'family-medicine',
    name: { en: 'Family Medicine', ar: 'طب العائلة' },
    parentId: 'general-medicine',
    order: 1,
    active: true,
  },
  {
    id: 'orthodontics',
    slug: 'orthodontics',
    name: { en: 'Orthodontics', ar: 'تقويم الأسنان' },
    parentId: 'dentistry',
    order: 1,
    active: true,
  },
];

export const LEGACY_CATEGORY_TO_SPEC = {
  generalMedicine: 'general-medicine',
  paediatrics: 'paediatrics',
  dentistry: 'dentistry',
};
