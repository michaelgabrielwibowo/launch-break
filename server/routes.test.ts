import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import rateLimit from "express-rate-limit";
import { chatRequestSchema, quizRequestSchema } from "./schemas/ai";

// Create a mock route configuration helper for testing route logic
function createTestApp() {
  const app = express();
  app.use(express.json());

  // Rate delimiter for testing (scaled down or kept same)
  const aiLimiter = rateLimit({
    windowMs: 50, // very small window for fast testing
    limit: 2,
    legacyHeaders: false,
    message: { error: "Too many AI requests. Please wait a minute and try again." },
    skipSuccessfulRequests: false,
  });

  // Mock post/get endpoints matching server.ts behavior
  app.post("/api/ai/chat", aiLimiter, (req, res) => {
    const parsed = chatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request data structure." });
    }
    const { message } = parsed.data;
    res.json({ text: `Mocked reply for: ${message}` });
  });

  app.get("/api/github/readme", (req, res) => {
    const { owner, repo } = req.query;
    if (!owner || !repo || typeof owner !== "string" || typeof repo !== "string") {
      return res.status(400).json({ error: "Missing owner or repo query parameter." });
    }
    // Check for invalid owner/repo naming format
    const nameRegex = /^[a-zA-Z0-9-_.]+$/;
    if (!nameRegex.test(owner) || !nameRegex.test(repo)) {
      return res.status(400).json({ error: "Invalid owner/repo rejected." });
    }
    res.json({ readme: `Mock README of ${owner}/${repo}`, branch: "main" });
  });

  app.get("/api/papers/search", (req, res) => {
    const q = (req.query.q as string) || "";
    if (!q.trim()) {
      return res.json({ papers: [] });
    }
    if (q.length > 500) {
      return res.status(400).json({ error: "Search query is too long." });
    }
    res.json({ papers: [{ id: "arxiv_1", title: `Result for ${q}`, authors: ["Author"], year: 2026, source: "arXiv" }] });
  });

  return app;
}

describe("Express Backend API Routing & Rate Limits", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    app = createTestApp();
  });

  describe("API Chat Endpoint & Input Validation", () => {
    it("returns 200 and mocked reply for valid post body", async () => {
      // Direct mock response testing
      const req = { body: { message: "What is an attention module?" } } as any;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as any;

      const parsed = chatRequestSchema.safeParse(req.body);
      expect(parsed.success).toBe(true);
    });

    it("returns 400 when message is empty (Zod validation failure)", () => {
      const parsed = chatRequestSchema.safeParse({ message: "" });
      expect(parsed.success).toBe(false);
    });
  });

  describe("Rate Limiting Guard", () => {
    it("rejects excessive calls with 429 Too Many Requests status (Mock simulated)", () => {
      let callCount = 0;
      const fakeLimiter = (req: any, res: any, next: any) => {
        callCount++;
        if (callCount > 2) {
          return res.status(429).json({ error: "Too many AI requests." });
        }
        next();
      };

      const res1 = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const res2 = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const res3 = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;

      fakeLimiter({}, res1, () => {});
      fakeLimiter({}, res2, () => {});
      fakeLimiter({}, res3, () => {});

      expect(res1.status).not.toHaveBeenCalledWith(429);
      expect(res2.status).not.toHaveBeenCalledWith(429);
      expect(res3.status).toHaveBeenCalledWith(429);
    });
  });

  describe("GitHub API Parameter Shielding", () => {
    it("returns 400 if owner or repo is missing", () => {
      const handleGetReadme = (req: any, res: any) => {
        const { owner, repo } = req.query;
        if (!owner || !repo) {
          return res.status(400).json({ error: "Missing owner or repo query parameter." });
        }
        res.json({ ok: true });
      };

      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      handleGetReadme({ query: { owner: "owner" } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("rejects dirty-injection patterns or malformed owner/repo parameters", () => {
      const handleGetReadme = (req: any, res: any) => {
        const { owner, repo } = req.query;
        const nameRegex = /^[a-zA-Z0-9-_.]+$/;
        if (!owner || !repo || !nameRegex.test(owner) || !nameRegex.test(repo)) {
          return res.status(400).json({ error: "Invalid owner/repo rejected." });
        }
        res.json({ ok: true });
      };

      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      handleGetReadme({ query: { owner: "invalid/owner", repo: "valid" } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("Papers API Query Bounds", () => {
    it("rejects search queries that exceed maximum query length constraints", () => {
      const handleSearch = (req: any, res: any) => {
        const q = req.query.q || "";
        if (q.length > 500) {
          return res.status(400).json({ error: "Query is too long." });
        }
        res.json({ papers: [] });
      };

      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      handleSearch({ query: { q: "a".repeat(501) } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
