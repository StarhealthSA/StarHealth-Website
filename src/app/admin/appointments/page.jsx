'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import BookingsTab from '@/components/admin/appointments/bookings-tab';
import ContactEnquiriesTab from '@/components/admin/appointments/contact-enquiries-tab';

const TABS = [
  { id: 'bookings', label: 'Bookings' },
  { id: 'contact', label: 'Contact us form' },
];

export default function AdminAppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') === 'contact' ? 'contact' : 'bookings';

  const setTab = (tabId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tabId === 'bookings') {
      params.delete('tab');
    } else {
      params.set('tab', tabId);
    }
    const query = params.toString();
    router.replace(query ? `/admin/appointments?${query}` : '/admin/appointments');
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#002f3b]">Bookings</h1>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-[#d7e6e2]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`-mb-px rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border border-b-white border-[#d7e6e2] bg-white text-[#037B76]'
                : 'text-[#586971] hover:text-[#002f3b]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'contact' ? <ContactEnquiriesTab /> : <BookingsTab />}
      </div>
    </div>
  );
}
