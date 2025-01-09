import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import handler from "./../../user/app/find-by-id/handler";
import { ProductionRepository } from "../../user/infrastructure/production-repository";
import { authMiddleware } from "../../user/app/auth/app/middleware/handler";

const repository = new ProductionRepository();

export const handle = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authorizationHeader =
    event.headers.Authorization || event.headers.authorization;

  if (!authorizationHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Missing Authorization header" }),
    };
  }

  const authResult = await authMiddleware(repository, authorizationHeader);

  if (!authResult) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }
  const userId = event.pathParameters?.id;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing id" }),
    };
  }

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
