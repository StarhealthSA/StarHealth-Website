import { getEnquiryTemplateId, sendEmailJsTemplate } from './send-email';

export async function sendEnquiryEmail(enquiry) {
  await sendEmailJsTemplate(getEnquiryTemplateId(), {
    name: enquiry.name,
    phonenumber: enquiry.phone,
    mail: enquiry.email,
    country: enquiry.country,
    speciality: enquiry.speciality,
    address: enquiry.address,
    message: enquiry.message,
  });
}
