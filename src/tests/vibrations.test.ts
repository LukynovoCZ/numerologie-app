import { describe, it, expect } from "vitest";
import { parseDate, calculate } from "../engine";
import {
  annualVibrations,
  vibrationTriangle,
  triangleCycles,
} from "../engine/vibrations";
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
    expect(t.periodMappingVerified).toBe(true);
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
    const cycles = triangleCycles(r.birth, parseDate(e.analysis));
    expect({
      cycleValues: cycles.periods.map((p) => p.value).join(","),
      firstCycleFrom: cycles.periods[0].from,
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

describe("časové přiřazení podle Najdise", () => {
  it("reprodukuje zdrojový příklad 24.07.1939", () => {
    const c = triangleCycles(parseDate("24.07.1939"), parseDate("23.10.2026"));
    expect(
      c.periods.map((p) => [p.value, p.startAge, p.endAge, p.from, p.until]),
    ).toEqual([
      [4, 28, 37, "24.07.1967", "24.07.1976"],
      [1, 37, 46, "24.07.1976", "24.07.1985"],
      [5, 46, 55, "24.07.1985", "24.07.1994"],
      [11, 55, null, "24.07.1994", null],
    ]);
    expect(c.activeIndex).toBe(3);
  });
  it("nepřiřazuje období před jeho začátkem a přechází přesně na narozeniny", () => {
    const b = parseDate("24.07.1939");
    expect(triangleCycles(b, parseDate("23.07.1967"))).toMatchObject({
      beforeFirst: true,
      activeIndex: -1,
    });
    expect(triangleCycles(b, parseDate("24.07.1967")).activeIndex).toBe(0);
    expect(triangleCycles(b, parseDate("23.07.1976")).activeIndex).toBe(0);
    expect(triangleCycles(b, parseDate("24.07.1976")).activeIndex).toBe(1);
  });
  it("redukuje 11 v prvních dvou vrcholech, ve třetím a čtvrtém ji zachovává", () => {
    expect(vibrationTriangle(parseDate("04.07.2005")).left.value).toBe(2);
    expect(vibrationTriangle(parseDate("07.04.2002")).right.value).toBe(2);
    expect(vibrationTriangle(parseDate("29.09.2000")).outer.value).toBe(11);
    expect(vibrationTriangle(parseDate("14.09.1990")).peak.value).toBe(11);
  });
  it("používá základ životního čísla i při mistrovském součtu", () => {
    const c = triangleCycles(parseDate("29.09.2000"), parseDate("23.10.2026"));
    expect(c.baseLifePath).toBe(4);
    expect(c.firstAge).toBe(32);
  });
  it("udržuje ve čtvrtém období vibraci po další desetiletí a roky přepočítává", () => {
    const b = parseDate("24.07.1939");
    for (const date of ["24.07.1994", "01.01.2026", "24.07.2050"]) {
      const c = triangleCycles(b, parseDate(date));
      expect(c.activeIndex).toBe(3);
      expect(c.periods[3].value).toBe(11);
      expect(c.periods[3].until).toBeNull();
      expect(c.periods[3].years.map((y) => y.value)).toEqual([
        9, 1, 2, 3, 4, 5, 6, 7, 8,
      ]);
      expect(c.periods[3].years.filter((y) => y.active)).toHaveLength(1);
    }
  });
  it("zachovává ORV 9 na všech hranicích pro mnoho dat", () => {
    for (let year = 1900; year <= 2026; year++) {
      const c = triangleCycles(
        parseDate(`14.09.${year}`),
        parseDate("23.10.2026"),
      );
      expect(c.periods.map((p) => p.startORV)).toEqual([9, 9, 9, 9]);
      expect(c.periods[0].years.map((y) => y.value)).toEqual([
        9, 1, 2, 3, 4, 5, 6, 7, 8,
      ]);
    }
  });
  it("přechází u 29. února podle výročí 28. února v nepřestupných letech", () => {
    const b = parseDate("29.02.2000"),
      c = triangleCycles(b, parseDate("01.01.2026"));
    const start = c.periods[0].startYear;
    expect(c.periods[0].from).toBe(`28.02.${start}`);
    expect(triangleCycles(b, parseDate(`27.02.${start}`)).activeIndex).toBe(-1);
    expect(triangleCycles(b, parseDate(`28.02.${start}`)).activeIndex).toBe(0);
  });
});
