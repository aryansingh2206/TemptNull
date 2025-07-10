// server/middleware/auth.ts
import express from "express";
import jwt from "jsonwebtoken";

const SECRET = "your-secret-key";

export function authenticateToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    (req as any).user = decoded;
    next();
  });
}
