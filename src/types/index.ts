export type CalendarDate = { day: number; month: number; year: number };
export type Input = {
  birth: string;
  time?: string;
  name?: string;
  surname?: string;
  nameMasters?: boolean;
  analysis: string;
  year: number;
  masters: boolean;
  method: "raw_digit_sum" | "component_sum";
  cycle: "calendar" | "birthday_to_birthday";
  yVowel: boolean;
};
