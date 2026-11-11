import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserClock,
  faSave,
  faUndo,
  faPlus,
  faTrashAlt,
  faInfoCircle,
  faCheckCircle,
  faTimesCircle,
  faUserGraduate,
  faCalculator,
  faSun,
  faCoffee,
  faChevronDown,
  faChevronUp,
  faFileSignature,
  faBan,
  faSlidersH,
  faTag,
  faUtensils
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  updateDraftLatePickup,
  addLatePickupTier,
  updateLatePickupTier,
  deleteLatePickupTier,
  updateDraftMealRefund,
  updateDraftExcusedRates,
  updateDraftUnexcusedRates,
  addDraftRefundableFee,
  addDraftRefundableFees,
  removeDraftRefundableFee,
  updateDraftRefundableFeeRate,
  saveLatePickupAndRefund,
  discardLatePickupAndRefund
} from '@/store/slices/settingFeeSlice';
import { formatCurrencyVND } from '@/utils/settingFeeValidation';
import { addToast } from '@/store/slices/toastSlice';
import { Dropdown } from '@/components/ds';
import { AddRefundableFeeModal } from './AddRefundableFeeModal';
import type { RefundableFeeConfigItem } from '@/types/settingFee';
import type { FeeItem } from '@/types/schoolFee';

const FIXED_INTERVAL_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export const LatePickupAndRefundBlock: React.FC = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.settingFee.draft.latePickupAndRefund);
  const isDirty = useAppSelector((state) => state.settingFee.dirtyFlags.latePickupAndRefund);

  const { latePickup, mealRefund } = draft;

  // Granular Rates for Student Self-Absence (Excused vs Unexcused)
  const excusedRates = mealRefund.excusedRates || mealRefund.rates || { mainMealRatePercent: 50, breakfastRatePercent: 70 };
  const unexcusedRates = mealRefund.unexcusedRates || { mainMealRatePercent: 0, breakfastRatePercent: 0 };

  // Dynamic Refundable Fees (Strictly unit 'ngày', defaults to 'Tiền ăn' only)
  const defaultRefundableFees: RefundableFeeConfigItem[] = useMemo(() => [
    {
      feeId: 'fee-sys-002',
      code: 'TIEN_AN',
      name: 'Tiền ăn (bán trú / trưa)',
      unit: 'ngày',
      defaultAmount: 40000,
      isDefault: true,
      excusedRatePercent: excusedRates.mainMealRatePercent ?? 50,
      unexcusedRatePercent: unexcusedRates.mainMealRatePercent ?? 0
    },
    {
      feeId: 'fee-cust-006',
      code: 'DUA_DON_2A8',
      name: 'Phí đưa đón 2A8',
      unit: 'ngày',
      defaultAmount: 20000,
      isDefault: false,
      excusedRatePercent: 50,
      unexcusedRatePercent: 0
    }
  ], [excusedRates.mainMealRatePercent, unexcusedRates.mainMealRatePercent]);

  const refundableFees: RefundableFeeConfigItem[] =
    mealRefund.refundableFees && mealRefund.refundableFees.length > 0
      ? mealRefund.refundableFees
      : defaultRefundableFees;

  // Local UI states
  const [activeAbsenceTab, setActiveAbsenceTab] = useState<'co_phep' | 'khong_phep'>('co_phep');
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);
  const [isAddFeeModalOpen, setIsAddFeeModalOpen] = useState<boolean>(false);

  // Dynamic Simulation calculation numbers based on standard example (Tháng 9 -> Hóa đơn Tháng 10)
  // Evaluates both excused self-absence days (3 days) and unexcused self-absence days (2 days)
  const simExcusedDays = 3;
  const simUnexcusedDays = 2;

  const simulationItems = useMemo(() => {
    return refundableFees.map((fee) => {
      const unitPrice =
        fee.defaultAmount && fee.defaultAmount > 0
          ? fee.defaultAmount
          : fee.code === 'TIEN_AN'
          ? 40000
          : 20000;
      const excusedRate = fee.excusedRatePercent ?? 50;
      const unexcusedRate = fee.unexcusedRatePercent ?? 0;

      const excusedRefund = Math.round(
        simExcusedDays * unitPrice * (excusedRate / 100)
      );
      const unexcusedRefund = Math.round(
        simUnexcusedDays * unitPrice * (unexcusedRate / 100)
      );
      const totalRefund = excusedRefund + unexcusedRefund;

      return {
        feeId: fee.feeId,
        name: fee.name,
        unitPrice,
        excusedRefund,
        unexcusedRefund,
        totalRefund,
        excusedRate,
        unexcusedRate
      };
    });
  }, [refundableFees, simExcusedDays, simUnexcusedDays]);

  const simExcusedTotal = useMemo(
    () => simulationItems.reduce((acc, it) => acc + it.excusedRefund, 0),
    [simulationItems]
  );
  const simUnexcusedTotal = useMemo(
    () => simulationItems.reduce((acc, it) => acc + it.unexcusedRefund, 0),
    [simulationItems]
  );
  const simMonthTotal = useMemo(
    () => simExcusedTotal + simUnexcusedTotal,
    [simExcusedTotal, simUnexcusedTotal]
  );

  const handleBatchAddFees = (fees: FeeItem[]) => {
    const items: RefundableFeeConfigItem[] = fees.map((fee) => ({
      feeId: fee.id,
      code: fee.code,
      name: fee.name,
      unit: 'ngày',
      defaultAmount: fee.defaultAmount || 0,
      isDefault: false,
      excusedRatePercent: 50,
      unexcusedRatePercent: 0
    }));

    dispatch(addDraftRefundableFees(items));
    dispatch(
      addToast({
        type: 'success',
        message:
          fees.length === 1
            ? `Đã thêm khoản phí "${fees[0].name}" vào danh sách hoàn tiền!`
            : `Đã thêm ${fees.length} khoản phí vào danh sách hoàn tiền!`
      })
    );
    setIsAddFeeModalOpen(false);
  };

  const handleSelectFeeToAdd = (fee: FeeItem) => {
    handleBatchAddFees([fee]);
  };

  const handleRemoveFee = (feeId: string, feeName: string) => {
    dispatch(removeDraftRefundableFee(feeId));
    dispatch(
      addToast({
        type: 'info',
        message: `Đã xóa khoản phí "${feeName}" khỏi danh sách hoàn tiền.`
      })
    );
  };

  const handleUpdateFeeRate = (
    feeId: string,
    rateType: 'excused' | 'unexcused',
    percent: number
  ) => {
    dispatch(
      updateDraftRefundableFeeRate({
        feeId,
        rateType,
        percent: Math.min(100, Math.max(0, percent))
      })
    );
  };

  const handleSave = () => {
    dispatch(saveLatePickupAndRefund());
    dispatch(
      addToast({
        type: 'success',
        message: 'Lưu cấu hình trả trễ & cơ chế hoàn tiền ăn thành công!'
      })
    );
  };

  const handleDiscard = () => {
    dispatch(discardLatePickupAndRefund());
    dispatch(
      addToast({
        type: 'info',
        message: 'Đã hoàn tác thay đổi cấu hình trả trễ & cơ chế hoàn tiền ăn.'
      })
    );
  };

  const handleAddTier = () => {
    const lastTier = latePickup.tiers[latePickup.tiers.length - 1];
    const newTier = {
      id: `tier-${Date.now()}`,
      startTime: lastTier ? lastTier.endTime : '18:00',
      endTime: '19:00',
      amount: lastTier ? lastTier.amount + 20000 : 50000
    };
    dispatch(addLatePickupTier(newTier));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FontAwesomeIcon icon={faUserClock} className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Cấu hình trả trễ & Báo vắng hoàn tiền ăn
              </h2>
              {isDirty && (
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  Chưa lưu
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Thiết lập quy tắc tính phí giữ trẻ ngoài giờ và cơ chế hoàn tiền ăn (bán trú / ăn sáng) khi học sinh nghỉ học.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FontAwesomeIcon icon={faUndo} className="w-3 h-3" />
              <span>Hoàn tác</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-xs ${
              isDirty
                ? 'bg-[#0070CE] hover:bg-[#005bb5] text-white cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <FontAwesomeIcon icon={faSave} className="w-3.5 h-3.5" />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-8">
        {/* ========================================================================= */}
        {/* Section 1: Late Pickup (Cấu hình trả trễ) */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                1. Cấu hình tính phí trả trễ (Đón muộn)
              </h3>
            </div>
            {/* Master Toggle */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-medium text-slate-600">
                {latePickup.isEnabled ? 'Bật tính phí' : 'Không tính phí'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={latePickup.isEnabled}
                  onChange={(e) =>
                    dispatch(updateDraftLatePickup({ isEnabled: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0070CE]"></div>
              </label>
            </div>
          </div>

          <div
            className={`space-y-5 transition-opacity ${
              latePickup.isEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            {/* Mode Selector Radio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  latePickup.calculationMode === 'fixed'
                    ? 'border-[#0070CE] bg-blue-50/40 ring-1 ring-[#0070CE]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="latePickupMode"
                  value="fixed"
                  checked={latePickup.calculationMode === 'fixed'}
                  onChange={() =>
                    dispatch(updateDraftLatePickup({ calculationMode: 'fixed' }))
                  }
                  className="mt-0.5 text-[#0070CE] focus:ring-[#0070CE]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Khung thời gian cố định
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Tính tiền đồng giá theo từng block thời gian làm tròn (ví dụ 30 phút/block).
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  latePickup.calculationMode === 'tiered'
                    ? 'border-[#0070CE] bg-blue-50/40 ring-1 ring-[#0070CE]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="latePickupMode"
                  value="tiered"
                  checked={latePickup.calculationMode === 'tiered'}
                  onChange={() =>
                    dispatch(updateDraftLatePickup({ calculationMode: 'tiered' }))
                  }
                  className="mt-0.5 text-[#0070CE] focus:ring-[#0070CE]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Bậc thang theo khung giờ
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Thiết lập nhiều khung giờ cụ thể với đơn giá lũy tiến khác nhau.
                  </div>
                </div>
              </label>
            </div>

            {/* Mode A: Fixed Rate Controls */}
            {latePickup.calculationMode === 'fixed' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50/70 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Thời gian trả trễ (Block tính phí)
                  </label>
                  <Dropdown
                    placeholder="Chọn block tính phí"
                    options={FIXED_INTERVAL_OPTIONS.map((min) => ({
                      value: String(min),
                      label: `${min} phút`,
                    }))}
                    value={String(latePickup.fixedIntervalMinutes)}
                    onChange={(val) =>
                      dispatch(
                        updateDraftLatePickup({
                          fixedIntervalMinutes: parseInt(val, 10),
                        })
                      )
                    }
                    size="sm"
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Số tiền / học sinh / giờ (VNĐ)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="5000"
                      min="0"
                      value={latePickup.fixedAmountPerHour}
                      onChange={(e) =>
                        dispatch(
                          updateDraftLatePickup({
                            fixedAmountPerHour: Math.max(0, parseInt(e.target.value, 10) || 0)
                          })
                        )
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
                    />
                    <span className="absolute right-3 top-2 text-xs font-semibold text-slate-400">
                      {formatCurrencyVND(latePickup.fixedAmountPerHour)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Mode B: Tiered Bracket Table */}
            {latePickup.calculationMode === 'tiered' && (
              <div className="space-y-3">
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3 w-14 text-center">STT</th>
                        <th className="py-2.5 px-4">Khung giờ bắt đầu</th>
                        <th className="py-2.5 px-4">Khung giờ kết thúc</th>
                        <th className="py-2.5 px-4">Đơn giá (VNĐ)</th>
                        <th className="py-2.5 px-3 w-20 text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {latePickup.tiers.map((tier, index) => {
                        const isFirstRow = index === 0;
                        return (
                          <tr key={tier.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                              {index + 1}
                            </td>
                            <td className="py-2.5 px-4">
                              <input
                                type="time"
                                value={tier.startTime}
                                onChange={(e) =>
                                  dispatch(
                                    updateLatePickupTier({
                                      index,
                                      tier: { startTime: e.target.value }
                                    })
                                  )
                                }
                                className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                              />
                            </td>
                            <td className="py-2.5 px-4">
                              <input
                                type="time"
                                value={tier.endTime}
                                onChange={(e) =>
                                  dispatch(
                                    updateLatePickupTier({
                                      index,
                                      tier: { endTime: e.target.value }
                                    })
                                  )
                                }
                                className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                              />
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  step="5000"
                                  min="0"
                                  value={tier.amount}
                                  onChange={(e) =>
                                    dispatch(
                                      updateLatePickupTier({
                                        index,
                                        tier: {
                                          amount: Math.max(0, parseInt(e.target.value, 10) || 0)
                                        }
                                      })
                                    )
                                  }
                                  className="w-36 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                                />
                                <span className="text-[11px] font-medium text-slate-500">
                                  {formatCurrencyVND(tier.amount)}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {isFirstRow ? (
                                <span
                                  className="text-[11px] text-slate-300 italic"
                                  title="Khung giờ cơ sở không thể xóa"
                                >
                                  Cố định
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => dispatch(deleteLatePickupTier(index))}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Xóa khung giờ này"
                                >
                                  <FontAwesomeIcon icon={faTrashAlt} className="w-3 h-3" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddTier}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0070CE] hover:text-[#005bb5] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                    <span>Thêm khung giờ</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 2: Refund Mechanism (Thiết Lập Cơ Chế Hoàn Tiền Khi Nghỉ Học) */}
        {/* ========================================================================= */}
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  2. Thiết lập cơ chế hoàn tiền khi nghỉ học
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tự động tính toán số tiền hoàn và giảm trừ trực tiếp vào hóa đơn học phí tháng tiếp theo (M+1).
                </p>
              </div>
            </div>
            {/* Master Toggle */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-medium text-slate-600">
                {mealRefund.isEnabled ? 'Bật cơ chế hoàn tiền' : 'Tắt hoàn tiền'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={mealRefund.isEnabled}
                  onChange={(e) =>
                    dispatch(updateDraftMealRefund({ isEnabled: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0070CE]"></div>
              </label>
            </div>
          </div>

          {mealRefund.isEnabled ? (
            <div className="space-y-6">
              {/* Active Refundable Fee Line Items Management Toolbar */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200/80 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faTag} className="w-3.5 h-3.5 text-[#0070CE]" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Các khoản phí áp dụng cơ chế hoàn tiền khi nghỉ học
                      </h4>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                        {refundableFees.length} khoản phí
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Chỉ các khoản phí có đơn vị tính theo{' '}
                      <strong className="text-blue-700">Ngày</strong> trong danh mục mới có thể áp dụng. Mỗi khoản phí được thêm sẽ được cài đặt tỷ lệ hoàn tiền cho trường hợp vắng có phép và không phép.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddFeeModalOpen(true)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-[#0070CE] hover:bg-[#005bb5] rounded-lg shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                    <span>Thêm khoản phí hoàn tiền</span>
                  </button>
                </div>

                {/* Badges of Active Fees */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {refundableFees.map((fee) => (
                    <div
                      key={fee.feeId}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        fee.isDefault
                          ? 'bg-blue-100/60 border-blue-300 text-blue-900 font-bold'
                          : 'bg-white border-slate-300 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={fee.code === 'TIEN_AN' || fee.code === 'AN_SANG' ? faSun : faTag}
                        className={`w-3.5 h-3.5 ${
                          fee.isDefault ? 'text-blue-600' : 'text-slate-500'
                        }`}
                      />
                      <span>{fee.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                        Đơn vị: Ngày
                      </span>
                      {fee.defaultAmount !== undefined && fee.defaultAmount > 0 && (
                        <span className="text-[11px] text-slate-500 font-normal">
                          ({formatCurrencyVND(fee.defaultAmount)}/ngày)
                        </span>
                      )}
                      {fee.isDefault ? (
                        <span
                          className="text-[10px] text-blue-700 font-semibold bg-blue-200/60 px-1.5 py-0.2 rounded"
                          title="Khoản phí hệ thống mặc định (Không thể xóa)"
                        >
                          Mặc định
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoveFee(fee.feeId, fee.name)}
                          className="ml-1 text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
                          title={`Xóa "${fee.name}" khỏi danh sách hoàn tiền`}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* Cấu hình tỷ lệ hoàn tiền khi học sinh tự nghỉ (Nghỉ có phép & Không phép) */}
              {/* ------------------------------------------------------------- */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shadow-2xs border border-amber-200">
                      <FontAwesomeIcon icon={faUserGraduate} className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                        Cấu hình tỷ lệ hoàn tiền khi học sinh tự nghỉ
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Thiết lập % hoàn tiền cho các khoản phí theo 2 diện: Nghỉ có phép & Nghỉ không phép
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 w-fit">
                    <FontAwesomeIcon icon={faSlidersH} className="w-3 h-3 text-amber-600" />
                    2 chế độ nghỉ: Có phép & Không phép
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Cơ chế hoàn tiền tự động chỉ áp dụng khi học sinh tự nghỉ học. Hệ thống xác định qua <strong>Đơn báo vắng của phụ huynh</strong> hoặc <strong>Điểm danh vắng</strong> trên hệ thống:
                </p>

                {/* Dual Tab Switcher */}
                <div className="flex border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveAbsenceTab('co_phep')}
                    className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeAbsenceTab === 'co_phep'
                        ? 'border-[#0070CE] text-[#0070CE] bg-blue-50/50'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faFileSignature}
                      className={`w-3.5 h-3.5 ${
                        activeAbsenceTab === 'co_phep' ? 'text-[#0070CE]' : 'text-slate-400'
                      }`}
                    />
                    <span>Nghỉ có phép</span>
                    <span className="ml-1 text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                      Được hoàn tiền
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveAbsenceTab('khong_phep')}
                    className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeAbsenceTab === 'khong_phep'
                        ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faBan}
                      className={`w-3.5 h-3.5 ${
                        activeAbsenceTab === 'khong_phep' ? 'text-amber-600' : 'text-slate-400'
                      }`}
                    />
                    <span>Nghỉ không phép</span>
                    <span className="ml-1 text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-semibold">
                      Mặc định 0%
                    </span>
                  </button>
                </div>

                {/* Tab 1 Content: Nghỉ có phép */}
                {activeAbsenceTab === 'co_phep' && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200 text-xs text-blue-900 space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-2 font-bold text-blue-900">
                        <FontAwesomeIcon icon={faInfoCircle} className="w-3.5 h-3.5 text-blue-600" />
                        <span>Điều kiện tính &quot;Vắng có phép&quot;:</span>
                      </div>
                      <p className="text-[11px] text-blue-800 leading-relaxed pl-5">
                        Áp dụng khi phụ huynh <strong>gửi đơn báo vắng đúng thời hạn</strong> (trước mốc giờ báo trước) hoặc giáo viên điểm danh vắng có phép trên hệ thống.
                      </p>
                      <div className="p-2.5 bg-white/90 rounded border border-blue-200/90 text-[11px] text-blue-950 font-medium">
                        ⚡ <strong>Quy tắc ưu tiên dữ liệu:</strong> Điểm danh của giáo viên có giá trị cao hơn đơn báo vắng của phụ huynh. Nếu phụ huynh gửi đơn báo vắng nhưng sau đó học sinh vẫn đến lớp và được giáo viên điểm danh (có mặt), hệ thống sẽ ưu tiên ghi nhận theo điểm danh của giáo viên và tính là <strong>học sinh đi học</strong> (không phát sinh hoàn tiền).
                      </div>
                    </div>

                    {/* Dynamic Excused Rate Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {refundableFees.map((fee) => (
                        <div
                          key={`excused-${fee.feeId}`}
                          className="p-3.5 bg-slate-50/80 rounded-lg border border-slate-200 flex items-center justify-between gap-3 hover:border-blue-200 transition-colors shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0070CE] flex items-center justify-center shrink-0 font-bold">
                              <FontAwesomeIcon
                                icon={fee.code === 'TIEN_AN' || fee.code === 'AN_SANG' ? faSun : faTag}
                                className="w-4 h-4"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800 truncate">
                                  {fee.name}
                                </span>
                                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                  Ngày
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                Tỷ lệ hoàn khi vắng có phép
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="5"
                              value={fee.excusedRatePercent ?? 50}
                              onChange={(e) =>
                                handleUpdateFeeRate(
                                  fee.feeId,
                                  'excused',
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              className="w-18 px-2 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] text-center"
                            />
                            <span className="text-xs font-bold text-slate-700">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2 Content: Nghỉ không phép */}
                {activeAbsenceTab === 'khong_phep' && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2 shadow-2xs">
                      <FontAwesomeIcon icon={faInfoCircle} className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span className="text-[11px] leading-relaxed">
                        Áp dụng khi học sinh <strong>vắng mặt không báo trước</strong> hoặc gửi đơn muộn sau mốc thời gian quy định. Mặc định là 0% (nhà trường không hoàn tiền do đã chuẩn bị suất ăn và dịch vụ trong ngày).
                      </span>
                    </div>

                    {/* Dynamic Unexcused Rate Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {refundableFees.map((fee) => (
                        <div
                          key={`unexcused-${fee.feeId}`}
                          className="p-3.5 bg-slate-50/80 rounded-lg border border-slate-200 flex items-center justify-between gap-3 hover:border-amber-200 transition-colors shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                              <FontAwesomeIcon
                                icon={fee.code === 'TIEN_AN' || fee.code === 'AN_SANG' ? faSun : faTag}
                                className="w-4 h-4"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800 truncate">
                                  {fee.name}
                                </span>
                                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                  Ngày
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                Tỷ lệ hoàn khi vắng không phép
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="5"
                              value={fee.unexcusedRatePercent ?? 0}
                              onChange={(e) =>
                                handleUpdateFeeRate(
                                  fee.feeId,
                                  'unexcused',
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              className="w-18 px-2 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] text-center"
                            />
                            <span className="text-xs font-bold text-slate-700">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* Collapsible Calculation Simulation Example (Hidden by default) */}
              {/* ------------------------------------------------------------- */}
              <div className="rounded-xl bg-gradient-to-r from-slate-50 via-blue-50/30 to-emerald-50/30 border border-slate-200 shadow-xs overflow-hidden">
                {/* Simulation Header */}
                <div className="w-full px-5 py-3.5 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0070CE] flex items-center justify-center font-bold">
                      <FontAwesomeIcon icon={faCalculator} className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Ví dụ tính toán thực tế & Giảm trừ hóa đơn tháng sau
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Áp dụng {refundableFees.length} khoản phí ({refundableFees.map((f) => f.name).join(', ')})
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSimulationOpen(!isSimulationOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-[#0070CE] bg-white hover:bg-blue-50/80 active:scale-95 rounded-md border border-blue-200 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>{isSimulationOpen ? 'Thu gọn' : 'Xem ví dụ'}</span>
                    <FontAwesomeIcon
                      icon={isSimulationOpen ? faChevronUp : faChevronDown}
                      className="w-3 h-3 text-[#0070CE]"
                    />
                  </button>
                </div>

                {/* Collapsible Content Area */}
                {isSimulationOpen && (
                  <div className="p-5 pt-2 border-t border-slate-200/80 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                      {/* Case 1: Nghỉ có phép (3 ngày) */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-2xs">
                        <div className="font-bold text-slate-800 flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            1. Nghỉ có phép (3 ngày)
                          </span>
                          <span className="text-amber-600 font-bold">{formatCurrencyVND(simExcusedTotal)}</span>
                        </div>
                        <div className="space-y-2.5 text-[11px] text-slate-600">
                          {simulationItems.map((item) => (
                            <div key={`sim-excused-${item.feeId}`} className="flex justify-between items-start gap-2 pb-1.5 border-b border-slate-100/70 last:border-b-0 last:pb-0">
                              <div className="min-w-0">
                                <div className="font-medium text-slate-800 truncate">{item.name}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  ({Math.round(item.unitPrice / 1000)}k × {item.excusedRate}% × 3 ngày)
                                </div>
                              </div>
                              <span className="font-semibold text-slate-800 shrink-0 pt-0.5">
                                {formatCurrencyVND(item.excusedRefund)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Case 2: Nghỉ không phép (2 ngày) */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-2xs">
                        <div className="font-bold text-slate-800 flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            2. Nghỉ không phép (2 ngày)
                          </span>
                          <span className={simUnexcusedTotal > 0 ? "text-rose-600 font-bold" : "text-slate-500 font-bold"}>
                            {formatCurrencyVND(simUnexcusedTotal)}
                          </span>
                        </div>
                        <div className="space-y-2.5 text-[11px] text-slate-600">
                          {simulationItems.map((item) => (
                            <div key={`sim-unexcused-${item.feeId}`} className="flex justify-between items-start gap-2 pb-1.5 border-b border-slate-100/70 last:border-b-0 last:pb-0">
                              <div className="min-w-0">
                                <div className="font-medium text-slate-800 truncate">{item.name}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  ({Math.round(item.unitPrice / 1000)}k × {item.unexcusedRate}% × 2 ngày)
                                </div>
                              </div>
                              <span className={item.unexcusedRefund > 0 ? "font-semibold text-rose-600 shrink-0 pt-0.5" : "font-semibold text-slate-500 shrink-0 pt-0.5"}>
                                {formatCurrencyVND(item.unexcusedRefund)}
                              </span>
                            </div>
                          ))}
                        </div>
                        {simUnexcusedTotal === 0 && (
                          <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-100">
                            * Mặc định 0% (không hoàn tiền cho các ngày vắng không phép). Khi điều chỉnh tỷ lệ %, số tiền sẽ tự động cập nhật.
                          </div>
                        )}
                      </div>

                      {/* Case 3: Tổng hoàn tháng & Giảm trừ hóa đơn tháng tiếp theo */}
                      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-xl shadow-xs space-y-2.5 flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-white flex items-center justify-between pb-2 border-b border-emerald-500/50">
                            <span>3. Tổng hoàn giảm trừ hóa đơn tháng sau:</span>
                            <span className="text-base font-extrabold text-amber-200">{formatCurrencyVND(simMonthTotal)}</span>
                          </div>
                          <div className="space-y-1.5 text-[11px] text-emerald-100 mt-2">
                            {simulationItems.map((item) => (
                              <div key={`sim-total-${item.feeId}`} className="flex justify-between items-center gap-2">
                                <span className="truncate">Khấu trừ {item.name}:</span>
                                <span className="font-bold text-white shrink-0">
                                  {formatCurrencyVND(item.totalRefund)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-[10px] text-emerald-200/90 pt-1 border-t border-emerald-500/40">
                          Áp dụng tự động cho hóa đơn Tháng 10/2026 khi phụ huynh xem phiếu thu.
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white/90 rounded-lg border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-600 shadow-2xs">
                      <FontAwesomeIcon icon={faInfoCircle} className="w-3.5 h-3.5 text-[#0070CE] mt-0.5 shrink-0" />
                      <span>
                        <strong>Cơ chế khấu trừ tự động:</strong> Khi kế toán tạo hóa đơn tháng &quot;N+1&quot; (Tài chính &gt; Học phí), hệ thống sẽ tự động trừ số tiền <strong>{formatCurrencyVND(simMonthTotal)}</strong> vào các dòng tương ứng (gồm 3 ngày có phép + 2 ngày không phép) và ghi chú chi tiết số ngày tự nghỉ trên phiếu thu gửi phụ huynh cho tháng N.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Advance Notice Hours Input (Clarified for Excused Absence Eligibility) */}
              <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="max-w-2xl">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thời gian phụ huynh cần báo vắng trước (Quy định vắng có phép)
                  </label>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Thời gian tối thiểu phụ huynh phải gửi đơn xin nghỉ trước giờ mở cửa/bắt đầu buổi học để được hệ thống xác nhận là <strong>&quot;Vắng có phép&quot;</strong> và hưởng chính sách hoàn tiền ăn. Các trường hợp gửi đơn sau thời gian này sẽ được tính là <strong>&quot;Vắng không phép&quot;</strong>.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={mealRefund.advanceNoticeHours}
                    onChange={(e) =>
                      dispatch(
                        updateDraftMealRefund({
                          advanceNoticeHours: Math.min(
                            100,
                            Math.max(0, parseInt(e.target.value, 10) || 0)
                          )
                        })
                      )
                    }
                    className="w-24 px-3 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] text-center"
                  />
                  <span className="text-xs font-semibold text-slate-600">giờ</span>
                </div>
              </div>

              {/* Operating Hours Table Reference */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Khung giờ mở cửa & đón trả trẻ áp dụng (Đồng bộ từ Cấu hình Trường học)
                  </label>
                  <span className="text-[11px] text-slate-400 italic">Chỉ đọc</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-2.5 px-4">Ngày trong tuần</th>
                        <th className="py-2.5 px-4">Buổi sáng (Giờ mở - Đóng)</th>
                        <th className="py-2.5 px-4">Buổi chiều (Giờ mở - Đóng)</th>
                        <th className="py-2.5 px-4 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mealRefund.operatingHoursReference.map((day) => (
                        <tr key={day.dayOfWeek} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-bold text-slate-800">
                            {day.dayName}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">
                            {day.morningStart} - {day.morningEnd}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">
                            {day.afternoonStart} - {day.afternoonEnd}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {day.isOpen ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <FontAwesomeIcon icon={faCheckCircle} className="w-2.5 h-2.5" />
                                Mở cửa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                <FontAwesomeIcon icon={faTimesCircle} className="w-2.5 h-2.5" />
                                Nghỉ
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* When OFF */
            <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 flex items-start gap-3">
              <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <span className="font-semibold">Chế độ tắt hoàn tiền ăn: </span>
                Khi tắt cấu hình này, hệ thống sẽ không tự động tính toán và khấu trừ tiền ăn khi học sinh xin nghỉ học.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Refundable Fee Modal Dialog */}
      <AddRefundableFeeModal
        isOpen={isAddFeeModalOpen}
        onClose={() => setIsAddFeeModalOpen(false)}
        onAddFees={handleBatchAddFees}
        onSelectFee={handleSelectFeeToAdd}
        alreadyAddedFeeIds={refundableFees.map((f) => f.feeId)}
      />
    </div>
  );
};
