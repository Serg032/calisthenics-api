import { CreateCommand, User } from ".";

export abstract class Repository {
  abstract create(user: CreateCommand): Promise<User>;
  abstract findById(id: string): Promise<User | undefined>;
}
