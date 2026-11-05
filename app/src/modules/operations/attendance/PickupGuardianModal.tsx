import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faUserShield,
  faClock,
  faUserGroup,
  faTriangleExclamation,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
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

const ModalOverlay = styled.div`
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
`;

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
      // Default to first authorized guardian
      const authorized = student.guardians.find((g) => g.isAuthorizedPickup);
      if (authorized) {
        setSelectedGuardianId(authorized.id);
      } else if (student.guardians.length > 0) {
        setSelectedGuardianId(student.guardians[0].id);
      }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const checkTime = departureTime || getCurrentTimeHHmm();

    // Check validation if student has arrival time
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
    <ModalOverlay className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0070CE] to-[#005096] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-amber-300">
              <FontAwesomeIcon icon={faUserShield} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg leading-tight">
                Xác Nhận Trả Học Sinh
              </h3>
              <p className="text-xs text-blue-100">
                Xác thực người giám hộ được ủy quyền đón bé
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        {/* Student Info Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center gap-3.5">
          <img
            src={student.avatarUrl}
            alt={student.fullName}
            className="w-12 h-12 rounded-full ring-2 ring-blue-500 object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{student.fullName}</span>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
                {student.studentCode}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
              <span>
                Giờ đón:{' '}
                <strong className="text-slate-800">
                  {student.arrivalTime || 'Chưa ghi nhận (mặc định 07:30)'}
                </strong>
              </span>
              {student.isLate && (
                <span className="text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                  Đến muộn
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Departure Time Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              <FontAwesomeIcon icon={faClock} className="mr-1 text-[#0070CE]" />
              Giờ trả học sinh
            </label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className={`w-full px-3 py-2 text-sm font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] ${
                validationError ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-white'
              }`}
              required
            />
            {validationError && (
              <div className="mt-1.5 text-xs text-rose-600 flex items-center gap-1.5 font-medium">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Authorized Guardians Radio List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FontAwesomeIcon icon={faUserGroup} className="text-[#0070CE]" />
                Chọn người đón học sinh
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Danh sách ủy quyền
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {student.guardians.map((guardian: Guardian) => {
                const isSelected = selectedGuardianId === guardian.id;
                return (
                  <label
                    key={guardian.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0070CE] bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
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
                        className="w-4 h-4 text-[#0070CE] focus:ring-[#0070CE]"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <span>{guardian.fullName}</span>
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {guardian.relationship}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          SĐT: {guardian.phoneNumber}
                        </div>
                      </div>
                    </div>

                    <div>
                      {guardian.isAuthorizedPickup ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded-full flex items-center gap-1">
                          <FontAwesomeIcon icon={faCircleCheck} />
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

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={Boolean(validationError)}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all shadow-xs ${
                validationError
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#0070CE] hover:bg-blue-700 text-white'
              }`}
            >
              Xác nhận trả học sinh
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

export default PickupGuardianModal;
