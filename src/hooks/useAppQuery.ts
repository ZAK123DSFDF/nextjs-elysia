import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { EdenError, ExtractEdenData, ExtractEdenError } from "@/lib/eden/types";

interface UseAppQueryOptions {
  enabled?: boolean;
  showToast?: boolean;
}

type EdenQueryResult<TData, TError extends EdenError> =
  | { ok: true; data: TData }
  | { ok: false; error: TError };
function serializeQueryKey(key: Array<string | number | object | undefined>) {
  return key.map((k) =>
    typeof k === "object" && k !== null ? JSON.stringify(k) : k,
  );
}
export function useAppQuery<TFetch extends () => Promise<any>>(
  queryKey: Array<string | number | object | undefined>,
  fetchFn: TFetch,
  options?: UseAppQueryOptions,
) {
  type TData = ExtractEdenData<Awaited<ReturnType<TFetch>>>;
  type TError = ExtractEdenError<Awaited<ReturnType<TFetch>>> & EdenError;
  const serializedKey = useMemo(() => serializeQueryKey(queryKey), [queryKey]);
  const queryResult = useQuery<EdenQueryResult<TData, TError>>({
    queryKey: serializedKey,
    queryFn: async () => {
      const res = await fetchFn();
      const body = res.data ?? res.error?.value ?? null;

      if (!body) {
        return {
          ok: false,
          error: {
            ok: false,
            status: 500,
            error: "Unknown",
            message: "Unknown server response",
          } as TError,
        };
      }

      if (body.ok === true) {
        return { ok: true, data: body.data as TData };
      }

      return { ok: false, error: body as TError };
    },
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });

  // 🔥 toast support
  useEffect(() => {
    const result = queryResult.data;

    if (options?.showToast && result && result.ok === false) {
      if (result.error.toast) {
        toast.error(result.error.toast);
      }
    }
  }, [queryResult.data, options?.showToast]);

  return {
    data: queryResult.data?.ok ? queryResult.data.data : undefined,
    error: !queryResult.data?.ok ? queryResult.data?.error.message : undefined,
    isPending: queryResult.isPending,
    queryResult,
  };
}
