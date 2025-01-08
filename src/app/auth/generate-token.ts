import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import handler from "./../../../src/auth/app/generate-token/handler";
export const handle = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    throw new Error("Missing body");
  }

  const body = JSON.parse(event.body);

  handler(body);

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Token generated" }),
  };
};
