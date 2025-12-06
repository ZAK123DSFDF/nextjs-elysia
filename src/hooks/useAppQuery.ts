import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

interface UseAppQueryOptions {
  enabled?: boolean;
  showToast?: boolean;
}

// Extract the successful Treaty data shape
type ExtractTreatyData<T> = T extends { data?: { data?: infer U } }
  ? U
  : T extends { data?: infer U }
    ? U
    : unknown;

// Your final normalized result for React Query
interface AppQueryResult<TData> {
  data: TData | undefined;
  error: string | undefined;
  isPending: boolean;
  queryResult: UseQueryResult<{
    data?: TData;
    message?: string;
    toast?: string;
  }>;
}

export function useAppQuery<TFetch extends () => Promise<any>>(
  queryKey: (string | number | undefined)[],
  fetchFn: TFetch,
  options?: UseAppQueryOptions,
): AppQueryResult<ExtractTreatyData<Awaited<ReturnType<TFetch>>>> {
  type TData = ExtractTreatyData<Awaited<ReturnType<TFetch>>>;

  const queryResult = useQuery<{
    data?: TData;
    message?: string;
    toast?: string;
  }>({
    queryKey,
    queryFn: async () => {
      const res = await fetchFn();

      // Treaty Response
      if (res && typeof res === "object" && "data" in res && "status" in res) {
        const ok = (res.data as any)?.ok === true;

        if (ok) {
          return {
            data: (res.data as any)?.data as TData,
          };
        }

        return {
          message:
            (res.data as any)?.message ||
            (res.data as any)?.error ||
            "Unknown server error",
        };
      }

      // Standard Elysia action response
      if (res.ok) {
        return { data: res.data as TData };
      }

      return { message: res.message };
    },
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // ⛔ Show toast **inside the hook**
  useEffect(() => {
    if (!queryResult.isPending && options?.showToast !== false) {
      const t = queryResult.data?.toast;

      if (t) toast.error(t);
    }
  }, [queryResult.isPending, queryResult.data?.toast]);
  return {
    data: queryResult.data?.data,
    error: queryResult.data?.message,
    isPending: queryResult.isPending,
    queryResult,
  };
}
