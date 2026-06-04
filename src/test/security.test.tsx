import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserProfile } from "../types";

// Dynamic schema checker in client state corresponding to firebase rules validation blueprint
function validateUserProfilePayload(data: any): boolean {
  if (!data) return false;
  
  // Required keys check
  const requiredKeys = ["name", "email", "avatarUrl", "isPro"];
  for (const key of requiredKeys) {
    if (!(key in data)) return false;
  }

  // Type & constraints validation (matches firestore.rules validation)
  if (typeof data.name !== "string" || data.name.length === 0 || data.name.length > 100) {
    return false;
  }
  if (typeof data.email !== "string" || data.email.length === 0 || data.email.length > 120) {
    return false;
  }
  if (typeof data.avatarUrl !== "string" || data.avatarUrl.length === 0 || data.avatarUrl.length > 300) {
    return false;
  }
  if (typeof data.isPro !== "boolean") {
    return false;
  }
  if (data.isDarkMode !== undefined && typeof data.isDarkMode !== "boolean") {
    return false;
  }
  if (data.streakCount !== undefined && typeof data.streakCount !== "number") {
    return false;
  }
  if (data.lastActiveDate !== undefined && typeof data.lastActiveDate !== "string") {
    return false;
  }
  if (data.claimedRewardDays !== undefined && typeof data.claimedRewardDays !== "number") {
    return false;
  }
  if (data.isAdmin !== undefined) {
    return false; // Shadow field spoofing blocked
  }

  return true;
}

// Simulated Firebase client operation
interface AuthState {
  currentUser: { uid: string; email: string } | null;
}

class FirestoreSimulator {
  private db: Record<string, any> = {};
  private authState: AuthState;

  constructor(authState: AuthState) {
    this.authState = authState;
  }

  getDoc(docPath: string): any {
    // 9. Unauthenticated Read Scraping (Pillar 6)
    if (!this.authState.currentUser) {
      throw new Error("PERMISSION_DENIED: Unauthenticated profiles read scraper attempt blocked.");
    }
    
    // Ownership check (Pillar 6 and rules match block)
    const pathParts = docPath.split("/");
    const userId = pathParts[1];
    if (this.authState.currentUser.uid !== userId) {
      throw new Error("PERMISSION_DENIED: Cross-user read scrapers attempt blocked.");
    }

    return this.db[docPath] || null;
  }

  setDoc(docPath: string, data: any): void {
    // 10. Unauthenticated Creation Injection
    if (!this.authState.currentUser) {
      throw new Error("PERMISSION_DENIED: Client posting without auth header credentials blocked.");
    }

    const pathParts = docPath.split("/");
    const userId = pathParts[1];
    if (this.authState.currentUser.uid !== userId) {
      throw new Error("PERMISSION_DENIED: Cross-user creation poisoning blocked.");
    }

    // Schema Validation (Item 7, 8 & 3)
    if (!validateUserProfilePayload(data)) {
      throw new Error("PERMISSION_DENIED: Payload fails strict validation blueprint check.");
    }

    this.db[docPath] = data;
  }
}

describe("Firebase Security Rules & Dirty Dozen Test Suite", () => {
  let authState: AuthState;
  let firestore: FirestoreSimulator;

  beforeEach(() => {
    authState = { currentUser: null };
    firestore = new FirestoreSimulator(authState);
  });

  // ITEM 9: Unauthenticated Read Scraping
  it("Item 9: Unauthenticated Read Scraping - should block profile reads when unauthenticated", () => {
    authState.currentUser = null; // Unauthenticated
    expect(() => {
      firestore.getDoc("users/targetUserUID");
    }).toThrowError(/Unauthenticated profiles read scraper attempt blocked/);
  });

  // ITEM 10: Unauthenticated Creation Injection
  it("Item 10: Unauthenticated Creation Injection - should block profile posting when unauthenticated", () => {
    authState.currentUser = null; // Unauthenticated
    const payload = {
      name: "Autonomous Bot",
      email: "bot@domain.com",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg",
      isPro: true,
    };
    expect(() => {
      firestore.setDoc("users/targetUserUID", payload);
    }).toThrowError(/posting without auth header credentials blocked/);
  });

  // ITEM 7: Invalid Field Type Pollution (Chromotherapy or status verification spoof)
  it("Item 7: Invalid Field Type Pollution - should fail validation if isPro is a string instead of a boolean", () => {
    authState.currentUser = { uid: "user123", email: "user@domain.com" };
    const invalidPayload = {
      name: "Normal Scholar",
      email: "user@domain.com",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg",
      isPro: "true" as any, // Polluting type
    };
    expect(() => {
      firestore.setDoc("users/user123", invalidPayload);
    }).toThrowError(/Payload fails strict validation blueprint check/);
  });

  // ITEM 8: Null Value Bypassing
  it("Item 8: Null Value Bypassing - should block creation when name is null", () => {
    authState.currentUser = { uid: "user123", email: "user@domain.com" };
    const nullPayload = {
      name: null as any, // Null value bypass attempt
      email: "user@domain.com",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg",
      isPro: false,
    };
    expect(() => {
      firestore.setDoc("users/user123", nullPayload);
    }).toThrowError(/Payload fails strict validation blueprint check/);
  });

  // Integrity checks: Self-Elevating checks
  it("Shadow Field Spoofing (Item 5) - should reject payloads with administrative ghost fields", () => {
    authState.currentUser = { uid: "user123", email: "user@domain.com" };
    const backdoorPayload = {
      name: "Normal Scholar",
      email: "user@domain.com",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg",
      isPro: false,
      isAdmin: true, // Ghost-key injection
    };
    expect(() => {
      firestore.setDoc("users/user123", backdoorPayload);
    }).toThrowError(/Payload fails strict validation blueprint check/);
  });
});
