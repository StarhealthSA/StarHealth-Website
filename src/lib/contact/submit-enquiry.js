import { sendEnquiryEmailClient } from '@/lib/email/client-emailjs';

export async function submitEnquiry(formData) {
  const enquiry = {
    name: formData.name,
    phone: formData.phonenumber,
    email: formData.mail,
    country: formData.country,
    speciality: formData.speciality,
    address: formData.address,
    message: formData.message,
  };

  const response = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiry),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send message');
  }

  await sendEnquiryEmailClient(enquiry);

  return data;
}
