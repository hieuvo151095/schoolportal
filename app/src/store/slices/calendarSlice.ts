/**
 * Redux Toolkit State Machine for School Event Calendar (Nhà Trường — Lịch Sự Kiện)
 * Feature: 035-school-event-calendar
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  CalendarState,
  CalendarViewMode,
  EventScopeFilter,
  SchoolEvent,
} from '../../types/calendar.ts';
import { INITIAL_SCHOOL_EVENTS } from '../../services/mockCalendarData.ts';

const initialState: CalendarState = {
  events: INITIAL_SCHOOL_EVENTS,
  selectedYear: 2026,
  selectedMonth: 9, // September 2026
  activeViewMode: 'nam',
  eventScopeFilter: 'sap_toi',
  selectedEventId: null,
  isDetailModalOpen: false,
  isDeleteModalOpen: false,
  searchQuery: '',
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<CalendarViewMode>) => {
      state.activeViewMode = action.payload;
    },
    setYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
    setMonth: (state, action: PayloadAction<number>) => {
      state.selectedMonth = Math.min(12, Math.max(1, action.payload));
    },
    nextMonth: (state) => {
      if (state.selectedMonth === 12) {
        state.selectedMonth = 1;
        state.selectedYear += 1;
      } else {
        state.selectedMonth += 1;
      }
    },
    prevMonth: (state) => {
      if (state.selectedMonth === 1) {
        state.selectedMonth = 12;
        state.selectedYear -= 1;
      } else {
        state.selectedMonth -= 1;
      }
    },
    nextYear: (state) => {
      state.selectedYear += 1;
    },
    prevYear: (state) => {
      state.selectedYear -= 1;
    },
    setEventScopeFilter: (state, action: PayloadAction<EventScopeFilter>) => {
      state.eventScopeFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    openDetailModal: (state, action: PayloadAction<string>) => {
      state.selectedEventId = action.payload;
      state.isDetailModalOpen = true;
    },
    closeDetailModal: (state) => {
      state.isDetailModalOpen = false;
      state.selectedEventId = null;
    },
    openDeleteModal: (state, action: PayloadAction<string>) => {
      state.selectedEventId = action.payload;
      state.isDeleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.selectedEventId = null;
    },
    addEvent: (
      state,
      action: PayloadAction<Omit<SchoolEvent, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      const nowIso = new Date().toISOString();
      const newId = `EVT-${state.selectedYear}-${String(state.events.length + 1).padStart(3, '0')}`;
      const newEvent: SchoolEvent = {
        ...action.payload,
        id: newId,
        isAppliedForMealRefund:
          action.payload.category === 'ngay_nghi'
            ? (action.payload.isAppliedForMealRefund ?? true)
            : action.payload.isAppliedForMealRefund,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      state.events.push(newEvent);
    },
    updateEvent: (
      state,
      action: PayloadAction<Partial<SchoolEvent> & { id: string }>
    ) => {
      const index = state.events.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = {
          ...state.events[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((e) => e.id !== action.payload);
      if (state.selectedEventId === action.payload) {
        state.selectedEventId = null;
        state.isDetailModalOpen = false;
        state.isDeleteModalOpen = false;
      }
    },
    toggleEventMealRefund: (state, action: PayloadAction<string>) => {
      const index = state.events.findIndex((e) => e.id === action.payload);
      if (index !== -1) {
        const currentVal = state.events[index].isAppliedForMealRefund;
        state.events[index].isAppliedForMealRefund = currentVal === false ? true : false;
        state.events[index].updatedAt = new Date().toISOString();
      }
    },
    resetCalendarState: () => initialState,
  },
});

export const {
  setViewMode,
  setYear,
  setMonth,
  nextMonth,
  prevMonth,
  nextYear,
  prevYear,
  setEventScopeFilter,
  setSearchQuery,
  openDetailModal,
  closeDetailModal,
  openDeleteModal,
  closeDeleteModal,
  addEvent,
  updateEvent,
  deleteEvent,
  toggleEventMealRefund,
  resetCalendarState,
} = calendarSlice.actions;

export default calendarSlice.reducer;
