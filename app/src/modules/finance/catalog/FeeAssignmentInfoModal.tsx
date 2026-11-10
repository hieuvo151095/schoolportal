/**
 * Fee Assignment Info SlideOver Component (Right Drawer)
 * Displays student and class breakdown for a selected fee item with search and class filtering
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/khoan-phi.md (BR05)
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (SlideOver + Dropdown)
 */

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeAssignmentModal } from '../../../store/slices/schoolFeeSlice';
import {
  formatFeeAmount,
  filterStudentAssignments,
} from '../../../utils/schoolFeeValidation';
import { SCHOOL_CLASSES } from '../../../services/mockSchoolFeeData';
import { SlideOver, Dropdown, DropdownOption, Icon } from '@/components/ds';

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
    <SlideOver
      open={Boolean(viewingAssignmentFee)}
      onClose={handleClose}
      title="Thông tin khoản phí"
      description={`Khoản thu: ${viewingAssignmentFee.name}${
        viewingAssignmentFee.defaultAmount !== undefined
          ? ` (Mặc định: ${formatFeeAmount(viewingAssignmentFee.defaultAmount)})`
          : ''
      }`}
      icon="eye"
      width={640}
      secondaryAction={null}
      primaryAction={{
        label: 'Đóng',
        onClick: handleClose,
      }}
    >
      <div className="space-y-4">
        {/* Inner Search & Class Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pb-2 border-b border-[var(--border-default)]">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên học sinh..."
              className="w-full h-9 px-3 text-xs bg-[var(--bg-surface)] text-[var(--text-heading)] border border-[var(--border-default)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--eco-primary)] placeholder-[var(--text-subtle)]"
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
        <div className="max-h-[380px] overflow-y-auto border border-[var(--border-default)] rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-[var(--bg-subtle)] text-[var(--text-heading)] font-bold tracking-wider border-b border-[var(--border-default)]">
              <tr>
                <th className="py-2.5 px-3.5 w-12 text-center">STT</th>
                <th className="py-2.5 px-3.5">Họ và tên</th>
                <th className="py-2.5 px-3.5 text-center">Lớp học</th>
                <th className="py-2.5 px-3.5 text-right">Số tiền áp dụng</th>
                <th className="py-2.5 px-3.5">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[var(--text-subtle)]">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Icon name="circle-exclamation" size={24} className="text-slate-300" />
                      <p className="font-semibold text-[var(--text-heading)] text-xs">
                        Chưa có dữ liệu
                      </p>
                      <p className="text-[11px] text-[var(--text-subtle)]">
                        Khoản phí này chưa được gán cho học sinh nào theo điều kiện lọc.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((assign, index) => (
                  <tr key={assign.id} className="hover:bg-[var(--bg-subtle)]/50 transition-colors">
                    <td className="py-2.5 px-3.5 text-center text-[var(--text-subtle)] font-medium">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-[var(--text-heading)]">
                      {assign.studentName}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100">
                        {assign.className}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-[var(--text-heading)]">
                      {formatFeeAmount(assign.appliedAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-[var(--text-subtle)] italic">
                      {assign.note || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-[var(--text-subtle)] pt-1 flex items-center justify-between">
          <span>Hiển thị <strong>{filteredAssignments.length}</strong> học sinh áp dụng</span>
        </div>
      </div>
    </SlideOver>
  );
};

export const FeeAssignmentInfoSlideOver = FeeAssignmentInfoModal;
export default FeeAssignmentInfoModal;
