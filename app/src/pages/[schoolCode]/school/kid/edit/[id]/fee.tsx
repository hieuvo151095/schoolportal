import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Icon, Dropdown, SlideOver } from '@/components/ds';
import { PortalLayout } from '../../../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { updateStudentFees } from '../../../../../../store/slices/studentSlice';
import { addToast } from '../../../../../../store/slices/toastSlice';
import type { StudentFeeItem } from '../../../../../../types/student';
import {
  formatCurrencyVND,
  formatFeeUnitDisplay,
  isBreakfastFeeItem,
  evaluateStudentBreakfastRefundEligibility,
} from '../../../../../../utils/studentFeeCalculation';

export default function EditStudentFeePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const studentId = (router.query.id as string) || '';

  const student = useAppSelector((state) =>
    state.student.students.find((s) => s.id === studentId)
  );

  // Master fee catalog from Khoản phí sub-module
  const catalogFees = useAppSelector((state) => state.schoolFee.items || []);
  const mealRefundConfig = useAppSelector(
    (state) => state.settingFee.latePickupAndRefund?.mealRefund
  );

  // Initial Mandatory Fees (Học phí cơ bản & Tiền ăn cơ bản)
  const initialMandatoryFees: StudentFeeItem[] = useMemo(() => {
    if (student?.feeItems && student.feeItems.length > 0) {
      const mand = student.feeItems.filter((f) => f.isMandatory);
      if (mand.length > 0) return mand;
    }
    return [
      {
        id: `mand-hp-${studentId}`,
        feeId: 'fee-sys-001',
        code: 'HOC_PHI',
        name: 'Học phí',
        amount: 200000,
        unit: 'thang',
        unitDisplay: 'Đ/tháng',
        exportElectronicInvoice: true,
        category: 'hoc_phi',
        isMandatory: true,
      },
      {
        id: `mand-ta-${studentId}`,
        feeId: 'fee-sys-002',
        code: 'TIEN_AN',
        name: 'Tiền ăn',
        amount: 35000,
        unit: 'ngay',
        unitDisplay: 'Đ/ngày',
        exportElectronicInvoice: true,
        category: 'tien_an',
        isMandatory: true,
      },
    ];
  }, [student, studentId]);

  // Initial Custom Fees (Khoản phí khác)
  const initialCustomFees: StudentFeeItem[] = useMemo(() => {
    if (student?.feeItems && student.feeItems.length > 0) {
      const custom = student.feeItems.filter((f) => !f.isMandatory);
      if (custom.length > 0) return custom;
    }
    return [
      {
        id: `cust-1-${studentId}`,
        feeId: 'fee-cust-011',
        code: 'HOC_LIEU_LS',
        name: 'Học liệu Lịch sử',
        amount: 280000,
        unit: 'nam',
        unitDisplay: 'Đ/năm',
        exportElectronicInvoice: false,
        category: 'khac',
      },
      {
        id: `cust-2-${studentId}`,
        feeId: 'fee-cust-012',
        code: 'NGOAI_KHOA',
        name: 'Ngoại khóa',
        amount: 0,
        unit: 'thang',
        unitDisplay: 'Đ/tháng',
        exportElectronicInvoice: false,
        category: 'khac',
      },
      {
        id: `cust-3-${studentId}`,
        feeId: 'fee-cust-013',
        code: 'TIENG_ANH',
        name: 'Tiếng Anh',
        amount: 1000,
        unit: 'thang',
        unitDisplay: 'Đ/tháng',
        exportElectronicInvoice: false,
        category: 'khac',
      },
    ];
  }, [student, studentId]);

  // Form State
  const [mandatoryFees] = useState<StudentFeeItem[]>(initialMandatoryFees);
  const [customFees, setCustomFees] = useState<StudentFeeItem[]>(initialCustomFees);
  const [feeNotes, setFeeNotes] = useState<string>(student?.feeNotes || student?.notes || '');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Available fee items for adding: derived from Khoản phí sub-module
  const defaultAvailableFees = [
    { id: 'fee-cust-022', code: 'TIEN_AN_SANG', name: 'Ăn sáng', defaultAmount: 500000, unit: 'thang' },
    { id: 'fee-cust-002', code: 'NANG_KHIEU_VE', name: 'Năng khiếu: Vẽ', defaultAmount: 300000, unit: 'thang' },
    { id: 'fee-cust-003', code: 'PHI_HOC_BOI', name: 'Phí học bơi', defaultAmount: 400000, unit: 'thang' },
    { id: 'fee-cust-004', code: 'NANG_KHIEU', name: 'Năng khiếu', defaultAmount: 250000, unit: 'thang' },
    { id: 'fee-cust-005', code: 'NUOC_UONG', name: 'Nước uống', defaultAmount: 50000, unit: 'thang' },
    { id: 'fee-cust-006', code: 'DONG_PHUC', name: 'Đồng phục', defaultAmount: 350000, unit: 'bo' },
  ];

  const availableCatalogOptions = useMemo(() => {
    const list = [...defaultAvailableFees];
    catalogFees.forEach((fee) => {
      if (
        fee.type !== 'system' &&
        !list.some((it) => it.id === fee.id || it.name.toLowerCase() === fee.name.toLowerCase())
      ) {
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

  // Handle adding a new custom fee row
  const handleAddFeeRow = () => {
    // Find first fee not yet in customFees
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

  // Handle fee dropdown select change
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
            amount: matched ? (isBf && matched.defaultAmount === 0 ? 500000 : matched.defaultAmount) : item.amount,
            unit: matched ? matched.unit : item.unit,
            unitDisplay: matched ? formatFeeUnitDisplay(matched.unit) : item.unitDisplay,
          };
        }
        return item;
      })
    );
  };

  // Handle fee amount change
  const handleAmountChange = (rowId: string, valStr: string) => {
    const rawNum = parseInt(valStr.replace(/\D/g, ''), 10);
    const amount = isNaN(rawNum) ? 0 : rawNum;
    setCustomFees((prev) =>
      prev.map((item) => (item.id === rowId ? { ...item, amount } : item))
    );
  };

  // Handle fee removal
  const handleRemoveFeeRow = (rowId: string) => {
    setCustomFees((prev) => prev.filter((item) => item.id !== rowId));
  };

  // Check if student has Breakfast fee
  const allProposedFees = [...mandatoryFees, ...customFees];
  const tentativeStudent = student ? { ...student, feeItems: allProposedFees } : null;
  const breakfastEvaluation = evaluateStudentBreakfastRefundEligibility(
    tentativeStudent,
    mealRefundConfig
  );

  // Submit & Save handler
  const handleConfirmSave = () => {
    if (!student) return;

    // Filter valid custom fees
    const validCustom = customFees.filter((f) => f.name.trim() !== '');
    const finalFeeItems = [...mandatoryFees, ...validCustom];

    dispatch(
      updateStudentFees({
        studentId: student.id,
        feeItems: finalFeeItems,
        feeNotes,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        message: 'Cập nhật phí của học sinh thành công',
      })
    );

    setIsConfirmModalOpen(false);
    router.push(`/${schoolCode}/school/kid/detail/${student.id}`);
  };

  if (!student) {
    return (
      <PortalLayout schoolCode={schoolCode}>
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center space-y-4 max-w-xl mx-auto mt-12">
          <h2 className="text-lg font-bold text-slate-800">Không tìm thấy thông tin học sinh</h2>
          <p className="text-xs text-slate-500">Mã học sinh &quot;{studentId}&quot; không tồn tại.</p>
          <Link
            href={`/${schoolCode}/school/kid`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0070CE] rounded-lg"
          >
            Quay lại danh sách
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const hocPhiMandatory = mandatoryFees.find((f) => f.code === 'HOC_PHI') || mandatoryFees[0];
  const tienAnMandatory = mandatoryFees.find((f) => f.code === 'TIEN_AN') || mandatoryFees[1];

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Cập nhật học phí | {student.fullName}</title>
      </Head>

      <div className="space-y-6">
        {/* Header with Title & Subtitle */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${schoolCode}/school/kid/detail/${student.id}`}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Icon name="arrow-left" size={16} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070CE] flex items-center justify-center text-lg">
              <Icon name="receipt" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Cập nhật học phí học sinh
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {student.fullName} - {student.className}
              </p>
            </div>
          </div>
        </div>

        {/* Form Container Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8 space-y-8">
          {/* 1. Học Phí Cơ Bản & Tiền Ăn Cơ Bản */}
          <div className="space-y-6">
            {/* Học phí cơ bản */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Học phí cơ bản</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-2xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                  <Icon name="circle-check" size={10} />
                  <span>Xuất HĐĐT</span>
                </span>
              </div>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="px-3.5 py-2.5 bg-amber-50/80 text-amber-700 border-r border-slate-200">
                  <Icon name="graduation-cap" size={16} />
                </div>
                <input
                  type="text"
                  disabled
                  value={formatCurrencyVND(hocPhiMandatory?.amount || 200000)}
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-50 text-slate-700 font-semibold cursor-not-allowed outline-hidden"
                />
                <span className="px-4 py-2.5 text-xs text-slate-500 font-medium">
                  {hocPhiMandatory?.unitDisplay || 'Đ/tháng'}
                </span>
              </div>
            </div>

            {/* Tiền ăn cơ bản */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Tiền ăn cơ bản</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-2xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                  <Icon name="circle-check" size={10} />
                  <span>Xuất HĐĐT</span>
                </span>
              </div>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="px-3.5 py-2.5 bg-amber-50/80 text-amber-700 border-r border-slate-200">
                  <Icon name="utensils" size={16} />
                </div>
                <input
                  type="text"
                  disabled
                  value={formatCurrencyVND(tienAnMandatory?.amount || 35000)}
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-50 text-slate-700 font-semibold cursor-not-allowed outline-hidden"
                />
                <span className="px-4 py-2.5 text-xs text-slate-500 font-medium">
                  {tienAnMandatory?.unitDisplay || 'Đ/ngày'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Học Phí Lớp Ngoại Khóa */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-700">Học phí lớp ngoại khóa</h3>
            <p className="text-xs text-slate-400 italic">Chưa có khoản phí khác</p>
          </div>

          {/* 3. Khoản Phí Khác (Custom Fees list + Dropdowns) */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-700">Khoản phí khác</h3>

            <div className="space-y-3">
              {customFees.map((fee) => {
                const isBf = isBreakfastFeeItem(fee);

                return (
                  <div key={fee.id} className="flex items-center gap-3">
                    {/* Fee Select Dropdown */}
                    <div className="w-1/2 flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-[#0070CE] focus-within:ring-1 focus-within:ring-[#0070CE]">
                      <div className="px-3 py-2.5 bg-amber-50 text-amber-600 border-r border-slate-200 shrink-0 rounded-l-xl">
                        <Icon name="pen" size={12} />
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
                        <Icon name={isBf ? 'utensils' : 'coins'} size={14} />
                      </div>
                      <input
                        type="text"
                        value={fee.amount > 0 ? formatCurrencyVND(fee.amount) : ''}
                        placeholder="0"
                        onChange={(e) => handleAmountChange(fee.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm text-slate-800 bg-transparent outline-hidden font-mono"
                      />
                      <span className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">
                        {fee.unitDisplay || formatFeeUnitDisplay(fee.unit)}
                      </span>
                    </div>

                    {/* Delete Icon */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeeRow(fee.id)}
                      className="p-2.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Xóa khoản phí"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add Button */}
            <div>
              <button
                type="button"
                onClick={handleAddFeeRow}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-xl shadow-xs transition-colors"
              >
                <Icon name="plus" size={14} />
                <span>Thêm</span>
              </button>
            </div>
          </div>

          {/* 4. Ghi Chú */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-700">Ghi chú</h3>
            <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-[#0070CE] focus-within:ring-1 focus-within:ring-[#0070CE]">
              <div className="px-3.5 py-3 bg-amber-50 text-amber-600 border-r border-slate-200">
                <Icon name="pen" size={12} />
              </div>
              <textarea
                rows={3}
                value={feeNotes}
                onChange={(e) => setFeeNotes(e.target.value)}
                placeholder="Nhập ghi chú học phí cho học sinh..."
                className="w-full p-3 text-xs text-slate-800 bg-transparent outline-hidden resize-y"
              />
            </div>
          </div>

          {/* 5. Breakfast Refund Rule Live Indicator */}
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              breakfastEvaluation.status === 'eligible'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : breakfastEvaluation.status === 'school_disabled'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Icon name="circle-info" size={14} className="mt-0.5" />
            <div>
              <span className="font-bold block">Quy tắc hoàn tiền ăn sáng:</span>
              <p>{breakfastEvaluation.reason}</p>
            </div>
          </div>

          {/* 6. Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href={`/${schoolCode}/school/kid/detail/${student.id}`}
              className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Hủy bỏ
            </Link>

            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-xl shadow-xs transition-colors"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation SlideOver */}
      <SlideOver
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Xác nhận thay đổi học phí"
        description="Lưu thiết lập học phí tùy chỉnh cho học sinh"
        icon="circle-check"
        width={460}
        primaryAction={{
          label: 'Xác nhận lưu',
          icon: 'check',
          onClick: handleConfirmSave,
        }}
        secondaryAction={{
          label: 'Hủy bỏ',
          onClick: () => setIsConfirmModalOpen(false),
        }}
      >
        <div className="space-y-4 py-2">
          <div className="p-3.5 bg-blue-50 border border-blue-200/80 rounded-xl text-xs text-blue-900 leading-relaxed">
            Vui lòng xác nhận thay đổi học phí của học sinh! Các khoản thu đã điều chỉnh sẽ được áp dụng vào kỳ thu phí kế tiếp.
          </div>
        </div>
      </SlideOver>
    </PortalLayout>
  );
}
