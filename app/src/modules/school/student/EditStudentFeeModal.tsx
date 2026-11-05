import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faEdit,
  faGraduationCap,
  faUtensils,
  faCoffee,
  faCoins,
  faTrashAlt,
  faPlus,
  faCheckCircle,
  faInfoCircle,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateStudentFees } from '../../../store/slices/studentSlice';
import { addToast } from '../../../store/slices/toastSlice';
import type { Student, StudentFeeItem } from '../../../types/student';
import { Dropdown } from '@/components/ds';
import {
  formatCurrencyVND,
  formatFeeUnitDisplay,
  isBreakfastFeeItem,
  evaluateStudentBreakfastRefundEligibility,
} from '../../../utils/studentFeeCalculation';

interface EditStudentFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  currentFees: StudentFeeItem[];
}

export const EditStudentFeeModal: React.FC<EditStudentFeeModalProps> = ({
  isOpen,
  onClose,
  student,
  currentFees,
}) => {
  const dispatch = useAppDispatch();

  // Master fee catalog from Redux
  const catalogFees = useAppSelector((state) => state.schoolFee?.items || []);
  // Class fee matrix from Redux
  const tuitionMatrixRows = useAppSelector(
    (state) => state.tuitionManagement?.matrixRows || []
  );
  // Meal refund configuration from Settings module
  const mealRefundConfig = useAppSelector(
    (state) => state.settingFee?.latePickupAndRefund?.mealRefund
  );

  // Mandatory fee items
  const hocPhiMandatory = useMemo(() => {
    return (
      currentFees.find(
        (f) =>
          f.isMandatory &&
          (f.category === 'hoc_phi' ||
            f.code === 'HOC_PHI' ||
            f.name.toLowerCase().includes('học phí'))
      ) || {
        id: `mand-hoc-phi-${student.id}`,
        feeId: 'fee-sys-001',
        code: 'HOC_PHI',
        name: 'Học phí cơ bản',
        amount: 200000,
        unit: 'thang',
        unitDisplay: 'Đ/tháng',
        exportElectronicInvoice: true,
        category: 'hoc_phi' as const,
        isMandatory: true,
      }
    );
  }, [currentFees, student.id]);

  const tienAnMandatory = useMemo(() => {
    return (
      currentFees.find(
        (f) =>
          f.isMandatory &&
          (f.category === 'tien_an' ||
            f.code === 'TIEN_AN' ||
            f.name.toLowerCase().includes('tiền ăn'))
      ) || {
        id: `mand-tien-an-${student.id}`,
        feeId: 'fee-sys-002',
        code: 'TIEN_AN',
        name: 'Tiền ăn cơ bản',
        amount: 35000,
        unit: 'ngay',
        unitDisplay: 'Đ/ngày',
        exportElectronicInvoice: true,
        category: 'tien_an' as const,
        isMandatory: true,
      }
    );
  }, [currentFees, student.id]);

  const mandatoryFees: StudentFeeItem[] = useMemo(
    () => [hocPhiMandatory, tienAnMandatory],
    [hocPhiMandatory, tienAnMandatory]
  );

  // Available catalog fee options
  const availableCatalogOptions = useMemo(() => {
    const list: Array<{
      id: string;
      code: string;
      name: string;
      defaultAmount: number;
      unit: string;
    }> = [];

    const defaultCatalogList = [
      { id: 'fee-25', code: 'AN_SANG', name: 'Ăn sáng', defaultAmount: 500000, unit: 'thang' },
      { id: 'fee-cust-001', code: 'VE', name: 'Năng khiếu: Vẽ', defaultAmount: 280000, unit: 'nam' },
      { id: 'fee-cust-002', code: 'BOI', name: 'Phí học bơi', defaultAmount: 300000, unit: 'thang' },
      { id: 'fee-cust-003', code: 'NANG_KHIEU', name: 'Năng khiếu', defaultAmount: 150000, unit: 'thang' },
      { id: 'fee-cust-004', code: 'NUOC_UONG', name: 'Nước uống', defaultAmount: 50000, unit: 'thang' },
      { id: 'fee-cust-005', code: 'DONG_PHUC', name: 'Đồng phục', defaultAmount: 350000, unit: 'lan' },
      { id: 'fee-cust-006', code: 'STEAM', name: 'Học STEAM', defaultAmount: 400000, unit: 'thang' },
      { id: 'fee-cust-007', code: 'BAN_TRU_T7', name: 'Bán trú thứ 7', defaultAmount: 120000, unit: 'ngay' },
      { id: 'fee-cust-008', code: 'KY_NANG_SONG', name: 'Kỹ năng sống', defaultAmount: 250000, unit: 'thang' },
      { id: 'fee-cust-009', code: 'DA_NGOAI', name: 'Dã ngoại học kỳ 1', defaultAmount: 300000, unit: 'lan' },
      { id: 'fee-cust-010', code: 'CO_VUA', name: 'Câu lạc bộ Cờ vua', defaultAmount: 200000, unit: 'thang' },
      { id: 'fee-cust-011', code: 'AM_NHAC', name: 'Câu lạc bộ Âm nhạc', defaultAmount: 200000, unit: 'thang' },
      { id: 'fee-cust-012', code: 'BAO_HIEM', name: 'Bảo hiểm thân thể', defaultAmount: 180000, unit: 'nam' },
      { id: 'fee-cust-013', code: 'HOC_LIEU', name: 'Học liệu Lịch sử', defaultAmount: 280000, unit: 'nam' },
      { id: 'fee-cust-014', code: 'NGOAI_KHOA', name: 'Ngoại khóa', defaultAmount: 0, unit: 'thang' },
      { id: 'fee-cust-015', code: 'TIENG_ANH', name: 'Tiếng Anh', defaultAmount: 1000, unit: 'thang' },
      { id: 'fee-cust-016', code: 'CAMBRIDGE', name: 'Lệ phí thi Cambridge', defaultAmount: 850000, unit: 'lan' },
      { id: 'fee-cust-017', code: 'THE_THONG_MINH', name: 'Phí thẻ học sinh thông minh', defaultAmount: 60000, unit: 'lan' },
    ];

    defaultCatalogList.forEach((item) => list.push(item));

    catalogFees.forEach((fee) => {
      if (!list.some((existing) => existing.name.toLowerCase() === fee.name.toLowerCase())) {
        list.push({
          id: fee.id,
          code: fee.code,
          name: fee.name,
          defaultAmount: fee.defaultAmount || 0,
          unit: fee.unit || 'thang',
        });
      }
    });

    return list;
  }, [catalogFees]);

  // Local state for editable custom fees
  const [customFees, setCustomFees] = useState<StudentFeeItem[]>(() => {
    const nonMandatory = currentFees.filter((f) => !f.isMandatory);
    if (nonMandatory.length > 0) return nonMandatory;
    return [
      {
        id: `sfee-${student.id}-hoc-lieu`,
        feeId: 'fee-cust-013',
        code: 'HOC_LIEU',
        name: 'Học liệu Lịch sử',
        amount: 280000,
        unit: 'nam',
        unitDisplay: 'Đ/năm',
        exportElectronicInvoice: false,
        category: 'khac',
      },
      {
        id: `sfee-${student.id}-ngoai-khoa`,
        feeId: 'fee-cust-014',
        code: 'NGOAI_KHOA',
        name: 'Ngoại khóa',
        amount: 0,
        unit: 'thang',
        unitDisplay: 'Đ/tháng',
        exportElectronicInvoice: false,
        category: 'khac',
      },
      {
        id: `sfee-${student.id}-tieng-anh`,
        feeId: 'fee-cust-015',
        code: 'TIENG_ANH',
        name: 'Tiếng Anh',
        amount: 1000,
        unit: 'thang',
        unitDisplay: 'Đ/tháng',
        exportElectronicInvoice: false,
        category: 'khac',
      },
    ];
  });

  const [note, setNote] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Add fee row
  const handleAddFeeRow = () => {
    const unused = availableCatalogOptions.find(
      (opt) => !customFees.some((f) => f.name.toLowerCase() === opt.name.toLowerCase())
    );

    const newFee: StudentFeeItem = {
      id: `fee-row-${Date.now()}`,
      feeId: unused ? unused.id : '',
      code: unused ? unused.code : '',
      name: unused ? unused.name : '',
      amount: unused ? unused.defaultAmount : 0,
      unit: unused ? unused.unit : 'thang',
      unitDisplay: unused ? formatFeeUnitDisplay(unused.unit) : 'Đ/tháng',
      exportElectronicInvoice: false,
      category: 'khac',
    };

    setCustomFees([...customFees, newFee]);
  };

  // Change fee row item
  const handleFeeSelectChange = (rowId: string, selectedFeeName: string) => {
    const matched = availableCatalogOptions.find((opt) => opt.name === selectedFeeName);
    setCustomFees((prev) =>
      prev.map((item) => {
        if (item.id === rowId) {
          const isBf = matched ? isBreakfastFeeItem(matched) : false;
          return {
            ...item,
            feeId: matched ? matched.id : '',
            code: matched ? matched.code : '',
            name: selectedFeeName,
            amount: matched
              ? isBf && matched.defaultAmount === 0
                ? 500000
                : matched.defaultAmount
              : item.amount,
            unit: matched ? matched.unit : item.unit,
            unitDisplay: matched ? formatFeeUnitDisplay(matched.unit) : item.unitDisplay,
          };
        }
        return item;
      })
    );
  };

  // Change amount
  const handleAmountChange = (rowId: string, valStr: string) => {
    const rawNum = parseInt(valStr.replace(/\D/g, ''), 10);
    const amount = isNaN(rawNum) ? 0 : rawNum;
    setCustomFees((prev) =>
      prev.map((item) => (item.id === rowId ? { ...item, amount } : item))
    );
  };

  // Delete row
  const handleRemoveFeeRow = (rowId: string) => {
    setCustomFees((prev) => prev.filter((item) => item.id !== rowId));
  };

  // Breakfast refund rule evaluation
  const allProposedFees = [...mandatoryFees, ...customFees];
  const tentativeStudent = { ...student, feeItems: allProposedFees };
  const refundRulePreview = evaluateStudentBreakfastRefundEligibility(
    tentativeStudent,
    mealRefundConfig
  );

  // Commit and save fees
  const handleExecuteSave = () => {
    dispatch(
      updateStudentFees({
        studentId: student.id,
        feeItems: allProposedFees,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        message: 'Cập nhật học phí của học sinh thành công',
      })
    );

    setIsConfirmOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4.5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faCoins} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Cập nhật học phí học sinh
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {student.fullName} — <span className="text-amber-700 font-semibold">{student.className || 'Lớp 11A1'}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-sm" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* 1. Mandatory Fees */}
          <div className="space-y-3">
            {/* Học phí cơ bản */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Học phí cơ bản</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-2xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-2xs" />
                  <span>Xuất HĐĐT</span>
                </span>
              </div>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="px-3.5 py-2.5 bg-amber-50/80 text-amber-700 border-r border-slate-200">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <input
                  type="text"
                  disabled
                  value={formatCurrencyVND(hocPhiMandatory.amount)}
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-50 text-slate-700 font-semibold cursor-not-allowed outline-none"
                />
                <span className="px-4 py-2.5 text-xs text-slate-500 font-medium">
                  {hocPhiMandatory.unitDisplay}
                </span>
              </div>
            </div>

            {/* Tiền ăn cơ bản */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Tiền ăn cơ bản</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-2xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-2xs" />
                  <span>Xuất HĐĐT</span>
                </span>
              </div>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="px-3.5 py-2.5 bg-amber-50/80 text-amber-700 border-r border-slate-200">
                  <FontAwesomeIcon icon={faUtensils} />
                </div>
                <input
                  type="text"
                  disabled
                  value={formatCurrencyVND(tienAnMandatory.amount)}
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-50 text-slate-700 font-semibold cursor-not-allowed outline-none"
                />
                <span className="px-4 py-2.5 text-xs text-slate-500 font-medium">
                  {tienAnMandatory.unitDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Extra Curricular Tuition */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-700">Học phí lớp ngoại khóa</h3>
            <p className="text-xs text-slate-400 italic">Chưa có khoản phí khác</p>
          </div>

          {/* 3. Custom Fees List */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-700">Khoản phí khác</h3>
              <span className="text-xs text-slate-400">
                {customFees.length} mục đã thiết lập
              </span>
            </div>

            <div className="space-y-3">
              {customFees.map((fee) => {
                const isBf = isBreakfastFeeItem(fee);

                return (
                  <div key={fee.id} className="flex items-center gap-3">
                    {/* Fee Select Dropdown */}
                    <div className="w-1/2 flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-[#0070CE] focus-within:ring-1 focus-within:ring-[#0070CE]">
                      <div className="px-3 py-2.5 bg-amber-50 text-amber-600 border-r border-slate-200 shrink-0 rounded-l-xl">
                        <FontAwesomeIcon icon={faEdit} className="text-xs" />
                      </div>
                      <Dropdown
                        options={availableCatalogOptions.map((opt) => ({
                          value: opt.name,
                          label: opt.name,
                          sublabel:
                            opt.defaultAmount > 0
                              ? `${formatCurrencyVND(opt.defaultAmount)} ${formatFeeUnitDisplay(opt.unit)}`
                              : undefined,
                        }))}
                        value={fee.name}
                        placeholder="Chọn..."
                        onChange={(val) => handleFeeSelectChange(fee.id, val)}
                        variant="ghost"
                        searchable={true}
                        searchPlaceholder="Tìm khoản phí..."
                        className="flex-1 min-w-0"
                      />
                    </div>

                    {/* Amount Input */}
                    <div className="w-1/2 flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-[#0070CE] focus-within:ring-1 focus-within:ring-[#0070CE]">
                      <div className="px-3 py-2.5 bg-amber-50 text-amber-600 border-r border-slate-200">
                        <FontAwesomeIcon icon={isBf ? faCoffee : faCoins} className="text-xs" />
                      </div>
                      <input
                        type="text"
                        value={fee.amount > 0 ? formatCurrencyVND(fee.amount) : ''}
                        placeholder="0"
                        onChange={(e) => handleAmountChange(fee.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm text-slate-800 bg-transparent outline-none font-mono"
                      />
                      <span className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">
                        {fee.unitDisplay || formatFeeUnitDisplay(fee.unit)}
                      </span>
                    </div>

                    {/* Delete Icon */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeeRow(fee.id)}
                      className="p-2.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Xóa khoản phí"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="text-sm" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* + Thêm Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleAddFeeRow}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-lg shadow-2xs transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="text-xs" />
                <span>Thêm</span>
              </button>
            </div>
          </div>

          {/* 4. Notes Textarea */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">
              Ghi chú
            </label>
            <div className="flex items-start rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-[#0070CE] focus-within:ring-1 focus-within:ring-[#0070CE]">
              <div className="px-3 py-2.5 bg-amber-50 text-amber-600 border-r border-slate-200 h-full">
                <FontAwesomeIcon icon={faEdit} className="text-xs" />
              </div>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú học phí cho học sinh..."
                className="w-full px-3 py-2 text-sm text-slate-800 bg-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* 5. Breakfast Refund Live Insight Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-slate-400 mt-0.5 shrink-0"
            />
            <div>
              <span className="font-semibold text-slate-700 block mb-0.5">
                Quy tắc hoàn tiền ăn sáng:
              </span>
              <span>{refundRulePreview.reason}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-lg shadow-2xs transition-colors"
          >
            Cập nhật
          </button>
        </div>

        {/* Confirmation Modal overlay */}
        {isConfirmOpen && (
          <div className="absolute inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                <FontAwesomeIcon icon={faCheck} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  Xác nhận thay đổi học phí
                </h3>
                <p className="text-xs text-slate-500">
                  Vui lòng xác nhận lưu thiết lập biểu phí cho học sinh {student.fullName}?
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleExecuteSave}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-lg transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
