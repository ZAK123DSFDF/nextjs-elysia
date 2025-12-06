"use client";

import { useAppQuery } from "@/hooks/useAppQuery";
import { api } from "@/lib/eden";

export function RandomJoke() {
  const { data, isPending, error } = useAppQuery(
    ["random-joke"],
    () => api.joke.random.get(),
    { showToast: true },
  );
  const joke = data;

  return (
    <div className="p-4 border rounded-md bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">Random Joke</h2>

      {/* Loading state */}
      {isPending && (
        <p className="text-sm text-blue-500 animate-pulse">Loading joke...</p>
      )}

      {/* Error state */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Joke content (only when data exists) */}
      {joke && !isPending && !error && (
        <>
          <p className="font-medium">{joke.setup}</p>
          <p className="text-zinc-600 mt-1">{joke.punchline}</p>
        </>
      )}
    </div>
  );
}
