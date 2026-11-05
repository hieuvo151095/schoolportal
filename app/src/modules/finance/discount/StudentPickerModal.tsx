/**
 * Student Picker Modal for Individual Student Exemption Scoping
 * Finance Domain - Finviet / SOHA School Operating Portal
 */

import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSearch,
  faCheck,
  faGraduationCap,
  faUserGraduate,
} from '@fortawesome/free-solid-svg-icons';
import { AVAILABLE_STUDENTS_FOR_DISCOUNT } from '../../../services/mockDiscountData';

interface StudentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudentIds: string[];
  onConfirm: (selectedIds: string[]) => void;
}

export const StudentPickerModal: React.FC<StudentPickerModalProps> = ({
  isOpen,
  onClose,
  selectedStudentIds,
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedStudentIds);

  // Sync state on modal open
  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedIds(selectedStudentIds);
      setSearchQuery('');
      setSelectedClassFilter('all');
    }
  }, [isOpen, selectedStudentIds]);

  const uniqueClasses = useMemo(() => {
    const map = new Map<string, string>();
    AVAILABLE_STUDENTS_FOR_DISCOUNT.forEach((s) => {
      map.set(s.classId, s.className);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return AVAILABLE_STUDENTS_FOR_DISCOUNT.filter((s) => {
      const matchClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q);
      return matchClass && matchQuery;
    });
  }, [searchQuery, selectedClassFilter]);

  if (!isOpen) return null;

  const isSelected = (studentId: string) => {
    return tempSelectedIds.includes(studentId);
  };

  const handleToggleStudent = (studentId: string) => {
    if (isSelected(studentId)) {
      setTempSelectedIds((prev) => prev.filter((id) => id !== studentId));
    } else {
      setTempSelectedIds((prev) => [...prev, studentId]);
    }
  };

  const handleSelectAllFiltered = () => {
    const unselectedFiltered = filteredStudents
      .map((s) => s.id)
      .filter((id) => !tempSelectedIds.includes(id));
    setTempSelectedIds((prev) => [...prev, ...unselectedFiltered]);
  };

  const handleDeselectAllFiltered = () => {
    const filteredIds = new Set(filteredStudents.map((s) => s.id));
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
              <FontAwesomeIcon icon={faUserGraduate} className="text-lg" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Chọn học sinh áp dụng</h2>
              <p className="text-xs text-slate-500">
                Tìm kiếm và chỉ định học sinh được hưởng chính sách miễn giảm
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
                placeholder="Tìm tên, mã học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]/20 focus:border-[#0070CE]"
              />
            </div>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="py-2 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0070CE]/20 focus:border-[#0070CE]"
            >
              <option value="all">Tất cả các lớp</option>
              {uniqueClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Tìm thấy <strong className="text-slate-700">{filteredStudents.length}</strong> học sinh
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

        {/* Student List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Không tìm thấy học sinh phù hợp với điều kiện tìm kiếm.
            </div>
          ) : (
            filteredStudents.map((student) => {
              const checked = isSelected(student.id);
              return (
                <div
                  key={student.id}
                  onClick={() => handleToggleStudent(student.id)}
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
                        {student.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        Mã HS: <span className="font-mono text-slate-600">{student.code}</span> • Lớp:{' '}
                        <span className="text-slate-600 font-medium">{student.className}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                    {student.className}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Đã chọn: <span className="font-bold text-[#0070CE]">{tempSelectedIds.length}</span> học sinh
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
