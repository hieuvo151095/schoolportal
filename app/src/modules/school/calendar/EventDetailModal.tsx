import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faPencilAlt,
  faPaperclip,
  faCalendarCheck,
  faFileDownload,
} from '@fortawesome/free-solid-svg-icons';
import {
  SchoolEvent,
  EVENT_CATEGORY_MAP,
} from '../../../types/calendar';
import {
  formatEventTimeRange,
  formatDateWithWeekday,
  calculateEventDurationDays,
} from '../../../utils/calendarValidation';

interface EventDetailModalProps {
  schoolCode: string;
  isOpen: boolean;
  event: SchoolEvent | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  schoolCode,
  isOpen,
  event,
  onClose,
}) => {
  if (!isOpen || !event) return null;

  const catConfig = EVENT_CATEGORY_MAP[event.category];
  const timeRangeStr = formatEventTimeRange(event);
  const durationDays = calculateEventDurationDays(event.startDate, event.endDate);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Cover Image banner if available */}
        {event.coverImage && (
          <div className="h-44 w-full relative overflow-hidden bg-gray-100">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {/* Category Pill */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${catConfig.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${catConfig.dotClass}`} />
                {catConfig.label}
              </span>

              {durationDays > 1 && (
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                  Kéo dài {durationDays} ngày
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-gray-900 leading-snug">
              {event.title}
            </h2>
          </div>

          {!event.coverImage && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-1"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Date & Time */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-2.5">
              <FontAwesomeIcon icon={faClock} className="text-[#0070CE] mt-0.5 text-sm" />
              <div>
                <span className="text-gray-400 font-semibold block text-[11px]">Thời gian</span>
                <span className="text-gray-800 font-bold block mt-0.5">{timeRangeStr}</span>
                <span className="text-gray-500 block text-[10px] mt-0.5">
                  {formatDateWithWeekday(event.startDate)}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-2.5">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber-500 mt-0.5 text-sm" />
              <div>
                <span className="text-gray-400 font-semibold block text-[11px]">Địa điểm</span>
                <span className="text-gray-800 font-bold block mt-0.5">
                  {event.location || 'Toàn trường'}
                </span>
              </div>
            </div>
          </div>

          {/* Holiday Meal Refund Alert Notice (Cross-module interoperability) */}
          {event.category === 'ngay_nghi' && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800">
              <FontAwesomeIcon icon={faCalendarCheck} className="text-rose-500 mt-0.5 text-sm" />
              <div>
                <span className="font-bold block">Chính sách hoàn tiền ăn ngày nghỉ:</span>
                <span className="mt-0.5 block leading-relaxed text-rose-700">
                  Sự kiện này được ghi nhận vào Lịch nghỉ lễ của nhà trường. Học sinh được tự động hoàn trả 100% tiền ăn bán trú và tiền ăn sáng trong các ngày nghỉ lễ này khi lập hóa đơn học phí.
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Nội dung chi tiết
            </h4>
            <div className="text-xs text-gray-700 leading-relaxed bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 whitespace-pre-line">
              {event.description || 'Chưa có nội dung mô tả chi tiết cho sự kiện này.'}
            </div>
          </div>

          {/* Attachments */}
          {event.attachments && event.attachments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Tệp đính kèm ({event.attachments.length})
              </h4>
              <div className="space-y-2">
                {event.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FontAwesomeIcon icon={faPaperclip} className="text-gray-400" />
                      <span className="font-medium text-gray-800 truncate">{file}</span>
                    </div>
                    <button
                      type="button"
                      className="text-[#0070CE] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <FontAwesomeIcon icon={faFileDownload} />
                      Tải về
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-white transition"
          >
            Đóng
          </button>
          <Link
            href={`/${schoolCode}/school/calendar/edit/${event.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0070CE] hover:bg-[#005bb5] text-white rounded-lg text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <FontAwesomeIcon icon={faPencilAlt} />
            <span>Chỉnh sửa</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
