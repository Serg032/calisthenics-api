import { Repository } from "../../../../domain/repository-interface";

export const authMiddleware = async (repository: Repository, token: string) => {
  return await repository.authMiddleware(token);
};
