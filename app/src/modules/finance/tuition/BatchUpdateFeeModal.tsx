/**
 * Batch Update Fee Modal Component (Cập Nhật Học Phí Lớp Học)
 * Modal triggered by column header pencil icon (BR05, BR08)
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PopupModal + Icon)
 */

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addToast } from '../../../store/slices/toastSlice';
import { PopupModal, Icon } from '@/components/ds';
import {
  batchUpdateClassFee,
  closeBatchModal,
} from '../../../store/slices/tuitionManagementSlice';
import {
  formatFeeAmount,
  validateBatchUpdate,
} from '../../../utils/tuitionManagementValidation';

export const BatchUpdateFeeModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    isBatchModalOpen,
    batchFeeId,
    assignedFees,
    matrixRows,
    activeClassId,
  } = useAppSelector((state) => state.tuitionManagement);

  const targetFee = assignedFees.find((f) => f.feeId === batchFeeId);

  const [amountInput, setAmountInput] = useState<string>('');
  const [applyToAll, setApplyToAll] = useState<boolean>(true);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (targetFee) {
      setAmountInput(targetFee.defaultAmount.toString());
      setApplyToAll(true);
      setSelectedStudentIds(matrixRows.map((s) => s.studentId));
      setErrorMessage(null);
    }
  }, [targetFee, matrixRows]);

  if (!isBatchModalOpen || !targetFee) {
    return null;
  }

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = () => {
    if (selectedStudentIds.length === matrixRows.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(matrixRows.map((s) => s.studentId));
    }
  };

  const isSubmitDisabled =
    !amountInput ||
    Number(amountInput.replace(/\D/g, '')) < 0 ||
    (!applyToAll && selectedStudentIds.length === 0);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsedAmount = Number(amountInput.replace(/\D/g, ''));

    const validation = validateBatchUpdate({
      classId: activeClassId,
      feeId: targetFee.feeId,
      newAmount: parsedAmount,
      applyToAll,
      selectedStudentIds,
    });

    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Dữ liệu không hợp lệ.');
      return;
    }

    const feeName = targetFee.feeName;
    dispatch(
      batchUpdateClassFee({
        classId: activeClassId,
        feeId: targetFee.feeId,
        newAmount: parsedAmount,
        applyToAll,
        selectedStudentIds: applyToAll
          ? matrixRows.map((s) => s.studentId)
          : selectedStudentIds,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        message: `Đã cập nhật mức phí "${feeName}" thành công!`,
      })
    );
  };

  return (
    <PopupModal
      isOpen={isBatchModalOpen}
      onClose={() => dispatch(closeBatchModal())}
      title="Cập nhật học phí lớp học"
      subtitle={`${targetFee.feeName} — Lớp ${activeClassId}`}
      icon="edit"
      width={540}
      primaryAction={{
        label: 'Cập nhật số tiền',
        onClick: () => handleSubmit(),
        disabled: isSubmitDisabled,
        icon: 'check',
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: () => dispatch(closeBatchModal()),
      }}
    >
      <div className="space-y-4 text-left">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <Icon name="info" size={14} className="text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Amount input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Số tiền mới (đ/{targetFee.unit}) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={amountInput ? new Intl.NumberFormat('vi-VN').format(Number(amountInput.replace(/\D/g, ''))) : ''}
              onChange={(e) => setAmountInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Nhập số tiền..."
              className="w-full pl-3.5 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              required
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              đ
            </span>
          </div>
        </div>

        {/* Readonly Electronic Invoice Setting (BR08) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Icon name="file" size={14} className="text-slate-400" />
            <span>Xuất hóa đơn điện tử (Xuất HĐĐT):</span>
          </div>
          <div>
            {targetFee.exportElectronicInvoice ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                Có (Tự động từ Danh mục)
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-600">
                Không (Tự động từ Danh mục)
              </span>
            )}
          </div>
        </div>

        {/* Target Scope Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Cập nhật cho học sinh <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                applyToAll
                  ? 'bg-blue-50/70 border-blue-300 text-blue-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="applyScope"
                checked={applyToAll}
                onChange={() => setApplyToAll(true)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <Icon name="users" size={14} />
              <span className="text-xs font-semibold">Cả lớp ({matrixRows.length} HS)</span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                !applyToAll
                  ? 'bg-blue-50/70 border-blue-300 text-blue-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="applyScope"
                checked={!applyToAll}
                onChange={() => setApplyToAll(false)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <Icon name="user-check" size={14} />
              <span className="text-xs font-semibold">Học sinh được chọn</span>
            </label>
          </div>

          {/* Individual Student Checkbox List if not applyToAll */}
          {!applyToAll && (
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2 max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-medium text-slate-500">
                <span>Chọn học sinh áp dụng ({selectedStudentIds.length}/{matrixRows.length})</span>
                <button
                  type="button"
                  onClick={handleSelectAllStudents}
                  className="text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  {selectedStudentIds.length === matrixRows.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
              </div>
              <div className="space-y-1.5 pt-1">
                {matrixRows.map((student) => (
                  <label
                    key={student.studentId}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(student.studentId)}
                        onChange={() => handleToggleStudent(student.studentId)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-slate-800">{student.fullName}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{student.studentCode}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Explicit Notice (BR05) */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-start gap-2">
            <Icon name="info" size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <span>
              <strong>Lưu ý:</strong> Khoản phí sửa đổi chỉ được áp dụng cho những học sinh được gắn thẻ.
            </span>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

export default BatchUpdateFeeModal;
