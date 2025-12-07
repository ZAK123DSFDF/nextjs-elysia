import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { EdenError, ExtractEdenData, ExtractEdenError } from "@/lib/eden/types";

interface UseAppMutationOptions<
  TData,
  TVariables,
  TError extends EdenError,
> extends Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn"> {
  disableSuccessToast?: boolean;
  disableErrorToast?: boolean;
}

export function useAppMutation<TFetch extends (vars: any) => Promise<any>>(
  mutationFn: TFetch,
  options?: UseAppMutationOptions<
    ExtractEdenData<Awaited<ReturnType<TFetch>>>,
    Parameters<TFetch>[0],
    ExtractEdenError<Awaited<ReturnType<TFetch>>> & EdenError
  >,
) {
  type TResponse = Awaited<ReturnType<TFetch>>;
  type TData = ExtractEdenData<TResponse>;
  type TError = ExtractEdenError<TResponse> & EdenError;

  return useMutation<TData, TError, Parameters<TFetch>[0]>({
    mutationFn: async (variables) => {
      const res = await mutationFn(variables);

      const body = res.data ?? res.error?.value ?? null;

      if (!body) {
        throw {
          ok: false,
          status: 500,
          error: "Unknown",
          toast: "something went wrong",
          message: "Unknown server response",
        } as TError;
      }

      if (body.ok !== true) {
        throw body as TError; // goes to onError
      }

      return body.data as TData;
    },

    onSuccess: (data, variables, context, mutation) => {
      if (data && (data as any).redirectUrl) {
        window.location.href = (data as any).redirectUrl;
        return;
      }
      if (!options?.disableSuccessToast) {
        const message =
          (data as any)?.message || "Action completed successfully.";
        toast.success(message);
      }

      options?.onSuccess?.(data, variables, context, mutation);
    },

    onError: (error, variables, context, mutation) => {
      const err = error as TError;

      if (!options?.disableErrorToast) {
        toast.error(err.toast || err.message || "Something went wrong.");
      }

      options?.onError?.(err, variables, context, mutation);
    },

    ...options,
  });
}
