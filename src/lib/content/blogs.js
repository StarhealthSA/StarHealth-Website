import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { isBlogPublished, normalizeBlog } from './normalize-blog';

const COLLECTION = 'blogs';

function sortBlogs(items) {
  return [...items].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }
    const dateA = new Date(a.publishedAt || 0).getTime();
    const dateB = new Date(b.publishedAt || 0).getTime();
    if (dateA !== dateB) return dateB - dateA;
    return (a.order ?? 0) - (b.order ?? 0);
  });
}

function normalizeList(items) {
  return sortBlogs(items.map((item) => normalizeBlog(item)));
}

async function fetchBlogsFromFirestore({ publishedOnly = true } = {}) {
  const db = getAdminDb();
  if (!db) return null;

  const snapshot = await db.collection(COLLECTION).get();
  let blogs = snapshot.docs.map((doc) => normalizeBlog({ id: doc.id, ...doc.data() }));

  if (publishedOnly) {
    blogs = blogs.filter((blog) => isBlogPublished(blog));
  }

  return sortBlogs(blogs);
}

export async function getPublishedBlogs() {
  try {
    if (!isFirebaseAdminConfigured()) {
      return [];
    }

    const blogs = await fetchBlogsFromFirestore({ publishedOnly: true });
    return blogs || [];
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export async function getAllBlogs() {
  const db = getAdminDb();
  if (!db) return [];

  const snapshot = await db.collection(COLLECTION).get();
  return normalizeList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getBlogById(id) {
  const db = getAdminDb();
  if (!db) return null;

  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return normalizeBlog({ id: doc.id, ...doc.data() });
}

export async function getBlogBySlug(slug) {
  const db = getAdminDb();
  if (!db) return null;

  const snapshot = await db.collection(COLLECTION).where('slug', '==', slug).limit(1).get();
  if (!snapshot.empty) {
    const blog = normalizeBlog({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
    return isBlogPublished(blog) ? blog : null;
  }

  const byId = await getBlogById(slug);
  return byId && isBlogPublished(byId) ? byId : null;
}

export async function getRelatedBlogs(slug, limit = 4) {
  const blogs = await getPublishedBlogs();
  return blogs.filter((blog) => blog.slug !== slug).slice(0, limit);
}

export async function createBlog(data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(data.id || data.slug);
  const payload = normalizeBlog({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function updateBlog(id, data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const payload = normalizeBlog({
    ...data,
    updatedAt: now,
  });
  await db.collection(COLLECTION).doc(id).set(payload, { merge: true });
  return { id, ...payload };
}

export async function deleteBlog(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  await db.collection(COLLECTION).doc(id).delete();
}
