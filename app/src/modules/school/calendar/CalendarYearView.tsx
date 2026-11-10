import React from 'react';
import { Icon } from '../../../components/ds';
import {
  SchoolEvent,
  EVENT_CATEGORY_MAP,
  SchoolEventType,
} from '../../../types/calendar';
import {
  getDaysInMonth,
  getFirstWeekdayOfMonth,
  countEventsByCategory,
  isDateInEventSpan,
} from '../../../utils/calendarValidation';

interface CalendarYearViewProps {
  selectedYear: number;
  events: SchoolEvent[];
  onSelectEvent: (eventId: string) => void;
  onMonthClick: (month: number) => void;
}

export const CalendarYearView: React.FC<CalendarYearViewProps> = ({
  selectedYear,
  events,
  onSelectEvent,
  onMonthClick,
}) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const weekdayShortLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const todayIso = new Date().toISOString().split('T')[0];

  const categoryCounts = countEventsByCategory(events);

  const getEventsForDay = (dateStr: string): SchoolEvent[] => {
    return events.filter((ev) => isDateInEventSpan(dateStr, ev));
  };

  return (
    <div className="p-6 space-y-6">
      {/* 12-Month Miniature Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((month) => {
          const daysInMonth = getDaysInMonth(selectedYear, month);
          const firstWeekday = getFirstWeekdayOfMonth(selectedYear, month); // 1 = Mon, ..., 7 = Sun
          const emptyLeadDays = firstWeekday - 1;

          const monthName = `Tháng ${month}`;

          return (
            <div
              key={month}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition flex flex-col"
            >
              {/* Mini Month Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => onMonthClick(month)}
                  className="font-bold text-gray-900 hover:text-[#0070CE] transition text-sm flex items-center gap-1.5"
                  title="Nhấp để xem chi tiết tháng này"
                >
                  <span>{monthName}</span>
                  <span className="text-xs text-gray-400 font-normal">
                    ({selectedYear})
                  </span>
                </button>
                <span className="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                  {daysInMonth} ngày
                </span>
              </div>

              {/* Weekday Short Headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-semibold text-gray-400">
                {weekdayShortLabels.map((lbl, idx) => (
                  <div
                    key={lbl}
                    className={idx >= 5 ? 'text-rose-400' : 'text-gray-400'}
                  >
                    {lbl}
                  </div>
                ))}
              </div>

              {/* Day Cells Matrix */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Empty lead cells */}
                {Array.from({ length: emptyLeadDays }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-7 w-7" />
                ))}

                {/* Days of current month */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const mStr = String(month).padStart(2, '0');
                  const dStr = String(day).padStart(2, '0');
                  const dateStr = `${selectedYear}-${mStr}-${dStr}`;
                  const dayEvents = getEventsForDay(dateStr);
                  const hasEvents = dayEvents.length > 0;
                  const isToday = dateStr === todayIso;

                  // Determine dominant category for day styling
                  let dominantCat: SchoolEventType | null = null;
                  if (hasEvents) {
                    if (dayEvents.some((e) => e.category === 'ngay_nghi')) {
                      dominantCat = 'ngay_nghi';
                    } else if (dayEvents.some((e) => e.category === 'moi_phu_huynh')) {
                      dominantCat = 'moi_phu_huynh';
                    } else {
                      dominantCat = 'noi_bo';
                    }
                  }

                  let cellBgClass = 'text-gray-700 hover:bg-gray-100';
                  if (hasEvents && dominantCat) {
                    if (dominantCat === 'ngay_nghi') {
                      cellBgClass = 'bg-rose-100 text-rose-800 font-bold hover:bg-rose-200';
                    } else if (dominantCat === 'moi_phu_huynh') {
                      cellBgClass = 'bg-amber-100 text-amber-800 font-bold hover:bg-amber-200';
                    } else {
                      cellBgClass = 'bg-teal-100 text-teal-800 font-bold hover:bg-teal-200';
                    }
                  } else if (isToday) {
                    cellBgClass = 'border border-[#0070CE] font-bold text-[#0070CE] bg-blue-50';
                  }

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        if (hasEvents) {
                          onSelectEvent(dayEvents[0].id);
                        }
                      }}
                      disabled={!hasEvents}
                      className={`h-7 w-7 mx-auto rounded-md flex flex-col items-center justify-center transition relative ${cellBgClass} ${
                        hasEvents ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      title={
                        hasEvents
                          ? dayEvents.map((e) => `${e.title} (${EVENT_CATEGORY_MAP[e.category].label})`).join('\n')
                          : undefined
                      }
                    >
                      <span className="leading-none text-[11px]">{day}</span>
                      {hasEvents && dayEvents.length > 1 && (
                        <div className="absolute bottom-0.5 flex gap-0.5">
                          {dayEvents.slice(0, 3).map((e, idx) => (
                            <span
                              key={idx}
                              className={`w-1 h-1 rounded-full ${EVENT_CATEGORY_MAP[e.category].dotClass}`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Color Legend Bar ("Chú thích") per BR02 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Icon name="circle-info" className="w-4 h-4 text-[#0070CE]" />
          <span className="text-sm font-bold text-gray-900">Chú thích phân loại sự kiện:</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Ngày nghỉ */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
            <span className="text-xs font-semibold text-rose-800">
              {EVENT_CATEGORY_MAP.ngay_nghi.label}
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded-full">
              {categoryCounts.ngay_nghi}
            </span>
          </div>

          {/* Sự kiện nội bộ */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200">
            <span className="w-3 h-3 rounded-full bg-teal-500 shadow-sm" />
            <span className="text-xs font-semibold text-teal-800">
              {EVENT_CATEGORY_MAP.noi_bo.label}
            </span>
            <span className="text-xs font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded-full">
              {categoryCounts.noi_bo}
            </span>
          </div>

          {/* Sự kiện có mời phụ huynh */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
            <span className="text-xs font-semibold text-amber-900">
              {EVENT_CATEGORY_MAP.moi_phu_huynh.label}
            </span>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full">
              {categoryCounts.moi_phu_huynh}
            </span>
          </div>
        </div>

        {/* Holiday meal refund interoperability note */}
        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          <Icon name="calendar-check" className="w-4 h-4 text-rose-500" />
          <span>Sự kiện Ngày nghỉ tự động khấu trừ hoàn 100% tiền ăn học sinh.</span>
        </div>
      </div>
    </div>
  );
};
