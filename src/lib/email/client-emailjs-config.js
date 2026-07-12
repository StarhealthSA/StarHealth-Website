export function getClientEmailJsConfig() {
  return {
    serviceId: (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '').trim(),
    publicKey: (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '').trim(),
    enquiryTemplateId: (process.env.NEXT_PUBLIC_EMAILJS_ENQUIRY_TEMPLATE_ID || '').trim(),
    appointmentTemplateId: (process.env.NEXT_PUBLIC_EMAILJS_APPOINTMENT_TEMPLATE_ID || '').trim(),
  };
}

export function assertClientEmailJsReady(config, { template = 'enquiry' } = {}) {
  if (!config.serviceId || !config.publicKey) {
    throw new Error(
      'EmailJS is not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY.'
    );
  }

  const templateId = template === 'appointment'
    ? config.appointmentTemplateId
    : config.enquiryTemplateId;

  if (!templateId) {
    throw new Error(
      template === 'appointment'
        ? 'EmailJS appointment template is not configured. Set NEXT_PUBLIC_EMAILJS_APPOINTMENT_TEMPLATE_ID.'
        : 'EmailJS enquiry template is not configured. Set NEXT_PUBLIC_EMAILJS_ENQUIRY_TEMPLATE_ID.'
    );
  }

  return templateId;
}
