import type { GlobalConfig } from "payload";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  admin: {
    group: "Pages",
  },
  fields: [
    {
      name: "heading",
      type: "text",
    },
    {
      name: "subtitle",
      type: "text",
    },
    {
      name: "storyHeading",
      type: "text",
    },
    {
      name: "storyImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "storyParagraphs",
      type: "array",
      admin: { description: "Each item is a separate paragraph." },
      fields: [
        {
          name: "text",
          type: "textarea",
        },
      ],
    },
    {
      name: "stats",
      type: "array",
      fields: [
        {
          name: "value",
          type: "text",
        },
        {
          name: "label",
          type: "text",
        },
      ],
    },
    {
      name: "serviceAreaHeading",
      type: "text",
    },
    {
      name: "serviceAreaDescription",
      type: "textarea",
    },
    {
      name: "serviceAreas",
      type: "array",
      fields: [
        {
          name: "area",
          type: "text",
        },
      ],
    },
    {
      name: "ctaHeading",
      type: "text",
    },
    {
      name: "ctaDescription",
      type: "text",
    },
  ],
};
