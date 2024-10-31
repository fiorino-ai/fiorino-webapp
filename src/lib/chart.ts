import {
  ChartCostData,
  ChartCostSerie,
  DailyModelTotalCost,
  MonthRange,
} from "@/types";

/**
 * Returns an array of dates between start and end dates (inclusive)
 */
function getDatesInRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Format a date to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const formatDailyCosts = (
  dailyCosts: DailyModelTotalCost[],
  period: MonthRange
): ChartCostSerie[] => {
  // Initialize costs object with all dates in range
  const costs: ChartCostData = {};
  const dates = getDatesInRange(period.from, period.to);

  // Get all unique model names from dailyCosts (if any)
  const modelNames = new Set<string>();
  if (dailyCosts) {
    dailyCosts.forEach((cost) => modelNames.add(cost.llm_model_name));
  }

  // Initialize all dates with 0 for each model (or just date if no models)
  dates.forEach((date) => {
    const dateStr = formatDate(date);
    costs[dateStr] = {};
    if (modelNames.size > 0) {
      modelNames.forEach((model) => {
        costs[dateStr][model] = 0;
      });
    }
  });

  // Fill in actual costs if they exist
  if (dailyCosts) {
    for (const cost of dailyCosts) {
      if (costs[cost.date]) {
        costs[cost.date][cost.llm_model_name] = cost.total_cost;
      }
    }
  }

  // Convert to series format
  return Object.keys(costs)
    .sort() // Ensure dates are in order
    .map((date) => ({
      date,
      ...costs[date],
    }));
};