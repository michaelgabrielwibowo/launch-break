import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import AcademicPapersExplorer from "./AcademicPapersExplorer";

const mockPaper = {
  id: "arxiv_99",
  title: "A Survey of Federated Learning Algorithms",
  abstract: "An entry survey detailing federated optimization patterns.",
  authors: ["John Doe", "Jane Smith"],
  year: 2025,
  pdfUrl: "https://arxiv.org/pdf/999.001",
  source: "arXiv",
  citationCount: 45,
};

describe("AcademicPapersExplorer Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ papers: [mockPaper] }),
    });
  });

  it("renders federated academic papers portal and lists mock results", async () => {
    render(<AcademicPapersExplorer />);

    expect(screen.getByText("arXiv & Semantic Scholar Federated Portal")).toBeInTheDocument();
    expect(screen.getByText("Academic Open Papers Locator")).toBeInTheDocument();

    // Wait for the initial load of papers to complete
    await waitFor(() => {
      expect(screen.getByText("A Survey of Federated Learning Algorithms")).toBeInTheDocument();
    });
  });

  it("should trigger search queries correctly and render paper rows", async () => {
    render(<AcademicPapersExplorer />);

    // Wait for initial load so that the search button becomes enabled (loading is false)
    await waitFor(() => {
      expect(screen.getByText("A Survey of Federated Learning Algorithms")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Search across arXiv, Semantic Scholar/i);
    const searchBtn = screen.getByRole("button", { name: "Search Publications" });

    fireEvent.change(input, { target: { value: "Federated Learning" } });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/papers/search?q=Federated%20Learning");
      expect(screen.getByText("A Survey of Federated Learning Algorithms")).toBeInTheDocument();
      expect(screen.getByText(/45 Citations/i)).toBeInTheDocument();
    });
  });
});
