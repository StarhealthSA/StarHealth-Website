import { LEGACY_CATEGORY_TO_SPEC } from './fallback-specializations.js';

const emptyLocalized = () => ({ en: '', ar: '' });

export function normalizeDoctor(raw = {}) {
  const status = raw.status ?? (raw.published === false ? 'inactive' : 'active');
  const specializationId =
    raw.specializationId ??
    LEGACY_CATEGORY_TO_SPEC[raw.category] ??
    null;

  return {
    id: raw.id ?? raw.slug ?? '',
    slug: raw.slug ?? raw.id ?? '',
    name: raw.name ?? emptyLocalized(),
    profilePhotoUrl: raw.profilePhotoUrl ?? raw.imageUrl ?? '',
    imageKey: raw.imageKey ?? '',
    gender: raw.gender ?? '',
    qualification: raw.qualification ?? emptyLocalized(),
    experienceYears: raw.experienceYears ?? null,
    designation: raw.designation ?? emptyLocalized(),
    specializationId,
    subSpecializationId: raw.subSpecializationId ?? null,
    specialty: raw.specialty ?? emptyLocalized(),
    medicalRegistrationNumber: raw.medicalRegistrationNumber ?? '',
    certifications: raw.certifications ?? [],
    awards: raw.awards ?? [],
    languagesKnown: raw.languagesKnown ?? [],
    affiliation: raw.affiliation ?? emptyLocalized(),
    shortIntro: raw.shortIntro ?? emptyLocalized(),
    biography: raw.biography ?? emptyLocalized(),
    areasOfExpertise: raw.areasOfExpertise ?? [],
    treatmentsOffered: raw.treatmentsOffered ?? [],
    consultationTimings: raw.consultationTimings ?? emptyLocalized(),
    workingDays: raw.workingDays ?? [],
    onlineConsultationAvailable: raw.onlineConsultationAvailable ?? false,
    galleryImages: raw.galleryImages ?? [],
    metaTitle: raw.metaTitle ?? emptyLocalized(),
    metaDescription: raw.metaDescription ?? emptyLocalized(),
    status,
    featured: raw.featured ?? false,
    order: raw.order ?? 0,
    relatedServiceIds: raw.relatedServiceIds ?? [],
    published: status === 'active',
    category: raw.category ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export function getDoctorDisplayLine(doctor, language = 'en') {
  const designation = doctor.designation?.[language] || doctor.designation?.en;
  const qualification = doctor.qualification?.[language] || doctor.qualification?.en;
  const years = doctor.experienceYears;
  const legacy = doctor.specialty?.[language] || doctor.specialty?.en;

  if (designation && years) {
    return `${designation} · ${years} ${language === 'ar' ? 'سنوات خبرة' : 'yrs experience'}`;
  }
  if (qualification && years) {
    return `${qualification} · ${years} ${language === 'ar' ? 'سنوات خبرة' : 'yrs experience'}`;
  }
  if (legacy) return legacy;
  if (designation) return designation;
  if (qualification) return qualification;
  return '';
}

export function isDoctorActive(doctor) {
  const normalized = normalizeDoctor(doctor);
  return normalized.status === 'active';
}
