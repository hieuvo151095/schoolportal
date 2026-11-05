import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCheck,
  faRightFromBracket,
  faTimes,
  faClock,
  faCheck,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { getCurrentTimeHHmm } from '@/utils/attendanceValidation';

interface StudentBrief {
  studentId: string;
  fullName: string;
  studentCode: string;
  avatarUrl?: string;
}

interface BulkTimeConfirmModalProps {
  isOpen: boolean;
  type: 'checkIn' | 'checkOut';
  selectedStudents: StudentBrief[];
  filteredOutCount?: number;
  onConfirm: (time: string, studentIds?: string[]) => void;
  onClose: () => void;
}

export const BulkTimeConfirmModal: React.FC<BulkTimeConfirmModalProps> = ({
  isOpen,
  type,
  selectedStudents,
  filteredOutCount,
  onConfirm,
  onClose,
}) => {
  const [time, setTime] = useState<string>('07:30');
  const [studentsList, setStudentsList] = useState<StudentBrief[]>(selectedStudents);

  // Sync with current time and students list when modal opens
  useEffect(() => {
    if (isOpen) {
      setStudentsList(selectedStudents);
      const now = getCurrentTimeHHmm();
      if (type === 'checkOut') {
        // If checkout in morning, default to late afternoon 16:30 or current time if after 11:00
        const [hh] = now.split(':').map(Number);
        setTime(hh < 11 ? '16:30' : now);
      } else {
        setTime(now);
      }
    }
  }, [isOpen, type, selectedStudents]);

  if (!isOpen) return null;

  const isCheckIn = type === 'checkIn';
  const count = studentsList.length;

  const adjustMinutes = (offsetMinutes: number) => {
    const [hh, mm] = time.split(':').map(Number);
    const totalMinutes = (hh * 60 + mm + offsetMinutes + 1440) % 1440;
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    const formatted = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
    setTime(formatted);
  };

  const resetToNow = () => {
    setTime(getCurrentTimeHHmm());
  };

  const handleRemoveStudent = (studentId: string) => {
    setStudentsList((prev) => prev.filter((s) => s.studentId !== studentId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                isCheckIn
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-blue-50 text-blue-600'
              }`}
            >
              <FontAwesomeIcon icon={isCheckIn ? faUserCheck : faRightFromBracket} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                {isCheckIn ? 'Xác nhận Đón hàng loạt' : 'Xác nhận Trả hàng loạt'}
              </h3>
              <p className="text-xs text-slate-500">
                Áp dụng cho {count} học sinh đang được chọn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Automatic Filter Notification for Checkout */}
          {!isCheckIn && filteredOutCount && filteredOutCount > 0 ? (
            <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800">
              <FontAwesomeIcon icon={faInfoCircle} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-900">
                  Đã tự động loại {filteredOutCount} học sinh chưa điểm danh đón
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Theo quy định điểm danh, chỉ các học sinh đã được điểm danh đón và đang có mặt mới được xác nhận trả.
                </p>
              </div>
            </div>
          ) : null}

          {/* Selected Students Preview Cards with [x] remove button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Danh sách học sinh ({count}):
              </label>
              {count > 0 && (
                <span className="text-[11px] text-slate-400">
                  Nhấp [✕] để loại bớt học sinh nếu cần
                </span>
              )}
            </div>
            <div className="max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-2">
              {studentsList.map((s) => (
                <div
                  key={s.studentId}
                  className="relative group inline-flex items-center gap-2 pl-2.5 pr-7 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-all"
                >
                  {s.avatarUrl && (
                    <img
                      src={s.avatarUrl}
                      alt={s.fullName}
                      className="w-4 h-4 rounded-full object-cover shrink-0"
                    />
                  )}
                  <span className="truncate max-w-[120px]">{s.fullName}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveStudent(s.studentId);
                    }}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                    title={`Xóa ${s.fullName} khỏi danh sách này`}
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              {studentsList.length === 0 && (
                <div className="w-full py-4 text-center text-xs text-rose-500 font-medium">
                  Đã loại hết học sinh khỏi danh sách thực hiện hàng loạt.
                </div>
              )}
            </div>
          </div>

          {/* Time Picker & Adjustment Steppers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="bulk-time-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} className={isCheckIn ? 'text-emerald-600' : 'text-blue-600'} />
                <span>{isCheckIn ? 'Giờ đón ghi nhận:' : 'Giờ trả ghi nhận:'}</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                (Có thể điều chỉnh trước khi bấm xác nhận)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="bulk-time-input"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-lg font-mono font-bold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 focus:bg-white focus:outline-none focus:border-[#0070CE] transition-all shadow-xs"
              />

              {/* Quick Stepper Buttons */}
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => adjustMinutes(-15)}
                  className="px-2 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  title="Trừ 15 phút"
                >
                  -15p
                </button>
                <button
                  type="button"
                  onClick={() => adjustMinutes(-5)}
                  className="px-2 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  title="Trừ 5 phút"
                >
                  -5p
                </button>
                <button
                  type="button"
                  onClick={resetToNow}
                  className="px-2.5 py-1.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-colors"
                  title="Đặt lại về giờ hiện tại"
                >
                  Hiện tại
                </button>
                <button
                  type="button"
                  onClick={() => adjustMinutes(5)}
                  className="px-2 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  title="Cộng 5 phút"
                >
                  +5p
                </button>
                <button
                  type="button"
                  onClick={() => adjustMinutes(15)}
                  className="px-2 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  title="Cộng 15 phút"
                >
                  +15p
                </button>
              </div>
            </div>
          </div>

          {/* Helpful context notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed">
            {isCheckIn ? (
              <span>
                • Tất cả <strong>{count} học sinh</strong> sẽ được ghi nhận đã đến lớp lúc <strong>{time}</strong> và cập nhật trạng thái <em>Có mặt</em>.
              </span>
            ) : (
              <span>
                • Giờ trả của <strong>{count} học sinh</strong> sẽ được lưu đồng loạt là <strong>{time}</strong>.
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            disabled={count === 0}
            onClick={() => onConfirm(time, studentsList.map((s) => s.studentId))}
            className={`px-5 py-2 text-sm font-bold text-white rounded-xl shadow-xs flex items-center gap-2 transition-colors ${
              count === 0
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : isCheckIn
                ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
          >
            <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />
            <span>
              {isCheckIn
                ? `Xác nhận Đón (${count} học sinh)`
                : `Xác nhận Trả (${count} học sinh)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkTimeConfirmModal;
