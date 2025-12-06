// hooks/useAppMutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * The universal response structure returned by your server actions.
 */
export interface AppResponse {
  ok: boolean;
  status?: number;
  message?: string; // success message from backend
  toast?: string; // error or success description from backend
  redirectUrl?: string;
  data?: any;
}

/**
 * 🔁 Global reusable mutation hook (App-wide)
 * - Handles success/error toasts
 * - Handles redirects
 * - Handles application-level error fallback
 * - Keeps code DRY and consistent
 */
export function useAppMutation<TData extends AppResponse, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, unknown, TVariables>,
    "mutationFn" | "onSuccess" | "onError"
  > & {
    disableSuccessToast?: boolean;
    disableErrorToast?: boolean;
    affiliate?: boolean;
    redirectUrl?: string;
    onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
  },
) {
  const router = useRouter();

  return useMutation<TData, unknown, TVariables>({
    mutationFn,
    ...options,

    onSuccess: (res, variables, context) => {
      if (res.ok) {
        // ✅ Success Toast
        if (!options?.disableSuccessToast) {
          toast.success(res.toast || "Action completed successfully.");
        }

        // 🔁 Handle redirect
        if (res.redirectUrl) {
          router.push(res.redirectUrl);
        } else if (options?.redirectUrl) {
          router.push(options.redirectUrl);
        }
      } else {
        // ❌ Error Toast (Backend error)
        if (!options?.disableErrorToast) {
          toast.error(res.toast || "Something went wrong.");
        }
      }

      // 🔧 Allow custom onSuccess callback
      options?.onSuccess?.(res, variables, context);
    },

    onError: () => {
      toast.error("Unexpected error. Please try again.");
    },
  });
}
