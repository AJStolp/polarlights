import { draftMode } from "next/headers";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;

export async function sanityFetch<T>({
  query,
  params = {},
  tags = ["sanity"],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
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
      .fetch<T>(query, params, { next: { tags } });
  }

  return client
    .withConfig({ stega: { enabled: false } })
    .fetch<T>(query, params, {
      next: { revalidate: 0, tags },
    });
}
