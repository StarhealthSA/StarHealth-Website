const emptyLocalized = () => ({ en: '', ar: '' });

export function createEmptyDoctor() {
  return {
    id: '',
    slug: '',
    name: emptyLocalized(),
    profilePhotoUrl: '',
    imageKey: 'dr_hany',
    gender: '',
    qualification: emptyLocalized(),
    experienceYears: null,
    designation: emptyLocalized(),
    specializationId: '',
    subSpecializationId: null,
    medicalRegistrationNumber: '',
    certifications: [],
    awards: [],
    languagesKnown: [],
    affiliation: emptyLocalized(),
    shortIntro: emptyLocalized(),
    biography: emptyLocalized(),
    areasOfExpertise: [],
    treatmentsOffered: [],
    consultationTimings: emptyLocalized(),
    workingDays: [],
    onlineConsultationAvailable: false,
    galleryImages: [],
    reels: [],
    metaTitle: emptyLocalized(),
    metaDescription: emptyLocalized(),
    status: 'active',
    featured: false,
    order: 1,
    relatedServiceIds: [],
  };
}

export const DOCTOR_FORM_TABS = [
  { id: 'basic', label: 'Basic' },
  { id: 'professional', label: 'Professional' },
  { id: 'profile', label: 'Profile' },
  { id: 'availability', label: 'Availability' },
  { id: 'media', label: 'Media' },
  { id: 'reels', label: 'Reels' },
  { id: 'seo', label: 'SEO' },
  { id: 'status', label: 'Status' },
];

export const WORKING_DAYS = [
  { value: 'sun', label: 'Sunday' },
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
];

export const GENDERS = [
  { value: '', label: 'Not specified' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
