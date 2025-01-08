import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import handler from "../../auth/app/verify-token/handler";

export const handle = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    throw new Error("Missing body");
  }
  const body = JSON.parse(event.body);
  const token = handler(body.token);

  return {
    statusCode: 200,
    body: JSON.stringify(token),
  };
};
