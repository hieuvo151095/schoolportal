/**
 * Fee Assignment Info Modal Component
 * Displays student and class breakdown for a selected fee item with search and class filtering
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/khoan-phi.md (BR05)
 */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faEye,
  faSearch,
  faGraduationCap,
  faUsers,
  faMoneyBillWave,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeAssignmentModal } from '../../../store/slices/schoolFeeSlice';
import {
  formatFeeAmount,
  filterStudentAssignments,
} from '../../../utils/schoolFeeValidation';
import { SCHOOL_CLASSES } from '../../../services/mockSchoolFeeData';

export const FeeAssignmentInfoModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { viewingAssignmentFee, assignments } = useAppSelector(
    (state) => state.schoolFee
  );

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');

  if (!viewingAssignmentFee) {
    return null;
  }

  const handleClose = () => {
    setSearchKeyword('');
    setSelectedClassId('all');
    dispatch(closeAssignmentModal());
  };

  // Filter assignments for this specific fee item
  const filteredAssignments = filterStudentAssignments(
    assignments,
    viewingAssignmentFee.id,
    searchKeyword,
    selectedClassId
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-[#0070CE]">
            <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Thông tin khoản phí
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Khoản thu: <span className="text-[#0070CE] font-semibold">{viewingAssignmentFee.name}</span>
                {viewingAssignmentFee.defaultAmount !== undefined && (
                  <span className="ml-2 text-slate-400">
                    (Mặc định: {formatFeeAmount(viewingAssignmentFee.defaultAmount)})
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            aria-label="Đóng"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Inner Search & Class Filter */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <FontAwesomeIcon icon={faSearch} className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên học sinh..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] text-slate-800 shadow-sm"
            />
          </div>

          {/* Class Filter */}
          <div className="w-full sm:w-48">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] text-slate-700 shadow-sm"
            >
              {SCHOOL_CLASSES.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="max-h-[380px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-50 text-slate-600 font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 w-12 text-center">STT</th>
                <th className="py-2.5 px-4">Họ và tên</th>
                <th className="py-2.5 px-4 text-center">Lớp học</th>
                <th className="py-2.5 px-4 text-right">Số tiền áp dụng</th>
                <th className="py-2.5 px-4">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="w-6 h-6 text-slate-300"
                      />
                      <p className="font-semibold text-slate-600 text-xs">
                        Chưa có dữ liệu
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Khoản phí này chưa được gán cho học sinh nào theo điều kiện lọc.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((assign, index) => (
                  <tr key={assign.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 text-center text-slate-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">
                      {assign.studentName}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100">
                        {assign.className}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      {formatFeeAmount(assign.appliedAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 italic">
                      {assign.note || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-800">
              Tổng: {filteredAssignments.length}
            </span>{' '}
            học sinh áp dụng
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition text-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
