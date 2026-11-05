import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faTimes,
  faTrash,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ClassItem } from '../../../types/class';
import { canDeleteClass, getDeletionBlockReason } from '../../../utils/classValidation';

interface DeleteClassModalProps {
  isOpen: boolean;
  classItem: ClassItem | null;
  onClose: () => void;
  onConfirm: (classId: string) => void;
}

export const DeleteClassModal: React.FC<DeleteClassModalProps> = ({
  isOpen,
  classItem,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !classItem) return null;

  const isDeletable = canDeleteClass(classItem);
  const blockReason = getDeletionBlockReason(classItem.studentCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header with icon */}
        <div className="p-6 text-center">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 ${
              isDeletable
                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                : 'bg-amber-50 text-amber-600 border border-amber-100'
            }`}
          >
            <FontAwesomeIcon icon={isDeletable ? faTrash : faExclamationTriangle} />
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-1">
            {isDeletable ? 'Xác nhận xóa lớp học' : 'Không thể xóa lớp học này'}
          </h3>

          <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Tên lớp:</span>
              <span className="font-bold text-slate-800">{classItem.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Mã lớp:</span>
              <span className="font-mono font-semibold text-slate-700">{classItem.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Phân loại:</span>
              <span className="font-semibold text-slate-700">
                {classItem.taxonomy === 'chinh_khoa' ? 'Chính khóa' : 'Ngoại khóa & CLB'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Sĩ số thực tế:</span>
              <span
                className={`font-bold ${
                  classItem.studentCount > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {classItem.studentCount} học sinh
              </span>
            </div>
          </div>

          {/* Explanation text */}
          {isDeletable ? (
            <p className="text-xs text-slate-600 leading-relaxed">
              Lớp học hiện có <strong>sĩ số bằng 0</strong>. Bạn có chắc chắn muốn xóa lớp học này khỏi hệ thống? Thao tác này không thể hoàn tác.
            </p>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 leading-relaxed text-left flex items-start gap-2.5">
              <FontAwesomeIcon icon={faInfoCircle} className="text-rose-600 mt-0.5 shrink-0" />
              <span>{blockReason}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-xl text-sm font-semibold transition-colors"
          >
            {isDeletable ? 'Hủy bỏ' : 'Đã hiểu'}
          </button>

          {isDeletable && (
            <button
              type="button"
              onClick={() => onConfirm(classItem.id)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>Xóa vĩnh viễn</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
