import { CreateCommand } from "../../../../domain";
import { LocalRepository } from "../../../../infrastructure/local-repository";
import { handler as createUserHandler } from "./../../../create/handler";
import * as jwt from "jsonwebtoken";
import handler from "./handler";

describe("When generating a token", () => {
  const repository = new LocalRepository();
  const email = "email@gmail.com";
  const password = "password12345";
  const createUserCommand: CreateCommand = {
    email,
    name: "name",
    password,
    surname: "surname",
    username: "username",
    admin: false,
  };

  beforeAll(async () => {
    await createUserHandler(repository, createUserCommand);
  });

  it("should return a token", async () => {
    const token = await handler(repository, {
      email,
      password,
    });
    const decodedToken = jwt.decode(token);
    expect(token).toBeDefined();
    expect(decodedToken).toBeDefined();
    expect(decodedToken).toHaveProperty("email", email);
    expect(decodedToken).toHaveProperty("password", password);
  });
});
