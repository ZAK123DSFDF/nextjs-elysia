import { Elysia } from "elysia";
import { JokeController } from "./joke.controller";
import { errorPlugin } from "@/lib/elysia/error-plugin";
import { SuccessBodySchema } from "@/lib/validation/joke";

const joke = new JokeController();

const app = new Elysia({
  prefix: "/api",
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 86400,
  },
})
  .use(errorPlugin)
  .get("/joke/random", joke.random)
  .post("/redirect", joke.redirect)
  .post("/success", joke.success, {
    body: SuccessBodySchema,
  })
  .post("/logout", joke.logout)
  .post("/error", joke.error);

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const PATCH = app.fetch;
export const DELETE = app.fetch;
