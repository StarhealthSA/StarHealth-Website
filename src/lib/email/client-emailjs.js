import emailjs from '@emailjs/browser';

function getClientEmailJsConfig() {
  return {
    serviceId: (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_gr3hz0c').trim(),
    publicKey: (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '3hR26mPB0OTAoNfhQ').trim(),
    enquiryTemplateId: (
      process.env.NEXT_PUBLIC_EMAILJS_ENQUIRY_TEMPLATE_ID || 'template_jdttqx9'
    ).trim(),
  };
}

export async function sendEnquiryEmailClient(enquiry) {
  const { serviceId, publicKey, enquiryTemplateId } = getClientEmailJsConfig();

  await emailjs.send(
    serviceId,
    enquiryTemplateId,
    {
      name: enquiry.name,
      phonenumber: enquiry.phone,
      mail: enquiry.email,
      country: enquiry.country || '',
      speciality: enquiry.speciality || '',
      address: enquiry.address || '',
      message: enquiry.message || '',
    },
    publicKey
  );
}
