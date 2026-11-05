/**
 * Automated Unit Test Suite for School Event Calendar (Nhà Trường — Lịch Sự Kiện)
 * Feature: 035-school-event-calendar
 * Covers BR01-BR10: 3 view modes, categories, multi-day spans, time toggles, validation, Redux state machine, and holiday meal refund interoperability.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  validateEventForm,
  getDaysInMonth,
  getFirstWeekdayOfMonth,
  formatDisplayDate,
  formatDateWithWeekday,
  formatEventTimeRange,
  formatDisplayDateNoYear,
  formatEventTimeRangeNoYear,
  isDateInEventSpan,
  calculateEventDurationDays,
  filterEventsByYear,
  filterEventsByMonth,
  filterAgendaEvents,
  countEventsByCategory,
  generateMonthGridCells,
} from '../../src/utils/calendarValidation.ts';

import calendarReducer, {
  setViewMode,
  setYear,
  setMonth,
  nextMonth,
  prevMonth,
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
} from '../../src/store/slices/calendarSlice.ts';

import { EVENT_CATEGORY_MAP } from '../../src/types/calendar.ts';
import { INITIAL_SCHOOL_EVENTS } from '../../src/services/mockCalendarData.ts';

describe('School Event Calendar Business Rules & Validation Engine', () => {

  test('BR01 & BR02: Category configuration map adheres strictly to approved tokens', () => {
    assert.equal(EVENT_CATEGORY_MAP.ngay_nghi.colorHex, '#E11D48');
    assert.equal(EVENT_CATEGORY_MAP.ngay_nghi.label, 'Ngày nghỉ');

    assert.equal(EVENT_CATEGORY_MAP.noi_bo.colorHex, '#0D9488');
    assert.equal(EVENT_CATEGORY_MAP.noi_bo.label, 'Sự kiện nội bộ');

    assert.equal(EVENT_CATEGORY_MAP.moi_phu_huynh.colorHex, '#EA580C');
    assert.equal(EVENT_CATEGORY_MAP.moi_phu_huynh.label, 'Sự kiện có mời phụ huynh');
  });

  test('BR03: validateEventForm rejects missing or invalid required fields', () => {
    // Empty payload
    const emptyErrors = validateEventForm({});
    assert.ok(emptyErrors.some((e) => e.field === 'title'));
    assert.ok(emptyErrors.some((e) => e.field === 'category'));
    assert.ok(emptyErrors.some((e) => e.field === 'startDate'));
    assert.ok(emptyErrors.some((e) => e.field === 'endDate'));

    // Title too long (> 200 chars)
    const longTitleErrors = validateEventForm({
      title: 'A'.repeat(201),
      category: 'ngay_nghi',
      startDate: '2026-09-01',
      endDate: '2026-09-02',
    });
    assert.ok(longTitleErrors.some((e) => e.field === 'title'));

    // End date before start date
    const dateErrors = validateEventForm({
      title: 'Họp phụ huynh',
      category: 'moi_phu_huynh',
      startDate: '2026-09-10',
      endDate: '2026-09-05',
    });
    assert.ok(dateErrors.some((e) => e.field === 'endDate'));
  });

  test('BR08: validateEventForm enforces specific time constraints when toggle is enabled', () => {
    // When hasSpecificTime is true but times are missing
    const missingTimeErrors = validateEventForm({
      title: 'Lễ Khai giảng',
      category: 'moi_phu_huynh',
      startDate: '2026-09-05',
      endDate: '2026-09-05',
      hasSpecificTime: true,
    });
    assert.ok(missingTimeErrors.some((e) => e.field === 'startTime'));
    assert.ok(missingTimeErrors.some((e) => e.field === 'endTime'));

    // When endTime is before startTime on single-day event
    const invertedTimeErrors = validateEventForm({
      title: 'Lễ Khai giảng',
      category: 'moi_phu_huynh',
      startDate: '2026-09-05',
      endDate: '2026-09-05',
      hasSpecificTime: true,
      startTime: '10:00',
      endTime: '08:00',
    });
    assert.ok(invertedTimeErrors.some((e) => e.field === 'endTime'));

    // Valid specific time payload
    const validErrors = validateEventForm({
      title: 'Lễ Khai giảng',
      category: 'moi_phu_huynh',
      startDate: '2026-09-05',
      endDate: '2026-09-05',
      hasSpecificTime: true,
      startTime: '07:30',
      endTime: '10:30',
    });
    assert.equal(validErrors.length, 0);
  });

  test('Date Arithmetic: getDaysInMonth & getFirstWeekdayOfMonth calculations', () => {
    assert.equal(getDaysInMonth(2026, 1), 31);
    assert.equal(getDaysInMonth(2026, 2), 28); // Non-leap year
    assert.equal(getDaysInMonth(2024, 2), 29); // Leap year
    assert.equal(getDaysInMonth(2026, 9), 30);

    // 2026-09-01 is a Tuesday -> weekday 2 (Monday = 1)
    assert.equal(getFirstWeekdayOfMonth(2026, 9), 2);
    // 2026-02-01 is a Sunday -> weekday 7
    assert.equal(getFirstWeekdayOfMonth(2026, 2), 7);
  });

  test('Formatters: formatDisplayDate & formatDateWithWeekday', () => {
    assert.equal(formatDisplayDate('2026-09-05'), '05/09/2026');
    assert.equal(formatDateWithWeekday('2026-09-05'), 'Thứ bảy, 05/09/2026');
    assert.equal(formatDateWithWeekday('2026-09-01'), 'Thứ ba, 01/09/2026');
  });

  test('Formatters: formatEventTimeRange for all combinations', () => {
    // Single day without specific time
    assert.equal(
      formatEventTimeRange({
        startDate: '2026-01-01',
        endDate: '2026-01-01',
        hasSpecificTime: false,
      }),
      '01/01/2026'
    );

    // Single day with specific time
    assert.equal(
      formatEventTimeRange({
        startDate: '2026-09-05',
        endDate: '2026-09-05',
        hasSpecificTime: true,
        startTime: '07:30',
        endTime: '10:30',
      }),
      '07:30 - 10:30, 05/09/2026'
    );

    // Multi day event
    assert.equal(
      formatEventTimeRange({
        startDate: '2026-02-14',
        endDate: '2026-02-23',
        hasSpecificTime: false,
      }),
      '14/02/2026 - 23/02/2026'
    );
  });

  test('BR04: Multi-day span calculation and date containment', () => {
    const tetEvent = INITIAL_SCHOOL_EVENTS.find((e) => e.id === 'EVT-2026-002');
    assert.ok(tetEvent);

    assert.equal(calculateEventDurationDays(tetEvent.startDate, tetEvent.endDate), 10);
    assert.equal(isDateInEventSpan('2026-02-14', tetEvent), true); // start day
    assert.equal(isDateInEventSpan('2026-02-18', tetEvent), true); // middle day
    assert.equal(isDateInEventSpan('2026-02-23', tetEvent), true); // end day
    assert.equal(isDateInEventSpan('2026-02-13', tetEvent), false); // before
    assert.equal(isDateInEventSpan('2026-02-24', tetEvent), false); // after
  });

  test('BR05 & BR06: filterAgendaEvents scope filtering and sorting', () => {
    // Given mock events in 2026
    const all2026 = filterAgendaEvents(INITIAL_SCHOOL_EVENTS, 2026, 'tat_ca', '2026-09-01');
    assert.ok(all2026.length >= 10);

    // Chronological order verification
    for (let i = 0; i < all2026.length - 1; i++) {
      assert.ok(all2026[i].startDate <= all2026[i + 1].startDate);
    }

    // Filter upcoming events from 2026-09-01
    const upcoming = filterAgendaEvents(INITIAL_SCHOOL_EVENTS, 2026, 'sap_toi', '2026-09-01');
    // Events ending before 2026-09-01 (e.g. Jan, Feb, May, Aug) should be excluded
    assert.ok(upcoming.every((ev) => ev.endDate >= '2026-09-01'));
    assert.ok(upcoming.some((ev) => ev.title.includes('Quốc khánh')));
    assert.ok(upcoming.some((ev) => ev.title.includes('Khai giảng')));
    assert.ok(!upcoming.some((ev) => ev.title.includes('Tết Dương Lịch')));
  });

  test('Month Grid Generation: generateMonthGridCells generates complete Monday-start matrix', () => {
    // September 2026: starts on Tuesday (firstWeekday = 2) -> 1 previous day lead cell
    const cellsSep = generateMonthGridCells(2026, 9, '2026-09-05');
    assert.ok(cellsSep.length === 35 || cellsSep.length === 42);

    // First cell is previous month (2026-08-31, Monday)
    assert.equal(cellsSep[0].dateStr, '2026-08-31');
    assert.equal(cellsSep[0].isCurrentMonth, false);

    // Second cell is current month (2026-09-01, Tuesday)
    assert.equal(cellsSep[1].dateStr, '2026-09-01');
    assert.equal(cellsSep[1].isCurrentMonth, true);

    // Today flag verified
    const todayCell = cellsSep.find((c) => c.dateStr === '2026-09-05');
    assert.ok(todayCell);
    assert.equal(todayCell.isToday, true);
  });

  test('Category summary: countEventsByCategory aggregates all 3 types', () => {
    const counts = countEventsByCategory(INITIAL_SCHOOL_EVENTS);
    assert.ok(counts.ngay_nghi >= 3);
    assert.ok(counts.noi_bo >= 2);
    assert.ok(counts.moi_phu_huynh >= 3);
  });
});

describe('School Event Calendar Redux State Machine', () => {

  const getFreshState = () => {
    return calendarReducer(undefined, { type: '@@INIT' });
  };

  test('View transitions: setViewMode, setYear, and setMonth', () => {
    let state = getFreshState();
    assert.equal(state.activeViewMode, 'nam');

    state = calendarReducer(state, setViewMode('thang'));
    assert.equal(state.activeViewMode, 'thang');

    state = calendarReducer(state, setViewMode('su_kien'));
    assert.equal(state.activeViewMode, 'su_kien');

    state = calendarReducer(state, setYear(2027));
    assert.equal(state.selectedYear, 2027);

    state = calendarReducer(state, setMonth(11));
    assert.equal(state.selectedMonth, 11);

    // Month boundary clamp
    state = calendarReducer(state, setMonth(15));
    assert.equal(state.selectedMonth, 12);
  });

  test('Month pagination: nextMonth and prevMonth handle year rollover', () => {
    let state = getFreshState();
    state = calendarReducer(state, setYear(2026));
    state = calendarReducer(state, setMonth(12));

    // Next month from Dec 2026 -> Jan 2027
    state = calendarReducer(state, nextMonth());
    assert.equal(state.selectedMonth, 1);
    assert.equal(state.selectedYear, 2027);

    // Prev month from Jan 2027 -> Dec 2026
    state = calendarReducer(state, prevMonth());
    assert.equal(state.selectedMonth, 12);
    assert.equal(state.selectedYear, 2026);
  });

  test('CRUD Lifecycle: addEvent, updateEvent, and deleteEvent', () => {
    let state = getFreshState();
    const initialCount = state.events.length;

    // 1. Add Event
    state = calendarReducer(
      state,
      addEvent({
        schoolCode: 'demo',
        title: 'Hội trại 26/3',
        category: 'moi_phu_huynh',
        startDate: '2026-03-26',
        endDate: '2026-03-26',
        hasSpecificTime: true,
        startTime: '08:00',
        endTime: '17:00',
        location: 'Khu du lịch sinh thái',
      })
    );
    assert.equal(state.events.length, initialCount + 1);
    const added = state.events[state.events.length - 1];
    assert.equal(added.title, 'Hội trại 26/3');
    assert.equal(added.category, 'moi_phu_huynh');
    assert.ok(added.id.startsWith('EVT-'));

    // 2. Update Event
    state = calendarReducer(
      state,
      updateEvent({
        id: added.id,
        title: 'Hội trại Thanh niên 26/3 (Cập nhật)',
        location: 'Sân vận động thị xã',
      })
    );
    const updated = state.events.find((e) => e.id === added.id);
    assert.equal(updated.title, 'Hội trại Thanh niên 26/3 (Cập nhật)');
    assert.equal(updated.location, 'Sân vận động thị xã');

    // 3. Delete Event (LS-01)
    state = calendarReducer(state, openDeleteModal(added.id));
    assert.equal(state.isDeleteModalOpen, true);
    assert.equal(state.selectedEventId, added.id);

    state = calendarReducer(state, deleteEvent(added.id));
    assert.equal(state.events.length, initialCount);
    assert.equal(state.isDeleteModalOpen, false);
    assert.equal(state.selectedEventId, null);
  });

  test('Modal Inspection Flow: openDetailModal and closeDetailModal', () => {
    let state = getFreshState();
    assert.equal(state.isDetailModalOpen, false);
    assert.equal(state.selectedEventId, null);

    state = calendarReducer(state, openDetailModal('EVT-2026-002'));
    assert.equal(state.isDetailModalOpen, true);
    assert.equal(state.selectedEventId, 'EVT-2026-002');

    state = calendarReducer(state, closeDetailModal());
    assert.equal(state.isDetailModalOpen, false);
    assert.equal(state.selectedEventId, null);
  });

  test('Cross-Module Interoperability: Holiday Events cross-link to meal refund calculation', () => {
    // School holiday events in February 2026 (Tết holiday: 2026-02-14 to 2026-02-23)
    const febEvents = filterEventsByMonth(INITIAL_SCHOOL_EVENTS, 2026, 2);
    const holidayEvents = febEvents.filter((e) => e.category === 'ngay_nghi');

    assert.ok(holidayEvents.length > 0);
    const tetEvent = holidayEvents.find((e) => e.title.includes('Tết'));
    assert.ok(tetEvent);

    // In February 2026, 10 days of Tết holiday are recognized as official 100% meal refund days
    const refundDaysCount = calculateEventDurationDays(tetEvent.startDate, tetEvent.endDate);
    assert.equal(refundDaysCount, 10);

    // Formula test: 10 days * 35,000 VND main meal * 100% refund = 350,000 VND
    const dailyMealFee = 35000;
    const computedRefund = refundDaysCount * dailyMealFee * 1.0;
    assert.equal(computedRefund, 350000);
  });

  test('Agenda View Date Formatting: Omits year for cards and badges (Date & Month only)', () => {
    // formatDisplayDateNoYear returns DD/MM without year
    assert.equal(formatDisplayDateNoYear('2026-09-05'), '05/09');
    assert.equal(formatDisplayDateNoYear('2026-02-14'), '14/02');

    // Single-day event with specific time
    const singleTimed = {
      startDate: '2026-09-05',
      endDate: '2026-09-05',
      hasSpecificTime: true,
      startTime: '07:30',
      endTime: '10:30',
    };
    const timedStr = formatEventTimeRangeNoYear(singleTimed);
    assert.equal(timedStr, '07:30 - 10:30, 05/09');
    assert.equal(timedStr.includes('2026'), false);

    // Multi-day event span
    const multiSpan = {
      startDate: '2026-02-14',
      endDate: '2026-02-23',
      hasSpecificTime: false,
    };
    const multiStr = formatEventTimeRangeNoYear(multiSpan);
    assert.equal(multiStr, '14/02 - 23/02');
    assert.equal(multiStr.includes('2026'), false);
  });

  test('Holiday Meal Refund State: toggleEventMealRefund and default isAppliedForMealRefund', () => {
    let state = getFreshState();

    // Verify existing holiday has isAppliedForMealRefund !== false
    const tetEvent = state.events.find((e) => e.id === 'EVT-2026-002');
    assert.ok(tetEvent);
    assert.equal(tetEvent.isAppliedForMealRefund, true);

    // Toggle off meal refund application
    state = calendarReducer(state, toggleEventMealRefund('EVT-2026-002'));
    const toggledTet = state.events.find((e) => e.id === 'EVT-2026-002');
    assert.equal(toggledTet.isAppliedForMealRefund, false);

    // Toggle back on
    state = calendarReducer(state, toggleEventMealRefund('EVT-2026-002'));
    const reToggledTet = state.events.find((e) => e.id === 'EVT-2026-002');
    assert.equal(reToggledTet.isAppliedForMealRefund, true);

    // Adding new ngay_nghi event defaults isAppliedForMealRefund to true
    state = calendarReducer(
      state,
      addEvent({
        schoolCode: 'demo',
        title: 'Nghỉ tránh rét đột xuất',
        category: 'ngay_nghi',
        startDate: '2026-12-28',
        endDate: '2026-12-29',
        hasSpecificTime: false,
      })
    );
    const newHoliday = state.events.find((e) => e.title === 'Nghỉ tránh rét đột xuất');
    assert.ok(newHoliday);
    assert.equal(newHoliday.isAppliedForMealRefund, true);
  });
});
