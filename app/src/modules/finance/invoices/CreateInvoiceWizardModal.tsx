/**
 * Create Invoice Wizard Component / Modal
 * Multi-scope invoice generation (Toàn trường, Khối, Lớp, Học sinh)
 * with attendance-linked meal fee deduction and duplicate skip logic.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR05, BR07) & TASK-FIN-002
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Icon, Dropdown, DropdownOption } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createBatchInvoices } from '../../../store/slices/invoiceSlice';
import { mockFeeClasses } from '../../../services/mockInvoiceData';
import {
  InvoiceCreationScope,
  InvoiceLineItemCategory,
} from '../../../types/invoice';
import {
  calculateLineItemTotal,
  calculateInvoiceTotals,
  calculateMealDeduction,
  formatVND,
  formatCurrencyNumber,
  parseCurrencyNumber,
} from '../../../utils/invoiceValidation';
import {
  resolveStudentDiscounts,
  getStudentCandidateDiscountPolicies,
} from '../../../utils/discountValidation';
import {
  ALL_24_SCHOOL_FEES,
  CLASS_FEE_NUMBERS_MAP,
  getApplicableFeeItemsForTargets,
  AVAILABLE_CLASSES_FOR_DISCOUNT,
} from '../../../services/mockDiscountData';
import { ClassPickerModal } from '../discount/ClassPickerModal';
import { SelectDiscountProgramModal } from './SelectDiscountProgramModal';
import { BatchMealRefundListModal, BatchMealRefundItem } from './BatchMealRefundListModal';
import { getStudentAbsenceBreakdown } from '../../../services/mockMealRefundData';
import { calculateMealRefundForStudent, getPreviousMonthKey } from '../../../utils/mealRefundCalculation';

export const CreateInvoiceWizard: React.FC = () => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();
  const { students } = useAppSelector((state) => state.invoice);
  const { policies } = useAppSelector((state) => state.discount);
  const mealRefundConfig = useAppSelector((state) => state.settingFee.latePickupAndRefund.mealRefund);
  const storeSchoolFees = useAppSelector((state) => state.schoolFee?.items) || [];

  const allCatalogFees = React.useMemo(() => {
    if (storeSchoolFees && storeSchoolFees.length > 0) {
      const merged = storeSchoolFees.map((sf, idx) => {
        const df = ALL_24_SCHOOL_FEES.find((f) => f.id === sf.id || f.code === sf.code);
        return {
          id: sf.id,
          feeNumber: df?.feeNumber ?? (idx + 1),
          code: sf.code,
          name: sf.name,
          defaultAmount: sf.defaultAmount || 0,
          type: sf.type,
          unit: sf.unit,
        };
      });
      ALL_24_SCHOOL_FEES.forEach((df) => {
        if (!merged.some((m) => m.id === df.id || m.code === df.code)) {
          merged.push({
            id: df.id,
            feeNumber: df.feeNumber,
            code: df.code,
            name: df.name,
            defaultAmount: df.defaultAmount,
            type: df.type || 'custom',
            unit: (df.unit as any) || undefined,
          });
        }
      });
      return merged;
    }
    return ALL_24_SCHOOL_FEES;
  }, [storeSchoolFees]);

  // Form State
  const [scope, setScope] = useState<InvoiceCreationScope>(
    (router.query.scope as InvoiceCreationScope) || 'hoc_sinh'
  );
  const [gradeLevel, setGradeLevel] = useState<string>('Khối 10');
  const [classId, setClassId] = useState<string>('class-10a1');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([
    'class-10a1',
    'class-10a2',
  ]);
  const [isClassPickerOpen, setIsClassPickerOpen] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>(students[0]?.studentId || 'hs-001');
  const [selectedClassFilterForStudent, setSelectedClassFilterForStudent] = useState<string>('all');
  const [billingMonth, setBillingMonth] = useState<string>('2026-09');
  const [autoApplyDiscount, setAutoApplyDiscount] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('Hóa đơn tháng 09/2026');
  const [issueDate, setIssueDate] = useState<string>('01/09/2026');
  const [sendDate, setSendDate] = useState<string>(''); // Blank = send immediately
  const [dueDate, setDueDate] = useState<string>('20/09/2026');
  const [exportElectronicInvoice, setExportElectronicInvoice] = useState<boolean>(true);

  // Discount Selection & Modal State
  const [selectedPolicyOverrides, setSelectedPolicyOverrides] = useState<
    Record<
      number,
      {
        policyId: string | 'none';
        percent: number;
        policyName?: string;
        discountType?: 'percent' | 'fixed_amount';
        amount?: number;
      }
    >
  >({});
  const [discountModalItemIndex, setDiscountModalItemIndex] = useState<number | null>(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState<boolean>(false);
  const [isBatchMealRefundModalOpen, setIsBatchMealRefundModalOpen] = useState<boolean>(false);

  // Fee Line Items: Initialized with standard expenses including Xe đưa đón with 200.000 đ fixed discount
  const [items, setItems] = useState([
    {
      feeItemId: 'fee-sys-001',
      category: 'hoc_phi' as InvoiceLineItemCategory,
      name: 'Học phí chính khóa tháng 09/2026',
      description: 'Chương trình chuẩn liên cấp',
      unitPrice: 2500000,
      quantity: 1,
      discountType: 'percent' as 'percent' | 'fixed_amount',
      discountPercent: 50,
      discountAmount: 1250000,
      isRequired: true,
      isMealFee: false,
    },
    {
      feeItemId: 'fee-sys-002',
      category: 'tien_an' as InvoiceLineItemCategory,
      name: 'Tiền ăn bán trú (trừ ngày nghỉ phép)',
      description: 'Tự động tính theo ngày học thực tế (TASK-FIN-002)',
      unitPrice: 35000,
      quantity: 22,
      discountType: 'percent' as 'percent' | 'fixed_amount',
      discountPercent: 50,
      discountAmount: 385000,
      isRequired: true,
      isMealFee: true,
    },
    {
      feeItemId: 'fee-cust-003',
      category: 'khac' as InvoiceLineItemCategory,
      name: 'Xe đưa đón',
      description: 'Xe đưa đón học sinh theo tuyến đăng ký',
      unitPrice: 1200000,
      quantity: 1,
      discountType: 'fixed_amount' as 'percent' | 'fixed_amount',
      discountPercent: 17,
      discountAmount: 200000,
      isRequired: false,
      isMealFee: false,
    },
    {
      feeItemId: 'fee-cust-004',
      category: 'khac' as InvoiceLineItemCategory,
      name: 'Đồng phục hè',
      description: 'Đồng phục học sinh theo quy chuẩn',
      unitPrice: 450000,
      quantity: 1,
      discountType: 'percent' as 'percent' | 'fixed_amount',
      discountPercent: 0,
      discountAmount: 0,
      isRequired: false,
      isMealFee: false,
    },
  ]);

  // Compute applicable fees based on selected classes or students
  const applicableFees = React.useMemo(() => {
    if (scope === 'lop_hoc') {
      return getApplicableFeeItemsForTargets(
        'class',
        selectedClassIds.length > 0 ? selectedClassIds : ['class-10a1']
      );
    }
    if (scope === 'hoc_sinh') {
      return getApplicableFeeItemsForTargets('student', [studentId]);
    }
    if (scope === 'khoi_lop') {
      const classIdsInGrade = mockFeeClasses
        .filter((c) => c.gradeLevel === gradeLevel)
        .map((c) => c.id);
      return getApplicableFeeItemsForTargets(
        'class',
        classIdsInGrade.length > 0 ? classIdsInGrade : ['class-10a1']
      );
    }
    return allCatalogFees.filter((f) => [1, 2, 6, 7].includes(f.feeNumber));
  }, [scope, selectedClassIds, studentId, gradeLevel, allCatalogFees]);

  // Sync fee lines with standard expenses of the current target
  const syncItemsWithApplicableFees = (fees: typeof applicableFees) => {
    if (!fees || fees.length === 0) return;
    const newItems = fees.map((f) => {
      let category: InvoiceLineItemCategory = 'khac';
      let isMealFee = false;
      let qty = 1;
      let unitPrice = f.defaultAmount;
      let discountType: 'percent' | 'fixed_amount' = 'percent';
      let discountPercent = 0;
      let discountAmount = 0;

      if (f.feeNumber === 1 || f.code === 'HOC_PHI') {
        category = 'hoc_phi';
        if (studentId === 'hs-001') {
          discountType = 'percent';
          discountPercent = 50;
          discountAmount = Math.round(unitPrice * qty * 0.5);
        }
      } else if (f.feeNumber === 2 || f.code === 'TIEN_AN') {
        category = 'tien_an';
        isMealFee = true;
        unitPrice = 35000;
        qty = 22;
        if (studentId === 'hs-001') {
          discountType = 'percent';
          discountPercent = 50;
          discountAmount = Math.round(unitPrice * qty * 0.5);
        }
      } else if (f.feeNumber === 25 || f.code === 'TIEN_AN_SANG' || f.name.toLowerCase().includes('ăn sáng')) {
        category = 'tien_an';
        isMealFee = true;
        unitPrice = 20000;
        qty = 22;
      } else if (f.feeNumber === 3 || f.code === 'PHI_TRA_TRE') {
        category = 'phi_tra_tre';
      } else if (f.name.toLowerCase().includes('cơ sở vật chất')) {
        category = 'co_so_vat_chat';
      } else if (
        f.name.toLowerCase().includes('dã ngoại') ||
        f.name.toLowerCase().includes('ngoại khóa')
      ) {
        category = 'ngoai_khoa';
      } else if (f.feeNumber === 6 || f.code === 'XE_DUA_DON_THANG') {
        if (studentId === 'hs-001') {
          discountType = 'fixed_amount';
          discountPercent = 17;
          discountAmount = 200000;
        }
      }

      return {
        feeItemId: f.id,
        category,
        name: f.name,
        description:
          f.feeNumber === 1
            ? 'Chương trình chuẩn liên cấp'
            : f.feeNumber === 2
            ? 'Tự động tính theo ngày học thực tế (TASK-FIN-002)'
            : f.feeNumber === 25 || f.code === 'TIEN_AN_SANG' || f.name.toLowerCase().includes('ăn sáng')
            ? 'Đăng ký ăn sáng bán trú (20.000 đ/ngày x 22 ngày)'
            : f.feeNumber === 6
            ? 'Xe đưa đón học sinh theo tuyến đăng ký'
            : f.name,
        unitPrice,
        quantity: qty,
        discountType,
        discountPercent,
        discountAmount,
        isRequired: f.type === 'system',
        isMealFee,
      };
    });
    setItems(newItems);
  };

  // Handle month change and update suggested title
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBillingMonth(val);
    const [year, month] = val.split('-');
    setTitle(`Hóa đơn tháng ${month}/${year}`);
  };

  // Add line item from catalog
  const handleAddItem = () => {
    const unaddedFee =
      applicableFees.find(
        (af) => !items.some((it) => it.name === af.name || it.feeItemId === af.id)
      ) ||
      allCatalogFees.find(
        (f) => !items.some((it) => it.name === f.name || it.feeItemId === f.id)
      ) ||
      allCatalogFees[5]; // fallback: Xe đưa đón

    if (unaddedFee) {
      let category: InvoiceLineItemCategory = 'khac';
      let isMealFee = false;
      let unitPrice = unaddedFee.defaultAmount;
      let qty = 1;

      if (unaddedFee.feeNumber === 1 || unaddedFee.code === 'HOC_PHI') {
        category = 'hoc_phi';
      } else if (unaddedFee.feeNumber === 2 || unaddedFee.code === 'TIEN_AN') {
        category = 'tien_an';
        isMealFee = true;
        unitPrice = 35000;
        qty = 22;
      } else if (unaddedFee.feeNumber === 25 || unaddedFee.code === 'TIEN_AN_SANG' || unaddedFee.name.toLowerCase().includes('ăn sáng')) {
        category = 'tien_an';
        isMealFee = true;
        unitPrice = 20000;
        qty = 22;
      } else if (unaddedFee.feeNumber === 3) {
        category = 'phi_tra_tre';
      }

      setItems([
        ...items,
        {
          feeItemId: unaddedFee.id,
          category,
          name: unaddedFee.name,
          description: unaddedFee.name,
          unitPrice,
          quantity: qty,
          discountType: 'percent',
          discountPercent: 0,
          discountAmount: 0,
          isRequired: false,
          isMealFee,
        },
      ]);
    } else {
      setItems([
        ...items,
        {
          feeItemId: 'fee-custom',
          category: 'khac',
          name: 'Khoản thu bổ sung',
          description: '',
          unitPrice: 100000,
          quantity: 1,
          discountType: 'percent',
          discountPercent: 0,
          discountAmount: 0,
          isRequired: false,
          isMealFee: false,
        },
      ]);
    }
  };

  // Remove line item
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Update item field
  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Select a fee item from catalog and populate line attributes
  const handleFeeSelect = (index: number, selectedId: string) => {
    const foundFee = allCatalogFees.find((f) => f.id === selectedId);
    if (!foundFee) return;

    let category: InvoiceLineItemCategory = 'khac';
    let isMealFee = false;
    let qty = 1;
    let unitPrice = foundFee.defaultAmount;

    if (foundFee.feeNumber === 1 || foundFee.code === 'HOC_PHI') {
      category = 'hoc_phi';
    } else if (foundFee.feeNumber === 2 || foundFee.code === 'TIEN_AN') {
      category = 'tien_an';
      isMealFee = true;
      unitPrice = 35000;
      qty = 22;
    } else if (foundFee.feeNumber === 25 || foundFee.code === 'TIEN_AN_SANG' || foundFee.name.toLowerCase().includes('ăn sáng')) {
      category = 'tien_an';
      isMealFee = true;
      unitPrice = 20000;
      qty = 22;
    } else if (foundFee.feeNumber === 3 || foundFee.code === 'PHI_TRA_TRE') {
      category = 'phi_tra_tre';
    } else if (foundFee.name.toLowerCase().includes('cơ sở vật chất')) {
      category = 'co_so_vat_chat';
    } else if (
      foundFee.name.toLowerCase().includes('dã ngoại') ||
      foundFee.name.toLowerCase().includes('ngoại khóa')
    ) {
      category = 'ngoai_khoa';
    }

    const updated = [...items];
    updated[index] = {
      ...updated[index],
      feeItemId: foundFee.id,
      category,
      name: foundFee.name,
      description:
        foundFee.feeNumber === 1
          ? 'Chương trình chuẩn liên cấp'
          : foundFee.feeNumber === 2
          ? 'Tự động tính theo ngày học thực tế (TASK-FIN-002)'
          : foundFee.feeNumber === 25 || foundFee.code === 'TIEN_AN_SANG' || foundFee.name.toLowerCase().includes('ăn sáng')
          ? 'Đăng ký ăn sáng bán trú (20.000 đ/ngày x 22 ngày)'
          : foundFee.feeNumber === 6
          ? 'Xe đưa đón học sinh theo tuyến đăng ký'
          : foundFee.name,
      unitPrice,
      quantity: qty,
      isRequired: foundFee.type === 'system',
      isMealFee,
    };
    setItems(updated);
  };

  // Check which meal categories exist in the current invoice lines
  const hasBreakfastInInvoice = React.useMemo(() => {
    return items.some(
      (item) =>
        (item.category as string) === 'tien_an_sang' ||
        (item.name || '').toLowerCase().includes('sáng') ||
        (item.name || '').toLowerCase().includes('ăn sáng')
    );
  }, [items]);

  const hasMainMealInInvoice = React.useMemo(() => {
    return items.some(
      (item) =>
        (item.category === 'tien_an' ||
          item.isMealFee ||
          (item.name || '').toLowerCase().includes('tiền ăn') ||
          (item.name || '').toLowerCase().includes('bán trú')) &&
        !((item.category as string) === 'tien_an_sang' ||
          (item.name || '').toLowerCase().includes('sáng') ||
          (item.name || '').toLowerCase().includes('ăn sáng'))
    );
  }, [items]);

  // Previous-Month Meal Refund Calculation for active student context (M-1)
  const prevMonthKey = getPreviousMonthKey(billingMonth);
  const currentStudentAbsence =
    scope === 'hoc_sinh' ? getStudentAbsenceBreakdown(studentId, prevMonthKey) : undefined;

  const currentStudentMealRefund = React.useMemo(() => {
    if (scope !== 'hoc_sinh' || !currentStudentAbsence || !mealRefundConfig?.isEnabled) return null;
    const rawSummary = calculateMealRefundForStudent(
      currentStudentAbsence,
      { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 },
      {
        excused: mealRefundConfig.excusedRates || mealRefundConfig.rates || { mainMealRatePercent: 50, breakfastRatePercent: 70 },
        unexcused: mealRefundConfig.unexcusedRates || { mainMealRatePercent: 0, breakfastRatePercent: 0 }
      },
      billingMonth,
      mealRefundConfig.refundableFees,
      { isPayingBreakfast: hasBreakfastInInvoice }
    );

    if (!rawSummary) return null;

    // Filter refund items to ONLY those categories/fees that exist in current invoice lines
    const activeItems = rawSummary.items.filter((it) => {
      return items.some((invItem) => {
        const invLower = (invItem.name || '').toLowerCase();
        const itLower = (it.name || '').toLowerCase();
        if (it.feeId && (invItem.feeItemId === it.feeId || invItem.feeItemId === (it as any).feeCode)) return true;
        if (it.category === 'tien_an_sang' && hasBreakfastInInvoice) return true;
        if (it.category === 'tien_an' && hasMainMealInInvoice) return true;
        if (itLower.includes('2a8') && invLower.includes('2a8')) return true;
        if (itLower.includes('đưa đón') && invLower.includes('đưa đón')) return true;
        if (invLower.includes(itLower) || itLower.includes(invLower)) return true;
        return false;
      });
    });

    const activeTotalMealRefund = activeItems.reduce(
      (sum, it) => sum + it.totalRefundAmount,
      0
    );

    if (activeTotalMealRefund <= 0 || activeItems.length === 0) return null;

    return {
      ...rawSummary,
      items: activeItems,
      totalMealRefund: activeTotalMealRefund,
    };
  }, [scope, currentStudentAbsence, mealRefundConfig, billingMonth, hasBreakfastInInvoice, hasMainMealInInvoice, items]);

  // List of students who have meal refunds in current target scope (for batch creation scopes: toan_truong, khoi_lop, lop_hoc)
  const eligibleRefundStudents = React.useMemo(() => {
    if (scope === 'hoc_sinh' || !mealRefundConfig?.isEnabled) return [];

    let targetList = students;
    if (scope === 'lop_hoc') {
      targetList = students.filter((s) => selectedClassIds.includes(s.classId));
    } else if (scope === 'khoi_lop') {
      targetList = students.filter((s) => s.gradeLevel === gradeLevel);
    }

    const mealRates = {
      excused: mealRefundConfig.excusedRates || mealRefundConfig.rates || { mainMealRatePercent: 50, breakfastRatePercent: 70 },
      unexcused: mealRefundConfig.unexcusedRates || { mainMealRatePercent: 0, breakfastRatePercent: 0 }
    };

    return targetList
      .map((student) => {
        const absence = getStudentAbsenceBreakdown(student.studentId, prevMonthKey);
        if (!absence) return null;
        const rawRefundSummary = calculateMealRefundForStudent(
          absence,
          { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 },
          mealRates,
          billingMonth,
          mealRefundConfig.refundableFees
        );
        if (!rawRefundSummary) return null;

        // Filter refund summary items to ONLY those categories that exist in current invoice line items
        const activeItems = rawRefundSummary.items.filter((it) => {
          return items.some((invItem) => {
            const invLower = (invItem.name || '').toLowerCase();
            const itLower = (it.name || '').toLowerCase();
            if (it.feeId && (invItem.feeItemId === it.feeId || invItem.feeItemId === (it as any).feeCode)) return true;
            if (it.category === 'tien_an_sang' && hasBreakfastInInvoice) return true;
            if (it.category === 'tien_an' && hasMainMealInInvoice) return true;
            if (itLower.includes('2a8') && invLower.includes('2a8')) return true;
            if (itLower.includes('đưa đón') && invLower.includes('đưa đón')) return true;
            if (invLower.includes(itLower) || itLower.includes(invLower)) return true;
            return false;
          });
        });

        const activeTotalMealRefund = activeItems.reduce(
          (sum, it) => sum + it.totalRefundAmount,
          0
        );

        if (activeTotalMealRefund <= 0 || activeItems.length === 0) return null;

        const refundSummary = {
          ...rawRefundSummary,
          items: activeItems,
          totalMealRefund: activeTotalMealRefund,
        };

        return {
          student,
          absence,
          refundSummary,
        };
      })
      .filter(Boolean) as BatchMealRefundItem[];
  }, [scope, students, selectedClassIds, gradeLevel, mealRefundConfig, prevMonthKey, billingMonth, hasBreakfastInInvoice, hasMainMealInInvoice, items]);

  // Match line item to specific meal refund breakdown category (strictly for single student scope)
  const getMatchedMealRefundItem = (item: (typeof items)[0]) => {
    if (scope !== 'hoc_sinh' || !currentStudentMealRefund || currentStudentMealRefund.totalMealRefund <= 0) return null;
    const lowerName = (item.name || '').toLowerCase();

    // 1. Direct match by feeItemId or feeId
    if (item.feeItemId) {
      const directMatch = currentStudentMealRefund.items.find(
        (it) => it.feeId === item.feeItemId || it.feeCode === item.feeItemId
      );
      if (directMatch) return directMatch;
    }

    // 2. Specific matching for "Phí đưa đón 2A8"
    if (lowerName.includes('2a8')) {
      const match2A8 = currentStudentMealRefund.items.find(
        (it) => it.feeId === 'fee-cust-006' || it.feeCode === 'DUA_DON_2A8' || it.name.toLowerCase().includes('2a8')
      );
      if (match2A8) return match2A8;
    }

    // 3. Breakfast matching
    const isBreakfast =
      (item.category as string) === 'tien_an_sang' ||
      lowerName.includes('sáng') ||
      lowerName.includes('ăn sáng');

    if (isBreakfast) {
      return (
        currentStudentMealRefund.items.find(
          (it) =>
            it.category === 'tien_an_sang' ||
            it.feeCode === 'TIEN_AN_SANG' ||
            it.name.toLowerCase().includes('sáng')
        ) || null
      );
    }

    // 4. Main meal matching
    const isMainMeal =
      (item.category === 'tien_an' ||
        item.isMealFee ||
        lowerName.includes('tiền ăn') ||
        lowerName.includes('bán trú')) &&
      !isBreakfast;

    if (isMainMeal) {
      return (
        currentStudentMealRefund.items.find(
          (it) =>
            it.category === 'tien_an' ||
            it.feeCode === 'TIEN_AN' ||
            it.name.toLowerCase().includes('tiền ăn') ||
            it.name.toLowerCase().includes('bán trú')
        ) || null
      );
    }

    // 5. Generic name matching
    const nameMatch = currentStudentMealRefund.items.find((it) => {
      const itLower = it.name.toLowerCase();
      return lowerName.includes(itLower) || itLower.includes(lowerName);
    });
    if (nameMatch) return nameMatch;

    return null;
  };

  // Calculate totals
  const lineCalculations = items.map((item) => {
    const explicitAmount =
      item.discountType === 'fixed_amount' ? item.discountAmount : undefined;
    const baseCalc = calculateLineItemTotal(
      item.unitPrice,
      item.quantity,
      item.discountPercent,
      explicitAmount
    );

    const matchedRefund = getMatchedMealRefundItem(item);
    const refundAmount = matchedRefund ? matchedRefund.totalRefundAmount : 0;
    const netAmount = Math.max(0, baseCalc.amount - refundAmount);

    return {
      ...baseCalc,
      refundAmount,
      matchedRefund,
      netAmount,
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const discountTotal = lineCalculations.reduce(
    (sum, c) => sum + c.discountAmount,
    0
  );
  const mealRefundTotal = lineCalculations.reduce(
    (sum, c) => sum + (c.refundAmount || 0),
    0
  );
  const totalAmount = lineCalculations.reduce((sum, c) => sum + c.netAmount, 0);

  // Filter students by selected class for 'hoc_sinh' scope
  const filteredStudentsForSelection =
    selectedClassFilterForStudent === 'all'
      ? students
      : students.filter((s) => s.classId === selectedClassFilterForStudent);

  // Helper to map category/name to fee item ID in discount policies
  const mapCategoryToFeeItemId = (
    category: string,
    name: string,
    feeItemId?: string
  ): string => {
    if (feeItemId) return feeItemId;
    const lowerName = (name || '').toLowerCase();
    if (lowerName.includes('2a8')) return 'fee-cust-006';
    if (
      lowerName.includes('xe đưa đón') ||
      lowerName.includes('xe buýt') ||
      lowerName.includes('đưa đón')
    ) {
      return 'fee-cust-003';
    }
    if (category === 'hoc_phi' || lowerName.includes('học phí')) return 'fee-sys-001';
    if (lowerName.includes('ăn sáng') || lowerName.includes('bữa sáng')) return 'fee-cust-022';
    if (category === 'tien_an' || lowerName.includes('tiền ăn')) return 'fee-sys-002';
    if (
      category === 'phi_tra_tre' ||
      lowerName.includes('trả trẻ') ||
      lowerName.includes('trông trễ')
    ) {
      return 'fee-sys-003';
    }
    if (lowerName.includes('steam')) return 'fee-cust-001';
    if (lowerName.includes('tiếng anh')) return 'fee-cust-002';
    if (lowerName.includes('đồng phục')) return 'fee-cust-004';
    if (lowerName.includes('dã ngoại')) return 'fee-cust-011';
    return `fee-${category}`;
  };

  // Evaluate active student discounts
  const targetStudent = students.find((s) => s.studentId === studentId);

  // Helper to get candidate discount programs for a line item
  const getItemCandidates = (item: (typeof items)[0]) => {
    if (!targetStudent) return [];
    return getStudentCandidateDiscountPolicies(
      {
        id: targetStudent.studentId,
        classId: targetStudent.classId,
        fullName: targetStudent.studentName,
      },
      {
        id: mapCategoryToFeeItemId(item.category, item.name, (item as any).feeItemId),
        name: item.name,
        amount: item.unitPrice * item.quantity,
      },
      policies,
      billingMonth
    );
  };

  // Handler for scope change
  const handleScopeChange = (newScope: InvoiceCreationScope) => {
    setScope(newScope);
    if (newScope !== 'hoc_sinh') {
      setSelectedPolicyOverrides({});
      setItems((prev) =>
        prev.map((it) => ({
          ...it,
          discountType: 'percent',
          discountPercent: 0,
          discountAmount: 0,
          description: it.description?.replace(/\[Đã áp dụng [^\]]+\]/, '').trim() || '',
        }))
      );
    }
    let fees = applicableFees;
    if (newScope === 'lop_hoc') {
      fees = getApplicableFeeItemsForTargets(
        'class',
        selectedClassIds.length > 0 ? selectedClassIds : ['class-10a1', 'class-10a2']
      );
    } else if (newScope === 'hoc_sinh') {
      fees = getApplicableFeeItemsForTargets('student', [studentId]);
    }
    if (fees && fees.length > 0) {
      syncItemsWithApplicableFees(fees);
    }
  };

  // Handler for student change
  const handleStudentChange = (newStudentId: string) => {
    setStudentId(newStudentId);
    setSelectedPolicyOverrides({});
    const fees = getApplicableFeeItemsForTargets('student', [newStudentId]);
    if (fees && fees.length > 0) {
      syncItemsWithApplicableFees(fees);
    }
  };

  // Handler for confirming discount policy selection from modal
  const handleApplyPolicy = (
    itemIdx: number,
    policyId: string | 'none',
    percent: number,
    policyName?: string,
    discountType: 'percent' | 'fixed_amount' = 'percent',
    amount?: number
  ) => {
    setSelectedPolicyOverrides((prev) => ({
      ...prev,
      [itemIdx]: { policyId, percent, policyName, discountType, amount },
    }));
    setItems((prevItems) => {
      const updated = [...prevItems];
      let desc = updated[itemIdx].description || '';
      if (policyName) {
        const tag = `[Đã áp dụng ${policyName}]`;
        desc = desc.includes('[Đã áp dụng')
          ? desc.replace(/\[Đã áp dụng [^\]]+\]/, tag)
          : desc ? `${desc} • ${tag}` : tag;
      } else if (policyId === 'none') {
        desc = desc.replace(/\[Đã áp dụng [^\]]+\]/, '').trim();
      }

      const computedDiscountAmount =
        amount !== undefined
          ? amount
          : Math.round((updated[itemIdx].unitPrice * updated[itemIdx].quantity * percent) / 100);

      updated[itemIdx] = {
        ...updated[itemIdx],
        discountType,
        discountPercent: percent,
        discountAmount: computedDiscountAmount,
        description: desc,
      };
      return updated;
    });
  };

  // Switch discount type between percent (%) and fixed_amount (đ)
  const handleSwitchDiscountType = (
    index: number,
    newType: 'percent' | 'fixed_amount'
  ) => {
    const updated = [...items];
    const current = updated[index];
    const gross = current.unitPrice * current.quantity;

    if (newType === 'fixed_amount') {
      const amount =
        current.discountAmount !== undefined && current.discountAmount > 0
          ? current.discountAmount
          : Math.round(gross * ((current.discountPercent || 0) / 100));
      updated[index] = {
        ...current,
        discountType: 'fixed_amount',
        discountAmount: amount,
      };
      setSelectedPolicyOverrides((prev) => ({
        ...prev,
        [index]: {
          policyId: 'manual',
          percent: gross > 0 ? Math.round((amount / gross) * 100) : 0,
          amount,
          discountType: 'fixed_amount',
        },
      }));
    } else {
      const percent =
        current.discountPercent > 0
          ? current.discountPercent
          : gross > 0 && current.discountAmount
          ? Math.min(100, Math.round((current.discountAmount / gross) * 100))
          : 0;
      updated[index] = {
        ...current,
        discountType: 'percent',
        discountPercent: percent,
      };
      setSelectedPolicyOverrides((prev) => ({
        ...prev,
        [index]: {
          policyId: 'manual',
          percent,
          discountType: 'percent',
        },
      }));
    }
    setItems(updated);
  };

  // Change discount value in either % or VND
  const handleDiscountValueChange = (index: number, rawValue: string) => {
    const updated = [...items];
    const current = updated[index];
    const isFixed = current.discountType === 'fixed_amount';
    const gross = current.unitPrice * current.quantity;

    if (isFixed) {
      const num = Math.min(gross, parseCurrencyNumber(rawValue));
      const equivPercent = gross > 0 ? Math.round((num / gross) * 100) : 0;
      updated[index] = {
        ...current,
        discountAmount: num,
        discountPercent: equivPercent,
      };
      setSelectedPolicyOverrides((prev) => ({
        ...prev,
        [index]: {
          policyId: 'manual',
          percent: equivPercent,
          amount: num,
          discountType: 'fixed_amount',
        },
      }));
    } else {
      const num = Math.min(100, Math.max(0, Number(rawValue) || 0));
      const calcDiscountAmount = Math.round(gross * (num / 100));
      updated[index] = {
        ...current,
        discountPercent: num,
        discountAmount: calcDiscountAmount,
      };
      setSelectedPolicyOverrides((prev) => ({
        ...prev,
        [index]: {
          policyId: 'manual',
          percent: num,
          amount: calcDiscountAmount,
          discountType: 'percent',
        },
      }));
    }
    setItems(updated);
  };

  // Keep line items synced with candidate discounts when in 'hoc_sinh' scope
  React.useEffect(() => {
    if (scope !== 'hoc_sinh' || !targetStudent) return;

    setItems((prevItems) => {
      let changed = false;
      const nextItems = prevItems.map((item, idx) => {
        const override = selectedPolicyOverrides[idx];
        let targetDiscountType: 'percent' | 'fixed_amount' = 'percent';
        let targetPercent = 0;
        let targetDiscountAmount = 0;
        let targetDesc = item.description || '';

        if (override !== undefined) {
          targetDiscountType = override.discountType || 'percent';
          targetPercent = override.percent;
          targetDiscountAmount =
            override.amount !== undefined
              ? override.amount
              : targetDiscountType === 'fixed_amount'
              ? Math.round(item.unitPrice * item.quantity * (targetPercent / 100))
              : 0;
          if (override.policyName) {
            const tag = `[Đã áp dụng ${override.policyName}]`;
            targetDesc = targetDesc.includes('[Đã áp dụng')
              ? targetDesc.replace(/\[Đã áp dụng [^\]]+\]/, tag)
              : targetDesc ? `${targetDesc} • ${tag}` : tag;
          } else if (override.policyId === 'none') {
            targetDesc = targetDesc.replace(/\[Đã áp dụng [^\]]+\]/, '').trim();
          }
        } else if (autoApplyDiscount) {
          const candidates = getStudentCandidateDiscountPolicies(
            {
              id: targetStudent.studentId,
              classId: targetStudent.classId,
              fullName: targetStudent.studentName,
            },
            {
              id: mapCategoryToFeeItemId(item.category, item.name, (item as any).feeItemId),
              name: item.name,
              amount: item.unitPrice * item.quantity,
            },
            policies,
            billingMonth
          );
          if (candidates.length > 0 && candidates[0].deductionAmount > 0) {
            const best = candidates[0];
            targetDiscountType = best.policy.discountType;
            if (best.policy.discountType === 'fixed_amount') {
              targetDiscountAmount = best.policy.discountValue || best.deductionAmount;
              targetPercent = best.discountPercentEquivalent;
            } else {
              targetPercent = best.policy.discountValue;
              targetDiscountAmount = best.deductionAmount;
            }
            const tag = `[Đã áp dụng ${best.policy.name}]`;
            targetDesc = targetDesc.includes('[Đã áp dụng')
              ? targetDesc.replace(/\[Đã áp dụng [^\]]+\]/, tag)
              : targetDesc ? `${targetDesc} • ${tag}` : tag;
          } else {
            targetDiscountType = 'percent';
            targetPercent = 0;
            targetDiscountAmount = 0;
            targetDesc = targetDesc.replace(/\[Đã áp dụng [^\]]+\]/, '').trim();
          }
        } else {
          targetDiscountType = 'percent';
          targetPercent = 0;
          targetDiscountAmount = 0;
          targetDesc = targetDesc.replace(/\[Đã áp dụng [^\]]+\]/, '').trim();
        }

        if (
          item.discountPercent !== targetPercent ||
          item.discountType !== targetDiscountType ||
          item.discountAmount !== targetDiscountAmount ||
          item.description !== targetDesc
        ) {
          changed = true;
          return {
            ...item,
            discountType: targetDiscountType,
            discountPercent: targetPercent,
            discountAmount: targetDiscountAmount,
            description: targetDesc,
          };
        }
        return item;
      });

      return changed ? nextItems : prevItems;
    });
  }, [studentId, scope, autoApplyDiscount, billingMonth, selectedPolicyOverrides, policies]);

  // Modal item and candidate calculation
  const modalItem = discountModalItemIndex !== null ? items[discountModalItemIndex] : null;
  const modalItemCandidates = modalItem ? getItemCandidates(modalItem) : [];
  const currentPolicyId =
    discountModalItemIndex !== null && selectedPolicyOverrides[discountModalItemIndex]
      ? selectedPolicyOverrides[discountModalItemIndex].policyId
      : (modalItem?.discountPercent === 0 && (!modalItem?.discountAmount || modalItem.discountAmount === 0))
      ? 'none'
      : modalItemCandidates.find(
          (o) =>
            (modalItem?.discountType === 'fixed_amount' && o.policy.discountValue === modalItem.discountAmount) ||
            (modalItem?.discountType !== 'fixed_amount' && o.discountPercentEquivalent === modalItem?.discountPercent)
        )?.policy.id ||
        modalItemCandidates[0]?.policy.id ||
        'none';

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      createBatchInvoices({
        scope,
        gradeLevel: scope === 'khoi_lop' ? gradeLevel : undefined,
        classId: scope === 'lop_hoc' ? selectedClassIds[0] : undefined,
        classIds: scope === 'lop_hoc' ? selectedClassIds : undefined,
        studentId: scope === 'hoc_sinh' ? studentId : undefined,
        billingMonth,
        title,
        issueDate,
        sendDate: sendDate.trim() || undefined,
        dueDate,
        exportElectronicInvoice,
        autoApplyDiscount,
        discountPolicies: policies,
        autoApplyMealRefund: mealRefundConfig?.isEnabled ?? true,
        mealRefundRates: mealRefundConfig
          ? {
              excused:
                mealRefundConfig.excusedRates ||
                mealRefundConfig.rates || {
                  mainMealRatePercent: 50,
                  breakfastRatePercent: 70,
                },
              unexcused:
                mealRefundConfig.unexcusedRates || {
                  mainMealRatePercent: 0,
                  breakfastRatePercent: 0,
                },
            }
          : undefined,
        refundableFees: mealRefundConfig?.refundableFees,
        items,
      })
    );

    alert('Đã tạo thành công hóa đơn học phí theo danh sách chỉ định!');
    router.push(`/${schoolCode}/school/fee`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Tạo mới hóa đơn học phí
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Khởi tạo hóa đơn thu phí hàng loạt theo Toàn trường, Khối lớp, Lớp học, hoặc từng Học sinh.
            </p>
          </div>
          <button
            onClick={() => router.push(`/${schoolCode}/school/fee`)}
            className="text-slate-400 hover:text-slate-600 p-2"
          >
            <Icon name="xmark" size={18} />
          </button>
        </div>

        {/* BR05 Info Alert */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-blue-800">
          <Icon name="circle-info" size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Quy tắc nghiệp vụ hệ thống (BR05):</span> Hệ thống sẽ{' '}
            <span className="font-semibold">tự động bỏ qua</span> học sinh đã có hóa đơn hoặc đã thanh toán đủ học phí + tiền ăn trong tháng đang chọn để tránh lập trùng. Tiền ăn bán trú được tự động đối soát trừ ngày nghỉ phép hợp lệ từ Báo cáo Điểm danh.
          </div>
        </div>
      </div>

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Scope Selection (BR05) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            1. Phạm vi áp dụng hóa đơn
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'toan_truong', label: 'Toàn Trường' },
              { id: 'khoi_lop', label: 'Khối lớp' },
              { id: 'lop_hoc', label: 'Lớp học' },
              { id: 'hoc_sinh', label: 'Học sinh cụ thể' },
            ].map((sc) => (
              <button
                type="button"
                key={sc.id}
                onClick={() => handleScopeChange(sc.id as InvoiceCreationScope)}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center ${
                  scope === sc.id
                    ? 'bg-blue-50 border-[#0070CE] text-[#0070CE] shadow-sm ring-1 ring-[#0070CE]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>

          {/* Conditional Dropdowns based on Scope */}
          {scope === 'khoi_lop' && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chọn khối lớp <span className="text-rose-500">*</span>
              </label>
              <Dropdown
                value={gradeLevel}
                onChange={(val) => setGradeLevel(val)}
                options={[
                  { value: 'Khối 6', label: 'Khối 6' },
                  { value: 'Khối 7', label: 'Khối 7' },
                  { value: 'Khối 10', label: 'Khối 10' },
                  { value: 'Khối 11', label: 'Khối 11' },
                  { value: 'Khối 12', label: 'Khối 12' },
                  { value: 'Mầm non', label: 'Mầm non' },
                ]}
                fullWidth
              />
            </div>
          )}

          {scope === 'lop_hoc' && (
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Chọn các lớp học áp dụng ({selectedClassIds.length} lớp được chọn) <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Hệ thống sẽ tự động tổng hợp danh mục khoản thu quy định chung cho các lớp (gồm Học phí, Tiền ăn, Xe đưa đón...).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClassPickerOpen(true)}
                  className="px-3.5 py-1.5 bg-blue-50 text-[#0070CE] hover:bg-blue-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-blue-200 shrink-0 self-start sm:self-auto"
                >
                  <Icon name="users" size={14} />
                  <span>Chọn lớp học</span>
                </button>
              </div>

              {/* Selected Classes Chips */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[50px] flex flex-wrap items-center gap-2">
                {selectedClassIds.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    Chưa chọn lớp học nào. Nhấn &quot;Chọn lớp học&quot; để thêm Lớp 10A1, Lớp 10A2...
                  </span>
                ) : (
                  selectedClassIds.map((cid) => {
                    const cls =
                      AVAILABLE_CLASSES_FOR_DISCOUNT.find((c) => c.id === cid) ||
                      mockFeeClasses.find((c) => c.id === cid);
                    return (
                      <span
                        key={cid}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs group hover:border-blue-300 transition"
                      >
                        <Icon name="graduation-cap" size={13} className="text-[#0070CE]" />
                        <span>{cls?.name || cid}</span>
                        {cls && 'studentCount' in cls && (
                          <span className="text-[10px] text-slate-400">
                            ({(cls as any).studentCount} HS)
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedClassIds.length <= 1) {
                              alert('Cần có ít nhất 01 lớp học trong phạm vi áp dụng.');
                              return;
                            }
                            const updated = selectedClassIds.filter((id) => id !== cid);
                            setSelectedClassIds(updated);
                            setClassId(updated[0] || 'class-10a1');
                            const fees = getApplicableFeeItemsForTargets('class', updated);
                            if (fees.length > 0) {
                              syncItemsWithApplicableFees(fees);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-500 transition ml-0.5"
                          title="Gỡ lớp này"
                        >
                          <Icon name="xmark" size={12} />
                        </button>
                      </span>
                    );
                  })
                )}
                {selectedClassIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsClassPickerOpen(true)}
                    className="text-xs text-[#0070CE] hover:text-blue-700 font-bold px-2 py-1 inline-flex items-center gap-1"
                  >
                    <Icon name="plus" size={12} />
                    <span>Thêm lớp</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {scope === 'hoc_sinh' && (
            <div className="pt-2 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lọc theo lớp học
                  </label>
                  <Dropdown
                    value={selectedClassFilterForStudent}
                    onChange={(newClass) => {
                      setSelectedClassFilterForStudent(newClass);
                      const matching =
                        newClass === 'all'
                          ? students
                          : students.filter((s) => s.classId === newClass);
                      if (matching.length > 0) {
                        handleStudentChange(matching[0].studentId);
                      }
                    }}
                    options={[
                      { value: 'all', label: `Tất cả lớp học (${students.length} học sinh)` },
                      ...mockFeeClasses.map((c) => {
                        const count = students.filter((s) => s.classId === c.id).length;
                        return {
                          value: c.id,
                          label: `${c.name} (${c.gradeLevel})${count > 0 ? ` — ${count} HS` : ''}`,
                        };
                      }),
                    ]}
                    searchable
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chọn học sinh <span className="text-rose-500">*</span>
                  </label>
                  <Dropdown
                    value={studentId}
                    onChange={(val) => handleStudentChange(val)}
                    options={filteredStudentsForSelection.map((s) => ({
                      value: s.studentId,
                      label: `${s.studentName} (${s.studentCode} - ${s.className})`,
                    }))}
                    searchable
                    fullWidth
                  />
                </div>
              </div>
            </div>
          )}

          {/* Administrative Discount Policy Auto-Apply Toggle */}
          <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
            <div className="pr-4">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Icon name="percent" size={13} className="text-[#0070CE]" />
                <span>Tự động áp dụng chính sách miễn giảm</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-700 font-bold">
                  Mặc định BẬT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tự động rà soát và áp dụng các chính sách miễn giảm hợp lệ theo quy định cho các học sinh thuộc phạm vi tạo hóa đơn.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoApplyDiscount}
                onChange={(e) => setAutoApplyDiscount(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* Step 2: Invoice Metadata */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            2. Thông tin chung hóa đơn
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kỳ thu (Tháng hóa đơn) <span className="text-rose-500">*</span>
              </label>
              <Dropdown
                value={billingMonth}
                onChange={(val) => handleMonthChange({ target: { value: val } } as any)}
                options={[
                  { value: '2026-09', label: 'Tháng 09/2026' },
                  { value: '2026-10', label: 'Tháng 10/2026' },
                  { value: '2026-11', label: 'Tháng 11/2026' },
                  { value: '2026-12', label: 'Tháng 12/2026' },
                ]}
                fullWidth
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên hóa đơn hiển thị <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày hóa đơn <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                required
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hạn thanh toán <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                required
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày gửi thông báo phụ huynh
              </label>
              <input
                type="text"
                value={sendDate}
                onChange={(e) => setSendDate(e.target.value)}
                placeholder="Để trống = Gửi thông báo ngay sau khi tạo"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {sendDate ? `Lên lịch gửi vào ngày ${sendDate}` : 'Trạng thái ban đầu: Đã gửi ngay'}
              </span>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={exportElectronicInvoice}
                  onChange={(e) => setExportElectronicInvoice(e.target.checked)}
                  className="w-4 h-4 text-[#0070CE] rounded border-slate-300 focus:ring-[#0070CE]"
                />
                <span>Xuất hóa đơn điện tử (HĐĐT) (BR07)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Step 3: Fee Line Items Table - Only shown for 'lop_hoc' and 'hoc_sinh' */}
        {(scope === 'lop_hoc' || scope === 'hoc_sinh') ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                3. Chi tiết các dòng khoản thu
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {scope === 'lop_hoc'
                  ? `Đang áp dụng danh mục khoản thu quy định cho ${selectedClassIds.length} lớp đã chọn (${applicableFees.length} khoản phí, gồm Xe đưa đón nếu thuộc danh mục).`
                  : scope === 'hoc_sinh'
                  ? `Đang áp dụng danh mục khoản thu theo lớp của học sinh (${applicableFees.length} khoản phí).`
                  : `Danh mục khoản thu chuẩn cấp trường.`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => syncItemsWithApplicableFees(applicableFees)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200"
                title="Tải lại các khoản thu mặc định theo lớp học đã chọn"
              >
                <Icon name="rotate" size={12} className="text-slate-500" />
                <span>Tải lại theo lớp</span>
              </button>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3.5 py-1.5 bg-blue-50 text-[#0070CE] hover:bg-blue-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-blue-200"
              >
                <Icon name="plus" size={12} />
                <span>Thêm dòng thu</span>
              </button>
            </div>
          </div>

          {/* Single Student Meal Refund Deduction Callout (M-1) */}
          {scope === 'hoc_sinh' && currentStudentMealRefund && currentStudentMealRefund.totalMealRefund > 0 && (
            <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-blue-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Icon name="utensils" size={13} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Giảm trừ hoàn tiền khi nghỉ học tháng {currentStudentMealRefund.reconciledMonth} (Tự động kết chuyển vào kỳ {billingMonth})
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300">
                  Tổng hoàn: -{formatVND(currentStudentMealRefund.totalMealRefund)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {currentStudentMealRefund.items.map((item) => (
                  <div
                    key={item.feeId || item.category || item.name}
                    className="bg-white/90 p-3 rounded-lg border border-emerald-100 flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{item.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {item.excusedDays && item.excusedDays > 0 ? (
                          <div className="space-y-0.5">
                            <div>
                              {item.excusedDays} ngày nghỉ có phép [{item.excusedRatePercent ?? item.selfAbsenceRatePercent}%]: -{formatVND(item.excusedRefundAmount ?? item.selfRefundAmount)}
                            </div>
                            {item.unexcusedDays && item.unexcusedDays > 0 ? (
                              <div>
                                {item.unexcusedDays} ngày nghỉ không phép [{item.unexcusedRatePercent ?? 0}%]: -{formatVND(item.unexcusedRefundAmount ?? 0)}
                              </div>
                            ) : null}
                          </div>
                        ) : item.unexcusedDays && item.unexcusedDays > 0 ? (
                          <div>
                            {item.unexcusedDays} ngày nghỉ không phép [{item.unexcusedRatePercent ?? 0}%]: -{formatVND(item.unexcusedRefundAmount ?? 0)}
                          </div>
                        ) : item.selfAbsenceDays > 0 ? (
                          <span>{item.selfAbsenceDays} ngày nghỉ có phép [{item.selfAbsenceRatePercent}%]: -{formatVND(item.selfRefundAmount)}</span>
                        ) : (
                          <span>Khấu trừ hoàn tiền: -{formatVND(item.totalRefundAmount)}</span>
                        )}
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-600 shrink-0 text-xs">
                      -{formatVND(item.totalRefundAmount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-emerald-900 bg-white/60 p-2 rounded-md flex items-center gap-2">
                <Icon name="circle-info" size={14} className="text-emerald-600 shrink-0" />
                <span>
                  Hệ thống tự động trừ trực tiếp <strong>{formatVND(currentStudentMealRefund.totalMealRefund)}</strong> vào các dòng khoản thu tương ứng của học sinh khi tạo hóa đơn và ghi chú rõ ràng trên phiếu báo gửi phụ huynh.
                </span>
              </div>
            </div>
          )}

          {/* Batch Scope Notice: Highlight students with food-fee refund */}
          {scope !== 'hoc_sinh' && eligibleRefundStudents.length > 0 && (
            <div className="p-3.5 bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-50/90 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold shadow-2xs">
                  <Icon name="utensils" size={14} />
                </div>
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <span>
                      Có <strong className="text-amber-800 font-extrabold">{eligibleRefundStudents.length} học sinh</strong> trong danh sách được khấu trừ hoàn tiền ăn (Tháng {prevMonthKey.split('-')[1]})
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 shrink-0">
                      Tự động khấu trừ theo từng học sinh
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Bảng phí dưới đây hiển thị định mức chuẩn. Khi bấm tạo hóa đơn hàng loạt, hệ thống chỉ khấu trừ hoàn tiền ăn cho đúng {eligibleRefundStudents.length} học sinh này (các học sinh khác thu đủ theo định mức).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBatchMealRefundModalOpen(true)}
                className="px-3.5 py-1.5 bg-white hover:bg-amber-100/80 text-[#0070CE] font-bold border border-amber-300 hover:border-amber-400 rounded-lg shrink-0 flex items-center gap-1.5 transition shadow-xs text-xs self-end sm:self-auto"
              >
                <Icon name="eye" size={13} />
                <span>Xem chi tiết ({eligibleRefundStudents.length})</span>
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-xs font-bold text-slate-600">
                  <th className="py-2 px-3">Khoản thu (Danh mục)</th>
                  <th className="py-2 px-3">Mô tả</th>
                  <th className="py-2 px-3 text-right w-36">Đơn giá</th>
                  <th className="py-2 px-3 text-center w-20">Số lượng</th>
                  <th className="py-2 px-3 text-right w-36">Giảm trừ</th>
                  <th className="py-2 px-3 text-right w-36">Thành tiền</th>
                  <th className="py-2 px-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {items.map((item, idx) => {
                  const calc = lineCalculations[idx];
                  const candidates = getItemCandidates(item);

                  const feeOptions: DropdownOption[] = [
                    ...applicableFees.map((af) => ({
                      value: af.id,
                      label: `${af.name} (${formatVND(af.defaultAmount)})`,
                      badge: 'Theo lớp',
                      badgeTone: 'primary' as const,
                    })),
                    ...allCatalogFees
                      .filter((f) => !applicableFees.some((af) => af.id === f.id))
                      .map((f) => ({
                        value: f.id,
                        label: `${f.name} (${formatVND(f.defaultAmount)})`,
                        badge: 'Toàn trường',
                        badgeTone: 'neutral' as const,
                      })),
                    {
                      value: 'custom',
                      label: 'Tùy chỉnh / Khoản thu khác',
                    },
                  ];

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 min-w-[240px]">
                        <Dropdown
                          value={
                            (item as any).feeItemId ||
                            allCatalogFees.find(
                              (f) => f.name.toLowerCase() === item.name.toLowerCase()
                            )?.id ||
                            'custom'
                          }
                          onChange={(val) => {
                            if (val === 'custom') {
                              handleUpdateItem(idx, 'feeItemId', undefined);
                            } else {
                              handleFeeSelect(idx, val);
                            }
                          }}
                          options={feeOptions}
                          size="sm"
                          searchable
                          fullWidth
                        />
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'name', e.target.value)
                          }
                          placeholder="Tên dòng khoản thu"
                          className="w-full h-7 px-2 mt-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={item.description || ''}
                          placeholder="Ghi chú dòng"
                          onChange={(e) =>
                            handleUpdateItem(idx, 'description', e.target.value)
                          }
                          className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-slate-600"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="text"
                          value={item.unitPrice === 0 ? '' : formatCurrencyNumber(item.unitPrice)}
                          placeholder="0"
                          onChange={(e) => {
                            const val = parseCurrencyNumber(e.target.value);
                            handleUpdateItem(idx, 'unitPrice', val);
                          }}
                          className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-right font-medium focus:border-[#0070CE] focus:ring-1 focus:ring-[#0070CE]"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'quantity', Number(e.target.value))
                          }
                          className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-center font-bold"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center justify-end w-32 bg-white border border-slate-200 rounded overflow-hidden focus-within:border-[#0070CE] focus-within:ring-1 focus-within:ring-[#0070CE]">
                            <input
                              type="text"
                              value={
                                item.discountType === 'fixed_amount'
                                  ? (item.discountAmount === 0 || item.discountAmount === undefined)
                                    ? '0'
                                    : formatCurrencyNumber(item.discountAmount)
                                  : (item.discountPercent ?? 0)
                              }
                              onChange={(e) => handleDiscountValueChange(idx, e.target.value)}
                              className="w-full h-8 px-2 bg-transparent text-xs text-right text-emerald-600 font-bold focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleSwitchDiscountType(
                                  idx,
                                  item.discountType === 'fixed_amount' ? 'percent' : 'fixed_amount'
                                )
                              }
                              className="h-8 px-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border-l border-slate-200 cursor-pointer transition-colors shrink-0"
                              title="Chuyển đổi đơn vị (% hoặc đ)"
                            >
                              {item.discountType === 'fixed_amount' ? 'đ' : '%'}
                            </button>
                          </div>
                          {calc && calc.discountAmount > 0 && (
                            <span className="text-[11px] font-semibold text-emerald-600 tracking-tight whitespace-nowrap">
                              -{formatVND(calc.discountAmount)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-slate-900 text-xs">
                            {formatVND(calc?.netAmount ?? calc?.amount ?? 0)}
                          </span>
                          {calc?.refundAmount && calc.refundAmount > 0 ? (
                            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-1 inline-flex items-center gap-1 shadow-2xs">
                              <Icon name="utensils" size={11} className="text-emerald-600" />
                              <span>Hoàn tiền: -{formatVND(calc.refundAmount)}</span>
                            </div>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {!item.isRequired && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Icon name="trash" size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Subtotal summary */}
          <div className="border-t border-slate-200 pt-3 flex justify-end">
            <div className="w-80 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính:</span>
                <span className="font-semibold">{formatVND(subtotal)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Giảm trừ miễn giảm:</span>
                  <span className="font-semibold">-{formatVND(discountTotal)}</span>
                </div>
              )}
              {mealRefundTotal > 0 && currentStudentMealRefund && scope === 'hoc_sinh' && (
                <div className="flex justify-between text-emerald-600">
                  <span>Khấu trừ hoàn tiền khi nghỉ học (T{currentStudentMealRefund.reconciledMonth.split('-')[1]}):</span>
                  <span className="font-semibold">-{formatVND(mealRefundTotal)}</span>
                </div>
              )}
              {scope !== 'hoc_sinh' && eligibleRefundStudents.length > 0 && (
                <div className="text-[11px] text-slate-600 py-1.5 bg-amber-50/80 rounded px-2.5 text-left border border-amber-200/80 flex items-center justify-between">
                  <span>Có <strong>{eligibleRefundStudents.length} học sinh</strong> được tự động hoàn tiền ăn:</span>
                  <button
                    type="button"
                    onClick={() => setIsBatchMealRefundModalOpen(true)}
                    className="text-[#0070CE] font-bold underline hover:text-blue-700 ml-2 shrink-0"
                  >
                    Xem chi tiết ({eligibleRefundStudents.length})
                  </button>
                </div>
              )}
              {autoApplyDiscount && scope !== 'hoc_sinh' && (
                <div className="text-[11px] text-emerald-700 py-1 bg-emerald-50/70 rounded px-2 text-left border border-emerald-100 flex items-center gap-1.5">
                  <Icon name="check" size={12} className="text-emerald-600 shrink-0" />
                  <span>Tự động áp dụng chính sách miễn giảm cho các học sinh thuộc diện thụ hưởng.</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-1.5">
                <span>Tổng phải thu/học sinh:</span>
                <span className="text-[#0070CE]">{formatVND(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
        ) : (
          /* Notice banner for 'toan_truong' and 'khoi_lop' */
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#0070CE] flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-2xs">
                <Icon name="circle-info" size={16} />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">
                  {scope === 'toan_truong'
                    ? 'Tạo hóa đơn hàng loạt cho Toàn trường'
                    : `Tạo hóa đơn hàng loạt cho ${gradeLevel}`}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Các dòng khoản thu và định mức học phí sẽ được hệ thống tự động áp dụng theo biểu phí đã thiết lập của từng lớp học trong phân hệ <strong>Quản lý học phí</strong>. Hệ thống cũng tự động đối soát chính sách miễn giảm và khấu trừ hoàn tiền ăn cho từng học sinh.
                </p>
                {eligibleRefundStudents.length > 0 && (
                  <div className="text-xs text-amber-800 font-semibold pt-1 flex items-center gap-1.5 flex-wrap">
                    <span>• Có <strong>{eligibleRefundStudents.length} học sinh</strong> được tự động khấu trừ hoàn tiền ăn:</span>
                    <button
                      type="button"
                      onClick={() => setIsBatchMealRefundModalOpen(true)}
                      className="text-[#0070CE] font-bold underline hover:text-blue-700 ml-1 cursor-pointer"
                    >
                      Xem danh sách ({eligibleRefundStudents.length})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push(`/${schoolCode}/school/fee`)}
            className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 bg-white hover:bg-slate-50"
          >
            Hủy bỏ
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0070CE] hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            Xác nhận tạo hóa đơn
          </button>
        </div>
      </form>

      {/* Batch Meal Refund Inspection Modal */}
      <BatchMealRefundListModal
        isOpen={isBatchMealRefundModalOpen}
        onClose={() => setIsBatchMealRefundModalOpen(false)}
        refundStudents={eligibleRefundStudents}
        billingMonth={billingMonth}
        reconciledMonth={prevMonthKey}
        scope={scope}
        standardGrossSubtotal={subtotal}
      />

      {/* Select Discount Program Modal */}
      {modalItem && (
        <SelectDiscountProgramModal
          isOpen={isDiscountModalOpen}
          onClose={() => {
            setIsDiscountModalOpen(false);
            setDiscountModalItemIndex(null);
          }}
          itemName={modalItem.name}
          itemGrossAmount={modalItem.unitPrice * modalItem.quantity}
          studentName={targetStudent?.studentName || ''}
          className={targetStudent?.className || ''}
          options={modalItemCandidates}
          currentSelectedPolicyId={currentPolicyId}
          onConfirm={(policyId, percent, policyName, discountType, amount) => {
            if (discountModalItemIndex !== null) {
              handleApplyPolicy(
                discountModalItemIndex,
                policyId,
                percent,
                policyName,
                discountType,
                amount
              );
            }
          }}
        />
      )}

      {/* Class Picker Modal for Multi-Class Scoping */}
      <ClassPickerModal
        isOpen={isClassPickerOpen}
        onClose={() => setIsClassPickerOpen(false)}
        selectedClassIds={selectedClassIds}
        onConfirm={(newIds) => {
          setSelectedClassIds(newIds);
          if (newIds.length > 0) {
            setClassId(newIds[0]);
            const fees = getApplicableFeeItemsForTargets('class', newIds);
            if (fees.length > 0) {
              syncItemsWithApplicableFees(fees);
            }
          }
        }}
      />
    </div>
  );
};
