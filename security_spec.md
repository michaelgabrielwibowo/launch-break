# Security Specification

## 1. Data Invariants
- **Owner Consistency Constraint**: A user's profile under `/users/{userId}` can only be accessed, created, or modified if the authenticated consumer's UID matches the targeted `userId` path variable. No cross-profile access of any kind is permitted.
- **Strict Profile Key Size and Bounds**:
  - `name` must be a string up to 100 characters.
  - `email` must be a string up to 120 characters and must match the authenticated user's email.
  - `avatarUrl` must be a string up to 300 characters.
  - `isPro` and `isDarkMode` must be booleans.
- **Verified Authentication Requirement**: All operations require a verified authenticated session.

## 2. The "Dirty Dozen" Malicious Payloads (TDD Test Suite)

1. **Self-Elevating Pro Status (Identity Integrity Breach)**
   - Payload targeting another profile `users/victimRuleUID` where user sets victim's `isPro = true`.
2. **Cross-User Account Poisoning**
   - User attempting to create or select a profile with ID of another user.
3. **Empty Name Injection**
   - Attempting to set `name = ""` (violates size constraint).
4. **Gigantic URL Resource Attack (Denial of Wallet)**
   - Placing a 1MB string into the `avatarUrl` property.
5. **Shadow Field Spoofing**
   - Inserting an undefined `isAdmin: true` ghost-key into the payload.
6. **Mismatched Email Spoofing**
   - Setting a profile's `email` property to an administrator's email while logged in with a different user credentials.
7. **Invalid Field Type Pollution**
   - Sending `isPro: "not-a-bool-string"` inside the JSON package.
8. **Null Value Bypassing**
   - Sending `{ name: null, email: "attack@domain.com" }` to bypass the `name is string` rule.
9. **Unauthenticated Read Scraping**
   - Attempting to read a user profile without a valid `request.auth` token.
10. **Unauthenticated Creation Injection**
    - Client attempts to post/set a user profile without header credentials.
11. **Malicious ID Character Attack**
    - Trying to use `users/user_id_with_malicious_$_characters` to poison index trees.
12. **Status Short-Circuit / Mutation**
    - Creating a profile where some fields are missing but other metadata fields are injected.

## 3. Test Runner Design
We verify that these payloads fail at the security rule boundary, returning `PERMISSION_DENIED` back to the browser-client on every attempt.
