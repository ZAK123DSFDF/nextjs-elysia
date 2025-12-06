import { returnElysiaError } from "@/lib/elysia/errorHandler";
import type { ResponseData, MutationData } from "@/lib/types/response";

/**
 * Elysia-safe async action wrapper.
 * - Works in controllers/services
 * - Never throws (Elysia routes must return JSON)
 */
export async function handleAction<T extends ResponseData<any> | MutationData>(
  name: string | null,
  fn: () => Promise<T>,
  measureTime: boolean = true,
): Promise<T> {
  const label = name ?? "Unnamed Action";
  const start = measureTime ? performance.now() : 0;

  try {
    const result = await fn();

    if (measureTime) {
      const end = performance.now();
      console.info(`✅ ${label} completed in ${Math.round(end - start)}ms`);
    }

    return result;
  } catch (err) {
    console.error(`${label} error:`, err);
    return returnElysiaError(err) as T;
  }
}
