import React, { useState, useEffect } from 'react';
import { SlideOver, Icon, Avatar } from '@/components/ds';
import { StudentAttendance, Guardian } from '@/types/attendance';
import { getCurrentTimeHHmm, validateCheckOut } from '@/utils/attendanceValidation';

interface PickupGuardianModalProps {
  isOpen: boolean;
  student: StudentAttendance | null;
  onClose: () => void;
  onSubmit: (params: {
    studentId: string;
    departureTime: string;
    guardianId: string;
    guardianName: string;
  }) => void;
}

export const PickupGuardianModal: React.FC<PickupGuardianModalProps> = ({
  isOpen,
  student,
  onClose,
  onSubmit,
}) => {
  const [departureTime, setDepartureTime] = useState(getCurrentTimeHHmm());
  const [selectedGuardianId, setSelectedGuardianId] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setDepartureTime(student.departureTime || getCurrentTimeHHmm());
      setSelectedGuardianId('');
      setValidationError(null);
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleTimeChange = (newTime: string) => {
    setDepartureTime(newTime);
    if (student.arrivalTime) {
      const validation = validateCheckOut(student.arrivalTime, newTime);
      if (!validation.valid) {
        setValidationError(validation.error || null);
      } else {
        setValidationError(null);
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const checkTime = departureTime || getCurrentTimeHHmm();

    if (student.arrivalTime) {
      const validation = validateCheckOut(student.arrivalTime, checkTime);
      if (!validation.valid) {
        setValidationError(validation.error || 'Giờ trả không hợp lệ');
        return;
      }
    }

    const selectedGuardian = student.guardians.find((g) => g.id === selectedGuardianId);
    if (!selectedGuardian) {
      setValidationError('Vui lòng chọn người đón học sinh.');
      return;
    }

    onSubmit({
      studentId: student.studentId,
      departureTime: checkTime,
      guardianId: selectedGuardian.id,
      guardianName: `${selectedGuardian.fullName} (${selectedGuardian.relationship})`,
    });
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      icon="user"
      title="Xác Nhận Trả Học Sinh"
      description="Xác thực người giám hộ được ủy quyền đón bé"
      width={480}
      primaryAction={{
        label: 'Xác nhận trả học sinh',
        icon: 'check',
        disabled: Boolean(validationError) || !selectedGuardianId || !departureTime,
        onClick: () => handleSubmit(),
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student Info Card */}
        <div className="p-3.5 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-[var(--radius-8)] flex items-center gap-3">
          <Avatar src={student.avatarUrl} name={student.fullName} size="md" className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--text-heading)]">{student.fullName}</span>
              <span className="text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-subtle)] px-2 py-0.5 rounded font-mono font-semibold">
                {student.studentCode}
              </span>
            </div>
            <div className="text-xs text-[var(--text-subtle)] flex items-center gap-2 mt-1">
              <span>
                Giờ đón: <strong>{student.arrivalTime || '07:30'}</strong>
              </span>
              {student.isLate && (
                <span className="text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                  Đến muộn
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Departure Time Input */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Giờ trả học sinh <span className="text-[var(--text-danger)]">*</span>
          </label>
          <input
            type="time"
            value={departureTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className={`w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border rounded-[var(--radius-8)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] ${
              validationError
                ? 'border-[var(--text-danger)] bg-red-50/40 text-[var(--text-danger)]'
                : 'border-[var(--border-default)] text-[var(--text-heading)]'
            }`}
            required
          />
          {validationError && (
            <div className="mt-1.5 text-xs text-[var(--text-danger)] flex items-center gap-1.5 font-medium">
              <Icon name="circle-xmark" size={12} />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Authorized Guardians Radio List */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[var(--text-heading)]">
              Chọn người đón học sinh <span className="text-[var(--text-danger)]">*</span>
            </label>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Danh sách ủy quyền
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {student.guardians.map((guardian: Guardian) => {
              const isSelected = selectedGuardianId === guardian.id;
              return (
                <label
                  key={guardian.id}
                  className={`flex items-center justify-between p-3 rounded-[var(--radius-8)] border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--eco-blue-strong)] bg-[var(--semantic-info-soft)] shadow-xs'
                      : 'border-[var(--border-default)] hover:border-[var(--text-subtle)] bg-[var(--bg-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pickup-guardian"
                      value={guardian.id}
                      checked={isSelected}
                      onChange={() => {
                        setSelectedGuardianId(guardian.id);
                        setValidationError(null);
                      }}
                      className="w-4 h-4 text-[var(--eco-blue-strong)]"
                    />
                    <div>
                      <div className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
                        <span>{guardian.fullName}</span>
                        <span className="text-xs font-medium text-[var(--text-subtle)] bg-[var(--bg-muted)] px-2 py-0.5 rounded">
                          {guardian.relationship}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text-subtle)] font-mono mt-0.5">
                        SĐT: {guardian.phoneNumber}
                      </div>
                    </div>
                  </div>

                  <div>
                    {guardian.isAuthorizedPickup ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded-full flex items-center gap-1">
                        <Icon name="check" size={10} />
                        Hợp lệ
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-1 rounded-full">
                        Chưa duyệt
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </form>
    </SlideOver>
  );
};

export default PickupGuardianModal;
