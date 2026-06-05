import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  history: z.array(z.any()).optional(),
  context: z
    .object({
      activeTab: z.string().max(50).optional(),
      topic: z.string().max(100).optional(),
      category: z.string().max(100).optional(),
    })
    .optional(),
});

export const quizRequestSchema = z.object({
  topic: z.string().trim().min(1).max(100).optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
});
