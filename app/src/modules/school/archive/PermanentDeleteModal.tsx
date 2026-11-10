import React, { useState, useEffect } from 'react';
import { Icon, SlideOver, Checkbox } from '@/components/ds';
import type { ArchivedStudent } from '@/types/archive';

interface PermanentDeleteModalProps {
  student: ArchivedStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPurge: (studentId: string) => void;
}

export const PermanentDeleteModal: React.FC<PermanentDeleteModalProps> = ({
  student,
  isOpen,
  onClose,
  onConfirmPurge,
}) => {
  const [isAffirmed, setIsAffirmed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAffirmed(false);
    }
  }, [isOpen]);

  if (!student) return null;

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Cảnh báo xóa vĩnh viễn (Purge)"
      description="Thao tác xóa vĩnh viễn dữ liệu khỏi hệ thống và không thể khôi phục"
      icon="triangle-exclamation"
      width={520}
      primaryAction={{
        label: 'Xóa vĩnh viễn',
        icon: 'trash',
        disabled: !isAffirmed,
        onClick: () => onConfirmPurge(student.id),
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-rose-50 border border-rose-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold mb-3 border-2 border-rose-300">
            <Icon name="trash" size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Xác nhận xóa vĩnh viễn <span className="text-rose-600">{student.fullName}</span>?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Hồ sơ học sinh sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu lưu trữ và không thể phục hồi.
          </p>
        </div>

        {/* Irreversible warning notice box */}
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <Icon name="triangle-exclamation" size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 leading-relaxed">
            <strong className="font-semibold block mb-0.5">Cảnh báo nghiêm trọng:</strong>
            Hành động này sẽ xóa hoàn toàn hồ sơ lưu trữ của học sinh <strong>{student.fullName}</strong> (Mã: {student.studentCode}) khỏi cơ sở dữ liệu hệ thống. Dữ liệu sau khi xóa <strong>KHÔNG THỂ KHÔI PHỤC</strong> trong bất kỳ trường hợp nào!
          </div>
        </div>

        {/* Student details */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Mã học sinh:</span>
            <span className="font-bold text-slate-700 font-mono">{student.studentCode}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Lớp học cũ:</span>
            <span className="font-semibold text-slate-700">{student.formerClassName || 'Chưa rõ'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Ngày lưu trữ:</span>
            <span className="font-semibold text-slate-700">{student.archiveDate || 'Chưa rõ'}</span>
          </div>
        </div>

        {/* Affirmation Checkbox */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <label className="flex items-start gap-3 cursor-pointer text-xs font-medium text-slate-700 select-none">
            <input
              type="checkbox"
              id="affirm-purge-checkbox"
              checked={isAffirmed}
              onChange={(e) => setIsAffirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-rose-600 border-slate-300 focus:ring-rose-500"
            />
            <span>Tôi đã hiểu rõ hệ quả và hoàn toàn xác nhận xóa vĩnh viễn hồ sơ học sinh này.</span>
          </label>
        </div>
      </div>
    </SlideOver>
  );
};
