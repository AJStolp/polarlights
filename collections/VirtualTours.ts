import type { CollectionConfig } from "payload";

export const VirtualTours: CollectionConfig = {
  slug: "virtual-tours",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "location", "order"],
  },
  defaultSort: "order",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Preview image shown on the virtual tours page",
      },
    },
    {
      name: "embedUrl",
      type: "text",
      admin: {
        description:
          "Paste a Matterport or other 3D tour embed URL. Displayed as an interactive iframe.",
      },
      validate: (value: string | null | undefined) => {
        if (value && !/^https?:\/\//.test(value)) {
          return "Must be a valid URL starting with http:// or https://";
        }
        return true;
      },
    },
    {
      name: "externalLink",
      type: "text",
      admin: {
        description:
          "Optional link to view the tour on an external site (e.g. Matterport hosted page).",
      },
      validate: (value: string | null | undefined) => {
        if (value && !/^https?:\/\//.test(value)) {
          return "Must be a valid URL starting with http:// or https://";
        }
        return true;
      },
    },
    {
      name: "location",
      type: "text",
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
