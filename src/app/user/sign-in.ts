import { ProductionRepository } from "../../user/infrastructure/production-repository";
import { handler as signInHandler } from "../../user/app/auth/app/sign-in/handler";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SignInPayload } from "../../user/app/auth/domain";

const repository = new ProductionRepository();

export const handle = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const body = event.body;
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing body" }),
    };
  }
  const parsedBody = JSON.parse(body) as SignInPayload;

  const handlerResponse = await signInHandler(repository, {
    email: parsedBody.email,
    password: parsedBody.password,
  });

  if ("error" in handlerResponse) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: handlerResponse.error }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      token: handlerResponse.token,
    }),
  };
};
