// src/lib/elysia/error-plugin.ts
import { Elysia } from "elysia";

export const errorPlugin = new Elysia().onError(({ error, code, set }) => {
  console.error(`Elysia error [${code}]:`, error);

  // 1. Handle Elysia's Built-in Validation Errors (Zod/TypeBox)
  if (code === "VALIDATION") {
    set.status = 422;
    // Note: error is narrowed to ValidationError here, so .message works
    return {
      ok: false,
      status: 422,
      error: "Validation Error",
      message: error.message,
      toast: "Please check your input.",
      fields:
        (error as any).all?.reduce((acc: any, curr: any) => {
          const path = curr.path.replace("/", "");
          acc[path] = curr.message;
          return acc;
        }, {}) ?? null,
    };
  }

  // Cast once to any to handle custom objects and property access safely
  const err = error as any;

  // 2. Handle Custom throwAppError objects (our ok: false signature)
  if (err && typeof err === "object" && err.ok === false) {
    const status = err.status ?? 400;
    set.status = status;

    return {
      ok: false,
      status,
      error: err.error || "AppError",
      message: err.message || "Something went wrong",
      toast: err.toast || null,
      fields: err.fields || null,
      data: err.data || null,
    };
  }

  // 3. Handle Standard JavaScript Errors or other Elysia errors
  // We use err.status, err.name, etc., via the cast to avoid TS2339
  set.status = err?.status ?? 500;

  return {
    ok: false,
    status: set.status,
    error: err?.name || err?.error || "InternalServerError",
    message: err?.message || "An unexpected error occurred",
    toast: err?.toast || "Something went wrong on our end.",
    fields: err?.fields || null,
    data: err?.data || null,
  };
});
