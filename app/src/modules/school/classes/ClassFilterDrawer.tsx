import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faFilter,
  faUndo,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { ClassFilterState } from '../../../types/class';

interface ClassFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterCriteria: ClassFilterState;
  onUpdateFilter: (filter: Partial<ClassFilterState>) => void;
  onResetFilter: () => void;
  availableTeachers: { id: string; name: string; phone: string }[];
}

export const ClassFilterDrawer: React.FC<ClassFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterCriteria,
  onUpdateFilter,
  onResetFilter,
  availableTeachers,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFilter} className="text-blue-600 text-sm" />
            <h3 className="font-bold text-slate-800 text-sm">Bộ lọc nâng cao</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Filter Form Controls */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Trạng thái hoạt động
            </label>
            <select
              value={filterCriteria.status || ''}
              onChange={(e) =>
                onUpdateFilter({
                  status: e.target.value ? (e.target.value as ClassFilterState['status']) : undefined,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="dang_hoat_dong">Đang hoạt động</option>
              <option value="tam_dung">Tạm dừng</option>
              <option value="da_ket_thuc">Đã kết thúc</option>
            </select>
          </div>

          {/* Teacher Role Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Tình trạng GVCN
            </label>
            <div className="space-y-1.5">
              {[
                { label: 'Tất cả', value: undefined },
                { label: 'Đã phân công GVCN', value: 'co_gvcn' },
                { label: 'Chưa có GVCN', value: 'chua_co_gvcn' },
              ].map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700"
                >
                  <input
                    type="radio"
                    name="teacherRole"
                    checked={filterCriteria.teacherRole === opt.value}
                    onChange={() =>
                      onUpdateFilter({
                        teacherRole: opt.value as ClassFilterState['teacherRole'],
                      })
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specific Teacher Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Giáo viên cụ thể
            </label>
            <select
              value={filterCriteria.teacherId || ''}
              onChange={(e) =>
                onUpdateFilter({
                  teacherId: e.target.value ? e.target.value : undefined,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả giáo viên</option>
              {availableTeachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* CSDL Sở Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Liên kết CSDL Sở GD&ĐT
            </label>
            <select
              value={filterCriteria.csdlStatus || ''}
              onChange={(e) =>
                onUpdateFilter({
                  csdlStatus: e.target.value
                    ? (e.target.value as ClassFilterState['csdlStatus'])
                    : undefined,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái liên kết</option>
              <option value="da_lien_ket">Đã liên kết CSDL Sở</option>
              <option value="chua_lien_ket">Chưa liên kết</option>
            </select>
          </div>

          {/* Capacity Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Khoảng sĩ số học sinh
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  min="0"
                  placeholder="Từ (VD: 0)"
                  value={filterCriteria.capacityMin !== undefined ? filterCriteria.capacityMin : ''}
                  onChange={(e) =>
                    onUpdateFilter({
                      capacityMin: e.target.value !== '' ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  placeholder="Đến (VD: 35)"
                  value={filterCriteria.capacityMax !== undefined ? filterCriteria.capacityMax : ''}
                  onChange={(e) =>
                    onUpdateFilter({
                      capacityMax: e.target.value !== '' ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetFilter}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-white transition-colors"
          >
            <FontAwesomeIcon icon={faUndo} />
            <span>Đặt lại</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <FontAwesomeIcon icon={faCheck} />
            <span>Áp dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
