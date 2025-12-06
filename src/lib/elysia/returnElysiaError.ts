interface ErrorResponse {
  ok: false;
  status: number;
  error: string;
  message?: string;
  toast?: string;
  fields?: Record<string, string> | null;
  data?: any;
}

/**
 * Convert any thrown error into an Elysia-friendly JSON response.
 * (No Elysia error throwing here — handler returns structured JSON)
 */
export function returnElysiaError(err: unknown): ErrorResponse {
  console.error("Full error object:", err);

  // Native JS error
  if (err instanceof Error) {
    return {
      ok: false,
      status: 500,
      error: err.message,
      message: err.message,
      toast: "Server error occurred",
      fields: null,
    };
  }

  // Custom error object
  if (typeof err === "object" && err !== null) {
    const errorObj = err as Partial<ErrorResponse>;

    return {
      ok: false,
      status: errorObj.status ?? 500,
      error: errorObj.error ?? "Unknown error",
      message: errorObj.message ?? "Something went wrong",
      toast: errorObj.toast ?? "Something went wrong",
      fields: errorObj.fields ?? null,
      data: errorObj.data,
    };
  }

  // Fallback
  return {
    ok: false,
    status: 500,
    error: "Internal server error",
    message: "Something went wrong",
    toast: "Something went wrong",
  };
}
