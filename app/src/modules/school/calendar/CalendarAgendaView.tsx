import React from 'react';
import Link from 'next/link';
import { Icon } from '../../../components/ds';
import {
  SchoolEvent,
  EVENT_CATEGORY_MAP,
} from '../../../types/calendar';
import {
  formatEventTimeRangeNoYear,
  formatDateWithWeekday,
} from '../../../utils/calendarValidation';

interface CalendarAgendaViewProps {
  schoolCode: string;
  events: SchoolEvent[];
  onSelectEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const CalendarAgendaView: React.FC<CalendarAgendaViewProps> = ({
  schoolCode,
  events,
  onSelectEvent,
  onDeleteEvent,
}) => {
  if (events.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="calendar-days" className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-gray-800 mb-1">
          Không tìm thấy sự kiện nào
        </h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          Chưa có sự kiện nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm. Bạn có thể thêm sự kiện mới cho nhà trường.
        </p>
        <Link
          href={`/${schoolCode}/school/calendar/create`}
          className="inline-flex items-center gap-2 bg-[#0070CE] hover:bg-[#005bb5] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <Icon name="calendar-days" className="w-4 h-4" />
          <span>Thêm sự kiện mới</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((ev) => {
        const catConfig = EVENT_CATEGORY_MAP[ev.category];
        const timeRangeStr = formatEventTimeRangeNoYear(ev);
        const weekdayStr = formatDateWithWeekday(ev.startDate);

        // Date parts for tear-off badge (simply date and month, no year)
        const dayNumber = ev.startDate.split('-')[2];
        const monthNumber = ev.startDate.split('-')[1];

        return (
          <div
            key={ev.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group"
          >
            {/* Left & Center: Date Badge + Details */}
            <div className="flex items-start gap-4 flex-1">
              {/* Tear-off Calendar Date Badge: Date & Month only, no year */}
              <div className="flex-shrink-0 w-16 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs text-center">
                <div className="bg-[#0070CE] text-white py-1 text-[11px] font-bold uppercase tracking-wider">
                  Tháng {parseInt(monthNumber, 10)}
                </div>
                <div className="py-2.5">
                  <span className="text-2xl font-black text-gray-900 block leading-none">
                    {dayNumber}
                  </span>
                </div>
              </div>

              {/* Event Content & Metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                  {/* Category Pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${catConfig.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${catConfig.dotClass}`} />
                    {catConfig.label}
                  </span>

                  {/* Time Range Badge */}
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                    <Icon name="clock" className="w-3 h-3 text-gray-400" />
                    {timeRangeStr}
                  </span>

                  {/* Location Badge */}
                  {ev.location && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md">
                      <Icon name="location-dot" className="w-3 h-3 text-gray-400" />
                      {ev.location}
                    </span>
                  )}
                </div>

                {/* Event Title - Click to open detail modal */}
                <button
                  type="button"
                  onClick={() => onSelectEvent(ev.id)}
                  className="text-left font-bold text-gray-900 text-base hover:text-[#0070CE] transition line-clamp-1 block"
                >
                  {ev.title}
                </button>

                {/* Description Snippet */}
                {ev.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                )}

                {/* Attachments indicator */}
                {ev.attachments && ev.attachments.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                    <Icon name="paperclip" className="w-3 h-3" />
                    <span>{ev.attachments.length} tệp đính kèm</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Inline Action Buttons (BR05) */}
            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              {/* Detail inspect button */}
              <button
                type="button"
                onClick={() => onSelectEvent(ev.id)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Chi tiết
              </button>

              {/* Direct Edit link */}
              <Link
                href={`/${schoolCode}/school/calendar/edit/${ev.id}`}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:text-[#0070CE] hover:border-[#0070CE] hover:bg-blue-50 transition flex items-center justify-center"
                title="Chỉnh sửa sự kiện"
              >
                <Icon name="pencil" className="w-3.5 h-3.5" />
              </Link>

              {/* Direct Delete button */}
              <button
                type="button"
                onClick={() => onDeleteEvent(ev.id)}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition flex items-center justify-center"
                title="Xóa sự kiện"
              >
                <Icon name="trash" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
