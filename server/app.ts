import express from "express";
import { healthRouter } from "./routes/health";
import { aiRouter } from "./routes/ai";
import { githubRouter } from "./routes/github";
import { papersRouter } from "./routes/papers";
import { errorHandler } from "./middleware/errors";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "16kb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/github", githubRouter);
  app.use("/api/papers", papersRouter);

  // General error handling middleware
  app.use(errorHandler);

  return app;
}
