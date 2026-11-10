import React from 'react';
import { Icon, SlideOver } from '@/components/ds';
import type { ArchivedStudent } from '@/types/archive';
import { formatArchiveDate, formatGender } from '@/utils/archiveValidation';

interface ArchivedStudentDetailModalProps {
  student: ArchivedStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (student: ArchivedStudent) => void;
}

export const ArchivedStudentDetailModal: React.FC<ArchivedStudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onRestore,
}) => {
  if (!isOpen || !student) return null;

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Hồ Sơ Học Sinh Lưu Trữ"
      description={`${student.fullName} • ${student.studentCode}`}
      icon="lock"
      width={640}
      primaryAction={{
        label: 'Phục hồi học sinh',
        icon: 'rotate-right',
        onClick: () => {
          onClose();
          onRestore(student);
        },
      }}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-5">
        {/* BR03 Authoritative Warning Banner */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-800">
          <Icon name="lock" size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <strong className="block text-amber-900 font-bold">
              Học sinh đã được lưu trữ (cold storage)
            </strong>
            <p className="leading-relaxed">
              Các hoạt động học tập, điểm danh và học phí đã được khóa. Để tiếp tục ghi nhận thông tin, vui lòng phục hồi học sinh.
            </p>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-[#0070CE] flex items-center justify-center font-bold text-xl border border-blue-200">
            {student.fullName ? student.fullName.charAt(0) : <Icon name="user" size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-800 text-base">{student.fullName}</span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-200 text-slate-700">
                {student.studentCode}
              </span>
              {student.nickname && (
                <span className="text-xs text-slate-500">
                  (Biệt danh: {student.nickname})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lớp cuối cùng: <span className="font-semibold text-slate-700">{student.formerClassName || 'Chưa rõ'}</span>
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-400 block mb-0.5 font-medium">Ngày sinh</span>
            <span className="font-semibold text-slate-800">
              {formatArchiveDate(student.dateOfBirth)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-400 block mb-0.5 font-medium">Giới tính</span>
            <span className="font-semibold text-slate-800">
              {formatGender(student.gender)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-400 block mb-0.5 font-medium">Người giám hộ</span>
            <span className="font-semibold text-slate-800">
              {student.parentName || 'Chưa cập nhật'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-400 block mb-0.5 font-medium">SĐT liên hệ</span>
            <span className="font-semibold text-slate-800 font-mono">
              {student.parentPhone || 'Chưa cập nhật'}
            </span>
          </div>
        </div>

        {/* Archive Metadata Box */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
          <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Thông tin lưu trữ hồ sơ
          </h4>

          <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Ngày lưu trữ:</span>
            <span className="font-semibold text-slate-800">
              {formatArchiveDate(student.archiveDate)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Người thực hiện:</span>
            <span className="font-semibold text-slate-800">
              {student.archivedBy?.name || 'Quản trị viên'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Lý do lưu trữ:</span>
            <span className="font-semibold text-slate-800">
              {student.archiveReason || 'Chưa ghi nhận'}
            </span>
          </div>

          {student.archiveNote && (
            <div className="py-1">
              <span className="text-slate-500 block mb-0.5">Ghi chú bổ sung:</span>
              <span className="text-slate-700 italic">{student.archiveNote}</span>
            </div>
          )}
        </div>
      </div>
    </SlideOver>
  );
};
