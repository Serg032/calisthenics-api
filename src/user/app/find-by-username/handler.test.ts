import { CreateCommand } from "../../domain";
import { LocalRepository } from "../../infrastructure/local-repository";
import { handler as createHandler } from "../create/handler";
import { handler } from "./handler";

describe("When asking for a user by an username", () => {
  const repository = new LocalRepository();
  const username = "johnDoe";
  const createUserCommand: CreateCommand = {
    name: "John",
    surname: "Doe",
    username,
    email: "johndoe@gmail.com",
    password: "test",
  };

  beforeEach(async () => {
    await createHandler(repository, createUserCommand);
  });

  it("should return the user", async () => {
    const userByEmail = await handler(repository, username);
    expect(userByEmail).toBeDefined();
    expect(userByEmail?.username).toBe(username);
  });

  it("should return null if the user doesn't exist", async () => {
    const userByEmail = await handler(repository, "none");
    expect(userByEmail).toBeNull();
  });
});
