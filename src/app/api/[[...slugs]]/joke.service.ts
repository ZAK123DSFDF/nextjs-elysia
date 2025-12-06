import { throwHttpError } from "@/lib/elysia/httpError";
import { handleAction } from "@/lib/elysia/hndleAction";

export class JokeService {
  async getRandomJoke() {
    return handleAction("GetRandomJoke", async () => {
      const res = await fetch(
        "https://official-joke-api.appspot.com/random_joke",
      );

      if (!res.ok) {
        throwHttpError({
          status: 503,
          error: "Joke API unreachable",
          toast: "Unable to load jokes right now 😢",
        });
      }

      const data = await res.json();

      return {
        ok: true,
        status: 200,
        data: {
          setup: data.setup,
          punchline: data.punchline,
        },
      };
    });
  }
}
