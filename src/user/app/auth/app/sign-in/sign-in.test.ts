import { CreateCommand } from "../../../../domain";
import { LocalRepository } from "../../../../infrastructure/local-repository";
import { handler as createUserHandler } from "../../../create/handler";
import { handler } from "./handler";

describe("When the user submits the sign-in form", () => {
  const repository = new LocalRepository();
  const email = "johndoe@gmail.com";
  const password = "123456";
  const createUserCommand: CreateCommand = {
    email,
    password,
    name: "name",
    surname: "surname",
    username: "username",
  };

  beforeAll(async () => {
    await createUserHandler(repository, createUserCommand);
  });

  it("should return a token", async () => {
    const response = await handler(repository, {
      email,
      password,
    });

    if ("token" in response) {
      expect(response.token).toBeDefined();
    } else {
      fail("The response should contain a token");
    }
  });
  it("should return an error message if the user does not exist", async () => {
    const errorResponse = await handler(repository, {
      email: "error@mail.com",
      password: "123456890",
    });

    if ("error" in errorResponse) {
      expect(errorResponse.error).toBeDefined();
    } else {
      fail("The response should contain a token");
    }
  });
});
