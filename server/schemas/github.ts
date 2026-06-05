import { z } from "zod";

export const githubSearchQuerySchema = z.object({
  q: z.string().trim().min(1).max(500),
});

export const githubReadmeQuerySchema = z.object({
  owner: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9-_.]+$/),
  repo: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9-_.]+$/),
});
