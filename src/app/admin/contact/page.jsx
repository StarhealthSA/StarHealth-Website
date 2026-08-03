'use client';

import ContactEnquiriesTab from '@/components/admin/appointments/contact-enquiries-tab';

export default function AdminContactPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#002f3b]">Contact Form</h1>
      <div className="mt-6">
        <ContactEnquiriesTab />
      </div>
    </div>
  );
}
