import { lines } from "../config/rules";
import type { CalendarDate, Input } from "../types";
export const leap = (y: number) =>
  y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
export function parseDate(s: string): CalendarDate {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(s);
  if (!m) throw Error("Zadejte datum ve formátu DD.MM.RRRR.");
  const [day, month, year] = m.slice(1).map(Number);
  const days = [
    31,
    leap(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1])
    throw Error(
      "Toto kalendářní datum neexistuje. Zkontrolujte den, měsíc a rok.",
    );
  return { day, month, year };
}
export const sumDigits = (n: number): number =>
  String(n)
    .split("")
    .reduce((s, d) => s + Number(d), 0);
export function reduction(n: number, masters = false) {
  const steps = [n];
  while (n > 9 && !(masters && [11, 22, 33].includes(n))) {
    n = sumDigits(n);
    steps.push(n);
  }
  return { value: n, baseValue: reduce9(n), steps };
}
export function reduce9(n: number): number {
  while (n > 9) n = sumDigits(n);
  return n;
}
export const dateText = (d: CalendarDate) =>
  `${String(d.day).padStart(2, "0")}.${String(d.month).padStart(2, "0")}.${String(d.year).padStart(4, "0")}`;
export function today() {
  const d = new Date();
  return dateText({
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
  });
}
export function birthday(b: CalendarDate, year: number) {
  return {
    year,
    month: b.month,
    day: b.month === 2 && b.day === 29 && !leap(year) ? 28 : b.day,
  };
}
export function activeYear(b: CalendarDate, d: CalendarDate) {
  const anniversary = birthday(b, d.year);
  return d.month < anniversary.month ||
    (d.month === anniversary.month && d.day < anniversary.day)
    ? d.year - 1
    : d.year;
}
export const personalYear = (b: CalendarDate, y: number) =>
  reduce9(reduce9(b.day) + reduce9(b.month) + reduce9(y));
export function calculate(input: Input) {
  const b = parseDate(input.birth),
    a = parseDate(input.analysis);
  if (!Number.isInteger(input.year) || input.year < 5 || input.year > 9995)
    throw Error("Vyberte rok od 5 do 9995.");
  if (input.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time))
    throw Error("Čas zadejte jako HH:MM.");
  const digits = dateText(b).replaceAll(".", "").split("").map(Number);
  const counts = Object.fromEntries(
    Array.from({ length: 9 }, (_, i) => [
      i + 1,
      digits.filter((d) => d === i + 1).length,
    ]),
  ) as Record<number, number>;
  const raw = digits.reduce((s, d) => s + d, 0),
    components = [b.day, b.month, b.year].map(reduce9);
  const life = reduction(
    input.method === "raw_digit_sum"
      ? raw
      : components.reduce((s, d) => s + d, 0),
    input.masters,
  );
  const year = input.cycle === "calendar" ? a.year : activeYear(b, a);
  const py = personalYear(b, year),
    pm = reduce9(py + a.month),
    pd = reduce9(pm + a.day);
  const uy = reduce9(a.year),
    um = reduce9(uy + a.month);
  const gridLines = lines.map((l) => {
    const numbers = l.id.split("-").map(Number),
      presentCount = numbers.filter((n) => counts[n] > 0).length,
      occurrenceSum = numbers.reduce((s, n) => s + counts[n], 0),
      coverage = presentCount / 3,
      intensity = numbers.reduce((s, n) => s + Math.min(counts[n], 3), 0) / 9;
    return {
      ...l,
      numbers,
      presentCount,
      occurrenceSum,
      coverage,
      intensity,
      status: ["empty", "partial_one", "partial_two", "full"][presentCount],
      intense: presentCount === 3 && occurrenceSum >= 5,
      score: Math.round(100 * (0.8 * coverage + 0.2 * intensity)),
      interpretationId: `line:${l.id}:${presentCount}`,
    };
  });
  const [d, m, y] = components,
    p1 = reduce9(m + d),
    p2 = reduce9(d + y),
    end = 36 - life.baseValue;
  const cycles = [p1, p2, reduce9(p1 + p2), reduce9(m + y)].map((value, i) => ({
    value,
    challenge: [
      Math.abs(m - d),
      Math.abs(d - y),
      Math.abs(Math.abs(m - d) - Math.abs(d - y)),
      Math.abs(m - y),
    ][i],
    startAge: i === 0 ? 0 : end + 1 + (i - 1) * 9,
    endAge: i === 3 ? null : end + i * 9,
    start: dateText(
      birthday(b, b.year + (i === 0 ? 0 : end + 1 + (i - 1) * 9)),
    ),
    until: i === 3 ? null : dateText(birthday(b, b.year + end + i * 9 + 1)),
  }));
  const name = nameAnalysis(
    input.name || "",
    input.surname || "",
    input.yVowel,
    life.baseValue,
    input.nameMasters ?? true,
  );
  return {
    input,
    birth: b,
    rawDigits: digits,
    method: {
      life: input.method,
      cycle: input.cycle,
      masters: input.masters,
      yVowel: input.yVowel,
      leapBirthday: "28. února",
      pinnacleMasters: false,
    },
    life: { ...life, raw, components, interpretationId: `life:${life.value}` },
    birthday: reduction(b.day),
    attitude: reduction(b.day + b.month),
    counts,
    missing: Object.keys(counts)
      .map(Number)
      .filter((n) => !counts[n]),
    lines: gridLines,
    personal: { year: py, month: pm, day: pd, activeYear: year },
    universal: { year: uy, month: um, day: reduce9(um + a.day) },
    years: Array.from({ length: 9 }, (_, i) => ({
      year: input.year - 4 + i,
      value: personalYear(b, input.year - 4 + i),
    })),
    adjacentYears: [input.year - 1, input.year, input.year + 1].map((year) => ({
      year,
      value: personalYear(b, year),
    })),
    months: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      value: reduce9(personalYear(b, input.year) + i + 1),
    })),
    cycles,
    name,
    sources: ["western-conventions", "editorial"],
  };
}

