import { Router } from "express";
import { validateQuery } from "../middleware/validate";
import { githubSearchQuerySchema, githubReadmeQuerySchema } from "../schemas/github";
import { searchGithubRepositories, fetchGithubReadme } from "../services/github";

export const githubRouter = Router();

githubRouter.get("/search", validateQuery(githubSearchQuerySchema), async (req, res) => {
  const { q } = req.query as any;

  try {
    const data = await searchGithubRepositories(q);
    res.json(data);
  } catch (error: any) {
    console.error("GitHub Search API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch repositories from GitHub." });
  }
});

githubRouter.get("/readme", validateQuery(githubReadmeQuerySchema), async (req, res) => {
  const { owner, repo } = req.query as any;

  try {
    const result = await fetchGithubReadme(owner, repo);
    res.json(result);
  } catch (error: any) {
    console.error("GitHub Readme API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch repository readme." });
  }
});
