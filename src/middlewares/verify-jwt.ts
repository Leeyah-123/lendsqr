import type { RequestHandler } from "express";
import { verify } from "jsonwebtoken";

export const verifyJWT: RequestHandler = (req, res, next) => {
  const authHeader =
    req.headers.authorization ||
    (req.headers.Authorization as string | undefined);

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ success: false, message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
    if (err)
      return res.status(403).json({ success: false, message: "Forbidden" });
    next();
  });
};
