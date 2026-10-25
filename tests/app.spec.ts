import { readFile } from "node:fs/promises";
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
    page.getByRole("heading", {
      name: "Analýza a hledání smyslu · tři výskyty",
    }),
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

test("kontrolní stránka a vibrační schéma", async ({ page }) => {
  await page.goto("/#kontrola");
  await expect(
    page.getByRole("heading", { name: "Kontrola výpočtů", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Spustit kontrolní příklady" })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "4 / 4" }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Trojúhelník z obrázku · 24.07.1939",
      exact: true,
    })
    .click();
  await expect(page.getByLabel("Datum narození")).toHaveValue("24.07.1939");
  await page
    .getByRole("button", { name: "Roční vibrace a trojúhelník", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Osobní roční vibrace", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".annual-table tbody tr")).toHaveCount(9);
  await expect(
    page.getByRole("img", {
      name: "Vibrační trojúhelník pro 24.07.1939",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Trojúhelníky devítiletých cyklů",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".triangle-period-buttons button")).toHaveCount(4);
  await page
    .getByRole("button", { name: "1. období, vibrace 4", exact: true })
    .click();
  await expect(page.locator(".triangle-periods")).toContainText("24.07.1967");
  await expect(page.locator(".cycle-years-table tbody tr")).toHaveCount(9);
  await page
    .getByRole("button", { name: "4. období, vibrace 11", exact: true })
    .click();
  await expect(page.locator(".combined-reading")).toContainText(
    "Cyklus 11 + ORV",
  );
  await expect(page.locator(".triangle-panel .facts")).toContainText("11");
  await page
    .getByLabel("Zachovat 11 ve třetím a čtvrtém vrcholu (podle zdroje)")
    .uncheck();
  await expect(page.locator(".triangle-panel .facts")).toContainText("11 → 2");
  const exported = page.waitForEvent("download");
  await page.getByRole("button", { name: "JSON", exact: true }).click();
  const path = await (await exported).path();
  const json = JSON.parse(await readFile(path!, "utf8"));
  expect(json.triangle.periodMappingVerified).toBe(true);
  expect(
    json.triangleCycles.periods.map((p: { value: number }) => p.value),
  ).toEqual([4, 1, 5, 2]);
  expect(json.triangleCycles.periods[0].from).toBe("24.07.1967");

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("den narození, oddělené jméno a čtvrtiny ORV", async ({ page }) => {
  await page.goto("/#osobni");
  await page.getByLabel("Jméno", { exact: false }).first().fill("Petr");
  await page.getByLabel("Příjmení", { exact: false }).fill("Veselý");
  await page.getByRole("button", { name: "Prozkoumat můj rozbor" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Den narození 14 · Cílevědomost",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".name-number-cards article").nth(0)).toContainText(
    "5",
  );
  await expect(page.locator(".name-number-cards article").nth(1)).toContainText(
    "7",
  );
  await expect(page.locator(".name-number-cards article").nth(2)).toContainText(
    "3",
  );
  await expect(page.locator(".name-number-cards article").nth(3)).toContainText(
    "22",
  );
  await expect(page.locator(".name-number-cards article").nth(4)).toContainText(
    "8",
  );
  await page
    .getByRole("button", { name: "Roční vibrace a trojúhelník", exact: true })
    .click();
  await expect(page.locator(".quarter-cards>div")).toHaveCount(4);
  await expect(page.locator(".active-quarter")).toHaveCount(1);
  await page.getByRole("button", { name: "Přehled", exact: true }).click();
  await page.getByRole("button", { name: "Prázdné", exact: true }).click();
  await expect(page.locator(".lines button")).toHaveCount(2);
  await page.getByRole("button", { name: "Plné", exact: true }).click();
  await expect(page.locator(".lines button")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
