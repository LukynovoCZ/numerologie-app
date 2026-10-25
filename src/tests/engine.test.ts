import { describe, it, expect } from "vitest";
import {
  calculate,
  parseDate,
  reduce9,
  reduction,
  activeYear,
} from "../engine";
import type { Input } from "../types";
const input: Input = {
  birth: "14.09.1990",
  analysis: "23.10.2026",
  year: 2026,
  masters: true,
  method: "raw_digit_sum",
  cycle: "calendar",
  yVowel: true,
};
const run = (patch: Partial<Input> = {}) => calculate({ ...input, ...patch });
describe("referenční datum 14.09.1990", () => {
  it("používá pouze nenulové číslice a správné prázdné linie", () => {
    const r = run();
    expect(r.rawDigits).toEqual([1, 4, 0, 9, 1, 9, 9, 0]);
    expect(r.counts).toEqual({
      1: 2,
      2: 0,
      3: 0,
      4: 1,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 3,
    });
    expect(r.missing).toEqual([2, 3, 5, 6, 7, 8]);
    expect(
      r.lines.filter((l) => l.status === "empty").map((l) => l.id),
    ).toEqual(["2-5-8", "3-5-7"]);
    expect(r.lines.filter((l) => l.status === "full")).toHaveLength(0);
    expect(r.lines.map((l) => l.presentCount)).toEqual([
      2, 0, 1, 1, 1, 1, 2, 0,
    ]);
  });
  it("rozlišuje metody i mistrovská čísla", () => {
    expect(run().life).toMatchObject({
      value: 33,
      baseValue: 6,
      raw: 33,
      steps: [33],
    });
    expect(run({ masters: false }).life.steps).toEqual([33, 6]);
    expect(run({ method: "component_sum" }).life).toMatchObject({
      value: 6,
      components: [5, 9, 1],
      steps: [15, 6],
    });
  });
  it("počítá narozeninové, osobní a univerzální cykly", () => {
    const r = run();
    expect(r.birthday.value).toBe(5);
    expect(r.attitude.steps).toEqual([23, 5]);
    expect(r.personal).toMatchObject({ year: 6, month: 7, day: 3 });
    expect(r.universal.year).toBe(1);
    expect(r.adjacentYears.map((y) => y.value)).toEqual([5, 6, 7]);
    expect(r.months).toHaveLength(12);
    expect(r.years).toHaveLength(9);
  });
  it.each(["", "00:00", "08:30", "23:59"])(
    "čas %s nemění standardní výsledky",
    (time) => {
      const { input: _, ...base } = run();
      const { input: __, ...other } = run({ time });
      expect(other).toEqual(base);
    },
  );
  it("jméno nemění mřížku nebo životní číslo", () => {
    const r = run({ name: "Žaneta Chytilová" });
    expect(r.counts).toEqual(run().counts);
    expect(r.life).toEqual(run().life);
    expect(r.name?.normalized).toBe("ZANETACHYTILOVA");
  });
});
describe("kalendářní data a přechody", () => {
  it("přijímá přestupný den 2000", () =>
    expect(parseDate("29.02.2000")).toEqual({ day: 29, month: 2, year: 2000 }));
  it.each([
    "29.02.1900",
    "31.04.2020",
    "00.01.2020",
    "01.13.2020",
    "1.1.2020",
    "01.01.0000",
  ])("odmítá %s", (date) => expect(() => parseDate(date)).toThrow());
  it("mění kalendářní rok a měsíc přes Silvestra", () => {
    expect(run({ analysis: "31.12.2026" }).personal).toMatchObject({
      year: 6,
      month: 9,
      day: 4,
    });
    expect(run({ analysis: "01.01.2027" }).personal).toMatchObject({
      year: 7,
      month: 8,
      day: 9,
    });
  });
  it("přechází v narozeninové variantě na narozeniny", () => {
    expect(
      run({ analysis: "13.09.2026", cycle: "birthday_to_birthday" }).personal
        .year,
    ).toBe(5);
    expect(
      run({ analysis: "14.09.2026", cycle: "birthday_to_birthday" }).personal
        .year,
    ).toBe(6);
  });
  it("29. února přechází 28. února jen v nepřestupném roce", () => {
    const b = parseDate("29.02.2000");
    expect(activeYear(b, parseDate("27.02.2026"))).toBe(2025);
    expect(activeYear(b, parseDate("28.02.2026"))).toBe(2026);
    expect(activeYear(b, parseDate("28.02.2024"))).toBe(2023);
    expect(activeYear(b, parseDate("29.02.2024"))).toBe(2024);
  });
  it("odmítá neplatné nastavení", () => {
    expect(() => run({ year: NaN })).toThrow();
    expect(() => run({ time: "24:00" })).toThrow();
  });
});
describe("další výpočty a invarianty", () => {
  it("počítá všechny vrcholy, výzvy a hranice", () => {
    const r = run();
    expect(r.cycles.map((c) => c.value)).toEqual([5, 6, 2, 1]);
    expect(r.cycles.map((c) => c.challenge)).toEqual([4, 4, 0, 8]);
    expect(r.cycles.map((c) => [c.startAge, c.endAge])).toEqual([
      [0, 30],
      [31, 39],
      [40, 48],
      [49, null],
    ]);
    expect(r.cycles[0].until).toBe("14.09.2021");
    expect(r.cycles[1].start).toBe("14.09.2021");
  });
  it("jméno přiřazuje cyklicky, diakritiku a CH normalizuje a přepíná Y", () => {
    expect(run({ name: "ÁBC" }).name).toMatchObject({
      normalized: "ABC",
      expression: { value: 6 },
      soul: { value: 1 },
      personality: { value: 5 },
      maturity: { value: 3 },
    });
    expect(run({ name: "CH" }).name?.expression.value).toBe(11);
    expect(run({ name: "CH", nameMasters: false }).name?.expression.value).toBe(
      2,
    );
    expect(run({ name: "Y", yVowel: true }).name?.soul.value).toBe(7);
    expect(run({ name: "Y", yVowel: false }).name?.soul.value).toBe(0);
    expect(run({ name: "---" }).name).toBeNull();
  });
  it("plná linie s jedním výskytem má skóre 87", () => {
    const l = run({ birth: "14.07.2000" }).lines[0];
    expect(l).toMatchObject({
      presentCount: 3,
      occurrenceSum: 3,
      status: "full",
      score: 87,
      intense: false,
    });
  });
  it("intenzivní linie je plná a má alespoň pět výskytů", () => {
    expect(run({ birth: "11.04.1777" }).lines[0]).toMatchObject({
      presentCount: 3,
      intense: true,
    });
  });
  it("zachovává invarianty napříč stoletím dat", () => {
    for (let y = 1900; y <= 2026; y++) {
      const r = run({ birth: `29.09.${y}` });
      expect(Object.values(r.counts).reduce((a, b) => a + b, 0)).toBe(
        r.rawDigits.filter(Boolean).length,
      );
      for (const l of r.lines) {
        expect(l.presentCount).toBeGreaterThanOrEqual(0);
        expect(l.presentCount).toBeLessThanOrEqual(3);
        expect(l.status === "empty").toBe(l.presentCount === 0);
        expect(l.status === "full").toBe(l.presentCount === 3);
        expect(l.score).toBeGreaterThanOrEqual(0);
        expect(l.score).toBeLessThanOrEqual(100);
      }
      expect(JSON.parse(JSON.stringify(r))).toEqual(r);
    }
  });
  it("redukuje včetně nuly a mistrovských mezikroků", () => {
    expect(reduce9(0)).toBe(0);
    expect(reduction(29, true)).toEqual({
      value: 11,
      baseValue: 2,
      steps: [29, 11],
    });
    expect(reduction(22, true).value).toBe(22);
    expect(reduction(33, false).value).toBe(6);
  });
});
