export const FALLBACK_SERVICE_CATEGORIES = [
  {
    id: 'primary-care',
    slug: 'primary-care',
    name: { en: 'Primary Care', ar: 'الرعاية الأولية' },
    description: {
      en: 'General, family, and internal medicine services for everyday health needs.',
      ar: 'خدمات الطب العام وطب الأسرة والطب الباطني للاحتياجات الصحية اليومية.',
    },
    order: 1,
    active: true,
  },
  {
    id: 'womens-health',
    slug: 'womens-health',
    name: { en: "Women's Health", ar: 'صحة المرأة' },
    description: {
      en: 'Obstetrics, gynecology, and women-focused outpatient care.',
      ar: 'رعاية النساء والتوليد وأمراض النساء.',
    },
    order: 2,
    active: true,
  },
  {
    id: 'pediatrics',
    slug: 'pediatrics',
    name: { en: 'Pediatrics', ar: 'طب الأطفال' },
    description: {
      en: 'Child health, growth monitoring, and pediatric consultations.',
      ar: 'صحة الأطفال ومتابعة النمو والاستشارات المتخصصة.',
    },
    order: 3,
    active: true,
  },
  {
    id: 'dental',
    slug: 'dental',
    name: { en: 'Dental Care', ar: 'طب الأسنان' },
    description: {
      en: 'Preventive and restorative dentistry for all ages.',
      ar: 'طب الأسنان الوقائي والترميمي لجميع الأعمار.',
    },
    order: 4,
    active: true,
  },
  {
    id: 'orthopedics',
    slug: 'orthopedics',
    name: { en: 'Orthopedics', ar: 'العظام' },
    description: {
      en: 'Bone, joint, and musculoskeletal care.',
      ar: 'رعاية العظام والمفاصل والجهاز العضلي الهيكلي.',
    },
    order: 5,
    active: true,
  },
  {
    id: 'diagnostics',
    slug: 'diagnostics',
    name: { en: 'Diagnostics', ar: 'التشخيص' },
    description: {
      en: 'Laboratory testing and diagnostic support.',
      ar: 'الفحوصات المخبرية والدعم التشخيصي.',
    },
    order: 6,
    active: true,
  },
];
