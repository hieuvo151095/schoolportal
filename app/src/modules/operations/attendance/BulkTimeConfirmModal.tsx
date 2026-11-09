import React, { useState, useEffect } from 'react';
import { SlideOver, Icon, Avatar } from '@/components/ds';
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

  useEffect(() => {
    if (isOpen) {
      setStudentsList(selectedStudents);
      const now = getCurrentTimeHHmm();
      if (type === 'checkOut') {
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
    let totalMinutes = hh * 60 + mm + offsetMinutes;
    if (totalMinutes < 0) totalMinutes = 0;
    if (totalMinutes >= 24 * 60) totalMinutes = 24 * 60 - 1;
    const newH = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const newM = String(totalMinutes % 60).padStart(2, '0');
    setTime(`${newH}:${newM}`);
  };

  const resetToNow = () => {
    setTime(getCurrentTimeHHmm());
  };

  const handleRemoveStudent = (id: string) => {
    setStudentsList((prev) => prev.filter((s) => s.studentId !== id));
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      icon="clock"
      title={isCheckIn ? 'Xác Nhận Đón Hàng Loạt' : 'Xác Nhận Trả Hàng Loạt'}
      description={
        isCheckIn
          ? `Ghi nhận giờ đón đồng loạt cho ${count} học sinh`
          : `Ghi nhận giờ trả đồng loạt cho ${count} học sinh`
      }
      width={500}
      primaryAction={{
        label: isCheckIn ? `Xác nhận Đón (${count})` : `Xác nhận Trả (${count})`,
        icon: 'check',
        disabled: count === 0,
        onClick: () => onConfirm(time, studentsList.map((s) => s.studentId)),
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <div className="space-y-4">
        {/* Automatic Filter Notification for Checkout */}
        {!isCheckIn && filteredOutCount && filteredOutCount > 0 ? (
          <div
            className="flex items-start gap-2.5 p-3 rounded-[var(--radius-8)] border text-xs"
            style={{
              background: 'var(--semantic-warning-soft)',
              borderColor: 'var(--border-warning-soft, #fed7aa)',
              color: 'var(--semantic-warning-strong)',
            }}
          >
            <Icon name="circle-exclamation" size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">
                Đã tự động loại {filteredOutCount} học sinh chưa điểm danh đón
              </p>
              <p className="text-[11px] mt-0.5 opacity-90">
                Theo quy định điểm danh, chỉ các học sinh đã được điểm danh đón và đang có mặt mới được xác nhận trả.
              </p>
            </div>
          </div>
        ) : null}

        {/* Selected Students Preview Cards with [x] remove button */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[var(--text-heading)]">
              Danh sách học sinh áp dụng ({count}):
            </label>
            {count > 0 && (
              <span className="text-[11px] text-[var(--text-subtle)]">
                Bấm [✕] để loại bớt học sinh
              </span>
            )}
          </div>
          <div className="max-h-36 overflow-y-auto p-2 bg-[var(--bg-subtle)] rounded-[var(--radius-8)] border border-[var(--border-default)] flex flex-wrap gap-2">
            {studentsList.map((s) => (
              <div
                key={s.studentId}
                className="relative inline-flex items-center gap-1.5 pl-2 pr-6 py-1 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-6)] text-xs font-semibold text-[var(--text-heading)] shadow-2xs"
              >
                {s.avatarUrl && (
                  <Avatar src={s.avatarUrl} name={s.fullName} size="xs" />
                )}
                <span className="truncate max-w-[120px]">{s.fullName}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveStudent(s.studentId);
                  }}
                  className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--bg-muted)] hover:bg-red-100 hover:text-red-600 text-[var(--text-subtle)] flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                  title={`Xóa ${s.fullName} khỏi danh sách này`}
                >
                  <Icon name="xmark" size={10} />
                </button>
              </div>
            ))}
            {studentsList.length === 0 && (
              <div className="w-full py-4 text-center text-xs text-[var(--text-danger)] font-medium">
                Đã loại hết học sinh khỏi danh sách thực hiện hàng loạt.
              </div>
            )}
          </div>
        </div>

        {/* Time Picker & Adjustment Steppers */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="bulk-time-input" className="text-xs font-semibold text-[var(--text-heading)] flex items-center gap-1.5">
              <Icon name="clock" size={14} className={isCheckIn ? 'text-emerald-600' : 'text-blue-600'} />
              <span>{isCheckIn ? 'Giờ đón ghi nhận:' : 'Giờ trả ghi nhận:'}</span>
            </label>
            <span className="text-[11px] text-[var(--text-subtle)]">
              (Điều chỉnh trước khi xác nhận)
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              id="bulk-time-input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-base font-mono font-bold text-[var(--text-heading)] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] px-3.5 py-2 focus:border-[var(--eco-blue-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all"
            />

            {/* Quick Stepper Buttons */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => adjustMinutes(-15)}
                className="px-2 py-1.5 text-xs font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-heading)] border border-[var(--border-default)] rounded-[var(--radius-6)] transition-colors cursor-pointer"
              >
                -15p
              </button>
              <button
                type="button"
                onClick={() => adjustMinutes(-5)}
                className="px-2 py-1.5 text-xs font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-heading)] border border-[var(--border-default)] rounded-[var(--radius-6)] transition-colors cursor-pointer"
              >
                -5p
              </button>
              <button
                type="button"
                onClick={resetToNow}
                className="px-2.5 py-1.5 text-xs font-bold bg-[var(--semantic-info-soft)] hover:bg-blue-100 text-[var(--eco-blue-strong)] border border-[var(--eco-blue-200,#bfdbfe)] rounded-[var(--radius-6)] transition-colors cursor-pointer"
              >
                Hiện tại
              </button>
              <button
                type="button"
                onClick={() => adjustMinutes(5)}
                className="px-2 py-1.5 text-xs font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-heading)] border border-[var(--border-default)] rounded-[var(--radius-6)] transition-colors cursor-pointer"
              >
                +5p
              </button>
              <button
                type="button"
                onClick={() => adjustMinutes(15)}
                className="px-2 py-1.5 text-xs font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-heading)] border border-[var(--border-default)] rounded-[var(--radius-6)] transition-colors cursor-pointer"
              >
                +15p
              </button>
            </div>
          </div>
        </div>

        {/* Helpful context notice */}
        <div className="p-3 bg-[var(--bg-subtle)] rounded-[var(--radius-8)] border border-[var(--border-default)] text-xs text-[var(--text-subtle)] leading-relaxed">
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
    </SlideOver>
  );
};

export default BulkTimeConfirmModal;
