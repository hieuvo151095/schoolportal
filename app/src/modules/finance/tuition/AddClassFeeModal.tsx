/**
 * Add Class Fee Modal Component (Thêm Khoản Phí Vào Lớp)
 * Modal triggered by "Thêm khoản phí" button (BR06, BR08)
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PopupModal + Dropdown + Icon)
 */

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addToast } from '../../../store/slices/toastSlice';
import { SlideOver, Dropdown, Icon } from '@/components/ds';
import {
  addClassFeeToMatrix,
  closeAddFeeModal,
} from '../../../store/slices/tuitionManagementSlice';

export const AddClassFeeModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    isAddFeeModalOpen,
    unassignedCatalogFees,
    assignedFees,
    matrixRows,
    activeClassId,
  } = useAppSelector((state) => state.tuitionManagement);

  const catalogFees = useAppSelector((state) => state.schoolFee.items || []);

  // Synchronize master catalog from Khoản Phí with Tuition Management
  const availableCatalogFees = React.useMemo(() => {
    const list = [...unassignedCatalogFees];
    catalogFees.forEach((fee) => {
      if (
        fee.type !== 'system' &&
        !assignedFees.some(
          (af) =>
            af.feeId === fee.id ||
            af.feeName.toLowerCase() === fee.name.toLowerCase()
        ) &&
        !list.some(
          (it) =>
            it.id === fee.id ||
            it.name.toLowerCase() === fee.name.toLowerCase()
        )
      ) {
        list.push({
          id: fee.id,
          name: fee.name,
          unit: fee.unit || 'thang',
          defaultAmount: fee.defaultAmount || 0,
          exportElectronicInvoice: fee.exportElectronicInvoice,
        });
      }
    });
    return list;
  }, [unassignedCatalogFees, catalogFees, assignedFees]);

  const [selectedFeeId, setSelectedFeeId] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [applyToAll, setApplyToAll] = useState<boolean>(true);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAddFeeModalOpen) {
      // Do not pre-fill fee, leave empty to allow user to select
      setSelectedFeeId('');
      setAmountInput('');
      setApplyToAll(true);
      setSelectedStudentIds(matrixRows.map((s) => s.studentId));
      setErrorMessage(null);
    }
  }, [isAddFeeModalOpen, matrixRows]);

  if (!isAddFeeModalOpen) {
    return null;
  }

  const selectedFee = availableCatalogFees.find((f) => f.id === selectedFeeId);

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
    !selectedFee ||
    !amountInput ||
    Number(amountInput.replace(/\D/g, '')) < 0 ||
    (!applyToAll && selectedStudentIds.length === 0);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedFee) {
      setErrorMessage('Vui lòng chọn một khoản phí hợp lệ.');
      return;
    }

    const parsedAmount = Number(amountInput.replace(/\D/g, ''));
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      setErrorMessage('Vui lòng nhập số tiền hợp lệ.');
      return;
    }

    if (!applyToAll && selectedStudentIds.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một học sinh áp dụng.');
      return;
    }

    const feeName = selectedFee.name;
    dispatch(
      addClassFeeToMatrix({
        classId: activeClassId,
        feeId: selectedFee.id,
        feeName: selectedFee.name,
        unit: selectedFee.unit,
        defaultAmount: parsedAmount,
        exportElectronicInvoice: selectedFee.exportElectronicInvoice,
        applyToAll,
        selectedStudentIds: applyToAll
          ? matrixRows.map((s) => s.studentId)
          : selectedStudentIds,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        message: `Đã thêm khoản phí "${feeName}" vào lớp thành công!`,
      })
    );
  };

  return (
    <SlideOver
      open={isAddFeeModalOpen}
      onClose={() => dispatch(closeAddFeeModal())}
      title="Thêm khoản phí vào lớp"
      description={`Lớp ${activeClassId}`}
      icon="plus"
      width={560}
      primaryAction={{
        label: 'Thêm vào lớp',
        onClick: () => handleSubmit(),
        disabled: isSubmitDisabled,
        icon: 'plus',
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: () => dispatch(closeAddFeeModal()),
      }}
    >
      <div className="space-y-4 text-left">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <Icon name="info" size={14} className="text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Fee Item Selection - Strictly Unassigned Fees (BR06) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Chọn khoản phí từ danh mục <span className="text-rose-500">*</span>
          </label>
          {availableCatalogFees.length === 0 ? (
            <div className="p-3 bg-slate-50 border border-slate-200 text-slate-500 text-xs rounded-xl">
              Tất cả các khoản phí trong danh mục đã được gán cho lớp này.
            </div>
          ) : (
            <Dropdown
              options={availableCatalogFees.map((fee) => ({
                value: fee.id,
                label: `${fee.name} (Định mức: ${fee.defaultAmount.toLocaleString('vi-VN')} đ / ${fee.unit})`,
              }))}
              value={selectedFeeId}
              onChange={(val) => {
                setSelectedFeeId(val);
                const fee = availableCatalogFees.find((f) => f.id === val);
                if (fee) {
                  setAmountInput(fee.defaultAmount.toString());
                }
              }}
              placeholder="-- Chọn khoản phí --"
              searchable={availableCatalogFees.length > 5}
              searchPlaceholder="Tìm khoản phí..."
              fullWidth
            />
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            Hiển thị {availableCatalogFees.length} khoản phí chưa gán cho lớp {activeClassId}.
          </p>
        </div>

        {selectedFee && (
          <>
            {/* Default Amount input */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Số tiền áp dụng <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amountInput ? new Intl.NumberFormat('vi-VN').format(Number(amountInput.replace(/\D/g, ''))) : ''}
                    onChange={(e) => setAmountInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    đ
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Đơn vị tính
                </label>
                <input
                  type="text"
                  value={selectedFee.unit}
                  readOnly
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Readonly Electronic Invoice Setting (BR08) */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Icon name="file" size={14} className="text-slate-400" />
                <span>Xuất hóa đơn điện tử (Xuất HĐĐT):</span>
              </div>
              <div>
                {selectedFee.exportElectronicInvoice ? (
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

            {/* Target Students Scope */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Gán cho học sinh <span className="text-rose-500">*</span>
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
                    name="addFeeScope"
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
                    name="addFeeScope"
                    checked={!applyToAll}
                    onChange={() => setApplyToAll(false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <Icon name="user-check" size={14} />
                  <span className="text-xs font-semibold">Học sinh được chọn</span>
                </label>
              </div>

              {!applyToAll && (
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2 max-h-40 overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-medium text-slate-500">
                    <span>Chọn học sinh ({selectedStudentIds.length}/{matrixRows.length})</span>
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
            </div>
          </>
        )}
      </div>
    </SlideOver>
  );
};

export default AddClassFeeModal;
