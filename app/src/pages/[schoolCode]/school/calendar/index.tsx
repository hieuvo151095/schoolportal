import React, { useState, useEffect } from 'react';
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
  addEvent,
  updateEvent,
} from '../../../../store/slices/calendarSlice';
import { addToast } from '../../../../store/slices/toastSlice';
import { CalendarToolbar } from '../../../../modules/school/calendar/CalendarToolbar';
import { CalendarYearView } from '../../../../modules/school/calendar/CalendarYearView';
import { CalendarMonthView } from '../../../../modules/school/calendar/CalendarMonthView';
import { CalendarAgendaView } from '../../../../modules/school/calendar/CalendarAgendaView';
import { EventDetailModal } from '../../../../modules/school/calendar/EventDetailModal';
import { EventDeleteConfirmModal } from '../../../../modules/school/calendar/EventDeleteConfirmModal';
import { CreateEventSlideOver } from '../../../../modules/school/calendar/CreateEventSlideOver';
import { EventFormData, SchoolEvent } from '../../../../types/calendar';
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

  const [isCreateSlideOverOpen, setIsCreateSlideOverOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);

  useEffect(() => {
    if (router.query.create === 'true') {
      setEditingEvent(null);
      setIsCreateSlideOverOpen(true);
    } else if (router.query.edit && typeof router.query.edit === 'string') {
      const target = events.find((e) => e.id === router.query.edit);
      if (target) {
        setEditingEvent(target);
        setIsCreateSlideOverOpen(true);
      }
    }
  }, [router.query.create, router.query.edit, events]);

  const handleSubmitEvent = (formData: EventFormData) => {
    if (editingEvent) {
      dispatch(
        updateEvent({
          id: editingEvent.id,
          title: formData.title,
          category: formData.category,
          startDate: formData.startDate,
          endDate: formData.endDate,
          hasSpecificTime: formData.hasSpecificTime,
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location,
          description: formData.description,
          coverImage: formData.coverImage,
          attachments: formData.attachments,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          message: `Đã cập nhật sự kiện "${formData.title}" thành công.`,
        })
      );
    } else {
      dispatch(
        addEvent({
          schoolCode,
          title: formData.title,
          category: formData.category,
          startDate: formData.startDate,
          endDate: formData.endDate,
          hasSpecificTime: formData.hasSpecificTime,
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location,
          description: formData.description,
          coverImage: formData.coverImage,
          attachments: formData.attachments,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          message: `Đã thêm sự kiện "${formData.title}" vào lịch thành công!`,
        })
      );
    }
  };

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
          onOpenCreate={() => {
            setEditingEvent(null);
            setIsCreateSlideOverOpen(true);
          }}
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

      {/* Create / Edit Event SlideOver (Right-Sheet Standard) */}
      <CreateEventSlideOver
        isOpen={isCreateSlideOverOpen}
        onClose={() => {
          setIsCreateSlideOverOpen(false);
          setEditingEvent(null);
          if (router.query.create || router.query.edit) {
            router.replace(`/${schoolCode}/school/calendar`, undefined, { shallow: true });
          }
        }}
        schoolCode={schoolCode}
        initialData={editingEvent || undefined}
        isEdit={!!editingEvent}
        onSubmit={handleSubmitEvent}
      />
    </PortalLayout>
  );
}
