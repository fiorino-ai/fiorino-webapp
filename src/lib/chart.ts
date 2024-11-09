import {
  ChartCostData,
  ChartCostSerie,
  ChartTokensData,
  DailyModelCost,
  DailyModelTotalCost,
  DailyTotalTokens,
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
function formatDate(date: Date, format?: string): string {
  if (format === "MM-DD") {
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const formatDailyCosts = (
  dailyCosts: DailyModelTotalCost[],
  period: MonthRange
): ChartCostSerie[] => {
  if (dailyCosts.length === 0) {
    return [];
  }

  // Initialize costs object with all dates in range
  const costs: ChartCostData = {};
  const dates = getDatesInRange(period.from, period.to);

  // Get all unique model names from dailyCosts (if any)
  const modelNames = new Set<string>();
  if (dailyCosts) {
    dailyCosts.forEach((cost) => modelNames.add(cost.model_name));
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
        costs[cost.date][cost.model_name] = cost.total_cost;
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

export const formatSingleModelDailyCosts = (
  dailyModelCosts: DailyModelCost[],
  period: MonthRange
): DailyModelCost[] => {
  // Initialize costs object with all dates in range
  const filledData: DailyModelCost[] = [];
  const dates = getDatesInRange(period.from, period.to);

  // Initialize all dates with 0 for each model (or just date if no models)
  dates.forEach((date) => {
    const dateStr = formatDate(date);
    const chartDate = formatDate(date, "MM-DD");

    const cost = (dailyModelCosts || []).find((cost) => cost.date === dateStr);

    if (cost) {
      filledData.push({ ...cost, date: chartDate });
    } else {
      filledData.push({
        date: chartDate,
        cost: 0,
      });
    }
  });

  return filledData;
};

export const formatDailyTokens = (
  dailyTokens: DailyTotalTokens[],
  period: MonthRange
): DailyTotalTokens[] => {
  if (dailyTokens.length === 0) {
    return [];
  }

  // Initialize costs object with all dates in range
  const tokens: ChartTokensData = {};
  const dates = getDatesInRange(period.from, period.to);

  // Get all unique model names from dailyCosts (if any)
  const datesSet = new Set<string>();
  if (dailyTokens) {
    dailyTokens.forEach((tokens) => datesSet.add(tokens.date));
  }

  // Initialize all dates with 0 for each model (or just date if no models)
  dates.forEach((date) => {
    const dateStr = formatDate(date);

    tokens[dateStr] = {
      total_input_tokens: 0,
      total_output_tokens: 0,
    };
  });

  // Fill in actual costs if they exist
  if (dailyTokens) {
    for (const dailyUsage of dailyTokens) {
      if (tokens[dailyUsage.date]) {
        tokens[dailyUsage.date] = {
          total_input_tokens: dailyUsage.total_input_tokens,
          total_output_tokens: dailyUsage.total_output_tokens,
        };
      }
    }
  }

  // Convert to series format
  return Object.keys(tokens)
    .sort() // Ensure dates are in order
    .map((date) => ({
      date,
      ...tokens[date],
    }));
};

export const formatDateTick = (date: string) => {
  const dateObj = new Date(date);
  return formatDate(dateObj, "MM-DD");
};
