import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    homePage: defineLocations({
      select: { title: "heroHeadline" },
      resolve: () => ({
        locations: [{ title: "Home", href: "/" }],
      }),
    }),
    servicesPage: defineLocations({
      select: { title: "heading" },
      resolve: () => ({
        locations: [{ title: "Services", href: "/services" }],
      }),
    }),
    aboutPage: defineLocations({
      select: { title: "heading" },
      resolve: () => ({
        locations: [{ title: "About", href: "/about" }],
      }),
    }),
    contactPage: defineLocations({
      select: { title: "heading" },
      resolve: () => ({
        locations: [{ title: "Contact", href: "/contact" }],
      }),
    }),
    portfolioItem: defineLocations({
      select: { title: "title" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Portfolio Item",
            href: "/portfolio",
          },
          {
            title: "Home (Featured)",
            href: "/",
          },
        ],
      }),
    }),
  },
};
