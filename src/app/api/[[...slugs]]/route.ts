import { Elysia } from "elysia";
import { JokeController } from "./joke.controller";
import { errorPlugin } from "@/lib/elysia/error-plugin";

const joke = new JokeController();

const app = new Elysia({ prefix: "/api" })
  .use(errorPlugin)
  .get("/joke/random", joke.random)
  .post("/redirect", joke.redirect)
  .post("/success", joke.success)
  .post("/error", joke.error);

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const PATCH = app.fetch;
export const DELETE = app.fetch;
