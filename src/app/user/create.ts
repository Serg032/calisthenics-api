import { handler } from "../../user/app/create/handler";
import { handler as findUserByEmail } from "../../user/app/find-by-email/handler";
import { handler as findUserByUsername } from "../../user/app/find-by-username/handler";
import { CreateCommand } from "../../user/domain";
import { ProductionRepository } from "../../user/infrastructure/production-repository";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const repository = new ProductionRepository();

export const handle = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Create User!");
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing body" }),
      };
    }

    const body = JSON.parse(event.body) as CreateCommand;

    if (
      !body.email ||
      !body.password ||
      !body.name ||
      !body.surname ||
      !body.username
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    const userByEmail = await findUserByEmail(repository, body.email);

    if (userByEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `User with email ${body.email} already exists`,
        }),
      };
    }

    const userByUserName = await findUserByUsername(repository, body.username);

    if (userByUserName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `User with username ${body.username} already exists`,
        }),
      };
    }

    const createdUser = await handler(repository, body);

    return {
      statusCode: 201,
      body: JSON.stringify(createdUser),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Some ${error}`,
      }),
    };
  }
};
