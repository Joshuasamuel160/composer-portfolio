import { defineConfig } from "sanity";
import { schemaTypes } from "./lib/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "50173b3c";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "composer-portfolio",
  title: "Composer Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [],
  schema: {
    types: schemaTypes,
  },
});
