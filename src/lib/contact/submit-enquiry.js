export async function submitEnquiry(formData) {
  const response = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      phone: formData.phonenumber,
      email: formData.mail,
      country: formData.country,
      speciality: formData.speciality,
      address: formData.address,
      message: formData.message,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send message');
  }

  return data;
}
