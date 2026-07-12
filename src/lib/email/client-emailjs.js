import emailjs from '@emailjs/browser';
import { assertClientEmailJsReady, getClientEmailJsConfig } from '@/lib/email/client-emailjs-config';

export async function sendEnquiryEmailClient(enquiry) {
  const config = getClientEmailJsConfig();
  const templateId = assertClientEmailJsReady(config, { template: 'enquiry' });

  await emailjs.send(
    config.serviceId,
    templateId,
    {
      name: enquiry.name,
      phonenumber: enquiry.phone,
      mail: enquiry.email,
      country: enquiry.country || '',
      speciality: enquiry.speciality || '',
      address: enquiry.address || '',
      message: enquiry.message || '',
    },
    config.publicKey
  );
}

export async function sendAppointmentEmailClient(templateParams) {
  const config = getClientEmailJsConfig();
  const templateId = assertClientEmailJsReady(config, { template: 'appointment' });

  await emailjs.send(
    config.serviceId,
    templateId,
    templateParams,
    config.publicKey
  );
}
