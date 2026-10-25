import { describe, it, expect } from "vitest";
import { calculate, parseDate, nameAnalysis } from "../engine";
import { annualVibrations, addCalendarMonths } from "../engine/vibrations";
import birthdays from "../data/birthdays.cs.json";
describe("příklady ORV z dodaného zdroje", () => {
  it("13.05.1943 v prosinci 2004 má ORV 6", () =>
    expect(
      annualVibrations(parseDate("13.05.1943"), parseDate("01.12.2004"))
        .current,
    ).toMatchObject({ value: 6, from: "13.05.2004", until: "13.05.2005" }));
  it("20.10.1978 má v srpnu 2004 ORV 8, od narozenin 9 a v roce 2005 1", () => {
    const b = parseDate("20.10.1978");
    expect(annualVibrations(b, parseDate("01.08.2004")).current).toMatchObject({
      value: 8,
      from: "20.10.2003",
    });
    expect(annualVibrations(b, parseDate("20.10.2004")).current.value).toBe(9);
    expect(annualVibrations(b, parseDate("20.10.2005")).current.value).toBe(1);
  });
  it("čtvrtiny odpovídají příkladu 1. ledna", () => {
    const r = annualVibrations(
      parseDate("01.01.1990"),
      parseDate("01.07.2026"),
    );
    expect(r.quarters.map((q) => q.from)).toEqual([
      "01.01.2026",
      "01.04.2026",
      "01.07.2026",
      "01.10.2026",
    ]);
    expect(r.quarters.filter((q) => q.active).map((q) => q.index)).toEqual([3]);
    expect(r.quarters[3].until).toBe("01.01.2027");
  });
  it("posouvá přímo od výročí a ořezává pouze neexistující den v cílovém měsíci", () => {
    expect(addCalendarMonths(parseDate("31.01.2026"), 3)).toEqual({
      day: 30,
      month: 4,
      year: 2026,
    });
    expect(addCalendarMonths(parseDate("31.01.2026"), 6)).toEqual({
      day: 31,
      month: 7,
      year: 2026,
    });
    expect(addCalendarMonths(parseDate("30.11.2023"), 3)).toEqual({
      day: 29,
      month: 2,
      year: 2024,
    });
  });
});
describe("jmenná čísla", () => {
  it("reprodukuje celý příklad Petr Veselý včetně intimního 22", () => {
    const n = nameAnalysis("Petr", "Veselý", true, 6)!;
    expect(n.vibrations.active).toMatchObject({ value: 5, steps: [23, 5] });
    expect(n.vibrations.hereditary).toMatchObject({ value: 7, steps: [25, 7] });
    expect(n.vibrations.personal).toMatchObject({ value: 3, steps: [12, 3] });
    expect(n.vibrations.intimate.value).toBe(22);
    expect(n.vibrations.realization).toMatchObject({
      value: 8,
      steps: [26, 8],
    });
    expect(
      n.letters
        .filter((l) => l.kind === "vowel")
        .map((l) => l.letter)
        .join(""),
    ).toBe("EEEY");
    expect(Object.values(n.counts).reduce((a, b) => a + b, 0)).toBe(10);
  });
  it("přepíná Y a zachování 11/22 samostatně", () => {
    expect(nameAnalysis("Petr", "Veselý", true, 6, false)?.soul.value).toBe(4);
    expect(nameAnalysis("Petr", "Veselý", false, 6)?.soul.value).toBe(6);
    expect(
      nameAnalysis("CH", "", true, 6)?.letters.map((l) => l.letter),
    ).toEqual(["C", "H"]);
  });
  it("neodhaduje hranici mezi jménem a příjmením", () => {
    expect(
      nameAnalysis("Petr Veselý", "", true, 6)?.vibrations.hereditary,
    ).toBeNull();
    expect(nameAnalysis("", "Veselý", true, 6)?.vibrations.active).toBeNull();
    expect(nameAnalysis("---", "", true, 6)).toBeNull();
  });
  it("změna příjmení nemění numerologii data", () => {
    const input = {
      birth: "14.09.1990",
      analysis: "23.10.2026",
      year: 2026,
      masters: true,
      method: "raw_digit_sum" as const,
      cycle: "calendar" as const,
      yVowel: true,
    };
    expect(
      calculate({ ...input, name: "Petr", surname: "Veselý" }).counts,
    ).toEqual(calculate(input).counts);
    expect(
      calculate({ ...input, name: "Petr", surname: "Veselý" }).life,
    ).toEqual(calculate(input).life);
  });
});
it("nabízí pro všech 31 dní možnosti i témata k rozvíjení", () => {
  expect(Object.keys(birthdays)).toHaveLength(31);
  for (const text of Object.values(birthdays)) {
    expect(text.potential.length).toBeGreaterThan(20);
    expect(text.growth.length).toBeGreaterThan(20);
    expect(text.evidenceLevel).toBe("editorial_synthesis");
  }
});
