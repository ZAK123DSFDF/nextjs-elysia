// src/lib/elysia/throwAppError.ts

export interface ErrorConfig<T> {
  status?: number;
  error?: string;
  message?: string;
  toast?: string | null;
  fields?: Partial<Record<keyof T, string>> | null;
  data?: any;
}

// Overload 1: For Form Data (Inference)
export function throwAppError<T>(data: T, options: ErrorConfig<T>): never;

// Overload 2: For General Errors (No Data)
export function throwAppError(options: ErrorConfig<Record<string, any>>): never;

// Implementation
export function throwAppError(arg1: any, arg2?: any): never {
  const options = arg2 ? arg2 : arg1;

  // 🔥 Throwing INSIDE the function so you don't have to write it in your services
  throw {
    ok: false as const,
    status: options.status ?? 400,
    error: options.error ?? "Request failed",
    message: options.message ?? "Something went wrong",
    toast: options.toast ?? null,
    fields: options.fields ?? null,
    data: options.data ?? null,
  };
}
