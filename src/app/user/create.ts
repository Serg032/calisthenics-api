import { handler } from "../../user/app/create/handler";
import { CreateCommand } from "../../user/domain";
import { ProductionRepository } from "../../user/infrastructure/production-repository";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const repository = new ProductionRepository();

export const handle = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
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
  const createdUser = await handler(repository, body);

  return {
    statusCode: 201,
    body: JSON.stringify(createdUser),
  };
};
