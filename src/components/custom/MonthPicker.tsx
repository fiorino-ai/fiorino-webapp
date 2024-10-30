"use client";

import * as React from "react";
import {
  addMonths,
  format,
  subMonths,
  isBefore,
  isAfter,
  isSameMonth,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MonthRange } from "@/types";
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/lib/date";

interface MonthRangePickerValue {
  from?: Date;
  to?: Date;
}

interface MonthPickerProps {
  mode?: "single" | "range";
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: MonthRange) => void;
  value?: MonthRange;
}

export default function MonthPicker({
  mode = "single",
  minDate,
  maxDate,
  onChange,
  value,
}: MonthPickerProps = {}) {
  const [date, setDate] = React.useState<MonthRangePickerValue>(
    value || { from: new Date(), to: new Date() }
  );

  const [currentMode, setCurrentMode] = React.useState(mode);
  const [isOpen, setIsOpen] = React.useState(false);
  const [year, setYear] = React.useState(
    (date as MonthRange).from?.getFullYear() || new Date().getFullYear()
  );

  React.useEffect(() => {
    if (value && !isSameMonth(value.from, value.to)) {
      setCurrentMode("range");
    }
  }, [value]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const selectedDate = new Date(year, monthIndex);

    // if (currentMode === "single") {
    //   const range = {
    //     from: getFirstDayOfMonth(selectedDate),
    //     to: getLastDayOfMonth(selectedDate),
    //   };
    //   setDate(range);
    //   onChange?.(range);
    //   setIsOpen(false);
    // } else {
    const range = date as MonthRange;
    if (!range.from || range.to) {
      // Start new range
      const range = { from: getFirstDayOfMonth(selectedDate), to: undefined };
      setDate(range);
      setCurrentMode("range");
    } else {
      // Complete the range
      if (isBefore(selectedDate, range.from)) {
        const _range = {
          from: getFirstDayOfMonth(selectedDate),
          to: getLastDayOfMonth(range.from),
        };
        setDate(_range);
        onChange?.(_range);
      } else {
        const _range = {
          from: getFirstDayOfMonth(range.from),
          to: getLastDayOfMonth(selectedDate),
        };
        setDate(_range);
        onChange?.(_range);
      }
      setIsOpen(false);
    }
    // }
  };

  const handleYearChange = (increment: number) => {
    const newYear = year + increment;
    const newDate = new Date(newYear, 0);
    if (minDate && newDate < minDate) return;
    if (maxDate && newDate > maxDate) return;
    setYear(newYear);
  };

  const handleNavigateMonth = (direction: "prev" | "next") => {
    if (currentMode === "range") {
      const range = date as MonthRange;
      if (!range.from || !range.to) return;

      const newDate =
        direction === "prev"
          ? subMonths(range.from, 1)
          : addMonths(range.to, 1);

      if (minDate && newDate < minDate) return;
      if (maxDate && newDate > maxDate) return;

      setDate({
        from: getFirstDayOfMonth(newDate),
        to: getLastDayOfMonth(newDate),
      });
      setCurrentMode("single");
      setYear(newDate.getFullYear());
      onChange?.({
        from: getFirstDayOfMonth(newDate),
        to: getLastDayOfMonth(newDate),
      });
    } else {
      const currentDate = date;
      const newDate =
        direction === "prev"
          ? subMonths(currentDate.from as Date, 1)
          : addMonths(currentDate.from as Date, 1);

      if (minDate && newDate < minDate) return;
      if (maxDate && newDate > maxDate) return;

      setDate({
        from: getFirstDayOfMonth(newDate),
        to: getLastDayOfMonth(newDate),
      });
      setYear(newDate.getFullYear());
      onChange?.({
        from: getFirstDayOfMonth(newDate),
        to: getLastDayOfMonth(newDate),
      });
    }
  };

  const formatDateDisplay = () => {
    if (currentMode === "single") {
      return format(date.from as Date, "MMM, yyyy");
    } else {
      const range = date as MonthRange;
      if (!range.from) return "Select months";
      if (!range.to) return `${format(range.from, "MMM, yyyy")} - ...`;
      return `${format(range.from, "MMM, yyyy")} - ${format(
        range.to,
        "MMM, yyyy"
      )}`;
    }
  };

  const isMonthInRange = (monthDate: Date) => {
    if (currentMode !== "range") return false;
    const range = date as MonthRange;
    if (!range.from || !range.to) return false;
    return (
      (isAfter(monthDate, range.from) || isSameMonth(monthDate, range.from)) &&
      (isBefore(monthDate, range.to) || isSameMonth(monthDate, range.to))
    );
  };

  const isMonthSelected = (monthDate: Date) => {
    if (currentMode === "single") {
      return isSameMonth(monthDate, date.from as Date);
    } else {
      const range = date as MonthRange;
      return (
        (range.from && isSameMonth(monthDate, range.from)) ||
        (range.to && isSameMonth(monthDate, range.to))
      );
    }
  };

  const canNavigatePrev = () => {
    if (currentMode === "range") {
      const range = date as MonthRange;
      if (!range.from) return false;
      const prevMonth = subMonths(range.from, 1);
      return !minDate || !isBefore(prevMonth, minDate);
    } else {
      const prevMonth = subMonths(date.from as Date, 1);
      return !minDate || !isBefore(prevMonth, minDate);
    }
  };

  const canNavigateNext = () => {
    if (currentMode === "range") {
      const range = date as MonthRange;
      if (!range.to) return false;
      const nextMonth = addMonths(range.to, 1);
      return !maxDate || !isAfter(nextMonth, maxDate);
    } else {
      const nextMonth = addMonths(date.to as Date, 1);
      return !maxDate || !isAfter(nextMonth, maxDate);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        disabled={!canNavigatePrev()}
        onClick={() => handleNavigateMonth("prev")}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[220px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {formatDateDisplay()}
            {isOpen && (
              <X
                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleYearChange(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">{year}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleYearChange(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => {
                const monthDate = new Date(year, index);
                const isSelected = isMonthSelected(monthDate);
                const inRange = isMonthInRange(monthDate);
                const isDisabled =
                  (minDate && monthDate < minDate) ||
                  (maxDate && monthDate > maxDate);

                return (
                  <Button
                    key={month}
                    variant={isSelected ? "default" : "ghost"}
                    className={cn(
                      "h-9",
                      isSelected && "bg-primary text-primary-foreground",
                      inRange && "bg-primary/10",
                      !isSelected && "hover:bg-muted",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isDisabled}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        disabled={!canNavigateNext()}
        onClick={() => handleNavigateMonth("next")}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </Button>
    </div>
  );
}