export function nameAnalysis(
  given: string,
  surname: string,
  yVowel: boolean,
  lifeBase: number,
  masters = true,
) {
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z]/g, "");
  const first = normalize(given),
    last = normalize(surname),
    letters = (first + last).split("");
  if (!letters.length) return null;
  const value = (letter: string) => ((letter.charCodeAt(0) - 65) % 9) + 1;
  const sum = (text: string) =>
    text.split("").reduce((s, l) => s + value(l), 0);
  const vowels = yVowel ? "AEIOUY" : "AEIOU";
  const reduce = (n: number) => {
    const steps = [n];
    while (n > 9 && !(masters && [11, 22].includes(n))) {
      n = sumDigits(n);
      steps.push(n);
    }
    return { value: n, baseValue: reduce9(n), steps };
  };
  const active = first ? reduce(sum(first)) : null,
    hereditary = last ? reduce(sum(last)) : null;
  const expression = reduce(sum(first + last));
  const soul = reduce(sum(letters.filter((l) => vowels.includes(l)).join("")));
  const personality = reduce(
    sum(letters.filter((l) => !vowels.includes(l)).join("")),
  );
  const personal = reduce((active?.value ?? 0) + (hereditary?.value ?? 0));
  const counts = Object.fromEntries(
    Array.from({ length: 9 }, (_, i) => [
      i + 1,
      letters.filter((l) => value(l) === i + 1).length,
    ]),
  );
  return {
    normalized: first + last,
    first,
    last,
    masters,
    expression,
    soul,
    personality,
    maturity: reduce(reduce9(expression.value) + lifeBase),
    vibrations: {
      active,
      hereditary,
      personal,
      intimate: soul,
      realization: personality,
    },
    letters: letters.map((letter) => ({
      letter,
      value: value(letter),
      kind: vowels.includes(letter) ? "vowel" : "consonant",
    })),
    counts,
    missing: Object.keys(counts)
      .map(Number)
      .filter((n) => counts[n] === 0),
  };
}
