/**
 * Create & Edit Modal for Tuition Exemption & Fee Discount Policies
 * Finance Domain - Finviet / SOHA School Operating Portal
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSave,
  faPlus,
  faPercent,
  faCoins,
  faGraduationCap,
  faUserGraduate,
  faCalendarAlt,
  faInfoCircle,
  faCheck,
  faBell,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  createDiscountPolicy,
  updateDiscountPolicy,
} from '../../../store/slices/discountSlice';
import { addToast } from '../../../store/slices/toastSlice';
import {
  DiscountPolicy,
  DiscountCalculationType,
  DiscountScopeType,
  DiscountValidityType,
  CreateDiscountPolicyPayload,
} from '../../../types/discount';
import {
  ALL_24_SCHOOL_FEES,
  AVAILABLE_CLASSES_FOR_DISCOUNT,
  AVAILABLE_STUDENTS_FOR_DISCOUNT,
  getApplicableFeeItemsForTargets,
  feeIdsMatch,
} from '../../../services/mockDiscountData';
import {
  validateDiscountPolicyForm,
  formatCurrency,
  findStudentDiscountConflicts,
  ExistingStudentDiscountConflict,
} from '../../../utils/discountValidation';
import { StudentPickerModal } from './StudentPickerModal';
import { ClassPickerModal } from './ClassPickerModal';

interface CreateDiscountPolicyModalProps {
  isOpen: boolean;
  editingPolicy: DiscountPolicy | null;
  onClose: () => void;
}

const COMMON_REASONS = [
  'Con em thương binh, liệt sĩ',
  'Gia đình thuộc diện hộ nghèo, cận nghèo',
  'Anh chị em ruột cùng theo học tại trường',
  'Học sinh đạt giải học sinh giỏi cấp tỉnh/quốc gia',
  'Chính sách ưu đãi tuyển sinh đầu cấp',
  'Học sinh khuyết tật có hoàn cảnh khó khăn',
];

export const CreateDiscountPolicyModal: React.FC<CreateDiscountPolicyModalProps> = ({
  isOpen,
  editingPolicy,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  // Form states
  const [name, setName] = useState('');
  const [scopeType, setScopeType] = useState<DiscountScopeType>('class');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>(['class-10a1']);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [feeItemId, setFeeItemId] = useState('fee-sys-001');
  const [discountType, setDiscountType] = useState<DiscountCalculationType>('percent');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [validityType, setValidityType] = useState<DiscountValidityType>('academic_year');
  const [academicYearId, setAcademicYearId] = useState('ay-2026-2027');
  const [fromMonth, setFromMonth] = useState('2026-09');
  const [toMonth, setToMonth] = useState('2026-12');
  const [reason, setReason] = useState('');
  const [confirmReplacement, setConfirmReplacement] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);
  const [isClassPickerOpen, setIsClassPickerOpen] = useState(false);

  const allPolicies = useAppSelector((state) => state.discount.policies);

  // Target IDs for current scope
  const targetIds = scopeType === 'class' ? selectedClassIds : selectedStudentIds;

  // Applicable fee items calculated via mathematical intersection across all selected classes/students
  const applicableFeeItems = useMemo(() => {
    return getApplicableFeeItemsForTargets(scopeType, targetIds, AVAILABLE_STUDENTS_FOR_DISCOUNT);
  }, [scopeType, targetIds]);

  // Keep feeItemId synchronized with applicableFeeItems intersection
  useEffect(() => {
    if (applicableFeeItems.length > 0) {
      const isCurrentValid = applicableFeeItems.some(
        (f) => f.id === feeItemId || feeIdsMatch(f.id, feeItemId)
      );
      if (!isCurrentValid) {
        setFeeItemId(applicableFeeItems[0].id);
      }
    }
  }, [applicableFeeItems, feeItemId]);

  // Student IDs to inspect for conflicting policies
  const studentIdsToCheck = useMemo(() => {
    if (scopeType === 'student') {
      return selectedStudentIds;
    } else {
      return AVAILABLE_STUDENTS_FOR_DISCOUNT.filter((s) =>
        selectedClassIds.includes(s.classId)
      ).map((s) => s.id);
    }
  }, [scopeType, selectedStudentIds, selectedClassIds]);

  // Detect student discount conflicts: only ONE program allowed per student per fee item
  const studentConflicts: ExistingStudentDiscountConflict[] = useMemo(() => {
    if (studentIdsToCheck.length === 0 || !feeItemId) {
      return [];
    }
    return findStudentDiscountConflicts(
      studentIdsToCheck,
      feeItemId,
      discountType,
      Number(discountValue) || 0,
      allPolicies,
      AVAILABLE_STUDENTS_FOR_DISCOUNT,
      ALL_24_SCHOOL_FEES,
      editingPolicy?.id
    );
  }, [
    studentIdsToCheck,
    feeItemId,
    discountType,
    discountValue,
    allPolicies,
    editingPolicy?.id,
  ]);

  // Reset replacement confirmation whenever targets or fee item change
  useEffect(() => {
    setConfirmReplacement(false);
  }, [feeItemId, scopeType, selectedClassIds, selectedStudentIds]);

  // Initialize or reset form when editingPolicy changes
  useEffect(() => {
    if (editingPolicy) {
      setName(editingPolicy.name);
      setScopeType(editingPolicy.scopeType);
      if (editingPolicy.scopeType === 'class') {
        setSelectedClassIds(editingPolicy.targets.map((t) => t.targetId));
        setSelectedStudentIds([]);
      } else {
        setSelectedStudentIds(editingPolicy.targets.map((t) => t.targetId));
        setSelectedClassIds([]);
      }
      setFeeItemId(editingPolicy.feeItemId);
      setDiscountType(editingPolicy.discountType);
      setDiscountValue(editingPolicy.discountValue);
      setValidityType(editingPolicy.validityType);
      setAcademicYearId(editingPolicy.academicYearId || 'ay-2026-2027');
      setFromMonth(editingPolicy.fromMonth || '2026-09');
      setToMonth(editingPolicy.toMonth || '2026-12');
      setReason(editingPolicy.reason);
      setConfirmReplacement(false);
      setErrors({});
    } else {
      setName('');
      setScopeType('class');
      setSelectedClassIds(['class-10a1']);
      setSelectedStudentIds([]);
      const defaultFees = getApplicableFeeItemsForTargets('class', ['class-10a1']);
      setFeeItemId(defaultFees[0]?.id || 'fee-sys-001');
      setDiscountType('percent');
      setDiscountValue(20);
      setValidityType('academic_year');
      setAcademicYearId('ay-2026-2027');
      setFromMonth('2026-09');
      setToMonth('2026-12');
      setReason('');
      setConfirmReplacement(false);
      setErrors({});
    }
  }, [editingPolicy, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (targetIds.length === 0) {
      setErrors({ targetIds: 'Vui lòng chọn ít nhất một lớp học hoặc học sinh áp dụng' });
      return;
    }

    if (!feeItemId) {
      setErrors({ feeItemId: 'Vui lòng chọn khoản phí áp dụng' });
      return;
    }

    if (studentConflicts.length > 0 && !confirmReplacement) {
      setErrors({
        conflict: 'Vui lòng đánh dấu xác nhận thay thế chính sách cũ cho các học sinh bị trùng lặp trước khi tiếp tục.',
      });
      return;
    }

    const payload: CreateDiscountPolicyPayload = {
      name: name.trim(),
      feeItemId,
      discountType,
      discountValue: Number(discountValue),
      scopeType,
      targetIds,
      validityType,
      academicYearId: validityType === 'academic_year' ? academicYearId : undefined,
      fromMonth: validityType === 'month_range' ? fromMonth : undefined,
      toMonth: validityType === 'month_range' ? toMonth : undefined,
      reason: reason.trim(),
      confirmReplacement: studentConflicts.length > 0 ? true : undefined,
    };

    const formErrors = validateDiscountPolicyForm(payload);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (editingPolicy) {
      dispatch(
        updateDiscountPolicy({
          id: editingPolicy.id,
          ...payload,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          message: `Cập nhật chính sách "${payload.name}" thành công!`,
        })
      );
    } else {
      dispatch(createDiscountPolicy(payload));
      dispatch(
        addToast({
          type: 'success',
          message: `Tạo mới chính sách "${payload.name}" thành công!`,
        })
      );
    }

    onClose();
  };

  const selectedClassesData = AVAILABLE_CLASSES_FOR_DISCOUNT.filter((c) =>
    selectedClassIds.includes(c.id)
  );

  const selectedStudentsData = AVAILABLE_STUDENTS_FOR_DISCOUNT.filter((s) =>
    selectedStudentIds.includes(s.id)
  );

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-100 animate-fadeIn">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070CE] flex items-center justify-center">
                <FontAwesomeIcon icon={editingPolicy ? faSave : faPlus} className="text-base" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  {editingPolicy ? 'Chỉnh sửa chính sách miễn giảm' : 'Thiết lập chính sách miễn giảm mới'}
                </h2>
                <p className="text-xs text-slate-500">
                  Cấu hình đối tượng, khoản phí biểu mẫu và mức ưu đãi áp dụng vào hóa đơn thu phí
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* 1. Policy Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tên chính sách miễn giảm <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="VD: Miễn giảm 50% học phí diện chính sách"
                className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-[#0070CE]/20 focus:border-[#0070CE]'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* 2. Scope Selection (Nhóm áp dụng - Placed FIRST before Khoản phí) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nhóm áp dụng <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {scopeType === 'class'
                    ? `${selectedClassIds.length} lớp đã chọn`
                    : `${selectedStudentIds.length} học sinh đã chọn`}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setScopeType('class')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    scopeType === 'class'
                      ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <span>Theo lớp học (Nhiều lớp)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScopeType('student')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    scopeType === 'student'
                      ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faUserGraduate} />
                  <span>Theo học sinh cụ thể</span>
                </button>
              </div>

              {/* Class Scope Selector */}
              {scopeType === 'class' ? (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-700">
                        Danh sách lớp học được chỉ định:
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {selectedClassIds.length === 0
                          ? 'Chưa chọn lớp nào'
                          : `Đã chọn ${selectedClassIds.length} lớp học`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsClassPickerOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#0070CE] text-[#0070CE] text-xs font-bold shadow-sm transition-all"
                    >
                      + Chọn lớp học
                    </button>
                  </div>

                  {selectedClassesData.length > 0 && (
                    <div className="max-h-28 overflow-y-auto divide-y divide-slate-100 bg-white rounded-lg border border-slate-200 p-2">
                      {selectedClassesData.map((cls) => (
                        <div
                          key={cls.id}
                          className="py-1 px-1 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-slate-800">
                            {cls.name}{' '}
                            <span className="text-slate-400 font-normal">
                              ({cls.grade} • {cls.studentCount} HS)
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedClassIds(
                                selectedClassIds.filter((id) => id !== cls.id)
                              )
                            }
                            className="text-slate-400 hover:text-rose-500 p-0.5"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.targetIds && (
                    <p className="text-xs text-rose-500">{errors.targetIds}</p>
                  )}
                </div>
              ) : (
                /* Student Scope Selector */
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-700">
                        Danh sách học sinh được chỉ định:
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {selectedStudentIds.length === 0
                          ? 'Chưa chọn học sinh nào'
                          : `Đã chọn ${selectedStudentIds.length} học sinh`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsStudentPickerOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#0070CE] text-[#0070CE] text-xs font-bold shadow-sm transition-all"
                    >
                      + Chọn học sinh
                    </button>
                  </div>

                  {selectedStudentsData.length > 0 && (
                    <div className="max-h-28 overflow-y-auto divide-y divide-slate-100 bg-white rounded-lg border border-slate-200 p-2">
                      {selectedStudentsData.map((s) => (
                        <div
                          key={s.id}
                          className="py-1 px-1 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-slate-800">
                            {s.name}{' '}
                            <span className="text-slate-400 font-normal">({s.className})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedStudentIds(
                                selectedStudentIds.filter((id) => id !== s.id)
                              )
                            }
                            className="text-slate-400 hover:text-rose-500 p-0.5"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.targetIds && (
                    <p className="text-xs text-rose-500">{errors.targetIds}</p>
                  )}
                </div>
              )}
            </div>

            {/* 3. Applicable Fee Item (Dynamically filtered by Group/Scope intersection) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Khoản phí áp dụng <span className="text-rose-500">*</span>
                </label>
                {targetIds.length > 0 && applicableFeeItems.length > 0 && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0070CE] border border-blue-200/60">
                    {applicableFeeItems.length} khoản phí chung hợp lệ
                  </span>
                )}
              </div>

              {targetIds.length === 0 ? (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-amber-500" />
                  <span>
                    Vui lòng chọn <strong>Nhóm áp dụng</strong> ở trên trước để hệ thống tải danh mục các khoản phí áp dụng tương ứng.
                  </span>
                </div>
              ) : applicableFeeItems.length === 0 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-rose-500" />
                  <span>
                    Không tìm thấy khoản phí chung nào giữa các đối tượng đã chọn (giao danh mục khoản phí = rỗng). Vui lòng chọn lại nhóm áp dụng.
                  </span>
                </div>
              ) : (
                <>
                  <select
                    value={feeItemId}
                    onChange={(e) => setFeeItemId(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0070CE]/20 focus:border-[#0070CE]"
                  >
                    {applicableFeeItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        [Khoản {item.feeNumber}] {item.name} ({item.code}) — Mức chuẩn: {formatCurrency(item.defaultAmount)}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Chỉ hiển thị các khoản phí chung mà tất cả các lớp/học sinh đã chọn đều tham gia đóng (lọc từ 24 khoản phí toàn trường).
                  </p>
                </>
              )}
              {errors.feeItemId && (
                <p className="text-xs text-rose-500 mt-1">{errors.feeItemId}</p>
              )}
            </div>

            {/* 4. Calculation Type & Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Loại miễn giảm <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDiscountType('percent');
                      if (discountValue > 100) setDiscountValue(20);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      discountType === 'percent'
                        ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faPercent} />
                    <span>Giảm theo %</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscountType('fixed_amount');
                      if (discountValue <= 100) setDiscountValue(500000);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      discountType === 'fixed_amount'
                        ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCoins} />
                    <span>Giảm số tiền</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mức miễn giảm {discountType === 'percent' ? '(%)' : '(VNĐ)'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={discountType === 'percent' ? 1 : 1000}
                    max={discountType === 'percent' ? 100 : undefined}
                    step={discountType === 'percent' ? 1 : 10000}
                    value={discountValue}
                    onChange={(e) => {
                      setDiscountValue(Number(e.target.value));
                      if (errors.discountValue) setErrors({ ...errors, discountValue: '' });
                    }}
                    className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 font-bold ${
                      errors.discountValue
                        ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30 text-rose-700'
                        : 'border-slate-300 focus:ring-[#0070CE]/20 focus:border-[#0070CE] text-[#0070CE]'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    {discountType === 'percent' ? '%' : 'VNĐ'}
                  </div>
                </div>
                {errors.discountValue && (
                  <p className="text-xs text-rose-500 mt-1">{errors.discountValue}</p>
                )}
              </div>
            </div>

            {/* 5. Existing Policy Conflict Notification & Replacement Confirmation */}
            {studentConflicts.length > 0 && (
              <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
                  <FontAwesomeIcon icon={faBell} className="text-amber-500 text-sm" />
                  <span>Cảnh báo: Phát hiện {studentConflicts.length} học sinh đã có chính sách miễn giảm cho khoản phí này</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Quy định hệ thống: Mỗi học sinh chỉ áp dụng <strong>DUY NHẤT 01</strong> chính sách miễn giảm cho cùng một khoản thu. Nếu xác nhận thay thế, chính sách mới này sẽ có hiệu lực và chính sách cũ sẽ không còn áp dụng cho học sinh đó.
                </p>
                <div className="space-y-2 text-xs max-h-48 overflow-y-auto">
                  {studentConflicts.map((c) => (
                    <div
                      key={c.studentId}
                      className="p-3 bg-white rounded-lg border border-amber-200/80 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          {c.studentName}{' '}
                          <span className="text-slate-500 font-normal">({c.className})</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0070CE] border border-blue-100">
                          {c.feeItemName}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-slate-500 block">Chính sách hiện tại:</span>
                          <span className="font-semibold text-slate-800">{c.existingPolicy.name}</span>
                          <span className="text-amber-700 font-bold block mt-0.5">
                            Mức giảm: {c.existingDeductionFormatted}{' '}
                            <span className="font-normal text-slate-500">
                              ({c.existingPolicy.scopeType === 'class' ? 'áp dụng theo cả lớp' : 'áp dụng riêng cá nhân'})
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Chính sách mới đang thiết lập:</span>
                          <span className="font-semibold text-slate-800">{name || 'Chính sách mới'}</span>
                          <span className="text-[#0070CE] font-bold block mt-0.5">
                            Mức giảm: {c.newDeductionFormatted}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Replacement Confirmation Checkbox */}
                <label className="flex items-start gap-2.5 p-3 bg-white border border-amber-300 rounded-lg cursor-pointer hover:bg-amber-50/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={confirmReplacement}
                    onChange={(e) => {
                      setConfirmReplacement(e.target.checked);
                      if (errors.conflict) setErrors((prev) => ({ ...prev, conflict: '' }));
                    }}
                    className="mt-0.5 w-4 h-4 text-[#0070CE] rounded border-slate-300 focus:ring-[#0070CE]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">
                      Tôi xác nhận thay thế chính sách cũ bằng chính sách mới này cho các học sinh bị trùng lặp nêu trên.
                    </span>
                    <span className="text-slate-600 text-[11px]">
                      Chính sách cũ đối với khoản thu này sẽ không còn áp dụng cho các học sinh này nữa; chỉ chính sách mới được ghi nhận khi lập hóa đơn.
                    </span>
                  </div>
                </label>
                {errors.conflict && (
                  <p className="text-xs text-rose-600 font-semibold">{errors.conflict}</p>
                )}
              </div>
            )}

            {/* 6. Time Validity Period */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Thời gian áp dụng <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setValidityType('academic_year')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    validityType === 'academic_year'
                      ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Theo cả năm học</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValidityType('month_range')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    validityType === 'month_range'
                      ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Theo khoảng tháng</span>
                </button>
              </div>

              {validityType === 'academic_year' ? (
                <div>
                  <select
                    value={academicYearId}
                    onChange={(e) => setAcademicYearId(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0070CE]/20 focus:border-[#0070CE]"
                  >
                    <option value="ay-2025-2026">Năm học 2025 - 2026</option>
                    <option value="ay-2026-2027">Năm học 2026 - 2027</option>
                    <option value="ay-2027-2028">Năm học 2027 - 2028</option>
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Từ tháng</label>
                    <select
                      value={fromMonth}
                      onChange={(e) => setFromMonth(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0070CE]/20 focus:border-[#0070CE]"
                    >
                      <option value="2026-09">Tháng 09/2026</option>
                      <option value="2026-10">Tháng 10/2026</option>
                      <option value="2026-11">Tháng 11/2026</option>
                      <option value="2026-12">Tháng 12/2026</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Đến tháng</label>
                    <select
                      value={toMonth}
                      onChange={(e) => setToMonth(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0070CE]/20 focus:border-[#0070CE]"
                    >
                      <option value="2026-09">Tháng 09/2026</option>
                      <option value="2026-10">Tháng 10/2026</option>
                      <option value="2026-11">Tháng 11/2026</option>
                      <option value="2026-12">Tháng 12/2026</option>
                      <option value="2027-05">Tháng 05/2027</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Lý do miễn giảm <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COMMON_REASONS.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setReason(r);
                      if (errors.reason) setErrors({ ...errors, reason: '' });
                    }}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                  >
                    + {r}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (errors.reason) setErrors({ ...errors, reason: '' });
                }}
                placeholder="Nhập chi tiết căn cứ pháp lý, văn bản hoặc lý do miễn giảm..."
                className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.reason
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-[#0070CE]/20 focus:border-[#0070CE]'
                }`}
              />
              {errors.reason && <p className="text-xs text-rose-500 mt-1">{errors.reason}</p>}
            </div>

            {/* 8. Business Rule Note */}
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
              <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mt-0.5" />
              <div>
                <span className="font-bold">Quy tắc 01 chính sách miễn giảm cho mỗi khoản thu:</span> Mỗi học sinh
                chỉ được thụ hưởng duy nhất 01 chính sách miễn giảm cho cùng một khoản thu (ví dụ: Học phí chính khóa).
                Khi tạo hoặc cập nhật chính sách mới cho cùng khoản thu, hệ thống sẽ kiểm tra trùng lặp, yêu cầu người dùng
                xác nhận thay thế và tự động loại bỏ áp dụng chính sách cũ đối với học sinh đó. Danh mục khoản phí hiển thị
                được tự động lấy theo tập giao các khoản thu chung giữa các lớp hoặc học sinh đã chọn.
              </div>
            </div>
          </form>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0070CE] hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faSave} />
              <span>{editingPolicy ? 'Lưu thay đổi' : 'Tạo chính sách'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Picker Sub-modal */}
      <StudentPickerModal
        isOpen={isStudentPickerOpen}
        onClose={() => setIsStudentPickerOpen(false)}
        selectedStudentIds={selectedStudentIds}
        onConfirm={(ids) => {
          setSelectedStudentIds(ids);
          if (errors.targetIds) setErrors({ ...errors, targetIds: '' });
        }}
      />

      {/* Class Picker Sub-modal */}
      <ClassPickerModal
        isOpen={isClassPickerOpen}
        onClose={() => setIsClassPickerOpen(false)}
        selectedClassIds={selectedClassIds}
        onConfirm={(ids) => {
          setSelectedClassIds(ids);
          if (errors.targetIds) setErrors({ ...errors, targetIds: '' });
        }}
      />
    </>
  );
};
