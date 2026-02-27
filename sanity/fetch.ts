import { draftMode } from "next/headers";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;

export async function sanityFetch<T>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<T> {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode && token) {
    return client
      .withConfig({
        token,
        useCdn: false,
        perspective: "previewDrafts",
        stega: { enabled: true },
      })
      .fetch<T>(query, params);
  }

  return client
    .withConfig({ stega: { enabled: false } })
    .fetch<T>(query, params);
}
