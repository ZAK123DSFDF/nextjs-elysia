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
export function throwAppError<T>(data: T, options: ErrorConfig<T>): any;

// Overload 2: For General Errors (No Data)
export function throwAppError(options: ErrorConfig<Record<string, any>>): any;

// Implementation
export function throwAppError(arg1: any, arg2?: any) {
  const options = arg2 ? arg2 : arg1;

  // Note: We return the object. In your service, you will write:
  // throw throwAppError(...)
  return {
    ok: false as const,
    status: options.status ?? 400,
    error: options.error ?? "Request failed",
    message: options.message ?? "Something went wrong",
    toast: options.toast ?? null,
    fields: options.fields ?? null,
    data: options.data ?? null,
  };
}
