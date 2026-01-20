import { throwHttpError } from "@/lib/elysia/throwHttpError";
import { handleAction } from "@/lib/elysia/hndleAction";
import { Context } from "elysia";

export class JokeService {
  async redirectToDemo() {
    return handleAction("RedirectToDemo", async () => {
      return {
        ok: true,
        status: 200,
        data: {
          redirectUrl: "/redirected",
        },
      };
    });
  }
  async successDemo(cookie: Context["cookie"], rememberMe: boolean) {
    return handleAction("SuccessDemo", async () => {
      const duration = rememberMe ? 7 * 86400 : undefined;

      cookie.nextjs_check.set({
        value: "token_for_nextjs",
        maxAge: duration,
      });

      cookie.other_cookie.set({
        value: "token_for_other",
        maxAge: duration,
      });

      return {
        ok: true,
        status: 200,
        data: { message: "Cookies handled directly by service" },
      };
    });
  }

  async errorDemo() {
    return handleAction("ErrorDemo", async () => {
      const shouldError = true;
      if (shouldError) {
        throw throwHttpError({
          status: 400,
          error: "DemoError",
          toast: "This is an intentional error!",
          message: "Something went wrong in the demo error endpoint.",
        });
      }
      return {
        ok: true,
        status: 200,
        data: {
          message: "This action completed successfully!",
        },
      };
    });
  }

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
          message: "Failed to fetch joke from external API",
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
  async logout(cookie: Context["cookie"]) {
    return handleAction("Logout", async () => {
      // Service chooses which one to remove
      cookie.nextjs_check.remove();

      return {
        ok: true,
        data: { message: "Removed nextjs_check directly in service" },
      };
    });
  }
}
