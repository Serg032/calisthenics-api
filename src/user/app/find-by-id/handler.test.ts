import { CreateCommand, User } from "../../domain";
import { LocalRepository } from "../../infrastructure/local-repository";
import { handler as createHandler } from "./../create/handler";
import handler from "./handler";

describe("When asking for a user by id", () => {
  const repository = new LocalRepository();
  let createdUser: User;
  const createUserCommand: CreateCommand = {
    email: "email",
    name: "name",
    password: "password",
    surname: "surname",
    username: "username",
  };

  beforeAll(async () => {
    createdUser = await createHandler(repository, createUserCommand);
  });

  it("should return the user", async () => {
    const createdUserById = await handler(repository, createdUser.id);
    expect(createdUserById).toEqual(createdUser);
  });

  it("should return undefined if the user does not exist", async () => {
    const repository = new LocalRepository();
    const user = await handler(repository, "non-existing-id");
    expect(user).toBeUndefined();
  });
});
