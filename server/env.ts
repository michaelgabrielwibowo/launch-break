import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(3000),

  GEMINI_API_KEY: z.string().optional(),

  APP_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);

export const hasGeminiKey =
  Boolean(env.GEMINI_API_KEY) &&
  env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
