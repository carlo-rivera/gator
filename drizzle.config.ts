import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config.ts";

export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "src/lib/db/out",
  dialect: "postgresql",
  dbCredentials: {
    url: readConfig().dbUrl,
  },
});
