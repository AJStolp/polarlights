import type { GlobalConfig } from "payload";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    group: "Pages",
  },
  fields: [
    {
      name: "heroHeadline",
      type: "text",
      access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: { description: 'First line of the hero (e.g. "Elevate Your")' },
    },
    {
      name: "heroAccent",
      type: "text",
      access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: { description: 'The highlighted word (e.g. "Perspective")' },
    },
    {
      name: "heroDescription",
      type: "textarea",
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "servicesHeading",
      type: "text",
    },
    {
      name: "servicesDescription",
      type: "textarea",
    },
    {
      name: "featuredHeading",
      type: "text",
    },
    {
      name: "featuredDescription",
      type: "text",
    },
    {
      name: "ctaHeading",
      type: "text",
    },
    {
      name: "ctaDescription",
      type: "textarea",
    },
  ],
};
