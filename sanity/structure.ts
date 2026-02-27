import type { StructureResolver } from "sanity/structure";

const singletons = new Set(["homePage", "servicesPage", "aboutPage", "contactPage"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Page singletons
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Services Page")
        .id("servicesPage")
        .child(S.document().schemaType("servicesPage").documentId("servicesPage")),
      S.listItem()
        .title("About Page")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Contact Page")
        .id("contactPage")
        .child(S.document().schemaType("contactPage").documentId("contactPage")),
      S.divider(),
      // Regular document lists (filter out singletons)
      ...S.documentTypeListItems().filter(
        (listItem) => !singletons.has(listItem.getId() ?? "")
      ),
    ]);
