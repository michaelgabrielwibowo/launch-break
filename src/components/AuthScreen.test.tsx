import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import AuthScreen from "./AuthScreen";

// Mock firebase modules
vi.mock("../firebase", () => ({
  auth: {},
}));

vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: class {},
  signInWithPopup: vi.fn(),
}));

describe("AuthScreen", () => {
  it("renders correctly with custom title and CTA option", () => {
    const onAuthSuccess = vi.fn();
    const onEnterDemo = vi.fn();
    
    render(<AuthScreen onAuthSuccess={onAuthSuccess} onEnterDemo={onEnterDemo} />);
    
    expect(screen.getByText("Learning Launchpad")).toBeInTheDocument();
    expect(screen.getByText("Continue with Google Account")).toBeInTheDocument();
    
    const demoButton = screen.getByText("Explore Demo State (No Sign In)");
    expect(demoButton).toBeInTheDocument();
    
    fireEvent.click(demoButton);
    expect(onEnterDemo).toHaveBeenCalledOnce();
  });
});
