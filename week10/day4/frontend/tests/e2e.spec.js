import { test, expect } from "@playwright/test";

test("user can login and add a todo", async ({ page }) => {
  // Open frontend
  await page.goto("/");

  // Login
  await page.fill('input[placeholder="username"]', "admin");
  await page.fill('input[placeholder="password"]', "1234");
  await page.click("button:has-text('Login')");

  // Dashboard should appear
  await expect(page.getByText("Dashboard")).toBeVisible();

  // Add todo
  await page.fill('input[placeholder="Enter todo"]', "Learn Playwright");
  await page.click("button:has-text('Add Todo')");

  // Verify todo appears
  await expect(page.getByText("Learn Playwright")).toBeVisible();
});
