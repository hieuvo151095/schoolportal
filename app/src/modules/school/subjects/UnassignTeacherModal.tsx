import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faTriangleExclamation,
  faUserMinus,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import type { SubjectTeacherAssignment } from '@/types/subject';

interface UnassignTeacherModalProps {
  isOpen: boolean;
  data: {
    subjectId: string;
    subjectName: string;
    teacher: SubjectTeacherAssignment;
  } | null;
  onClose: () => void;
  onConfirm: (subjectId: string, teacherId: string) => void;
}

export const UnassignTeacherModal: React.FC<UnassignTeacherModalProps> = ({
  isOpen,
  data,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !data) return null;

  const { subjectId, subjectName, teacher } = data;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-scaleUp z-10 space-y-4">
        {/* Warning Icon & Header */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-800">
              Xác nhận gỡ giáo viên khỏi môn học
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hành động này sẽ rút quyền phân công giảng dạy môn học của giáo viên.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Target Details Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Giáo viên:</span>
            <span className="font-bold text-slate-900">
              {teacher.teacherName} ({teacher.teacherCode})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Môn học:</span>
            <span className="font-bold text-[#0070CE]">{subjectName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Lớp đang phụ trách:</span>
            <span className="font-bold text-slate-700">
              {teacher.assignedClassesCount} lớp học
            </span>
          </div>
        </div>

        {/* Safety Reassurance Notice */}
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-[11px] text-emerald-900">
          <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <span>
            <strong>Bảo toàn dữ liệu:</strong> Toàn bộ điểm số, đánh giá và lịch sử vào sổ điểm trước đây của giáo viên cho môn học này sẽ được giữ nguyên vẹn, không bị mất.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={() => onConfirm(subjectId, teacher.teacherId)}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faUserMinus} className="w-3 h-3" />
            <span>Xác nhận gỡ giáo viên</span>
          </button>
        </div>
      </div>
    </div>
  );
};
