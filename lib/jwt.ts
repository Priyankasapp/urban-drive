import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET ?? "dev-jwt-secret";

export const generateToken = (payload: {
  id: string;
  email: string;
  role: string;
}) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecret);
};
