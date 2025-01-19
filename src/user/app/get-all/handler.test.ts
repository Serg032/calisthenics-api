import { CreateCommand } from "../../domain";
import { Repository } from "../../domain/repository-interface";
import { LocalRepository } from "../../infrastructure/local-repository";
import { handler as createHandler } from "../create/handler";
import { handler } from "./handler";

describe("When getting all users", () => {
  let repository: Repository;
  const createFirstUserCommand: CreateCommand = {
    name: "John",
    surname: "Doe",
    username: "johnDoe",
    email: "johndoe@gmail.com",
    password: "password",
  };
  const createSecondUserCommand: CreateCommand = {
    name: "Jane",
    surname: "Doe",
    username: "janeDoe",
    email: "janedoe@gmail.com",
    password: "password",
  };

  beforeEach(async () => {
    repository = new LocalRepository();
  });

  it("should return all users", async () => {
    createHandler(repository, createFirstUserCommand);
    createHandler(repository, createSecondUserCommand);
    const users = await handler(repository);

    expect(users).toHaveLength(2);
  });

  describe("When there are no users", () => {
    it("should return an empty array", async () => {
      const users = await handler(repository);

      expect(users).toHaveLength(0);
    });
  });
});
