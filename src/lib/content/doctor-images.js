import dr_aljazi from '@/assets/doctors/dr_aljazi.png';
import dr_hany from '@/assets/doctors/dr_hany.png';
import dr_tanaa from '@/assets/doctors/dr_thanaa.png';
import dr_asma from '@/assets/doctors/dr_asma.png';
import dr_haifa from '@/assets/doctors/dr_haifa.png';
import dr_waad from '@/assets/doctors/dr_waad.png';

export const DOCTOR_IMAGES = {
  dr_aljazi,
  dr_hany,
  dr_tanaa,
  dr_asma,
  dr_haifa,
  dr_waad,
};

export function resolveDoctorImage(doctor) {
  if (doctor?.imageUrl) return doctor.imageUrl;
  if (doctor?.imageKey && DOCTOR_IMAGES[doctor.imageKey]) {
    return DOCTOR_IMAGES[doctor.imageKey];
  }
  return DOCTOR_IMAGES.dr_hany;
}
