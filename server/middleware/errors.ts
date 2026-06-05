import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "An unexpected backend error occurred. Please try again later.",
  });
}
