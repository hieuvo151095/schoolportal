import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faTimes,
  faInfoCircle,
  faCalendarAlt,
  faExternalLinkAlt,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
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
  onClose
}) => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  // Read events directly from Calendar slice (Single Source of Truth for holidays)
  const calendarEvents = useAppSelector((state) => state.calendar.events);
  const holidayEvents = calendarEvents.filter((ev) => ev.category === 'ngay_nghi');
  const activeCount = holidayEvents.filter((h) => h.isAppliedForMealRefund !== false).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0070CE] flex items-center justify-center font-bold shadow-xs">
              <FontAwesomeIcon icon={faCalendarCheck} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">
                  Danh sách ngày nghỉ lễ theo Luật Lao động & Lịch trường
                </h3>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                  {holidayEvents.length} ngày nghỉ áp dụng
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Xem và điều chỉnh các ngày nghỉ lễ để hệ thống tự động hoàn tiền ăn. Dữ liệu được đồng bộ trực tiếp từ phân hệ Lịch sự kiện.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Action Bar & Synchronization Note */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2.5 text-blue-950">
              <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-[#0070CE] mt-0.5 sm:mt-0 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">
                  Dữ liệu ngày nghỉ lễ được đồng bộ tự động từ phân hệ Lịch sự kiện (nhóm &quot;Ngày nghỉ&quot;).
                </span>
                <span className="text-slate-600 block sm:inline sm:ml-1">
                  Thầy/cô chỉ có thể thêm, chỉnh sửa hoặc xóa lịch nghỉ tại phân hệ Lịch sự kiện.
                </span>
              </div>
            </div>

            <Link
              href={`/${schoolCode}/school/calendar`}
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005bb5] rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 h-3.5" />
              <span>Quản lý tại Lịch sự kiện</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} className="w-2.5 h-2.5 ml-0.5 opacity-80" />
            </Link>
          </div>

          {/* Holiday Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">STT</th>
                  <th className="py-3 px-5">Tên ngày lễ / Căn cứ & Ghi chú</th>
                  <th className="py-3 px-3 text-center w-36">Từ ngày</th>
                  <th className="py-3 px-3 text-center w-36">Đến ngày</th>
                  <th className="py-3 px-3 text-center w-28">Số ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holidayEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Chưa có ngày nghỉ lễ nào trong Lịch sự kiện. Vui lòng thêm sự kiện nhóm &quot;Ngày nghỉ&quot; trong Lịch sự kiện.
                    </td>
                  </tr>
                ) : (
                  holidayEvents.map((hol, idx) => {
                    const dayCount = calculateDaysBetween(hol.startDate, hol.endDate);

                    return (
                      <tr
                        key={hol.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3.5 px-3 text-center font-bold text-slate-400 text-xs">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-slate-800 text-xs flex items-center gap-2">
                            <span className="text-sm font-semibold">{hol.title}</span>
                            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 shrink-0">
                              Ngày nghỉ trường
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {hol.description || 'Lịch nghỉ sự kiện chính thức do nhà trường công bố'}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center text-slate-700 font-medium">
                          {formatDisplayDate(hol.startDate)}
                        </td>
                        <td className="py-3.5 px-3 text-center text-slate-700 font-medium">
                          {formatDisplayDate(hol.endDate)}
                        </td>
                        <td className="py-3.5 px-3 text-center font-semibold text-slate-700 text-xs">
                          <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-800 font-bold">
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
            <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-[#0070CE] mt-0.5 shrink-0" />
            <span>
              <strong>Lưu ý:</strong> Tất cả các ngày nghỉ lễ và sự kiện nhóm Ngày nghỉ trong Lịch sự kiện sẽ được hệ thống tính vào nhóm Ngày nghỉ lễ của trường (Nhóm A) và tự động hoàn tiền ăn theo tỷ lệ đã thiết lập khi tạo hóa đơn học phí tháng tiếp theo.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Tổng cộng: <strong>{holidayEvents.length}</strong> ngày nghỉ/sự kiện áp dụng hoàn tiền
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#0070CE] hover:bg-[#005bb5] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
