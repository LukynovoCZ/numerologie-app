import { activeYear, birthday, dateText, personalYear, reduce9 } from "./index";
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
  return {
    current: period(year),
    periods: Array.from({ length: 9 }, (_, i) => start + i)
      .filter((y) => y >= 1 && y < 9999)
      .map(period),
    cycleFrom: dateText(birthday(birth, Math.max(1, start))),
    cycleUntil: dateText(birthday(birth, Math.min(9999, start + 9))),
    sourceId: "western-conventions",
  };
}
/** Diagram nodes only: the supplied image does not establish their time intervals. */
export function vibrationTriangle(birth: CalendarDate, masters = true) {
  const month = reduce9(birth.month),
    day = reduce9(birth.day),
    year = reduce9(birth.year);
  const node = (sum: number) => {
    const steps = [sum];
    while (sum > 9 && !(masters && [11, 22].includes(sum))) {
      sum = String(sum)
        .split("")
        .reduce((a, b) => a + Number(b), 0);
      steps.push(sum);
    }
    return { value: sum, steps };
  };
  const left = node(month + day),
    right = node(day + year),
    peak = node(left.value + right.value),
    outer = node(month + year);
  return {
    month,
    day,
    year,
    left,
    right,
    peak,
    outer,
    masters,
    sourceId: "user-supplied-diagram",
    periodMappingVerified: false as const,
  };
}
