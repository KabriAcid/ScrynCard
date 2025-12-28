
'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Label } from '../label';

interface DobPickerProps {
  day: string | undefined;
  month: string | undefined;
  year: string | undefined;
  onDayChange: (day: string) => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  className?: string;
  required?: boolean;
}

const months = [
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

export function DobPicker({
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
  className,
  required,
}: DobPickerProps) {
  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
      String(startYear + i)
    ).reverse();
  }, []);

  const daysInMonth = React.useMemo(() => {
    if (month === undefined || year === undefined) return [];
    const numDays = new Date(Number(year), Number(month) + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => String(i + 1));
  }, [month, year]);

  React.useEffect(() => {
    // If the selected day is no longer valid for the new month/year, reset it.
    if (day && !daysInMonth.includes(day)) {
      onDayChange('');
    }
  }, [daysInMonth, day, onDayChange]);

  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="dob-day">Day</Label>
        <Select
          value={day}
          onValueChange={onDayChange}
          required={required}
          disabled={!month || !year}
        >
          <SelectTrigger id="dob-day">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {daysInMonth.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="dob-month">Month</Label>
        <Select value={month} onValueChange={onMonthChange} required={required}>
          <SelectTrigger id="dob-month">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={String(m.value)}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="dob-year">Year</Label>
        <Select value={year} onValueChange={onYearChange} required={required}>
          <SelectTrigger id="dob-year">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
