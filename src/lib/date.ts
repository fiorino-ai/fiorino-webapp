/**
 * Returns the first day of the month for a given date
 * @param date - The date to get the first day of the month from
 * @returns A new Date object set to the first day of the month
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Returns the last day of the month for a given date
 * @param date - The date to get the last day of the month from
 * @returns A new Date object set to the last day of the month
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Formats a date to ISO string without time component and timezone offset
 * @param date - The date to format
 * @returns A string in the format "YYYY-MM-DD"
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns the first and last day of the month for a given date
 * @param date - The date to get the month range from
 * @returns An object containing the first and last day of the month
 */
export function getMonthRange(date: Date): { from: Date; to: Date } {
  return {
    from: getFirstDayOfMonth(date),
    to: getLastDayOfMonth(date),
  };
}

/**
 * Checks if two dates are in the same month and year
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns boolean indicating if dates are in the same month and year
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}
