import { handleAction } from "@/lib/elysia/hndleAction";
import { Context } from "elysia";
import { SuccessBody } from "@/lib/validation/joke";
import { throwAppError } from "@/lib/elysia/throwAppError";

export class JokeService {
  async redirectToDemo() {
    return handleAction("RedirectToDemo", async () => {
      return {
        ok: true,
        status: 200,
        redirectUrl: "/redirected",
      };
    });
  }
  async successDemo(cookie: Context["cookie"], body: SuccessBody) {
    return handleAction("SuccessDemo", async () => {
      const duration = body.rememberMe ? 7 * 86400 : undefined;
      if (!cookie) {
        throw throwAppError(body, {
          status: 400,
          fields: { rememberMe: "Cookie setup failed" },
        });
      }
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
        throw throwAppError({
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
        throw throwAppError({
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
