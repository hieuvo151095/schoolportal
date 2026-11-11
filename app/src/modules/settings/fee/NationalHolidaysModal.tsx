import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { SlideOver, Icon, Button } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleEventMealRefund } from '@/store/slices/calendarSlice';
import { calculateDaysBetween } from '@/utils/mealRefundCalculation';
import { formatDisplayDate } from '@/utils/calendarValidation';

interface NationalHolidaysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NationalHolidaysModal: React.FC<NationalHolidaysModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  // Read events directly from Calendar slice (Single Source of Truth for holidays)
  const calendarEvents = useAppSelector((state) => state.calendar.events);
  const holidayEvents = calendarEvents.filter((ev) => ev.category === 'ngay_nghi');
  const activeCount = holidayEvents.filter((h) => h.isAppliedForMealRefund !== false).length;

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Danh sách ngày nghỉ lễ theo Luật & Lịch trường"
      description={`Có ${holidayEvents.length} ngày nghỉ áp dụng hoàn tiền ăn tự động`}
      icon="calendar"
      width={720}
      primaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
      secondaryAction={null}
    >
      <div className="space-y-4 py-2">
        {/* Helper info & link to calendar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-800">
              Đang áp dụng hoàn tiền: <span className="text-[#0070CE] font-bold">{activeCount}/{holidayEvents.length}</span> ngày nghỉ.
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Để thêm, sửa đổi ngày nghỉ lễ, vui lòng quản lý tại phân hệ Lịch sự kiện.
            </p>
          </div>
          <Link
            href={`/${schoolCode}/school/calendar`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0070CE] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shrink-0"
          >
            <Icon name="arrow-up-right-from-square" size={12} />
            <span>Mở Lịch sự kiện</span>
          </Link>
        </div>

        {/* Table of holidays */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3.5">Tên ngày nghỉ lễ / Sự kiện</th>
                <th className="py-3 px-3 text-center">Từ ngày</th>
                <th className="py-3 px-3 text-center">Đến ngày</th>
                <th className="py-3 px-3 text-center">Số ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {holidayEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Chưa có ngày nghỉ lễ nào được khai báo trong Lịch sự kiện
                  </td>
                </tr>
              ) : (
                holidayEvents.map((hol) => {
                  const dayCount = calculateDaysBetween(hol.startDate, hol.endDate);
                  return (
                    <tr key={hol.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-800">
                        {hol.title}
                        {hol.description && (
                          <div className="text-[11px] font-normal text-slate-500 truncate max-w-xs mt-0.5">
                            {hol.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700 font-medium">
                        {formatDisplayDate(hol.startDate)}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700 font-medium">
                        {formatDisplayDate(hol.endDate)}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700 text-xs">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md text-slate-800 font-bold">
                          {dayCount} ngày
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Info callout */}
        <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
          <Icon name="circle-info" size={14} className="text-[#0070CE] mt-0.5 shrink-0" />
          <span>
            <strong>Lưu ý:</strong> Tất cả các ngày nghỉ lễ và sự kiện nhóm Ngày nghỉ trong Lịch sự kiện sẽ được hệ thống tính vào nhóm Ngày nghỉ lễ của trường (Nhóm A) và tự động hoàn tiền ăn theo tỷ lệ đã thiết lập khi tạo hóa đơn học phí tháng tiếp theo.
          </span>
        </div>
      </div>
    </SlideOver>
  );
};

export default NationalHolidaysModal;
