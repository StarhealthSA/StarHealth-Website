'use client';

const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: '7days', label: '7 Days' },
  { id: 'month', label: '1 Month' },
  { id: 'year', label: 'Year' },
];

function formatNumber(value) {
  return new Intl.NumberFormat().format(value ?? 0);
}

export default function DashboardActivityChart({
  activity,
  period,
  onPeriodChange,
  loading = false,
}) {
  const maxValue = Math.max(
    1,
    ...(activity?.bookings || []),
    ...(activity?.contactSubmissions || []),
  );

  const chartHeight = 220;
  const labels = activity?.labels || [];
  const bookings = activity?.bookings || [];
  const contacts = activity?.contactSubmissions || [];

  return (
    <section className="rounded-2xl border border-[#d7e6e2] bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#037B76]">Activity</p>
          <h2 className="mt-1 text-xl font-semibold text-[#002f3b]">Bookings & Contact Submissions</h2>
          <p className="mt-1 text-sm text-[#586971]">
            Compare appointment bookings against contact form submissions over time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={loading}
              onClick={() => onPeriodChange(item.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                period === item.id
                  ? 'bg-[#037B76] text-white'
                  : 'border border-[#d7e6e2] bg-[#f8fbfa] text-[#586971] hover:bg-[#f0f6f4]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[#d7e6e2] bg-gradient-to-br from-[#f3faf8] to-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#586971]">Bookings</p>
          <p className="mt-1 text-2xl font-semibold text-[#037B76]">
            {formatNumber(activity?.totals?.bookings)}
          </p>
        </div>
        <div className="rounded-xl border border-[#d7e6e2] bg-gradient-to-br from-[#fff8ef] to-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#586971]">Contact Forms</p>
          <p className="mt-1 text-2xl font-semibold text-[#b45309]">
            {formatNumber(activity?.totals?.contactSubmissions)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-[#586971]">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#037B76]" />
          Bookings
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#f59e0b]" />
          Contact submissions
        </span>
      </div>

      <div className="relative mt-4 overflow-x-auto pb-2">
        {loading ? (
          <div className="flex h-[220px] items-center justify-center text-sm text-[#586971]">
            Loading chart...
          </div>
        ) : (
          <div
            className="grid min-w-full gap-3"
            style={{ gridTemplateColumns: `repeat(${Math.max(labels.length, 1)}, minmax(28px, 1fr))` }}
          >
            {labels.map((label, index) => {
              const bookingValue = bookings[index] || 0;
              const contactValue = contacts[index] || 0;
              const bookingHeight = Math.max(6, (bookingValue / maxValue) * chartHeight);
              const contactHeight = Math.max(6, (contactValue / maxValue) * chartHeight);

              return (
                <div key={`${label}-${index}`} className="flex min-w-[28px] flex-col items-center">
                  <div
                    className="flex h-[220px] w-full items-end justify-center gap-1"
                    title={`${label}: ${bookingValue} bookings, ${contactValue} contacts`}
                  >
                    <div
                      className="w-[42%] rounded-t-md bg-gradient-to-t from-[#026a66] to-[#37a39d] transition-all duration-300"
                      style={{ height: `${bookingHeight}px` }}
                    />
                    <div
                      className="w-[42%] rounded-t-md bg-gradient-to-t from-[#d97706] to-[#fbbf24] transition-all duration-300"
                      style={{ height: `${contactHeight}px` }}
                    />
                  </div>
                  <span className="mt-2 text-center text-[10px] font-medium text-[#586971] sm:text-xs">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
