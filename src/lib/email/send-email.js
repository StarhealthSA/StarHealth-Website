const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

function getEmailJsConfig() {
  return {
    serviceId: (process.env.EMAILJS_SERVICE_ID || 'service_gr3hz0c').trim(),
    publicKey: (process.env.EMAILJS_PUBLIC_KEY || '3hR26mPB0OTAoNfhQ').trim(),
    privateKey: (process.env.EMAILJS_PRIVATE_KEY || '').trim(),
  };
}

export function isEmailJsConfigured() {
  const { serviceId, publicKey, privateKey } = getEmailJsConfig();
  return Boolean(serviceId && publicKey && privateKey);
}

export async function sendEmailJsTemplate(templateId, templateParams) {
  const { serviceId, publicKey, privateKey } = getEmailJsConfig();

  if (!serviceId || !publicKey || !privateKey || !templateId) {
    throw new Error('Email service is not configured');
  }

  const response = await fetch(EMAILJS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to send email');
  }
}

export function getEnquiryTemplateId() {
  return (process.env.EMAILJS_ENQUIRY_TEMPLATE_ID || 'template_jdttqx9').trim();
}

export function getAppointmentTemplateId() {
  return (process.env.EMAILJS_APPOINTMENT_TEMPLATE_ID || 'template_zi5qnzk').trim();
}
