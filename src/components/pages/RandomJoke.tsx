"use client";

import { useAppQuery } from "@/hooks/useAppQuery";
import { api } from "@/lib/eden";

export function RandomJoke() {
  const { data, isPending, error } = useAppQuery(
    ["random-joke"],
    () => api.joke.random.get(), // no args needed
  );

  if (isPending) return <p>Loading joke...</p>;
  if (error) return <p>{error}</p>;

  const joke = data;
  console.log("Joke data:", joke);

  return (
    <div className="p-4 border rounded-md bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">Random Joke</h2>
      <p className="font-medium">{joke?.setup}</p>
      <p className="text-zinc-600 mt-1">{joke?.punchline}</p>
    </div>
  );
}
