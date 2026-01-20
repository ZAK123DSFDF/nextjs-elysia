import { JokeService } from "./joke.service";
import { Context } from "elysia";
import { SuccessBody } from "@/lib/validation/joke";

export class JokeController {
  private service = new JokeService();

  random = () => this.service.getRandomJoke();
  redirect = () => this.service.redirectToDemo();
  success = ({ cookie, body }: Context<{ body: SuccessBody }>) => {
    return this.service.successDemo(cookie, body.rememberMe);
  };
  logout = ({ cookie }: Context) => this.service.logout(cookie);
  error = () => this.service.errorDemo();
}
