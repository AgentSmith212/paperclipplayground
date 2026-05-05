import { test, expect } from "@playwright/test";

const uniqueEmail = () => `e2e-${Date.now()}@djacademy.test`;

test.describe("Auth flows", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/DJ Academy/);
    await expect(page.getByRole("link", { name: /Get started/i }).first()).toBeVisible();
  });

  test("email signup → onboarding → dashboard", async ({ page }) => {
    const email = uniqueEmail();

    await page.goto("/signup");
    await page.fill('input[type="text"]', "E2E Test DJ");
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', "testpassword123");
    await page.getByRole("button", { name: /Start learning/i }).click();

    // Should land on onboarding
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 10_000 });
    await expect(page.getByText(/Welcome to DJ Academy/i)).toBeVisible();

    // Complete onboarding
    await page.getByRole("button", { name: /Let's go/i }).click();
    await page.getByRole("button", { name: /Never DJed before/i }).click();
    await page.getByRole("button", { name: /Continue/i }).click();
    await page.getByRole("button", { name: /Just for fun/i }).click();
    await page.getByRole("button", { name: /Start learning/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    await expect(page.getByText("Total XP")).toBeVisible();
  });

  test("login with wrong password shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "nonexistent@djacademy.test");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.getByRole("button", { name: /Log in/i }).click();
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible({ timeout: 8_000 });
  });

  test("signup with duplicate email shows error", async ({ page }) => {
    const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
    const email = uniqueEmail();
    await fetch(`${BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "First", email, password: "password123" }),
    });

    await page.goto("/signup");
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', "password123");
    await page.getByRole("button", { name: /Start learning/i }).click();
    await expect(page.getByText(/already/i)).toBeVisible({ timeout: 8_000 });
  });
});
