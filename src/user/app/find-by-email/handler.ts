import { Repository } from "../../domain/repository-interface";

export const handler = async (repository: Repository, email: string) => {
  return await repository.findByEmail(email);
};
