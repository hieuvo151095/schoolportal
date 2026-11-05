/**
 * TypeScript Data Contracts for School Event Calendar (Nhà Trường — Lịch Sự Kiện)
 * Feature: 035-school-event-calendar
 * Reference: docs_legacy/operating-portal/M5-nha-truong/lich-su-kien.md
 */

export type SchoolEventType = 'ngay_nghi' | 'noi_bo' | 'moi_phu_huynh';

export type CalendarViewMode = 'nam' | 'thang' | 'su_kien';

export type EventScopeFilter = 'sap_toi' | 'tat_ca';

export interface SchoolEvent {
  id: string;
  schoolCode: string;
  title: string;
  category: SchoolEventType;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD (equal to startDate for 1-day events)
  hasSpecificTime: boolean;
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  location?: string;
  description?: string;
  coverImage?: string;
  attachments?: string[];
  isAppliedForMealRefund?: boolean; // Controls whether this holiday is deducted for meal refund in fee settings
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  category: SchoolEventType;
  startDate: string;
  endDate: string;
  hasSpecificTime: boolean;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  coverImage?: string;
  attachments?: string[];
}

export interface EventValidationError {
  field: keyof EventFormData | 'general';
  message: string;
}

export interface DayCellEventInfo {
  event: SchoolEvent;
  isStart: boolean;
  isEnd: boolean;
  isContinuous: boolean;
  spanDays?: number;
}

export interface CalendarState {
  events: SchoolEvent[];
  selectedYear: number;
  selectedMonth: number; // 1-12
  activeViewMode: CalendarViewMode;
  eventScopeFilter: EventScopeFilter;
  selectedEventId: string | null;
  isDetailModalOpen: boolean;
  isDeleteModalOpen: boolean;
  searchQuery: string;
}

export interface EventCategoryConfig {
  key: SchoolEventType;
  label: string;
  colorHex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotClass: string;
  badgeClass: string;
}

export const EVENT_CATEGORY_MAP: Record<SchoolEventType, EventCategoryConfig> = {
  ngay_nghi: {
    key: 'ngay_nghi',
    label: 'Ngày nghỉ',
    colorHex: '#E11D48',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-200',
    dotClass: 'bg-rose-500',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  noi_bo: {
    key: 'noi_bo',
    label: 'Sự kiện nội bộ',
    colorHex: '#0D9488',
    bgClass: 'bg-teal-50',
    textClass: 'text-teal-700',
    borderClass: 'border-teal-200',
    dotClass: 'bg-teal-500',
    badgeClass: 'bg-teal-100 text-teal-700 border-teal-200',
  },
  moi_phu_huynh: {
    key: 'moi_phu_huynh',
    label: 'Sự kiện có mời phụ huynh',
    colorHex: '#EA580C',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200',
    dotClass: 'bg-amber-500',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
};
