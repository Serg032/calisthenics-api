import { Repository } from "../../domain/repository-interface";

export const handler = (repository: Repository) => {
  return repository.getAll();
};
