import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { handler as VerifyTokenHandler } from "../verify-token/handler";
dotenv.config();

export const handler = (token: string): boolean => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  const verifiedToken = jwt.verify(token, jwtSecret);
  console.log(verifiedToken);

  return verifiedToken ? true : false;
};
