import { CreateCommand } from "../../../../domain";
import { LocalRepository } from "../../../../infrastructure/local-repository";
import { SignInSuccessfulResponse, SignInFailedResponse } from "../../domain";
import { handler as createHandler } from "./../../../create/handler";
import { handler as signInHandler } from "./../sign-in/handler";
import { authMiddleware } from "./handler";

describe("When using the middleware", () => {
  const repository = new LocalRepository();
  const createUserCommand: CreateCommand = {
    email: "email",
    name: "name",
    password: "password",
    surname: "surname",
    username: "username",
    admin: true,
  };
  let token: SignInSuccessfulResponse | SignInFailedResponse;

  beforeAll(async () => {
    await createHandler(repository, createUserCommand);
    token = await signInHandler(repository, {
      email: createUserCommand.email,
      password: createUserCommand.password,
    });
  });

  it("it should return true if everything is ok", async () => {
    if ("token" in token) {
      const middlewareResult = await authMiddleware(repository, token.token);
      expect(middlewareResult).toBeTruthy();
    }
  });
});
