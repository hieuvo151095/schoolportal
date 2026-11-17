/**
 * Create & Edit Modal for Tuition Exemption & Fee Discount Policies
 * Finance Domain - Finviet / SOHA School Operating Portal
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PopupModal + Dropdown + Icon)
 */

import React, { useState, useEffect, useMemo } from 'react';
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
import { SlideOver, Dropdown, DropdownOption, Icon } from '@/components/ds';

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

const ACADEMIC_YEAR_OPTIONS: DropdownOption[] = [
  { value: 'ay-2025-2026', label: 'Năm học 2025 - 2026' },
  { value: 'ay-2026-2027', label: 'Năm học 2026 - 2027' },
  { value: 'ay-2027-2028', label: 'Năm học 2027 - 2028' },
];

const MONTH_OPTIONS: DropdownOption[] = [
  { value: '2026-09', label: 'Tháng 09/2026' },
  { value: '2026-10', label: 'Tháng 10/2026' },
  { value: '2026-11', label: 'Tháng 11/2026' },
  { value: '2026-12', label: 'Tháng 12/2026' },
  { value: '2027-05', label: 'Tháng 05/2027' },
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
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [feeItemId, setFeeItemId] = useState('');
  const [discountType, setDiscountType] = useState<DiscountCalculationType>('percent');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [validityType, setValidityType] = useState<DiscountValidityType>('academic_year');
  const [academicYearId, setAcademicYearId] = useState('ay-2026-2027');
  const [fromMonth, setFromMonth] = useState('2026-09');
  const [toMonth, setToMonth] = useState('2026-12');
  const [reason, setReason] = useState('');
  const [confirmReplacement, setConfirmReplacement] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [classSearchQuery, setClassSearchQuery] = useState('');
  const [classGradeFilter, setClassGradeFilter] = useState('all');
  const classDropdownRef = React.useRef<HTMLDivElement>(null);

  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('all');
  const studentDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close class & student dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        classDropdownRef.current &&
        !classDropdownRef.current.contains(event.target as Node)
      ) {
        setIsClassDropdownOpen(false);
      }
      if (
        studentDropdownRef.current &&
        !studentDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStudentDropdownOpen(false);
      }
    }
    if (isClassDropdownOpen || isStudentDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClassDropdownOpen, isStudentDropdownOpen]);

  const uniqueClassGrades = useMemo(() => {
    const set = new Set<string>();
    AVAILABLE_CLASSES_FOR_DISCOUNT.forEach((c) => set.add(c.grade));
    return Array.from(set);
  }, []);

  const uniqueStudentClasses = useMemo(() => {
    const set = new Set<string>();
    AVAILABLE_STUDENTS_FOR_DISCOUNT.forEach((s) => set.add(s.className));
    return Array.from(set);
  }, []);

  const filteredAvailableClasses = useMemo(() => {
    const q = classSearchQuery.toLowerCase().trim();
    return AVAILABLE_CLASSES_FOR_DISCOUNT.filter((cls) => {
      const matchGrade = classGradeFilter === 'all' || cls.grade === classGradeFilter;
      const matchQuery =
        !q ||
        cls.name.toLowerCase().includes(q) ||
        cls.grade.toLowerCase().includes(q);
      return matchGrade && matchQuery;
    });
  }, [classSearchQuery, classGradeFilter]);

  const filteredAvailableStudents = useMemo(() => {
    const q = studentSearchQuery.toLowerCase().trim();
    return AVAILABLE_STUDENTS_FOR_DISCOUNT.filter((s) => {
      const matchClass =
        studentClassFilter === 'all' || s.className === studentClassFilter;
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q);
      return matchClass && matchQuery;
    });
  }, [studentSearchQuery, studentClassFilter]);

  const allPolicies = useAppSelector((state) => state.discount.policies);

  // Target IDs for current scope
  const targetIds = scopeType === 'class' ? selectedClassIds : selectedStudentIds;

  // Applicable fee items calculated via mathematical intersection across all selected classes/students
  const applicableFeeItems = useMemo(() => {
    return getApplicableFeeItemsForTargets(scopeType, targetIds, AVAILABLE_STUDENTS_FOR_DISCOUNT);
  }, [scopeType, targetIds]);

  const feeItemOptions: DropdownOption[] = useMemo(() => {
    return applicableFeeItems.map((item) => ({
      value: item.id,
      label: `[Khoản ${item.feeNumber}] ${item.name} (${item.code}) — Mức chuẩn: ${formatCurrency(item.defaultAmount)}`,
    }));
  }, [applicableFeeItems]);

  // Keep feeItemId synchronized with applicableFeeItems intersection
  useEffect(() => {
    if (applicableFeeItems.length > 0 && feeItemId) {
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
      setIsClassDropdownOpen(false);
      setClassSearchQuery('');
      setClassGradeFilter('all');
    } else {
      setName('');
      setScopeType('class');
      setSelectedClassIds([]);
      setSelectedStudentIds([]);
      setFeeItemId('');
      setDiscountType('percent');
      setDiscountValue(0);
      setValidityType('academic_year');
      setAcademicYearId('ay-2026-2027');
      setFromMonth('2026-09');
      setToMonth('2026-12');
      setReason('');
      setConfirmReplacement(false);
      setErrors({});
      setIsClassDropdownOpen(false);
      setClassSearchQuery('');
      setClassGradeFilter('all');
    }
  }, [editingPolicy, isOpen]);

  if (!isOpen) return null;

  const isSubmitDisabled =
    !name.trim() ||
    targetIds.length === 0 ||
    !feeItemId ||
    discountValue <= 0 ||
    (studentConflicts.length > 0 && !confirmReplacement);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

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
      <SlideOver
        open={isOpen}
        onClose={onClose}
        title={editingPolicy ? 'Chỉnh sửa chính sách miễn giảm' : 'Thiết lập chính sách miễn giảm mới'}
        description="Cấu hình đối tượng, khoản phí biểu mẫu và mức ưu đãi áp dụng vào hóa đơn thu phí"
        icon={editingPolicy ? 'edit' : 'plus'}
        width={640}
        primaryAction={{
          label: editingPolicy ? 'Lưu thay đổi' : 'Tạo chính sách',
          onClick: () => handleSubmit(),
          disabled: isSubmitDisabled,
          icon: 'check',
        }}
        secondaryAction={{
          label: 'Hủy',
          onClick: onClose,
        }}
      >
        <div className="space-y-5 text-left">
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

          {/* 2. Scope Selection */}
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
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  scopeType === 'class'
                    ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="graduation-cap" size={14} />
                <span>Theo lớp học (Nhiều lớp)</span>
              </button>
              <button
                type="button"
                onClick={() => setScopeType('student')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  scopeType === 'student'
                    ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="user" size={14} />
                <span>Theo học sinh cụ thể</span>
              </button>
            </div>

            {/* Class Scope Selector - Inline Multi-Select Dropdown */}
            {scopeType === 'class' ? (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Chọn lớp học áp dụng <span className="text-rose-500">*</span>
                </label>

                <div ref={classDropdownRef} className="relative">
                  {/* Trigger Box */}
                  <div
                    role="combobox"
                    aria-expanded={isClassDropdownOpen}
                    onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                    className={`min-h-[42px] px-3.5 py-2 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all select-none ${
                      isClassDropdownOpen
                        ? 'border-[#0070CE] ring-2 ring-[#0070CE]/20 shadow-sm'
                        : errors.targetIds
                        ? 'border-rose-300 bg-rose-50/20'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      <span className="text-slate-400 shrink-0">
                        <Icon name="graduation-cap" size={14} />
                      </span>
                      {selectedClassIds.length === 0 ? (
                        <span className="text-slate-400 font-normal text-sm">
                          Chọn các lớp học áp dụng...
                        </span>
                      ) : (
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[#0070CE] font-semibold text-sm">
                            Đã chọn {selectedClassIds.length} lớp học
                          </span>
                          <span className="text-slate-400 text-xs truncate">
                            ({selectedClassesData.map((c) => c.name).join(', ')})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {selectedClassIds.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClassIds([]);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                          title="Xóa tất cả lớp đã chọn"
                        >
                          <Icon name="xmark" size={12} />
                        </button>
                      )}
                      <span
                        className={`text-slate-400 transition-transform duration-200 ${
                          isClassDropdownOpen ? 'rotate-180 text-[#0070CE]' : ''
                        }`}
                      >
                        <Icon name="chevron-down" size={12} />
                      </span>
                    </div>
                  </div>

                  {/* Inline Dropdown Popover */}
                  {isClassDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                      {/* Search Bar & Quick Toggles */}
                      <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 space-y-2">
                        <div className="flex items-center px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus-within:border-[#0070CE] focus-within:ring-1 focus-within:ring-[#0070CE]/20">
                          <Icon name="search" size={13} className="text-slate-400 mr-2 shrink-0" />
                          <input
                            type="text"
                            value={classSearchQuery}
                            onChange={(e) => setClassSearchQuery(e.target.value)}
                            placeholder="Tìm tên lớp, khối lớp..."
                            className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent outline-none"
                            autoFocus
                          />
                          {classSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setClassSearchQuery('')}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <Icon name="xmark" size={11} />
                            </button>
                          )}
                        </div>

                        {/* Grade Filter Pills & Actions */}
                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                            <button
                              type="button"
                              onClick={() => setClassGradeFilter('all')}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                                classGradeFilter === 'all'
                                  ? 'bg-blue-100 text-[#0070CE] font-semibold'
                                  : 'text-slate-500 hover:bg-slate-200/60'
                              }`}
                            >
                              Tất cả
                            </button>
                            {uniqueClassGrades.map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setClassGradeFilter(g)}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                                  classGradeFilter === g
                                    ? 'bg-blue-100 text-[#0070CE] font-semibold'
                                    : 'text-slate-500 hover:bg-slate-200/60'
                                }`}
                              >
                                {g}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 pl-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newIds = Array.from(
                                  new Set([...selectedClassIds, ...filteredAvailableClasses.map((c) => c.id)])
                                );
                                setSelectedClassIds(newIds);
                                if (errors.targetIds) setErrors({ ...errors, targetIds: '' });
                              }}
                              className="text-[11px] font-semibold text-[#0070CE] hover:underline"
                            >
                              Chọn tất cả
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={() => {
                                const removeSet = new Set(filteredAvailableClasses.map((c) => c.id));
                                setSelectedClassIds(selectedClassIds.filter((id) => !removeSet.has(id)));
                              }}
                              className="text-[11px] font-semibold text-slate-500 hover:underline"
                            >
                              Bỏ chọn
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Class List with Checkboxes */}
                      <div className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-50">
                        {filteredAvailableClasses.length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-slate-400">
                            Không tìm thấy lớp học nào phù hợp
                          </div>
                        ) : (
                          filteredAvailableClasses.map((cls) => {
                            const isChecked = selectedClassIds.includes(cls.id);
                            return (
                              <div
                                key={cls.id}
                                onClick={() => {
                                  if (isChecked) {
                                    setSelectedClassIds(selectedClassIds.filter((id) => id !== cls.id));
                                  } else {
                                    setSelectedClassIds([...selectedClassIds, cls.id]);
                                    if (errors.targetIds) setErrors({ ...errors, targetIds: '' });
                                  }
                                }}
                                className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer rounded-lg transition-colors select-none mx-0.5 my-0.5 ${
                                  isChecked
                                    ? 'bg-blue-50/80 text-[#0070CE]'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    className="w-4 h-4 rounded text-[#0070CE] focus:ring-[#0070CE] border-slate-300 cursor-pointer pointer-events-none"
                                  />
                                  <div>
                                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                      <span>{cls.name}</span>
                                      {isChecked && (
                                        <span className="text-2xs px-1.5 py-0.2 rounded bg-blue-100 text-[#0070CE] font-bold">
                                          Đã chọn
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-normal">
                                      {cls.grade} • {cls.studentCount} học sinh
                                    </div>
                                  </div>
                                </div>

                                <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                                  {cls.studentCount} HS
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          Đã chọn <strong className="text-[#0070CE]">{selectedClassIds.length}</strong> lớp
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsClassDropdownOpen(false)}
                          className="px-3 py-1 rounded-lg bg-[#0070CE] text-white font-semibold text-xs hover:bg-[#005bb5] transition-colors"
                        >
                          Xong
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Classes Chips */}
                {selectedClassesData.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedClassesData.map((cls) => (
                      <span
                        key={cls.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0070CE] text-xs font-medium border border-blue-200 shadow-2xs"
                      >
                        <span className="font-semibold">{cls.name}</span>
                        <span className="text-blue-400 text-[11px]">({cls.studentCount} HS)</span>
                        <button
                          type="button"
                          onClick={() => setSelectedClassIds(selectedClassIds.filter((id) => id !== cls.id))}
                          className="text-blue-400 hover:text-rose-600 transition-colors p-0.5 rounded"
                          title={`Bỏ chọn ${cls.name}`}
                        >
                          <Icon name="xmark" size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {errors.targetIds && (
                  <p className="text-xs text-rose-500">{errors.targetIds}</p>
                )}
              </div>
            ) : (
              /* Student Scope Selector - Inline Multi-Select Dropdown */
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Chọn học sinh áp dụng <span className="text-rose-500">*</span>
                </label>

                <div ref={studentDropdownRef} className="relative">
                  {/* Trigger Box */}
                  <div
                    role="combobox"
                    aria-expanded={isStudentDropdownOpen}
                    onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                    className={`min-h-[42px] px-3.5 py-2 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all select-none ${
                      isStudentDropdownOpen
                        ? 'border-[#0070CE] ring-2 ring-[#0070CE]/20 shadow-sm'
                        : errors.targetIds
                        ? 'border-rose-300 bg-rose-50/20'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      <span className="text-slate-400 shrink-0">
                        <Icon name="user" size={14} />
                      </span>
                      {selectedStudentIds.length === 0 ? (
                        <span className="text-slate-400 font-normal text-sm">
                          Chọn các học sinh áp dụng...
                        </span>
                      ) : (
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[#0070CE] font-semibold text-sm">
                            Đã chọn {selectedStudentIds.length} học sinh
                          </span>
                          <span className="text-slate-400 text-xs truncate">
                            ({selectedStudentsData.map((s) => s.name).join(', ')})
                          </span>
                        </div>
                      )}
                    </div>
                    <Icon
                      name="chevron-down"
                      size={14}
                      className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                        isStudentDropdownOpen ? 'rotate-180 text-[#0070CE]' : ''
                      }`}
                    />
                  </div>

                  {/* Dropdown Popover */}
                  {isStudentDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Search & Class Filter */}
                      <div className="p-2.5 border-b border-slate-100 bg-slate-50/70 space-y-2">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icon name="magnifying-glass" size={13} />
                          </span>
                          <input
                            type="text"
                            value={studentSearchQuery}
                            onChange={(e) => setStudentSearchQuery(e.target.value)}
                            placeholder="Tìm tên hoặc mã học sinh..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0070CE] focus:ring-1 focus:ring-[#0070CE] text-slate-800 placeholder:text-slate-400"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* Class Pills & Bulk Actions */}
                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[260px]">
                            <button
                              type="button"
                              onClick={() => setStudentClassFilter('all')}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                                studentClassFilter === 'all'
                                  ? 'bg-[#0070CE] text-white font-semibold'
                                  : 'text-slate-600 hover:bg-slate-200/60'
                              }`}
                            >
                              Tất cả lớp
                            </button>
                            {uniqueStudentClasses.map((cName) => (
                              <button
                                key={cName}
                                type="button"
                                onClick={() => setStudentClassFilter(cName)}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                                  studentClassFilter === cName
                                    ? 'bg-blue-100 text-[#0070CE] font-semibold'
                                    : 'text-slate-500 hover:bg-slate-200/60'
                                }`}
                              >
                                {cName}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 pl-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newIds = Array.from(
                                  new Set([...selectedStudentIds, ...filteredAvailableStudents.map((s) => s.id)])
                                );
                                setSelectedStudentIds(newIds);
                                if (errors.targetIds) setErrors({ ...errors, targetIds: '' });
                              }}
                              className="text-[11px] font-semibold text-[#0070CE] hover:underline"
                            >
                              Chọn tất cả
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={() => {
                                const removeSet = new Set(filteredAvailableStudents.map((s) => s.id));
                                setSelectedStudentIds(selectedStudentIds.filter((id) => !removeSet.has(id)));
                              }}
                              className="text-[11px] font-semibold text-slate-500 hover:underline"
                            >
                              Bỏ chọn
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Student List with Checkboxes */}
                      <div className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-50">
                        {filteredAvailableStudents.length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-slate-400">
                            Không tìm thấy học sinh nào phù hợp
                          </div>
                        ) : (
                          filteredAvailableStudents.map((st) => {
                            const isChecked = selectedStudentIds.includes(st.id);
                            return (
                              <div
                                key={st.id}
                                onClick={() => {
                                  if (isChecked) {
                                    setSelectedStudentIds(selectedStudentIds.filter((id) => id !== st.id));
                                  } else {
                                    setSelectedStudentIds([...selectedStudentIds, st.id]);
                                    if (errors.targetIds) setErrors({ ...errors, targetIds: '' });
                                  }
                                }}
                                className={`px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                                  isChecked ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}}
                                    className="w-4 h-4 text-[#0070CE] rounded border-slate-300 focus:ring-[#0070CE] cursor-pointer"
                                  />
                                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0070CE] font-bold text-xs flex items-center justify-center shrink-0">
                                    {st.name.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold text-slate-800 truncate">
                                      {st.name}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-normal">
                                      {st.code} • {st.className}
                                    </div>
                                  </div>
                                </div>

                                <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                                  {st.className}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          Đã chọn <strong className="text-[#0070CE]">{selectedStudentIds.length}</strong> học sinh
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsStudentDropdownOpen(false)}
                          className="px-3 py-1 rounded-lg bg-[#0070CE] text-white font-semibold text-xs hover:bg-[#005bb5] transition-colors"
                        >
                          Xong
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Students Chips */}
                {selectedStudentsData.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedStudentsData.map((st) => (
                      <span
                        key={st.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0070CE] text-xs font-medium border border-blue-200 shadow-2xs"
                      >
                        <span className="font-semibold">{st.name}</span>
                        <span className="text-blue-400 text-[11px]">({st.className})</span>
                        <button
                          type="button"
                          onClick={() => setSelectedStudentIds(selectedStudentIds.filter((id) => id !== st.id))}
                          className="text-blue-400 hover:text-rose-600 transition-colors p-0.5 rounded"
                          title={`Bỏ chọn ${st.name}`}
                        >
                          <Icon name="xmark" size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {errors.targetIds && (
                  <p className="text-xs text-rose-500">{errors.targetIds}</p>
                )}
              </div>
            )}
          </div>

          {/* 3. Applicable Fee Item */}
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
                <Icon name="info" size={14} className="text-amber-500 shrink-0" />
                <span>
                  Vui lòng chọn <strong>Nhóm áp dụng</strong> ở trên trước để hệ thống tải danh mục các khoản phí áp dụng tương ứng.
                </span>
              </div>
            ) : applicableFeeItems.length === 0 ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                <Icon name="alert-triangle" size={14} className="text-rose-500 shrink-0" />
                <span>
                  Không tìm thấy khoản phí chung nào giữa các đối tượng đã chọn (giao danh mục khoản phí = rỗng). Vui lòng chọn lại nhóm áp dụng.
                </span>
              </div>
            ) : (
              <div>
                <Dropdown
                  value={feeItemId}
                  onChange={(val) => {
                    setFeeItemId(val);
                    if (errors.feeItemId) setErrors({ ...errors, feeItemId: '' });
                  }}
                  options={feeItemOptions}
                  placeholder="-- Chọn khoản phí áp dụng --"
                  fullWidth
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Chỉ hiển thị các khoản phí chung mà tất cả các lớp/học sinh đã chọn đều tham gia đóng (lọc từ 24 khoản phí toàn trường).
                </p>
              </div>
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
                  className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    discountType === 'percent'
                      ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon name="percent" size={12} />
                  <span>Giảm theo %</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDiscountType('fixed_amount');
                    if (discountValue <= 100) setDiscountValue(500000);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    discountType === 'fixed_amount'
                      ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon name="credit-card" size={12} />
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
                  value={discountValue || ''}
                  onChange={(e) => {
                    setDiscountValue(Number(e.target.value));
                    if (errors.discountValue) setErrors({ ...errors, discountValue: '' });
                  }}
                  placeholder="0"
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
                <Icon name="bell" size={14} className="text-amber-500" />
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
                className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  validityType === 'academic_year'
                    ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="calendar" size={12} />
                <span>Theo cả năm học</span>
              </button>
              <button
                type="button"
                onClick={() => setValidityType('month_range')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  validityType === 'month_range'
                    ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] ring-1 ring-[#0070CE]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="calendar" size={12} />
                <span>Theo khoảng tháng</span>
              </button>
            </div>

            {validityType === 'academic_year' ? (
              <div>
                <Dropdown
                  value={academicYearId}
                  onChange={(val) => setAcademicYearId(val)}
                  options={ACADEMIC_YEAR_OPTIONS}
                  fullWidth
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Từ tháng</label>
                  <Dropdown
                    value={fromMonth}
                    onChange={(val) => setFromMonth(val)}
                    options={MONTH_OPTIONS}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Đến tháng</label>
                  <Dropdown
                    value={toMonth}
                    onChange={(val) => setToMonth(val)}
                    options={MONTH_OPTIONS}
                    fullWidth
                  />
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
                  className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors cursor-pointer"
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
            <Icon name="info" size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold">Quy tắc 01 chính sách miễn giảm cho mỗi khoản thu:</span> Mỗi học sinh
              chỉ được thụ hưởng duy nhất 01 chính sách miễn giảm cho cùng một khoản thu (ví dụ: Học phí chính khóa).
              Khi tạo hoặc cập nhật chính sách mới cho cùng khoản thu, hệ thống sẽ kiểm tra trùng lặp, yêu cầu người dùng
              xác nhận thay thế và tự động loại bỏ áp dụng chính sách cũ đối với học sinh đó. Danh mục khoản phí hiển thị
              được tự động lấy theo tập giao các khoản thu chung giữa các lớp hoặc học sinh đã chọn.
            </div>
          </div>
        </div>
      </SlideOver>
    </>
  );
};
