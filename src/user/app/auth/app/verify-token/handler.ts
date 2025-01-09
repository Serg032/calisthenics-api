import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const handler = (token: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.verify(token, jwtSecret);
};
