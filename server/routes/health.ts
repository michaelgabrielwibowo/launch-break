import { Router } from "express";
import { key } from "../services/gemini";
import { env } from "../env";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  res.json({
    status: "ok",
    environment: env.NODE_ENV,
    has_api_key: !!key && key !== "MY_GEMINI_API_KEY",
  });
});
