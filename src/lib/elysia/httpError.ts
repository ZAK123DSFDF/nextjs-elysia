export function throwHttpError({
  status = 400,
  error = "Request failed",
  toast = "Something went wrong",
  fields = null,
  data = null,
}: {
  status?: number;
  error?: string;
  toast?: string;
  fields?: Record<string, string> | null;
  data?: any;
}) {
  throw { ok: false, status, error, toast, fields, data };
}
