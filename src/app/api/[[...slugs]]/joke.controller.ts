import { JokeService } from "./joke.service";
import { Context } from "node:vm";

export class JokeController {
  private service = new JokeService();

  random = () => this.service.getRandomJoke();
  redirect = () => this.service.redirectToDemo();
  success = ({ cookie, body }: Context) => {
    return this.service.successDemo(cookie, body.rememberMe);
  };
  logout = ({ cookie }: Context) => this.service.logout(cookie);
  error = () => this.service.errorDemo();
}
