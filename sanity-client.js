import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "oehwpok2",
  dataset: "production",
  apiVersion: "2026-03-11",
  useCdn: process.env.NODE_ENV === "production",
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}