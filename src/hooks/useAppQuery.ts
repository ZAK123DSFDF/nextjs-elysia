import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react"; // or whatever you use

interface UseAppQueryOptions {
  enabled?: boolean;
  showToast?: boolean; // NEW
}

type ExtractTreatyData<T> = T extends { data?: { data?: infer U } }
  ? U
  : T extends { data?: infer U }
    ? U
    : unknown;

interface AppQueryResult<TData> {
  data: TData | undefined;
  error: string | undefined;
  isPending: boolean;
  queryResult: UseQueryResult<{ data?: TData; message?: string }>;
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
    toast?: string | null;
  }>({
    queryKey,
    queryFn: async () => {
      const res = await fetchFn();

      const body = (res.data as any) ?? (res.error.value as any) ?? null;
      if (!body) return { message: "Unknown server response" };

      // SUCCESS CASE
      if (body.ok === true) {
        return { data: body.data as TData };
      }

      // ERROR CASE
      return {
        message: body.message || body.error || "Unknown server error",
        toast: body.toast ?? null,
      };
    },
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });

  // 🔥 Automatically show toast if enabled
  useEffect(() => {
    if (
      options?.showToast &&
      !queryResult.isPending &&
      queryResult.data?.toast
    ) {
      toast.error(queryResult.data.toast);
    }
  }, [queryResult.data?.toast, queryResult.isPending, options?.showToast]);

  return {
    data: queryResult.data?.data,
    error: queryResult.data?.message,
    isPending: queryResult.isPending,
    queryResult,
  };
}
