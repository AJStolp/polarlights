import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      description: 'First line of the hero (e.g. "Elevate Your")',
    }),
    defineField({
      name: "heroAccent",
      title: "Hero Accent Word",
      type: "string",
      description: 'The highlighted word (e.g. "Perspective")',
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "servicesHeading",
      title: "Services Section Heading",
      type: "string",
    }),
    defineField({
      name: "servicesDescription",
      title: "Services Section Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "featuredHeading",
      title: "Featured Work Heading",
      type: "string",
    }),
    defineField({
      name: "featuredDescription",
      title: "Featured Work Description",
      type: "string",
    }),
    defineField({
      name: "ctaHeading",
      title: "CTA Section Heading",
      type: "string",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA Section Description",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
