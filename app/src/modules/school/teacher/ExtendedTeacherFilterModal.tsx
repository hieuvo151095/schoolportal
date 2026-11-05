import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes, faRedo, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setFilter, resetFilter } from '../../../store/slices/teacherSlice';

interface ExtendedTeacherFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtendedTeacherFilterModal: React.FC<ExtendedTeacherFilterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.teacher.filter);

  const [csdlSoOnly, setCsdlSoOnly] = useState(filter.csdlSoOnly);

  if (!isOpen) return null;

  const handleApply = () => {
    dispatch(setFilter({ csdlSoOnly }));
    onClose();
  };

  const handleReset = () => {
    setCsdlSoOnly(false);
    dispatch(resetFilter());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0070CE]">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Bộ lọc nâng cao</h3>
              <p className="text-xs text-slate-500">Tùy chọn lọc nâng cao cho danh sách giáo viên</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* CSDL Sở GD&ĐT Criteria (BR09) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
              Dữ liệu liên ngành
            </div>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={csdlSoOnly}
                onChange={(e) => setCsdlSoOnly(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#0070CE] focus:ring-[#0070CE]"
              />
              <div>
                <span className="text-sm font-medium text-slate-800">
                  Đã đồng bộ CSDL Sở GD&ĐT
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chỉ lọc các giáo viên đã có mã định danh liên kết với Cơ sở dữ liệu ngành Giáo dục.
                </p>
              </div>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <FontAwesomeIcon icon={faRedo} className="text-xs" />
              <span>Đặt lại bộ lọc</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-lg transition-colors shadow-xs"
              >
                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                <span>Áp dụng</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
