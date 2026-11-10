/**
 * Fee Assignment Info Modal Component
 * Displays student and class breakdown for a selected fee item with search and class filtering
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/khoan-phi.md (BR05)
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PopupModal + Dropdown)
 */

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeAssignmentModal } from '../../../store/slices/schoolFeeSlice';
import {
  formatFeeAmount,
  filterStudentAssignments,
} from '../../../utils/schoolFeeValidation';
import { SCHOOL_CLASSES } from '../../../services/mockSchoolFeeData';
import { PopupModal, Dropdown, DropdownOption, Icon } from '@/components/ds';

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

  const classOptions: DropdownOption[] = [
    { value: 'all', label: 'Tất cả các lớp' },
    ...SCHOOL_CLASSES.map((cls) => ({ value: cls.id, label: cls.name })),
  ];

  return (
    <PopupModal
      open={Boolean(viewingAssignmentFee)}
      onClose={handleClose}
      title="Thông tin khoản phí"
      description={`Khoản thu: ${viewingAssignmentFee.name}${
        viewingAssignmentFee.defaultAmount !== undefined
          ? ` (Mặc định: ${formatFeeAmount(viewingAssignmentFee.defaultAmount)})`
          : ''
      }`}
      icon="eye"
      width={680}
      primaryAction={{
        label: 'Đóng',
        onClick: handleClose,
      }}
    >
      <div className="space-y-3">
        {/* Inner Search & Class Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pb-2 border-b border-slate-100">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên học sinh..."
              className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] text-slate-800 shadow-xs"
            />
          </div>

          {/* Class Filter */}
          <div className="w-full sm:w-48">
            <Dropdown
              value={selectedClassId}
              onChange={(val) => setSelectedClassId(val)}
              options={classOptions}
              size="sm"
              fullWidth
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="max-h-[360px] overflow-y-auto">
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
                      <Icon name="circle-exclamation" size={24} className="text-slate-300" />
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

        <div className="text-xs text-slate-500 pt-1">
          Hiển thị <strong>{filteredAssignments.length}</strong> học sinh áp dụng
        </div>
      </div>
    </PopupModal>
  );
};
