import { addDays, eachDayOfInterval, format, parseISO } from "date-fns";

const dateFormat = "yyyy-MM-dd";

export function formatDate(date: Date): string {
  return format(date, dateFormat);
}

export function getToday(): string {
  return formatDate(new Date());
}

export function getNextSevenDays(startDate: string): Date[] {
  const start = parseISO(startDate);
  return eachDayOfInterval({ start, end: addDays(start, 6) });
}

export function getNextSevenDaysRange(startDate: string) {
  const start = parseISO(startDate);
  return {
    from: formatDate(start),
    to: formatDate(addDays(start, 6)),
  };
}

export function formatDateRange(startDate: string): string {
  const start = parseISO(startDate);
  const end = addDays(start, 6);
  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}
