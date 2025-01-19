import { Repository } from "../../domain/repository-interface";

export const handler = (repository: Repository, email: string) => {
  return repository.findByEmail(email);
};
