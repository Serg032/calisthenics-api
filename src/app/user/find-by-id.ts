import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import handler from "./../../user/app/find-by-id/handler";
import { ProductionRepository } from "../../user/infrastructure/production-repository";

const repository = new ProductionRepository();

export const handle = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = event.pathParameters?.id;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing id" }),
    };
  }

  console.log("event", event);

  const userById = await handler(repository, userId);

  if (!userById) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "User not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(userById),
  };
};
