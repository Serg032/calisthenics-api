import { CreateCommand, User } from "../../domain";
import { Repository } from "../../domain/repository-interface";

export const handler = async (
  repository: Repository,
  command: CreateCommand
): Promise<User> => {
  return await repository.create(command);
};
