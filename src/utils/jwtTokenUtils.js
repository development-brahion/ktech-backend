import jwt from "jsonwebtoken";
import { getAccessTokenExpiry, getRefreshTokenExpiry } from "./globalFunction.js";

const { JWT_SECRET_KEY, REFRESH_JWT_SECRET_KEY } = process.env;

export const signToken = (payload, expiresIn) => {
  const finalExpiry = expiresIn ?? getAccessTokenExpiry();

  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: finalExpiry,
  });
};

export const generateRefreshToken = (payload, expiresIn) => {
  const finalExpiry = expiresIn ?? getRefreshTokenExpiry();

  return jwt.sign(payload, REFRESH_JWT_SECRET_KEY, {
    expiresIn: finalExpiry,
  });
};
