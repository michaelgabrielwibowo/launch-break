import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import GitHubSearchTool from "./GitHubSearchTool";

const mockRepository = {
  id: 42,
  name: "generative-ai-js",
  full_name: "google/generative-ai-js",
  owner: {
    login: "google",
    avatar_url: "https://example.com/avatar.png",
    html_url: "https://github.com/google",
  },
  html_url: "https://github.com/google/generative-ai-js",
  description: "Official SDK for Gemini",
  stargazers_count: 5000,
  forks_count: 350,
  language: "TypeScript",
  open_issues_count: 12,
  created_at: "2023-11-01T00:00:00Z",
};

describe("GitHubSearchTool Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [mockRepository] }),
    });
  });

  it("renders the GitHub search interface correctly and resolves initial list", async () => {
    render(<GitHubSearchTool />);

    expect(screen.getByPlaceholderText(/Search repositories \(e\.g\., scikit-learn/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search GitHub" })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("google/generative-ai-js")).toBeInTheDocument();
    });
  });

  it("initiates search when user types and submits a query", async () => {
    render(<GitHubSearchTool />);

    // Wait for initial load so that the search button becomes enabled (loading is false)
    await waitFor(() => {
      expect(screen.getByText("google/generative-ai-js")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Search repositories \(e\.g\., scikit-learn/i);
    const searchBtn = screen.getByRole("button", { name: "Search GitHub" });

    fireEvent.change(input, { target: { value: "gemini" } });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/github/search?q=gemini");
      expect(screen.getByText("google/generative-ai-js")).toBeInTheDocument();
      expect(screen.getByText("Official SDK for Gemini")).toBeInTheDocument();
    });
  });
});
