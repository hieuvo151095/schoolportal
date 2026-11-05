import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faFilter,
  faUsers,
  faSortAmountDown,
  faExclamationCircle,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { MediaFilterState, MediaFilterType } from '../../../types/media';
import { MOCK_STUDENTS } from '../../../services/mockActivityData';
import { validateStudentFilterSelection } from '../../../utils/mediaValidation';

interface MediaFilterModalProps {
  isOpen: boolean;
  currentFilter: MediaFilterState;
  onClose: () => void;
  onApplyFilter: (filter: MediaFilterState) => void;
}

export const MediaFilterModal: React.FC<MediaFilterModalProps> = ({
  isOpen,
  currentFilter,
  onClose,
  onApplyFilter,
}) => {
  const [filterType, setFilterType] = useState<MediaFilterType>(currentFilter.filterType);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    currentFilter.selectedStudentIds || []
  );
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>(currentFilter.sortBy);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleStudent = (studentId: string) => {
    setError(null);
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
    } else {
      if (selectedStudentIds.length >= 5) {
        setError('Vui lòng chọn tối đa 5 học sinh theo quy định hệ thống.');
        return;
      }
      setSelectedStudentIds((prev) => [...prev, studentId]);
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateStudentFilterSelection(selectedStudentIds, filterType);
    if (!validation.valid) {
      setError(validation.error || 'Số lượng học sinh vượt quá giới hạn.');
      return;
    }

    onApplyFilter({
      filterType,
      selectedStudentIds: filterType === 'students' ? selectedStudentIds : [],
      sortBy,
    });
  };

  const handleReset = () => {
    setFilterType('all');
    setSelectedStudentIds([]);
    setSortBy('newest');
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#0070CE] flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Lọc Mở Rộng Album
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApply} className="p-6 space-y-5 text-xs">
          {/* Target Group Radio Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Đối tượng hiển thị ảnh
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="filterType"
                  value="all"
                  checked={filterType === 'all'}
                  onChange={() => {
                    setFilterType('all');
                    setError(null);
                  }}
                  className="text-[#0070CE] focus:ring-[#0070CE]"
                />
                <span className="font-semibold text-slate-800">Cả lớp (Xem tất cả ảnh)</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="filterType"
                  value="unassigned"
                  checked={filterType === 'unassigned'}
                  onChange={() => {
                    setFilterType('unassigned');
                    setError(null);
                  }}
                  className="text-[#0070CE] focus:ring-[#0070CE]"
                />
                <span className="font-semibold text-slate-800">Không gắn thẻ (Ảnh tập thể / Chưa nhận diện)</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="filterType"
                  value="students"
                  checked={filterType === 'students'}
                  onChange={() => setFilterType('students')}
                  className="text-[#0070CE] focus:ring-[#0070CE]"
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Học sinh cụ thể (Tối đa 5 em)</span>
                  {filterType === 'students' && (
                    <span className="text-[10px] font-bold text-[#0070CE] bg-blue-50 px-2 py-0.5 rounded-full">
                      {selectedStudentIds.length}/5
                    </span>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Student Picker Checklist (BR06) */}
          {filterType === 'students' && (
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Chọn học sinh cần lọc (tối đa 5 em):
              </div>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 bg-slate-50/50">
                {MOCK_STUDENTS.map((stu) => {
                  const isSelected = selectedStudentIds.includes(stu.id);
                  return (
                    <div
                      key={stu.id}
                      onClick={() => handleToggleStudent(stu.id)}
                      className={`flex items-center justify-between p-2.5 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/80' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={stu.avatarUrl}
                          alt={stu.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-semibold text-slate-800">{stu.name}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-[#0070CE] border-[#0070CE] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-red-600 font-medium">
                  <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {/* Sort By Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faSortAmountDown} className="text-slate-400" />
              <span>Sắp xếp ảnh theo</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:bg-white transition-all text-slate-800 font-medium"
            >
              <option value="newest">Theo media mới nhất (Mặc định)</option>
              <option value="oldest">Theo media cũ nhất</option>
            </select>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Đặt lại mặc định
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#0070CE] hover:bg-[#1A94FF] rounded-lg shadow-xs transition-all cursor-pointer"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
