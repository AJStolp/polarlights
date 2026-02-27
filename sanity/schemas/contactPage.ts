import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Page Heading",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Page Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "serviceAreaDescription",
      title: "Service Area Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
