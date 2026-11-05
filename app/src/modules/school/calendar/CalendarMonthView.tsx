import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  SchoolEvent,
  EVENT_CATEGORY_MAP,
} from '../../../types/calendar';
import {
  generateMonthGridCells,
  isDateInEventSpan,
} from '../../../utils/calendarValidation';

interface CalendarMonthViewProps {
  selectedYear: number;
  selectedMonth: number;
  events: SchoolEvent[];
  onSelectEvent: (eventId: string) => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  selectedYear,
  selectedMonth,
  events,
  onSelectEvent,
}) => {
  const weekdayFullLabels = [
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
    'Chủ nhật',
  ];

  const gridCells = generateMonthGridCells(selectedYear, selectedMonth);

  const getEventsForDate = (dateStr: string): SchoolEvent[] => {
    return events.filter((ev) => isDateInEventSpan(dateStr, ev));
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Weekday Header Row */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center">
          {weekdayFullLabels.map((weekday, idx) => (
            <div
              key={weekday}
              className={`py-3 text-xs font-bold uppercase tracking-wider ${
                idx >= 5 ? 'text-rose-500' : 'text-gray-700'
              }`}
            >
              {weekday}
            </div>
          ))}
        </div>

        {/* 7x5 or 7x6 Day Cells Matrix */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-gray-200">
          {gridCells.map((cell, idx) => {
            const dayEvents = getEventsForDate(cell.dateStr);
            const maxVisibleEvents = 3;
            const visibleEvents = dayEvents.slice(0, maxVisibleEvents);
            const overflowCount = dayEvents.length - maxVisibleEvents;

            return (
              <div
                key={`${cell.dateStr}-${idx}`}
                className={`min-h-[120px] p-2 flex flex-col justify-between transition ${
                  cell.isCurrentMonth
                    ? 'bg-white hover:bg-gray-50/50'
                    : 'bg-gray-50/70 text-gray-400'
                }`}
              >
                {/* Cell Header: Day number & today highlight */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                      cell.isToday
                        ? 'bg-[#0070CE] text-white shadow-sm'
                        : cell.isCurrentMonth
                        ? 'text-gray-800'
                        : 'text-gray-400'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-semibold text-gray-400">
                      {dayEvents.length} SK
                    </span>
                  )}
                </div>

                {/* Event Chips List */}
                <div className="space-y-1.5 flex-1">
                  {visibleEvents.map((ev) => {
                    const isStart = ev.startDate === cell.dateStr;
                    const isEnd = ev.endDate === cell.dateStr;
                    const isMultiDay = ev.startDate !== ev.endDate;

                    const catConfig = EVENT_CATEGORY_MAP[ev.category];

                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(ev.id);
                        }}
                        className={`w-full text-left px-2 py-1 rounded text-[11px] font-medium transition flex items-center gap-1.5 border truncate ${
                          catConfig.bgClass
                        } ${catConfig.textClass} ${catConfig.borderClass} hover:brightness-95 shadow-xs`}
                        title={`${ev.title} (${catConfig.label}) - ${
                          ev.hasSpecificTime ? `${ev.startTime} - ${ev.endTime}` : 'Cả ngày'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${catConfig.dotClass}`}
                        />
                        <span className="truncate flex-1 font-semibold">
                          {ev.title}
                        </span>
                        {ev.hasSpecificTime && ev.startTime && (
                          <span className="text-[10px] opacity-80 flex-shrink-0 flex items-center gap-0.5">
                            <FontAwesomeIcon icon={faClock} className="text-[8px]" />
                            {ev.startTime}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* Overflow badge if > 3 events */}
                  {overflowCount > 0 && (
                    <button
                      type="button"
                      onClick={() => onSelectEvent(dayEvents[maxVisibleEvents].id)}
                      className="w-full text-center text-[10px] font-bold text-gray-500 hover:text-[#0070CE] py-0.5 rounded bg-gray-100 hover:bg-gray-200 transition"
                    >
                      +{overflowCount} sự kiện khác
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
