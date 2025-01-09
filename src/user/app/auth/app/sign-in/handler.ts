import { Repository } from "../../../../domain/repository-interface";
import {
  SignInFailedResponse,
  SignInPayload,
  SignInSuccessfulResponse,
} from "../../domain";

export const handler = async (
  repository: Repository,
  payload: SignInPayload
) => {
  return await repository.signIn(payload);
};
