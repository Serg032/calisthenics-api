import { randomUUID } from "crypto";
import { CreateCommand, User } from "../domain";
import { Repository } from "../domain/repository-interface";
import * as AWS from "aws-sdk";
import {
  GenerateTokenInput,
  SignInFailedResponse,
  SignInPayload,
  SignInSuccessfulResponse,
} from "../app/auth/domain";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export class ProductionRepository extends Repository {
  private tableName: string;
  private dynamoDb: AWS.DynamoDB.DocumentClient;

  constructor() {
    super();
    if (!process.env.DYNAMODB_USER_TABLE) {
      throw new Error("DYNAMODB_USER_TABLE environment variable is not set");
    }

    this.tableName = process.env.DYNAMODB_USER_TABLE;

    this.dynamoDb = new AWS.DynamoDB.DocumentClient();
  }
  async create(command: CreateCommand): Promise<User> {
    try {
      const marshalledUser: User = {
        id: randomUUID(),
        admin: command.admin || false,
        ...command,
      };

      await this.dynamoDb
        .put({
          TableName: this.tableName,
          Item: marshalledUser,
        })
        .promise();

      return marshalledUser;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  async findById(id: string): Promise<User | undefined> {
    try {
      const result = await this.dynamoDb
        .get({
          TableName: this.tableName,
          Key: { id },
        })
        .promise();

      return result.Item as User | undefined;
    } catch (error) {
      throw new Error(`Failed to find user by id: ${error}`);
    }
  }

  async generateToken(input: GenerateTokenInput): Promise<string> {
    const userByInputObject = await this.dynamoDb
      .scan({
        TableName: this.tableName,
        FilterExpression: "email = :email AND password = :password",
        ExpressionAttributeValues: {
          ":email": input.email,
          ":password": input.password,
        },
      })
      .promise();

    const user = userByInputObject.Items?.[0] as User | undefined;

    if (!user) {
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

    const userByInputObject = await this.dynamoDb
      .scan({
        TableName: this.tableName,
        FilterExpression: "email = :email AND password = :password",
        ExpressionAttributeValues: {
          ":email": verifiedToken.email,
          ":password": verifiedToken.password,
        },
      })
      .promise();

    const user = userByInputObject.Items?.[0] as User | undefined;

    if (!user) {
      return false;
    }

    return verifiedToken ? true : false;
  }

  async signIn(
    payload: SignInPayload
  ): Promise<SignInSuccessfulResponse | SignInFailedResponse> {
    const userByPayloadObject = await this.dynamoDb
      .scan({
        TableName: this.tableName,
        FilterExpression: "email = :email AND password = :password",
        ExpressionAttributeValues: {
          ":email": payload.email,
          ":password": payload.password,
        },
      })
      .promise();

    const user = userByPayloadObject.Items?.[0] as User | undefined;

    if (!user) {
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
    try {
      const result = await this.dynamoDb
        .scan({
          TableName: this.tableName,
        })
        .promise();

      return result.Items as User[];
    } catch (error) {
      throw new Error(`Failed to get all users: ${error}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.dynamoDb
        .query({
          TableName: this.tableName,
          IndexName: "EmailIndex", // Asegúrate de tener un índice secundario global para el email
          KeyConditionExpression: "email = :email",
          ExpressionAttributeValues: {
            ":email": email,
          },
        })
        .promise();

      return result.Items?.[0] as User | null;
    } catch (error) {
      throw new Error(`Failed to find user by username: ${error}`);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.dynamoDb
        .query({
          TableName: this.tableName,
          IndexName: "UsernameIndex", // Asegúrate de tener un índice secundario global para el email
          KeyConditionExpression: "username = :username",
          ExpressionAttributeValues: {
            ":username": username,
          },
        })
        .promise();

      return result.Items?.[0] as User | null;
    } catch (error) {
      throw new Error(`Failed to find user by username: ${error}`);
    }
  }
}
