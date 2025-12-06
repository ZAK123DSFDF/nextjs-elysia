import { Suspense } from "react";
import { api } from "@/lib/eden";
import ServerFetch from "@/components/ui-custom/ServerFetch";
import { ServerFetchSkeleton } from "@/components/ui-custom/ServerFetchSkeleton";

export default function JokePage() {
  return (
    <Suspense fallback={<ServerFetchSkeleton title="Random Joke" lines={2} />}>
      <ServerFetch
        fetcher={() => api.joke.random.get()}
        render={(joke) => (
          <div>
            {joke?.setup} — {joke?.punchline}
          </div>
        )}
      />
    </Suspense>
  );
}
