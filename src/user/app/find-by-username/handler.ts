import { Repository } from "../../domain/repository-interface";

export const handler = async (repository: Repository, username: string) => {
  return await repository.findByUsername(username);
};
