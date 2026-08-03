export const FALLBACK_SPECIALIZATIONS = [
  {
    id: 'general-medicine',
    slug: 'general-medicine',
    name: { en: 'General Medicine', ar: 'الطب العام' },
    parentServiceId: 'general-medicine',
    order: 1,
    active: true,
  },
  {
    id: 'paediatrics',
    slug: 'paediatrics',
    name: { en: 'Paediatrics', ar: 'طب الأطفال' },
    parentServiceId: 'pediatrics',
    order: 2,
    active: true,
  },
  {
    id: 'dentistry',
    slug: 'dentistry',
    name: { en: 'Dentistry', ar: 'طب الأسنان' },
    parentServiceId: 'dentistry',
    order: 3,
    active: true,
  },
  {
    id: 'obg',
    slug: 'obg',
    name: { en: 'Obstetrics & Gynecology', ar: 'التوليد وأمراض النساء' },
    parentServiceId: 'obg',
    order: 4,
    active: true,
  },
  {
    id: 'family-medicine',
    slug: 'family-medicine',
    name: { en: 'Family Medicine', ar: 'طب العائلة' },
    parentServiceId: 'family-medicine',
    order: 5,
    active: true,
  },
  {
    id: 'orthodontics',
    slug: 'orthodontics',
    name: { en: 'Orthodontics', ar: 'تقويم الأسنان' },
    parentServiceId: 'dentistry',
    order: 6,
    active: true,
  },
];

export const LEGACY_CATEGORY_TO_SPEC = {
  generalMedicine: 'general-medicine',
  paediatrics: 'paediatrics',
  dentistry: 'dentistry',
};
