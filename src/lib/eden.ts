import { treaty } from "@elysiajs/eden";
import type { App } from "@/app/api/[[...slugs]]/route";
import { envConfig } from "@/lib/envConfig";

// requires http://
export const api = treaty<App>(envConfig.apiUrl, {
  fetch: {
    credentials: "include",
  },
}).api;
