import { describe, it, expect } from "vitest";
import { parseDate, calculate } from "../engine";
import { annualVibrations, vibrationTriangle } from "../engine/vibrations";
import examples from "../data/checks.cs.json";
describe("roční vibrace od narozenin", () => {
  it("mění aktivní období na narozeniny, ne 1. ledna", () => {
    const b = parseDate("14.09.1990");
    expect(annualVibrations(b, parseDate("13.09.2026")).current).toMatchObject({
      value: 5,
      from: "14.09.2025",
      until: "14.09.2026",
    });
    expect(annualVibrations(b, parseDate("14.09.2026")).current).toMatchObject({
      value: 6,
      from: "14.09.2026",
      until: "14.09.2027",
    });
    expect(annualVibrations(b, parseDate("01.01.2027")).current.value).toBe(6);
  });
  it("vytváří souvislou devítiletou řadu 1–9", () => {
    const r = annualVibrations(
      parseDate("14.09.1990"),
      parseDate("23.10.2026"),
    );
    expect(r.periods.map((p) => p.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(r.periods.filter((p) => p.active)).toHaveLength(1);
    for (let i = 0; i < 8; i++)
      expect(r.periods[i].until).toBe(r.periods[i + 1].from);
  });
  it("respektuje přestupné narozeniny", () => {
    const b = parseDate("29.02.2000");
    expect(annualVibrations(b, parseDate("27.02.2026")).current.year).toBe(
      2025,
    );
    expect(annualVibrations(b, parseDate("28.02.2026")).current.from).toBe(
      "28.02.2026",
    );
    expect(annualVibrations(b, parseDate("28.02.2024")).current.year).toBe(
      2023,
    );
    expect(annualVibrations(b, parseDate("29.02.2024")).current.from).toBe(
      "29.02.2024",
    );
  });
});
describe("uzly trojúhelníku", () => {
  it("odpovídá číslům uživatelova obrázku", () => {
    const t = vibrationTriangle(parseDate("24.07.1939"));
    expect([
      t.month,
      t.day,
      t.year,
      t.left.value,
      t.right.value,
      t.peak.value,
      t.outer.value,
    ]).toEqual([7, 6, 4, 4, 1, 5, 11]);
    expect(t.periodMappingVerified).toBe(false);
  });
  it("umožňuje redukovat vnější 11 na 2", () =>
    expect(vibrationTriangle(parseDate("24.07.1939"), false).outer.value).toBe(
      2,
    ));
  it.each(examples)("ověřuje pevné kontrolní hodnoty: $title", (e) => {
    const r = calculate({
        birth: e.birth,
        analysis: e.analysis,
        year: e.year,
        masters: true,
        method: "raw_digit_sum",
        cycle: "calendar",
        yVowel: true,
      }),
      t = vibrationTriangle(r.birth);
    expect({
      life: r.life.value,
      base: r.life.baseValue,
      annual: r.personal.year,
      month: r.personal.month,
      day: r.personal.day,
      counts: Object.values(r.counts).join(","),
      triangle: [
        t.month,
        t.day,
        t.year,
        t.left.value,
        t.right.value,
        t.peak.value,
        t.outer.value,
      ].join(","),
    }).toEqual(e.expected);
  });
});
