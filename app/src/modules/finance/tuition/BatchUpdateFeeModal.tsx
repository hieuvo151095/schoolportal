/**
 * Batch Update Fee Modal Component (Cập Nhật Học Phí Lớp Học)
 * Modal triggered by column header pencil icon (BR05, BR08)
 * Legacy Reference: docs_legacy/operating-portal/tai-chinh/quan-ly-hoc-phi.md
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPen,
  faUsers,
  faUserCheck,
  faInfoCircle,
  faFileInvoice,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addToast } from '../../../store/slices/toastSlice';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-batch-update-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
              <FontAwesomeIcon icon={faPen} />
            </div>
            <div>
              <h3 id="modal-batch-update-title" className="font-bold text-base leading-tight">
                Cập nhật học phí lớp học
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {targetFee.feeName} — Lớp {activeClassId}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeBatchModal())}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center"
            aria-label="Đóng modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Số tiền mới (Đ/{targetFee.unit}) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={amountInput ? new Intl.NumberFormat('vi-VN').format(Number(amountInput.replace(/\D/g, ''))) : ''}
                onChange={(e) => setAmountInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Nhập số tiền..."
                className="w-full pl-3.5 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                Đ
              </span>
            </div>
          </div>

          {/* Readonly Electronic Invoice Setting (BR08) */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <FontAwesomeIcon icon={faFileInvoice} className="text-slate-400" />
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
                <FontAwesomeIcon icon={faUsers} className="text-sm" />
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
                <FontAwesomeIcon icon={faUserCheck} className="text-sm" />
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
                    className="text-blue-600 hover:underline font-semibold"
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
              <FontAwesomeIcon icon={faInfoCircle} className="text-amber-600 text-sm mt-0.5 shrink-0" />
              <span>
                <b>Lưu ý:</b> Khoản phí sửa đổi chỉ được áp dụng cho những học sinh được gắn thẻ.
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => dispatch(closeBatchModal())}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!applyToAll && selectedStudentIds.length === 0}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPen} className="text-xs" />
              <span>Cập nhật số tiền</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchUpdateFeeModal;
