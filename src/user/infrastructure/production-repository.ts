import { randomUUID } from "crypto";
import { CreateCommand, User } from "../domain";
import { Repository } from "../domain/repository-interface";
import * as AWS from "aws-sdk";

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
}
