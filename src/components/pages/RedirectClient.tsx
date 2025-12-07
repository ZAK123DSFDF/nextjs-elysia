"use client";

import { api } from "@/lib/eden";
import { useAppMutation } from "@/hooks/useAppMutation";

export default function RedirectClient() {
  const redirectMutation = useAppMutation(() => api.redirect.post());

  const successMutation = useAppMutation(() => api.success.post());

  const errorMutation = useAppMutation(() => api.error.post());

  return (
    <div className="space-y-4">
      <button
        onClick={() => redirectMutation.mutate(undefined)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Redirect Me
      </button>

      <button
        onClick={() => successMutation.mutate(undefined)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Trigger Success
      </button>

      <button
        onClick={() => errorMutation.mutate(undefined)}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Trigger Error
      </button>
    </div>
  );
}
