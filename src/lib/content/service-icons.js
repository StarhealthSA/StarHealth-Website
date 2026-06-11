import generalmedicine from '@/assets/home/general_medicine.svg';
import ortho from '@/assets/home/ortho.svg';
import obg from '@/assets/home/obg.svg';
import generaldentistry from '@/assets/home/generaldentistry.svg';
import internalmedicine from '@/assets/home/internalmedicine.svg';
import familyMedicine from '@/assets/home/familymedicine.svg';
import laboratory from '@/assets/home/laboratory.svg';
import pediatrics from '@/assets/home/pediatric.svg';

export const SERVICE_ICONS = {
  generalMedicine: generalmedicine,
  familyMedicine,
  internalMedicine: internalmedicine,
  obg,
  ortho,
  generalDentistry: generaldentistry,
  laboratory,
  pediatrics,
};

export function resolveServiceIcon(service) {
  if (service?.iconUrl) return service.iconUrl;
  if (service?.iconKey && SERVICE_ICONS[service.iconKey]) {
    return SERVICE_ICONS[service.iconKey];
  }
  return SERVICE_ICONS.generalMedicine;
}

export function resolveServiceBannerImage(service) {
  return service?.featuredImageUrl || service?.imageUrl || '';
}
