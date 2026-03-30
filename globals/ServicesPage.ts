import type { GlobalConfig } from "payload";

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    group: "Pages",
  },
  fields: [
    {
      name: "heading",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "services",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "subtitle",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "features",
          type: "array",
          fields: [
            {
              name: "feature",
              type: "text",
            },
          ],
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "imageSize",
          type: "select",
          defaultValue: "full",
          options: [
            { label: "Full", value: "full" },
            { label: "Large (75%)", value: "large" },
            { label: "Medium (50%)", value: "medium" },
          ],
          access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
            description:
              "Controls image width. 'Full' fills the area (crops to fit). Other sizes keep the image proportional and centered.",
          },
        },
      ],
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
