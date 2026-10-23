import { test, expect } from "@playwright/test";
test("rozbor, interakce, soukromí a export", async ({ page }) => {
  const exceptions: string[] = [];
  page.on("pageerror", (e) => exceptions.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Váš numerologický rozbor" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Číslo 9, počet 3", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /1 · 4 · 7/ }).click();
  await expect(page.locator(".number-grid .highlight")).toHaveCount(3);
  await page
    .getByRole("button", { name: "Číslo 9, počet 3", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Nadhled · tři výskyty" }),
  ).toBeVisible();
  await page.getByLabel("Datum narození").fill("31.04.2020");
  await page.getByRole("button", { name: "Prozkoumat můj rozbor" }).click();
  await expect(page.getByRole("alert")).toContainText("neexistuje");
  await page.getByLabel("Datum narození").fill("29.02.2000");
  await page.getByRole("button", { name: "Prozkoumat můj rozbor" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.getItem("numerologie:input:v1")),
  ).toBeNull();
  await page.getByLabel("Zapamatovat údaje").check();
  await page.getByRole("button", { name: "Prozkoumat můj rozbor" }).click();
  await page.reload();
  await expect(page.getByLabel("Datum narození")).toHaveValue("29.02.2000");
  await page.getByLabel("Zapamatovat údaje").uncheck();
  expect(
    await page.evaluate(() => localStorage.getItem("numerologie:input:v1")),
  ).toBeNull();
  await page
    .getByRole("button", { name: "Cykly a období", exact: true })
    .click();
  await expect(page.locator(".year-timeline button")).toHaveCount(9);
  await expect(page.locator(".month-grid button")).toHaveCount(12);
  await page
    .getByRole("button", { name: "Jak se to počítá", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Jak se to počítá" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Přehled", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "JSON", exact: true }).click();
  expect((await download).suggestedFilename()).toBe(
    "numerologicky-rozbor.json",
  );
  const toggle = page.getByRole("button", { name: /Zapnout .* téma/ });
  await toggle.click();
  await expect(toggle).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(exceptions).toEqual([]);
});
