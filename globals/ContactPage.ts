import type { GlobalConfig } from "payload";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
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
      name: "email",
      type: "text",
    },
    {
      name: "serviceAreaDescription",
      type: "textarea",
    },
  ],
};
