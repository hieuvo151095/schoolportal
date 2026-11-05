/**
 * Business Logic & Date Calculation Utilities for School Event Calendar
 * Feature: 035-school-event-calendar
 */

import type {
  SchoolEvent,
  SchoolEventType,
  EventFormData,
  EventValidationError,
  EventScopeFilter,
} from '../types/calendar.ts';

/**
 * Validates the event authoring form payload (BR03, BR08, BR10)
 */
export function validateEventForm(formData: Partial<EventFormData>): EventValidationError[] {
  const errors: EventValidationError[] = [];

  if (!formData.title || formData.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Vui lòng nhập tiêu đề sự kiện' });
  } else if (formData.title.trim().length > 200) {
    errors.push({ field: 'title', message: 'Tiêu đề không được vượt quá 200 ký tự' });
  }

  const validCategories: SchoolEventType[] = ['ngay_nghi', 'noi_bo', 'moi_phu_huynh'];
  if (!formData.category || !validCategories.includes(formData.category)) {
    errors.push({ field: 'category', message: 'Vui lòng chọn loại sự kiện' });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!formData.startDate || !dateRegex.test(formData.startDate)) {
    errors.push({ field: 'startDate', message: 'Vui lòng chọn ngày bắt đầu hợp lệ' });
  }

  if (!formData.endDate || !dateRegex.test(formData.endDate)) {
    errors.push({ field: 'endDate', message: 'Vui lòng chọn ngày kết thúc hợp lệ' });
  }

  if (
    formData.startDate &&
    formData.endDate &&
    dateRegex.test(formData.startDate) &&
    dateRegex.test(formData.endDate)
  ) {
    if (formData.endDate < formData.startDate) {
      errors.push({ field: 'endDate', message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu' });
    }
  }

  if (formData.hasSpecificTime) {
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!formData.startTime || !timeRegex.test(formData.startTime)) {
      errors.push({ field: 'startTime', message: 'Vui lòng chọn giờ bắt đầu hợp lệ (HH:mm)' });
    }
    if (!formData.endTime || !timeRegex.test(formData.endTime)) {
      errors.push({ field: 'endTime', message: 'Vui lòng chọn giờ kết thúc hợp lệ (HH:mm)' });
    }
    if (
      formData.startTime &&
      formData.endTime &&
      timeRegex.test(formData.startTime) &&
      timeRegex.test(formData.endTime) &&
      formData.startDate === formData.endDate
    ) {
      if (formData.endTime <= formData.startTime) {
        errors.push({ field: 'endTime', message: 'Giờ kết thúc phải sau giờ bắt đầu' });
      }
    }
  }

  return errors;
}

/**
 * Returns number of days in month (1-12)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Returns first day of week for month (Monday = 1, ..., Sunday = 7)
 */
export function getFirstWeekdayOfMonth(year: number, month: number): number {
  const day = new Date(year, month - 1, 1).getDay();
  return day === 0 ? 7 : day;
}

/**
 * Formats ISO date (YYYY-MM-DD) to Vietnamese DD/MM/YYYY
 */
export function formatDisplayDate(isoDate: string): string {
  if (!isoDate || isoDate.length < 10) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Formats ISO date with Vietnamese weekday name
 */
export function formatDateWithWeekday(isoDate: string): string {
  if (!isoDate || isoDate.length < 10) return '';
  const date = new Date(isoDate + 'T00:00:00');
  const dayIndex = date.getDay();
  const weekdayNames = [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
  ];
  return `${weekdayNames[dayIndex]}, ${formatDisplayDate(isoDate)}`;
}

/**
 * Formats event time span for cards and modals
 */
export function formatEventTimeRange(
  event: Pick<SchoolEvent, 'startDate' | 'endDate' | 'hasSpecificTime' | 'startTime' | 'endTime'>
): string {
  const isSameDay = event.startDate === event.endDate;
  const startFmt = formatDisplayDate(event.startDate);
  const endFmt = formatDisplayDate(event.endDate);

  if (isSameDay) {
    if (event.hasSpecificTime && event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}, ${startFmt}`;
    }
    return startFmt;
  }

  if (event.hasSpecificTime && event.startTime && event.endTime) {
    return `${event.startTime} ${startFmt} - ${event.endTime} ${endFmt}`;
  }

  return `${startFmt} - ${endFmt}`;
}

/**
 * Formats ISO date (YYYY-MM-DD) to Vietnamese DD/MM (omits year)
 */
export function formatDisplayDateNoYear(isoDate: string): string {
  if (!isoDate || isoDate.length < 10) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}`;
}

/**
 * Formats event time span for cards and agenda list omitting the year
 */
export function formatEventTimeRangeNoYear(
  event: Pick<SchoolEvent, 'startDate' | 'endDate' | 'hasSpecificTime' | 'startTime' | 'endTime'>
): string {
  const isSameDay = event.startDate === event.endDate;
  const startFmt = formatDisplayDateNoYear(event.startDate);
  const endFmt = formatDisplayDateNoYear(event.endDate);

  if (isSameDay) {
    if (event.hasSpecificTime && event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}, ${startFmt}`;
    }
    return startFmt;
  }

  if (event.hasSpecificTime && event.startTime && event.endTime) {
    return `${event.startTime} ${startFmt} - ${event.endTime} ${endFmt}`;
  }

  return `${startFmt} - ${endFmt}`;
}

/**
 * Checks if a specific date (YYYY-MM-DD) falls within an event's active date span
 */
export function isDateInEventSpan(dateStr: string, event: SchoolEvent): boolean {
  return dateStr >= event.startDate && dateStr <= event.endDate;
}

/**
 * Calculates continuous day span duration
 */
export function calculateEventDurationDays(startDate: string, endDate: string): number {
  const start = new Date(startDate + 'T00:00:00').getTime();
  const end = new Date(endDate + 'T00:00:00').getTime();
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Filters events by year (any event overlapping the year)
 */
export function filterEventsByYear(events: SchoolEvent[], year: number): SchoolEvent[] {
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;
  return events.filter(
    (ev) => ev.startDate <= yearEnd && ev.endDate >= yearStart
  );
}

/**
 * Filters events by month (any event overlapping the month)
 */
export function filterEventsByMonth(
  events: SchoolEvent[],
  year: number,
  month: number
): SchoolEvent[] {
  const mStr = String(month).padStart(2, '0');
  const monthStart = `${year}-${mStr}-01`;
  const totalDays = getDaysInMonth(year, month);
  const monthEnd = `${year}-${mStr}-${String(totalDays).padStart(2, '0')}`;

  return events.filter(
    (ev) => ev.startDate <= monthEnd && ev.endDate >= monthStart
  );
}

/**
 * Filters agenda events by scope ('sap_toi' vs 'tat_ca') and sorts chronologically
 */
export function filterAgendaEvents(
  events: SchoolEvent[],
  year: number,
  scope: EventScopeFilter,
  todayIso: string = new Date().toISOString().split('T')[0]
): SchoolEvent[] {
  const yearEvents = filterEventsByYear(events, year);

  let filtered = yearEvents;
  if (scope === 'sap_toi') {
    filtered = yearEvents.filter((ev) => ev.endDate >= todayIso);
  }

  // Sort ascending by startDate, then startTime
  return filtered.sort((a, b) => {
    if (a.startDate !== b.startDate) {
      return a.startDate.localeCompare(b.startDate);
    }
    return (a.startTime || '00:00').localeCompare(b.startTime || '00:00');
  });
}

/**
 * Counts events grouped by category
 */
export function countEventsByCategory(
  events: SchoolEvent[]
): Record<SchoolEventType, number> {
  const counts: Record<SchoolEventType, number> = {
    ngay_nghi: 0,
    noi_bo: 0,
    moi_phu_huynh: 0,
  };

  events.forEach((ev) => {
    if (counts[ev.category] !== undefined) {
      counts[ev.category]++;
    }
  });

  return counts;
}

/**
 * Generates the full 42-cell (or 35-cell) day grid for a month (Monday-start)
 */
export interface CalendarCell {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  monthNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function generateMonthGridCells(
  year: number,
  month: number,
  todayIso: string = new Date().toISOString().split('T')[0]
): CalendarCell[] {
  const cells: CalendarCell[] = [];
  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekdayOfMonth(year, month); // 1 = Mon, ..., 7 = Sun

  // 1. Previous month trailing days
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const prevDaysCount = firstWeekday - 1; // Mon = 0 padding, Tue = 1 padding, etc.
  for (let i = prevDaysCount; i > 0; i--) {
    const day = daysInPrevMonth - i + 1;
    const mStr = String(prevMonth).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const dateStr = `${prevYear}-${mStr}-${dStr}`;
    cells.push({
      dateStr,
      dayNumber: day,
      monthNumber: prevMonth,
      isCurrentMonth: false,
      isToday: dateStr === todayIso,
    });
  }

  // 2. Current month days
  const currMStr = String(month).padStart(2, '0');
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const dStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${currMStr}-${dStr}`;
    cells.push({
      dateStr,
      dayNumber: day,
      monthNumber: month,
      isCurrentMonth: true,
      isToday: dateStr === todayIso,
    });
  }

  // 3. Next month leading days (fill up to full 35 or 42 grid cells)
  const targetTotal = cells.length > 35 ? 42 : 35;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const nextMStr = String(nextMonth).padStart(2, '0');

  let nextDay = 1;
  while (cells.length < targetTotal) {
    const dStr = String(nextDay).padStart(2, '0');
    const dateStr = `${nextYear}-${nextMStr}-${dStr}`;
    cells.push({
      dateStr,
      dayNumber: nextDay,
      monthNumber: nextMonth,
      isCurrentMonth: false,
      isToday: dateStr === todayIso,
    });
    nextDay++;
  }

  return cells;
}
