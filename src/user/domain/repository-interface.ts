import { CreateCommand, User } from ".";
import { GenerateTokenInput } from "../app/auth/domain";

export abstract class Repository {
  abstract create(user: CreateCommand): Promise<User>;
  abstract findById(id: string): Promise<User | undefined>;
  abstract generateToken(input: GenerateTokenInput): Promise<string>;
}
