import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: 'oehwpok2',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source) {
  if (!source) return { width: () => ({ url: () => '' }) };
  return builder.image(source);
}

export const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  category,
  about,
  mainImage,
  publishedAt,
  "author": author->name
}`;

export const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  category,
  about,
  mainImage,
  publishedAt,
  body,
  "author": author->name
}`;

export const POST_INTRO_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  category,
  about,
  mainImage,
  publishedAt,
  "author": author->name
}`;

export const RELATED_QUERY = `*[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...4] {
  _id,
  title,
  slug,
  category,
  mainImage
}`;

export async function getPosts() {
  try {
    return await client.fetch(POSTS_QUERY);
  } catch (error) {
    console.error('Failed to fetch Sanity posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug) {
  try {
    return await client.fetch(POST_QUERY, { slug });
  } catch (error) {
    console.error(`Failed to fetch Sanity post "${slug}":`, error);
    return null;
  }
}

export async function getRelatedPosts(slug) {
  try {
    return await client.fetch(RELATED_QUERY, { slug });
  } catch (error) {
    console.error(`Failed to fetch related posts for "${slug}":`, error);
    return [];
  }
}
