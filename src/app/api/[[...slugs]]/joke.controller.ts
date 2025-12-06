import { JokeService } from "./joke.service";

export class JokeController {
  private service = new JokeService();

  random = () => {
    return this.service.getRandomJoke();
  };
}
