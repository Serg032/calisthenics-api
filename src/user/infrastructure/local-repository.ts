import { randomUUID } from "crypto";
import { CreateCommand, User } from "../domain";
import { Repository } from "../domain/repository-interface";

export class LocalRepository implements Repository {
  public users: Set<User> = new Set();

  async create(command: CreateCommand): Promise<User> {
    const marshalledUser: User = {
      id: randomUUID(),
      ...command,
      admin: command.admin || false,
    };
    this.users.add(marshalledUser);

    return Array.from(this.users).find(
      (user) => user.id === marshalledUser.id
    )!;
  }

  async findById(id: string): Promise<User | undefined> {
    return Array.from(this.users).find((user) => user.id === id);
  }
}
