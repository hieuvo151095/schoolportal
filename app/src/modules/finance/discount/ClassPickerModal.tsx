/**
 * Class Picker Modal for Class-Scoped Exemption Scoping
 * Finance Domain - Finviet / SOHA School Operating Portal
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 */

import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSearch,
  faCheck,
  faGraduationCap,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { AVAILABLE_CLASSES_FOR_DISCOUNT } from '../../../services/mockDiscountData';

interface ClassPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClassIds: string[];
  onConfirm: (selectedIds: string[]) => void;
}

export const ClassPickerModal: React.FC<ClassPickerModalProps> = ({
  isOpen,
  onClose,
  selectedClassIds,
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('all');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedClassIds);

  // Sync state on modal open
  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedIds(selectedClassIds);
      setSearchQuery('');
      setSelectedGradeFilter('all');
    }
  }, [isOpen, selectedClassIds]);

  const uniqueGrades = useMemo(() => {
    const set = new Set<string>();
    AVAILABLE_CLASSES_FOR_DISCOUNT.forEach((c) => {
      set.add(c.grade);
    });
    return Array.from(set);
  }, []);

  const filteredClasses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return AVAILABLE_CLASSES_FOR_DISCOUNT.filter((cls) => {
      const matchGrade = selectedGradeFilter === 'all' || cls.grade === selectedGradeFilter;
      const matchQuery =
        !q ||
        cls.name.toLowerCase().includes(q) ||
        cls.grade.toLowerCase().includes(q);
      return matchGrade && matchQuery;
    });
  }, [searchQuery, selectedGradeFilter]);

  if (!isOpen) return null;

  const isSelected = (classId: string) => {
    return tempSelectedIds.includes(classId);
  };

  const handleToggleClass = (classId: string) => {
    if (isSelected(classId)) {
      setTempSelectedIds((prev) => prev.filter((id) => id !== classId));
    } else {
      setTempSelectedIds((prev) => [...prev, classId]);
    }
  };

  const handleSelectAllFiltered = () => {
    const unselectedFiltered = filteredClasses
      .map((c) => c.id)
      .filter((id) => !tempSelectedIds.includes(id));
    setTempSelectedIds((prev) => [...prev, ...unselectedFiltered]);
  };

  const handleDeselectAllFiltered = () => {
    const filteredIds = new Set(filteredClasses.map((c) => c.id));
    setTempSelectedIds((prev) => prev.filter((id) => !filteredIds.has(id)));
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden border border-slate-100 animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070CE] flex items-center justify-center">
              <FontAwesomeIcon icon={faGraduationCap} className="text-lg" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Chọn lớp học áp dụng</h2>
              <p className="text-xs text-slate-500">
                Tìm kiếm và chỉ định các lớp được hưởng chính sách miễn giảm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
              />
              <input
                type="text"
                placeholder="Tìm tên lớp, khối lớp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]/20 focus:border-[#0070CE]"
              />
            </div>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="py-2 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0070CE]/20 focus:border-[#0070CE]"
            >
              <option value="all">Tất cả các khối</option>
              {uniqueGrades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Tìm thấy <strong className="text-slate-700">{filteredClasses.length}</strong> lớp học
              (Đã chọn <strong className="text-[#0070CE]">{tempSelectedIds.length}</strong>)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="text-[#0070CE] hover:underline font-medium"
              >
                Chọn tất cả
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleDeselectAllFiltered}
                className="text-rose-500 hover:underline font-medium"
              >
                Bỏ chọn tất cả
              </button>
            </div>
          </div>
        </div>

        {/* Class List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {filteredClasses.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Không tìm thấy lớp học phù hợp với điều kiện tìm kiếm.
            </div>
          ) : (
            filteredClasses.map((cls) => {
              const checked = isSelected(cls.id);
              return (
                <div
                  key={cls.id}
                  onClick={() => handleToggleClass(cls.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    checked ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-[#0070CE] border-[#0070CE] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {checked && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {cls.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {cls.grade} • Sĩ số:{' '}
                        <span className="text-slate-600 font-medium">{cls.studentCount} học sinh</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faUsers} className="text-[10px] text-slate-400" />
                      <span>{cls.studentCount} HS</span>
                    </span>
                    <span className="text-xs px-2.5 py-1 bg-blue-50 text-[#0070CE] rounded-full font-medium">
                      {cls.grade}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Đã chọn: <span className="font-bold text-[#0070CE]">{tempSelectedIds.length}</span> lớp học
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0070CE] hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              Xác nhận ({tempSelectedIds.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
