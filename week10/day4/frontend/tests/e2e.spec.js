import { test, expect, request } from "@playwright/test";

// This runs before *every test*
test.beforeEach(async () => {
  const context = await request.newContext();
  await context.delete("http://localhost:3000/todos"); // clear all todos
  await context.dispose();
});

test("user can login, add, complete, and delete a todo", async ({ page }) => {
  await page.goto("/");

  // Login
  await page.fill('input[placeholder="username"]', "admin");
  await page.fill('input[placeholder="password"]', "1234");
  await page.click("button:has-text('Login')");
  await expect(page.getByText("Dashboard")).toBeVisible();

  // Add todo
  await page.fill('input[placeholder="Enter todo"]', "Learn Playwright");
  await page.click("button:has-text('Add Todo')");
  await expect(page.getByTestId(/todo-text-/)).toHaveText("Learn Playwright");

  // Complete todo
  await page.click("button[data-testid^='complete-']");
  await expect(page.getByTestId(/todo-text-/)).toHaveCSS("text-decoration", /line-through/);

  // Delete todo
  await page.click("button[data-testid^='delete-']");
  await expect(page.getByText("Learn Playwright")).not.toBeVisible();
});
