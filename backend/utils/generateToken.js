import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVar.js";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET || process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  
  const isDev = (ENV_VARS.NODE_ENV || process.env.NODE_ENV) === "development";

  res.cookie("netflix-jwt", token, {
    httpOnly: true, // Prevents XSS attacks from reading the cookie
    sameSite: isDev ? "lax" : "none", // CSRF mitigation
    secure: !isDev, // HTTPS required in production
    maxAge: 15 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  return token;
};
