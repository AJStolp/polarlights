import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { projectId, dataset } from "./sanity/env";
import { resolve } from "./sanity/resolve";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "polar-lights-imaging",
  title: "Polar Lights Imaging",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: {
        draftMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
