import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import handler from "./../../user/app/find-by-id/handler";
import { ProductionRepository } from "../../user/infrastructure/production-repository";

const repository = new ProductionRepository();

export const handle = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    throw new Error("Missing body");
  }
  const body = JSON.parse(event.body);

  const userById = await handler(repository, body.id);

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
