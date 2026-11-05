import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
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
  deleteEvent,
} from '../../../../store/slices/calendarSlice';
import { addToast } from '../../../../store/slices/toastSlice';
import { CalendarToolbar } from '../../../../modules/school/calendar/CalendarToolbar';
import { CalendarYearView } from '../../../../modules/school/calendar/CalendarYearView';
import { CalendarMonthView } from '../../../../modules/school/calendar/CalendarMonthView';
import { CalendarAgendaView } from '../../../../modules/school/calendar/CalendarAgendaView';
import { EventDetailModal } from '../../../../modules/school/calendar/EventDetailModal';
import { EventDeleteConfirmModal } from '../../../../modules/school/calendar/EventDeleteConfirmModal';
import {
  filterEventsByYear,
  filterEventsByMonth,
  filterAgendaEvents,
} from '../../../../utils/calendarValidation';

export default function SchoolCalendarPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const dispatch = useAppDispatch();
  const {
    events,
    selectedYear,
    selectedMonth,
    activeViewMode,
    eventScopeFilter,
    selectedEventId,
    isDetailModalOpen,
    isDeleteModalOpen,
    searchQuery,
  } = useAppSelector((state) => state.calendar);

  // Selected event for modal view / delete confirmation
  const selectedEvent = events.find((ev) => ev.id === selectedEventId) || null;

  // Filter events by search query if applicable
  const filteredEvents = searchQuery
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : events;

  // View-specific filtered event sets
  const yearEvents = filterEventsByYear(filteredEvents, selectedYear);
  const monthEvents = filterEventsByMonth(filteredEvents, selectedYear, selectedMonth);
  const agendaEvents = filterAgendaEvents(filteredEvents, selectedYear, eventScopeFilter);

  const handleSelectEvent = (eventId: string) => {
    dispatch(openDetailModal(eventId));
  };

  const handleDeleteTrigger = (eventId: string) => {
    dispatch(openDeleteModal(eventId));
  };

  const handleConfirmDelete = () => {
    if (selectedEvent) {
      const eventTitle = selectedEvent.title;
      dispatch(deleteEvent(selectedEvent.id));
      dispatch(
        addToast({
          type: 'success',
          message: `Đã xóa sự kiện "${eventTitle}" thành công.`,
        })
      );
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    dispatch(setYear(today.getFullYear()));
    dispatch(setMonth(today.getMonth() + 1));
  };

  return (
    <PortalLayout schoolCode={schoolCode} noPadding>
      <Head>
        <title>Lịch sự kiện nhà trường | School Operating Portal</title>
      </Head>

      <div className="flex flex-col h-full overflow-y-auto bg-[#F8FAFC]">
        {/* Top Control Toolbar */}
        <CalendarToolbar
          schoolCode={schoolCode}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          activeViewMode={activeViewMode}
          eventScopeFilter={eventScopeFilter}
          searchQuery={searchQuery}
          onYearChange={(yr) => dispatch(setYear(yr))}
          onMonthChange={(m) => dispatch(setMonth(m))}
          onNextMonth={() => dispatch(nextMonth())}
          onPrevMonth={() => dispatch(prevMonth())}
          onTodayClick={handleTodayClick}
          onViewModeChange={(mode) => dispatch(setViewMode(mode))}
          onScopeFilterChange={(scope) => dispatch(setEventScopeFilter(scope))}
          onSearchChange={(q) => dispatch(setSearchQuery(q))}
        />

        {/* Dynamic Calendar View Content */}
        <div className="flex-1">
          {activeViewMode === 'nam' && (
            <CalendarYearView
              selectedYear={selectedYear}
              events={yearEvents}
              onSelectEvent={handleSelectEvent}
              onMonthClick={(m) => {
                dispatch(setMonth(m));
                dispatch(setViewMode('thang'));
              }}
            />
          )}

          {activeViewMode === 'thang' && (
            <CalendarMonthView
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              events={monthEvents}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {activeViewMode === 'su_kien' && (
            <CalendarAgendaView
              schoolCode={schoolCode}
              events={agendaEvents}
              onSelectEvent={handleSelectEvent}
              onDeleteEvent={handleDeleteTrigger}
            />
          )}
        </div>
      </div>

      {/* Read-Only Inspection Modal */}
      <EventDetailModal
        schoolCode={schoolCode}
        isOpen={isDetailModalOpen}
        event={selectedEvent}
        onClose={() => dispatch(closeDetailModal())}
      />

      {/* Deletion Confirmation Modal (LS-01) */}
      <EventDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        event={selectedEvent}
        onConfirm={handleConfirmDelete}
        onCancel={() => dispatch(closeDeleteModal())}
      />
    </PortalLayout>
  );
}
