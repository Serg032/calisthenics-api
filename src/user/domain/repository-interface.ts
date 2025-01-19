import { CreateCommand, User } from ".";
import {
  GenerateTokenInput,
  SignInFailedResponse,
  SignInPayload,
  SignInSuccessfulResponse,
} from "../app/auth/domain";

export abstract class Repository {
  abstract create(user: CreateCommand): Promise<User>;
  abstract findById(id: string): Promise<User | undefined>;
  abstract generateToken(input: GenerateTokenInput): Promise<string>;
  abstract authMiddleware(token: string): Promise<boolean>;
  abstract signIn(
    payload: SignInPayload
  ): Promise<SignInSuccessfulResponse | SignInFailedResponse>;
  abstract getAll(): Promise<User[]>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
}
