import * as jwt from "jsonwebtoken";
import { SignInput } from "../../domain";
import * as dotenv from "dotenv";
dotenv.config();

const handler = (input: SignInput) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.sign(input, jwtSecret, { expiresIn: "1h" });
};

export default handler;
