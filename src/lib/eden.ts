import { treaty } from "@elysiajs/eden";
import type { App } from "@/app/api/[[...slugs]]/route";

// requires http://
export const api = treaty<App>("http://localhost:3000").api;
