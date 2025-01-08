import { CreateCommand } from "../../domain";
import { LocalRepository } from "../../infrastructure/local-repository";
import { handler } from "./handler";

describe("When creating a user", () => {
  const repository = new LocalRepository();
  const command: CreateCommand = {
    name: "name",
    surname: "surname",
    username: "username",
    email: "email",
    password: "password",
  };
  beforeAll(async () => {
    await handler(repository, command);
  });
  it("should be created and returned", () => {
    const user = Array.from(repository.users).find(
      (user) => user.name === command.name
    );
    expect(user?.id).toBeDefined();
  });
});
