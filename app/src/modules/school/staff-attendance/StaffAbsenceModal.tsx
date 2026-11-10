import React, { useState, useEffect } from 'react';
import { Icon, SlideOver } from '@/components/ds';
import { StaffProfile, StaffAttendanceRecord, AbsenceType } from '../../../types/staffAttendance';

interface StaffAbsenceModalProps {
  isOpen: boolean;
  staff: StaffProfile | null;
  attendance: StaffAttendanceRecord | null;
  date: string;
  onClose: () => void;
  onSave: (payload: {
    staffId: string;
    date: string;
    absenceType: AbsenceType;
    absenceNote?: string;
  }) => void;
  onCancelAbsence?: (payload: { staffId: string; date: string }) => void;
}

export const StaffAbsenceModal: React.FC<StaffAbsenceModalProps> = ({
  isOpen,
  staff,
  attendance,
  date,
  onClose,
  onSave,
  onCancelAbsence,
}) => {
  const [absenceType, setAbsenceType] = useState<AbsenceType>('co_phep');
  const [absenceNote, setAbsenceNote] = useState<string>('');

  useEffect(() => {
    if (attendance?.isAbsent && attendance.absenceType) {
      setAbsenceType(attendance.absenceType);
      setAbsenceNote(attendance.absenceNote || '');
    } else {
      setAbsenceType('co_phep'); // Default "Có phép" (BR05)
      setAbsenceNote('');
    }
  }, [attendance, isOpen]);

  if (!isOpen || !staff) return null;

  const hasCheckIn = !!attendance?.checkInTime;
  const hasCheckOut = !!attendance?.checkOutTime;
  const isAlreadyAbsent = !!attendance?.isAbsent;

  const handleSave = () => {
    onSave({
      staffId: staff.id,
      date,
      absenceType,
      absenceNote: absenceNote.trim() || undefined,
    });
  };

  const handleClearAbsence = () => {
    if (onCancelAbsence) {
      onCancelAbsence({ staffId: staff.id, date });
    }
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Báo vắng nhân viên"
      description={`Ngày điểm danh: ${date}`}
      icon="user-xmark"
      width={520}
      primaryAction={{
        label: 'Lưu',
        icon: 'check',
        onClick: handleSave,
      }}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
      extraAction={
        isAlreadyAbsent
          ? {
              label: 'Hủy báo vắng',
              icon: 'rotate-right',
              tone: 'danger',
              onClick: handleClearAbsence,
            }
          : undefined
      }
    >
      <div data-testid="staff-absence-modal" className="space-y-4">
        {/* Staff Summary Card */}
        <div className="flex items-center gap-3.5 p-3.5 bg-gray-50 rounded-xl border border-gray-200/70">
          {staff.avatar ? (
            <img
              src={staff.avatar}
              alt={staff.nickname}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
              {staff.nickname.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-base">{staff.nickname}</span>
              {staff.code && (
                <span className="text-xs bg-gray-200 text-gray-700 font-mono px-1.5 py-0.5 rounded">
                  {staff.code}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{staff.name}</p>
          </div>
        </div>

        {/* Warning DD-03 if Check-In/Check-Out already exists (BR05) */}
        {(hasCheckIn || hasCheckOut) && (
          <div
            data-testid="warning-dd03"
            className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800"
          >
            <Icon name="triangle-exclamation" size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Cảnh báo ghi nhận thời gian:</p>
              {hasCheckIn && (
                <p>
                  Lưu ý: Nhân viên đã check-in lúc{' '}
                  <span className="font-bold text-blue-700">{attendance?.checkInTime}</span>.
                </p>
              )}
              {hasCheckOut && (
                <p>
                  Lưu ý: Nhân viên đã check-out lúc{' '}
                  <span className="font-bold text-amber-700">{attendance?.checkOutTime}</span>.
                </p>
              )}
              <p className="text-amber-600 mt-0.5 italic">
                Việc xác nhận vắng mặt sẽ ghi nhận trạng thái vắng cho ngày làm việc này.
              </p>
            </div>
          </div>
        )}

        {/* Absence Type Selector (BR05) */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
            Hình thức vắng mặt:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              data-testid="absence-type-cophep"
              onClick={() => setAbsenceType('co_phep')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                absenceType === 'co_phep'
                  ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  absenceType === 'co_phep' ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-400'
                }`}
              >
                {absenceType === 'co_phep' && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
              </span>
              Có phép
            </button>

            <button
              type="button"
              data-testid="absence-type-khongphep"
              onClick={() => setAbsenceType('khong_phep')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                absenceType === 'khong_phep'
                  ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  absenceType === 'khong_phep' ? 'border-rose-500 bg-rose-500 text-white' : 'border-gray-400'
                }`}
              >
                {absenceType === 'khong_phep' && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
              </span>
              Không phép
            </button>
          </div>
        </div>

        {/* Reason Note */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
            Lý do / Ghi chú vắng:
          </label>
          <textarea
            data-testid="absence-note-input"
            rows={3}
            value={absenceNote}
            onChange={(e) => setAbsenceNote(e.target.value)}
            placeholder="Nhập lý do vắng mặt (ví dụ: Nghỉ ốm, Đi công tác, Việc gia đình...)"
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          />
        </div>
      </div>
    </SlideOver>
  );
};
