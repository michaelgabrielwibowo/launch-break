import "@testing-library/jest-dom";
import { vi } from "vitest";

// Polyfill scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Common browser mockups
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
