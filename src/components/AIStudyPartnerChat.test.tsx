import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import AIStudyPartnerChat from "./AIStudyPartnerChat";

describe("AIStudyPartnerChat Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("renders the floating toggle button with correct accessible labels", () => {
    render(<AIStudyPartnerChat currentTab="home" systemHealth={{ status: "ok", has_api_key: true }} />);

    const toggleBtn = screen.getByRole("button", { name: "Open AI Scholar Study Partner" });
    expect(toggleBtn).toBeInTheDocument();
    expect(screen.getByText("AI Study Partner")).toBeInTheDocument();
  });

  it("opens the chat drawer on click, showing welcome messages and presets", async () => {
    render(<AIStudyPartnerChat currentTab="home" systemHealth={{ status: "ok", has_api_key: true }} />);

    const toggleBtn = screen.getByRole("button", { name: "Open AI Scholar Study Partner" });
    fireEvent.click(toggleBtn);

    // Dialog expands
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Gemini Scholar Partner")).toBeInTheDocument();
    expect(screen.getByText(/Welcome to your Academic Helper!/i)).toBeInTheDocument();
  });

  it("blocks and ignores empty message submissions", async () => {
    render(<AIStudyPartnerChat currentTab="home" systemHealth={{ status: "ok", has_api_key: true }} />);

    const toggleBtn = screen.getByRole("button", { name: "Open AI Scholar Study Partner" });
    fireEvent.click(toggleBtn);

    const input = screen.getByPlaceholderText(/Ask Scholar anything/i);
    const sendBtn = screen.getByLabelText("Send query to AI tutor");

    // Initially disabled because of empty string
    expect(sendBtn).toBeDisabled();

    // Type empty space space space
    fireEvent.change(input, { target: { value: "     " } });
    expect(sendBtn).toBeDisabled();
  });

  it("handles failed express connection gracefully showing an alert error bubble", async () => {
    // Mock fetch rejects
    const mockRefused = new Error("Connection refused");
    (global.fetch as any).mockRejectedValueOnce(mockRefused);

    render(<AIStudyPartnerChat currentTab="home" systemHealth={{ status: "ok", has_api_key: true }} />);

    const toggleBtn = screen.getByRole("button", { name: "Open AI Scholar Study Partner" });
    fireEvent.click(toggleBtn);

    const input = screen.getByPlaceholderText(/Ask Scholar anything/i);
    const sendBtn = screen.getByLabelText("Send query to AI tutor");

    fireEvent.change(input, { target: { value: "What is Backpropagation?" } });
    expect(sendBtn).not.toBeDisabled();

    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/Connection Interrupted/i)).toBeInTheDocument();
    });
  });
});
