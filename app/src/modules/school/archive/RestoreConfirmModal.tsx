import React from 'react';
import { Icon, SlideOver } from '@/components/ds';
import type { ArchivedStudent } from '@/types/archive';
import { evaluateRestorationClass } from '@/utils/archiveValidation';

interface RestoreConfirmModalProps {
  student: ArchivedStudent | null;
  activeClasses: { id: string; name: string }[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmRestore: (studentId: string) => void;
}

export const RestoreConfirmModal: React.FC<RestoreConfirmModalProps> = ({
  student,
  activeClasses,
  isOpen,
  onClose,
  onConfirmRestore,
}) => {
  if (!student) return null;

  const restoration = evaluateRestorationClass(student, activeClasses);

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Xác nhận phục hồi học sinh"
      description={`Khôi phục hồ sơ học sinh ${student.fullName} trở lại danh sách quản lý chính thức`}
      icon="rotate-right"
      width={520}
      primaryAction={{
        label: 'Xác nhận phục hồi',
        icon: 'rotate-right',
        onClick: () => onConfirmRestore(student.id),
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-3 border-2 border-emerald-300">
            <Icon name="rotate-right" size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Phục hồi học sinh <span className="text-[#0070CE]">{student.fullName}</span>?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Học sinh sẽ được đưa trở lại danh sách quản lý học tập chính thức của nhà trường và kích hoạt lại tài khoản phụ huynh liên kết.
          </p>
        </div>

        {/* Student summary info */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Mã học sinh:</span>
            <span className="font-bold text-slate-700 font-mono">{student.studentCode}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Lớp lưu trữ trước đây:</span>
            <span className="font-semibold text-slate-700">{student.formerClassName || 'Chưa rõ'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Lý do lưu trữ:</span>
            <span className="font-semibold text-slate-700">{student.archiveReason || 'N/A'}</span>
          </div>
        </div>

        {/* BR05 / K066 Class Continuity Evaluation */}
        {restoration.isClassActive ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <Icon name="circle-check" size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">Lớp tiếp nhận tự động:</strong>
              Học sinh sẽ được đưa trở lại lớp <strong>{restoration.restoredClassName}</strong> (lớp đang hoạt động trong năm học này).
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <Icon name="triangle-exclamation" size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">Lưu ý xếp lớp:</strong>
              {restoration.warningMessage}
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};
