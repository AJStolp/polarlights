import { defineField, defineType } from "sanity";

export const virtualTour = defineType({
  name: "virtualTour",
  title: "Virtual Tour",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: { hotspot: true },
      description: "Preview image shown on the virtual tours page",
    }),
    defineField({
      name: "embedUrl",
      title: "Embed URL (iframe)",
      type: "url",
      description:
        "Paste a Matterport or other 3D tour embed URL. This will be displayed as an interactive iframe on the page.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "externalLink",
      title: "External Link",
      type: "url",
      description:
        "Optional link to view the tour on an external site (e.g. Matterport hosted page).",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
      media: "thumbnail",
    },
  },
});
