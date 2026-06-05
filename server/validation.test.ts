import { describe, it, expect } from "vitest";
import { chatRequestSchema, quizRequestSchema } from "./schemas/ai";

describe("Server-Side Input Schema Validation", () => {
  describe("chatRequestSchema", () => {
    it("should accept a valid message and optional context", () => {
      const validPayload = {
        message: "Tell me about Transformers.",
        context: {
          activeTab: "topics",
          topic: "Artificial Intelligence",
          category: "Deep Learning"
        }
      };
      const result = chatRequestSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject an empty message or whitespace-only message", () => {
      const invalidPayload = {
        message: "   ",
        context: { activeTab: "home" }
      };
      const result = chatRequestSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("should reject messages exceeding length limit of 2000 characters", () => {
      const hugeMessage = "A".repeat(2001);
      const result = chatRequestSchema.safeParse({ message: hugeMessage });
      expect(result.success).toBe(false);
    });

    it("should reject invalid activeTab, topic, or category length to prevent injection", () => {
      const result = chatRequestSchema.safeParse({
        message: "Valid query",
        context: {
          activeTab: "B".repeat(51) // limit is 50
        }
      });
      expect(result.success).toBe(false);
    });
  });

  describe("quizRequestSchema", () => {
    it("should accept valid quiz parameters", () => {
      const result = quizRequestSchema.safeParse({
        topic: "Linear Algebra",
        difficulty: "Advanced"
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid enum values for difficulty", () => {
      const result = quizRequestSchema.safeParse({
        topic: "Linear Algebra",
        difficulty: "SuperHard" // should be Beginner, Intermediate, or Advanced
      });
      expect(result.success).toBe(false);
    });

    it("should reject blank or extremely long topic payload", () => {
      const result = quizRequestSchema.safeParse({
        topic: "C".repeat(101) // limit is 100
      });
      expect(result.success).toBe(false);
    });
  });
});
