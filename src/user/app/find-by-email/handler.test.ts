import { CreateCommand } from "../../domain";
import { LocalRepository } from "../../infrastructure/local-repository";
import { handler as createHandler } from "../create/handler";
import { handler } from "./handler";

describe("When asking for a user by an attributte", () => {
  const repository = new LocalRepository();
  const email = "johndoe@gmail.com";
  const createUserCommand: CreateCommand = {
    name: "John",
    surname: "Doe",
    username: "johnDoe",
    email,
    password: "test",
  };

  beforeEach(async () => {
    await createHandler(repository, createUserCommand);
  });

  it("should return the user", async () => {
    const userByEmail = await handler(repository, email);
    expect(userByEmail).toBeDefined();
    expect(userByEmail?.email).toBe(email);
  });

  it("should return null if the user doesn't exist", async () => {
    const userByEmail = await handler(repository, "none@gmail.com");
    expect(userByEmail).toBeNull();
  });
});
