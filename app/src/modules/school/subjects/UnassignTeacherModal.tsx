import React from 'react';
import type { SubjectTeacherAssignment } from '@/types/subject';
import { SlideOver, Icon } from '@/components/ds';

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
  onConfirm,
}) => {
  if (!data) return null;

  const { subjectId, subjectName, teacher } = data;

  const handleConfirm = () => {
    onConfirm(subjectId, teacher.teacherId);
    onClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Xác nhận gỡ giáo viên khỏi môn học"
      description="Hành động này sẽ rút quyền phân công giảng dạy môn học của giáo viên"
      icon="user-minus"
      width={480}
      primaryAction={{
        label: 'Gỡ phân công',
        icon: 'user-minus',
        onClick: handleConfirm,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl font-bold mb-3 border-2 border-amber-300">
            <Icon name="user-minus" size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Gỡ phân công giảng dạy?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Rút phân công môn <strong className="text-slate-800">{subjectName}</strong> của giáo viên <strong className="text-slate-800">{teacher.teacherName}</strong>.
          </p>
        </div>

        {/* Target Details Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
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
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
          <Icon name="shield-check" size={16} className="text-emerald-600 mt-0.5 shrink-0" />
          <div className="leading-relaxed">
            <strong className="font-semibold block mb-0.5">Bảo toàn dữ liệu:</strong>
            Toàn bộ điểm số, đánh giá và lịch sử vào sổ điểm trước đây của giáo viên cho môn học này sẽ được giữ nguyên vẹn, không bị mất.
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
