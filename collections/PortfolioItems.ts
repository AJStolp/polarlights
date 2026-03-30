import type { CollectionConfig } from "payload";

export const PortfolioItems: CollectionConfig = {
  slug: "portfolio-items",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "featured", "order"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  defaultSort: "order",
  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Aerial Photo", value: "Aerial Photo" },
        { label: "Video", value: "Video" },
        { label: "3D Tours", value: "3D Tours" },
      ],
    },
    {
      name: "location",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "showTitle",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Show title overlay on the website",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Featured on Home Page",
      },
    },
    {
      name: "order",
      type: "number",
      admin: {
        description: "Lower numbers appear first",
      },
    },
  ],
};
