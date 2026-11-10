import React from 'react';
import { useRouter } from 'next/router';
import { Icon, SlideOver } from '../../../components/ds';
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
  const router = useRouter();
  if (!isOpen || !event) return null;

  const catConfig = EVENT_CATEGORY_MAP[event.category];
  const timeRangeStr = formatEventTimeRange(event);
  const durationDays = calculateEventDurationDays(event.startDate, event.endDate);

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={event.title}
      description={`${catConfig.label} • ${timeRangeStr}`}
      icon="calendar-days"
      width={560}
      primaryAction={{
        label: 'Chỉnh sửa sự kiện',
        icon: 'pencil',
        onClick: () => {
          onClose();
          router.push(`/${schoolCode}/school/calendar/edit/${event.id}`);
        },
      }}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-5">
        {/* Cover Image banner if available */}
        {event.coverImage && (
          <div className="h-44 w-full relative overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Category Pill */}
        <div className="flex items-center gap-2 flex-wrap">
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

        {/* Metadata Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Date & Time */}
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex items-start gap-2.5">
            <Icon name="clock" className="w-4 h-4 text-[#0070CE] mt-0.5 shrink-0" />
            <div>
              <span className="text-gray-400 font-semibold block text-[11px]">Thời gian</span>
              <span className="text-gray-800 font-bold block mt-0.5">{timeRangeStr}</span>
              <span className="text-gray-500 block text-[10px] mt-0.5">
                {formatDateWithWeekday(event.startDate)}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex items-start gap-2.5">
            <Icon name="location-dot" className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-gray-400 font-semibold block text-[11px]">Địa điểm</span>
              <span className="text-gray-800 font-bold block mt-0.5">
                {event.location || 'Toàn trường'}
              </span>
            </div>
          </div>
        </div>

        {/* Holiday Meal Refund Alert Notice */}
        {event.category === 'ngay_nghi' && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800">
            <Icon name="calendar-check" className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
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
                    <Icon name="paperclip" className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium text-gray-800 truncate">{file}</span>
                  </div>
                  <button
                    type="button"
                    className="text-[#0070CE] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                  >
                    Tải về
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};
