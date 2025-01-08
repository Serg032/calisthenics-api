import { User } from "../../domain";
import { Repository } from "../../domain/repository-interface";

const handler = async (
  repository: Repository,
  id: string
): Promise<User | undefined> => {
  return await repository.findById(id);
};

export default handler;
