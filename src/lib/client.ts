import { createClient, type ClientConfig } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "announcement",
  apiVersion: "2023-03-01",
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: true,
};

export const client = createClient(config);

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource): string => {
  return builder.image(source).url();
};
