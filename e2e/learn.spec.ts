import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

async function createAndLoginUser(page: import("@playwright/test").Page) {
  const email = `e2e-learn-${Date.now()}@djacademy.test`;
  await fetch(`${BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Learn Tester", email, password: "testpassword123" }),
  });

  await page.goto("/login");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', "testpassword123");
  await page.getByRole("button", { name: /Log in/i }).click();
  await expect(page).toHaveURL(/\/(dashboard|onboarding)/, { timeout: 10_000 });
}

test.describe("Learn flows", () => {
  test("learn page lists modules", async ({ page }) => {
    await page.goto("/learn");
    // Module h2 titles from seed data
    await expect(page.getByRole("heading", { name: /Beat-Matching Basics/i })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("heading", { name: /EQ Fundamentals/i })).toBeVisible();
  });

  test("leaderboard page renders heading", async ({ page }) => {
    await page.goto("/leaderboard");
    await expect(page.getByRole("heading", { name: /Leaderboard/i })).toBeVisible();
  });

  test("authenticated user sees dashboard with XP", async ({ page }) => {
    await createAndLoginUser(page);
    await page.goto("/dashboard");
    await expect(page.getByText("Total XP")).toBeVisible();
    await expect(page.getByText(/Level/i).first()).toBeVisible();
  });

  test("unauthenticated user is redirected from dashboard to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 8_000 });
  });

  test("practice page BPM presets load", async ({ page }) => {
    await page.goto("/practice");
    await expect(page.getByText(/BPM/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "House" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Techno" })).toBeVisible();
  });
});
