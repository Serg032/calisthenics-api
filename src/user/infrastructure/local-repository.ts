import { randomUUID } from "crypto";
import { CreateCommand, User } from "../domain";
import { Repository } from "../domain/repository-interface";
import {
  GenerateTokenInput,
  SignInFailedResponse,
  SignInPayload,
  SignInSuccessfulResponse,
} from "../app/auth/domain";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export class LocalRepository implements Repository {
  public users: Set<User> = new Set();

  async create(command: CreateCommand): Promise<User> {
    const marshalledUser: User = {
      id: randomUUID(),
      ...command,
      admin: command.admin || false,
    };
    this.users.add(marshalledUser);

    return Array.from(this.users).find(
      (user) => user.id === marshalledUser.id
    )!;
  }

  async findById(id: string): Promise<User | undefined> {
    return Array.from(this.users).find((user) => user.id === id);
  }

  async generateToken(input: GenerateTokenInput): Promise<string> {
    const userByInput = Array.from(this.users).find(
      (user) => user.email === input.email && user.password === input.password
    );

    if (!userByInput) {
      throw new Error(`User not found by ${input.email} and ${input.password}`);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    return jwt.sign(input, jwtSecret, { expiresIn: "1h" });
  }

  async authMiddleware(token: string): Promise<boolean> {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    const verifiedToken = jwt.verify(token, jwtSecret) as GenerateTokenInput;

    const userByTokenPayload = Array.from(this.users).find(
      (user) =>
        user.email === verifiedToken.email &&
        user.password === verifiedToken.password
    );

    if (!userByTokenPayload) {
      return false;
    }

    return verifiedToken ? true : false;
  }

  async signIn(
    payload: SignInPayload
  ): Promise<SignInSuccessfulResponse | SignInFailedResponse> {
    const userByPayload = Array.from(this.users).find(
      (user) =>
        user.email === payload.email && user.password === payload.password
    );

    if (!userByPayload) {
      return {
        error: `User not found by ${payload.email} and ${payload.password}`,
      };
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    return {
      token: jwt.sign(payload, jwtSecret, { expiresIn: "1h" }),
    };
  }

  async getAll(): Promise<User[]> {
    return Array.from(this.users);
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = Array.from(this.users);
    const userByEmail = users.find((user) => user.email === email);
    return userByEmail ? userByEmail : null;
  }
}
