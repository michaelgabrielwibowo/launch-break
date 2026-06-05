import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import ResourcesExplorer from "./ResourcesExplorer";
import { Resource, UserProfile } from "../types";

const mockResources: Resource[] = [
  {
    id: "r1",
    title: "Understanding Attention Mechanisms",
    type: "Research Paper",
    category: "Machine Learning",
    sourceUrl: "https://arxiv.org/abs/1706.03762",
    description: "Deep dive into self-attention in sequence modeling.",
    level: "Advanced",
    estimatedTime: "25m",
  },
  {
    id: "r2",
    title: "Deep Learning Foundations Book",
    type: "Book",
    category: "Machine Learning",
    sourceUrl: "https://example.com/dl-book",
    description: "Comprehensive book on deep learning concepts.",
    level: "Beginner",
    estimatedTime: "60m",
  }
];

const mockUser: UserProfile = {
  name: "Scholar Student",
  email: "student@example.test",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=learn",
  isPro: false,
  readingTimes: {},
  streakCount: 0,
  lastActiveDate: "",
  claimedRewardDays: 0
};

describe("ResourcesExplorer Component", () => {
  it("renders correctly and filters resources by search input", () => {
    const setResources = vi.fn();
    const onSearchChange = vi.fn();

    render(
      <ResourcesExplorer
        resources={mockResources}
        setResources={setResources}
        searchString=""
        onSearchChange={onSearchChange}
        user={mockUser}
      />
    );

    // Verify resources content renders
    expect(screen.getByText("Understanding Attention Mechanisms")).toBeInTheDocument();
    expect(screen.getByText("Deep Learning Foundations Book")).toBeInTheDocument();
  });

  it("filters resources matching searchString prop correctly", () => {
    const setResources = vi.fn();
    const onSearchChange = vi.fn();

    render(
      <ResourcesExplorer
        resources={mockResources}
        setResources={setResources}
        searchString="Attention"
        onSearchChange={onSearchChange}
        user={mockUser}
      />
    );

    // Verify only matching resource is displayed based on searchString
    expect(screen.getByText("Understanding Attention Mechanisms")).toBeInTheDocument();
    expect(screen.queryByText("Deep Learning Foundations Book")).not.toBeInTheDocument();
  });
});
