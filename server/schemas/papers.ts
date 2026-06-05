import { z } from "zod";

export const papersSearchQuerySchema = z.object({
  q: z.string().trim().min(1).max(500),
});

export const papersAnalyzeSchema = z.object({
  title: z.string().trim().min(1).max(300),
  abstract: z.string().trim().optional(),
  authors: z.array(z.string()).optional(),
  year: z.number().int().optional(),
  source: z.string().trim().max(100).optional(),
});
