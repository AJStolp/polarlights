import { defineField, defineType, defineArrayMember } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Page Heading",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Page Subtitle",
      type: "string",
    }),
    defineField({
      name: "storyHeading",
      title: "Story Section Heading",
      type: "string",
    }),
    defineField({
      name: "storyImage",
      title: "Story Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "storyParagraphs",
      title: "Story Paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text" })],
      description: "Each item is a separate paragraph.",
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string" }),
            defineField({ name: "label", title: "Label", type: "string" }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
    }),
    defineField({
      name: "serviceAreaHeading",
      title: "Service Area Heading",
      type: "string",
    }),
    defineField({
      name: "serviceAreaDescription",
      title: "Service Area Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "serviceAreas",
      title: "Service Area Locations",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "ctaHeading",
      title: "CTA Heading",
      type: "string",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA Description",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
