import { CreateCommand } from "../../../../domain";
import { Repository } from "../../../../domain/repository-interface";
import { LocalRepository } from "../../../../infrastructure/local-repository";
import { handler as createHandler } from "./../../../create/handler";
import { handler as generateTokenHandler } from "./../generate-token/handler";

const handler = async (repository: Repository, token: string) => {
  return await repository.authMiddleware(token);
};
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
  let token: string;

  beforeAll(async () => {
    await createHandler(repository, createUserCommand);
    token = await generateTokenHandler(repository, {
      email: createUserCommand.email,
      password: createUserCommand.password,
    });
  });

  it("it should return true if everything is ok", async () => {
    const middlewareResult = await handler(repository, token);
    expect(middlewareResult).toBeTruthy();
  });
});
