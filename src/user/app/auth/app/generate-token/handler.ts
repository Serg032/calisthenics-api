import { Repository } from "../../../../domain/repository-interface";
import { GenerateTokenInput } from "../../domain";

export const handler = async (
  repository: Repository,
  input: GenerateTokenInput
): Promise<string> => {
  return await repository.generateToken(input);
};
