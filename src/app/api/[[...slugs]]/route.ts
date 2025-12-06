import { Elysia } from "elysia";
import { JokeController } from "./joke.controller";
import { errorPlugin } from "@/lib/elysia/error-plugin";

const joke = new JokeController();

const app = new Elysia({ prefix: "/api" }).get("/joke/random", joke.random);

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const PATCH = app.fetch;
export const DELETE = app.fetch;
