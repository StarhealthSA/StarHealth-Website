import { listAppointments } from '@/lib/content/appointments';
import { getAllBlogs } from '@/lib/content/blogs';
import { getAllDoctors } from '@/lib/content/doctors';
import { listEnquiries } from '@/lib/content/enquiries';
import { getAllServiceCategories } from '@/lib/content/service-categories';
import { getAllServices } from '@/lib/content/services';
import { getHomeSettings } from '@/lib/content/site-settings';
import { getAllSpecializations } from '@/lib/content/specializations';
import { listAdminUsers } from '@/lib/firebase/user-management';
import { USER_MANAGEMENT_ROLES } from '@/lib/firebase/roles';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseCreatedAt(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function formatHourLabel(hour) {
  if (hour === 0) return '12a';
  if (hour < 12) return `${hour}a`;
  if (hour === 12) return '12p';
  return `${hour - 12}p`;
}

function getBucketConfig(period, now = new Date()) {
  if (period === 'today') {
    const start = startOfDay(now);
    const end = endOfDay(now);
    return {
      start,
      end,
      labels: Array.from({ length: 24 }, (_, hour) => formatHourLabel(hour)),
      getBucketIndex: (date) => date.getHours(),
      bucketCount: 24,
    };
  }

  if (period === '7days') {
    const start = startOfDay(now);
    start.setDate(start.getDate() - 6);
    const end = endOfDay(now);
    const labels = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return WEEKDAY_LABELS[day.getDay()];
    });

    return {
      start,
      end,
      labels,
      getBucketIndex: (date) => {
        const dayStart = startOfDay(date).getTime();
        const diff = Math.floor((dayStart - start.getTime()) / 86400000);
        return diff;
      },
      bucketCount: 7,
    };
  }

  if (period === 'month') {
    const start = startOfDay(now);
    start.setDate(start.getDate() - 29);
    const end = endOfDay(now);
    const labels = Array.from({ length: 30 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return `${day.getDate()}/${day.getMonth() + 1}`;
    });

    return {
      start,
      end,
      labels,
      getBucketIndex: (date) => {
        const dayStart = startOfDay(date).getTime();
        return Math.floor((dayStart - start.getTime()) / 86400000);
      },
      bucketCount: 30,
    };
  }

  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const end = endOfDay(now);
  return {
    start,
    end,
    labels: MONTH_LABELS,
    getBucketIndex: (date) => date.getMonth(),
    bucketCount: 12,
  };
}

export function buildActivitySeries(appointments, enquiries, period, now = new Date()) {
  const config = getBucketConfig(period, now);
  const bookings = Array(config.bucketCount).fill(0);
  const contactSubmissions = Array(config.bucketCount).fill(0);

  appointments.forEach((item) => {
    const createdAt = parseCreatedAt(item.createdAt);
    if (!createdAt || createdAt < config.start || createdAt > config.end) return;
    const index = config.getBucketIndex(createdAt);
    if (index >= 0 && index < config.bucketCount) {
      bookings[index] += 1;
    }
  });

  enquiries.forEach((item) => {
    const createdAt = parseCreatedAt(item.createdAt);
    if (!createdAt || createdAt < config.start || createdAt > config.end) return;
    const index = config.getBucketIndex(createdAt);
    if (index >= 0 && index < config.bucketCount) {
      contactSubmissions[index] += 1;
    }
  });

  return {
    period,
    labels: config.labels,
    bookings,
    contactSubmissions,
    totals: {
      bookings: bookings.reduce((sum, value) => sum + value, 0),
      contactSubmissions: contactSubmissions.reduce((sum, value) => sum + value, 0),
    },
  };
}

export async function getDashboardStats({ period = '7days', role } = {}) {
  const [
    specializations,
    doctors,
    serviceCategories,
    services,
    blogs,
    appointments,
    enquiries,
    homeSettings,
  ] = await Promise.all([
    getAllSpecializations(),
    getAllDoctors(),
    getAllServiceCategories(),
    getAllServices(),
    getAllBlogs(),
    listAppointments(),
    listEnquiries(),
    getHomeSettings(),
  ]);

  let users = null;
  if (USER_MANAGEMENT_ROLES.includes(role)) {
    try {
      const adminUsers = await listAdminUsers();
      users = adminUsers.length;
    } catch {
      users = null;
    }
  }

  const activeBookings = appointments.filter((item) => item.status === 'booked');
  const unreadBookings = appointments.filter((item) => item.status === 'booked' && !item.read);
  const unreadContacts = enquiries.filter((item) => !item.read);

  return {
    counts: {
      specializations: specializations.length,
      doctors: doctors.length,
      serviceCategories: serviceCategories.length,
      services: services.length,
      blogs: blogs.length,
      bookings: appointments.length,
      bookingsActive: activeBookings.length,
      bookingsUnread: unreadBookings.length,
      contactSubmissions: enquiries.length,
      contactUnread: unreadContacts.length,
      users,
      heroSlides: (homeSettings.heroSlides || []).length,
    },
    activity: buildActivitySeries(appointments, enquiries, period),
  };
}
