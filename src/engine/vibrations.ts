import {
  activeYear,
  birthday,
  dateText,
  personalYear,
  reduce9,
  sumDigits,
} from "./index";
import type { CalendarDate } from "../types";
export function annualVibrations(birth: CalendarDate, analysis: CalendarDate) {
  const year = activeYear(birth, analysis);
  const period = (year: number) => ({
    year,
    value: personalYear(birth, year),
    from: dateText(birthday(birth, year)),
    until: dateText(birthday(birth, year + 1)),
    active: year === activeYear(birth, analysis),
  });
  const start = year - (personalYear(birth, year) - 1);
  const boundaries = [
    birthday(birth, year),
    ...[3, 6, 9].map((offset) =>
      addCalendarMonths(birthday(birth, year), offset),
    ),
    birthday(birth, year + 1),
  ];
  const quarters = Array.from({ length: 4 }, (_, i) => ({
    index: i + 1,
    from: dateText(boundaries[i]),
    until: dateText(boundaries[i + 1]),
    active:
      calendarKey(analysis) >= calendarKey(boundaries[i]) &&
      calendarKey(analysis) < calendarKey(boundaries[i + 1]),
  }));
  return {
    current: period(year),
    quarters,
    periods: Array.from({ length: 9 }, (_, i) => start + i)
      .filter((y) => y >= 1 && y < 9999)
      .map(period),
    cycleFrom: dateText(birthday(birth, Math.max(1, start))),
    cycleUntil: dateText(birthday(birth, Math.min(9999, start + 9))),
    sourceId: "western-conventions",
  };
}
/** Najdise method: 11 is retained only at the third and fourth nodes. */
export function vibrationTriangle(birth: CalendarDate, masters = true) {
  const month = reduce9(birth.month),
    day = reduce9(birth.day),
    year = reduce9(birth.year);
  const node = (sum: number, allowEleven = false) => {
    const steps = [sum];
    while (sum > 9 && !(masters && allowEleven && sum === 11)) {
      sum = String(sum)
        .split("")
        .reduce((a, b) => a + Number(b), 0);
      steps.push(sum);
    }
    return { value: sum, steps };
  };
  const left = node(month + day),
    right = node(day + year),
    peak = node(left.value + right.value, true),
    outer = node(month + year, true);
  return {
    month,
    day,
    year,
    left,
    right,
    peak,
    outer,
    masters,
    sourceId: "najdise-triangles",
    periodMappingVerified: true as const,
  };
}

export function triangleCycles(
  birth: CalendarDate,
  analysis: CalendarDate,
  masters = true,
) {
  const triangle = vibrationTriangle(birth, masters);
  const baseLifePath = reduce9(
    sumDigits(birth.day) + sumDigits(birth.month) + sumDigits(birth.year),
  );
  const firstAge = 36 - baseLifePath;
  const atYear = activeYear(birth, analysis);
  const periods = [
    triangle.left,
    triangle.right,
    triangle.peak,
    triangle.outer,
  ].map((node, i) => {
    const startAge = firstAge + i * 9,
      startYear = birth.year + startAge;
    const endYear = i === 3 ? null : startYear + 9;
    const active =
      atYear >= startYear && (endYear === null || atYear < endYear);
    // The last influence continues; show the nine-year window containing the analysis date.
    const windowYear =
      i === 3 && active
        ? startYear + Math.floor((atYear - startYear) / 9) * 9
        : startYear;
    const years = Array.from({ length: 9 }, (_, offset) => windowYear + offset)
      .filter((year) => year >= 1 && year < 9999)
      .map((year) => ({
        year,
        value: personalYear(birth, year),
        from: dateText(birthday(birth, year)),
        until: dateText(birthday(birth, year + 1)),
        active: year === atYear,
      }));
    return {
      index: i + 1,
      value: node.value,
      startAge,
      endAge: i === 3 ? null : startAge + 9,
      startYear,
      endYear,
      from: dateText(birthday(birth, startYear)),
      until: endYear === null ? null : dateText(birthday(birth, endYear)),
      active,
      startORV: personalYear(birth, startYear),
      years,
      interpretationId: `nineCycle:${node.value}`,
    };
  });
  const activeIndex = periods.findIndex((p) => p.active);
  return {
    baseLifePath,
    firstAge,
    periods,
    activeIndex,
    beforeFirst: atYear < periods[0].startYear,
    sourceId: "najdise-triangles",
    ageConvention: "reduced-life-path-1-9",
    triangle,
  };
}

const calendarKey = (d: CalendarDate) => d.year * 10000 + d.month * 100 + d.day;
export function addCalendarMonths(
  date: CalendarDate,
  months: number,
): CalendarDate {
  const absolute = date.year * 12 + date.month - 1 + months,
    year = Math.floor(absolute / 12),
    month = (absolute % 12) + 1;
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const maxDay = [
    31,
    leapYear ? 29 : 28,
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
  ][month - 1];
  return { year, month, day: Math.min(date.day, maxDay) };
}
