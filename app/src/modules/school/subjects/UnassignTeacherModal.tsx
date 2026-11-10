import React from 'react';
import type { SubjectTeacherAssignment } from '@/types/subject';
import { PopupModal, Icon } from '@/components/ds';

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

  const handleConfirm = () => {
    onConfirm(subjectId, teacher.teacherId);
    onClose();
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận gỡ giáo viên khỏi môn học"
      subtitle="Hành động này sẽ rút quyền phân công giảng dạy môn học của giáo viên."
      icon="alert-triangle"
      width={480}
      primaryAction={{
        label: 'Gỡ phân công',
        onClick: handleConfirm,
        tone: 'danger',
        icon: 'user-minus',
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-4 text-left">
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
          <Icon name="shield" size={14} className="text-emerald-600 mt-0.5 shrink-0" />
          <span>
            <strong>Bảo toàn dữ liệu:</strong> Toàn bộ điểm số, đánh giá và lịch sử vào sổ điểm trước đây của giáo viên cho môn học này sẽ được giữ nguyên vẹn, không bị mất.
          </span>
        </div>
      </div>
    </PopupModal>
  );
};
