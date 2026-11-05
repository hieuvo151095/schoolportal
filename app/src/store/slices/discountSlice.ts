/**
 * Redux Toolkit Slice for Tuition Exemption & Fee Discount Policy Management (Miễn Giảm)
 * Finance Domain - Finviet / SOHA School Operating Portal
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  DiscountPolicy,
  DiscountFilterState,
  CreateDiscountPolicyPayload,
  EditDiscountPolicyPayload,
  DiscountTarget,
} from '../../types/discount.ts';
import {
  INITIAL_DISCOUNT_POLICIES,
  AVAILABLE_FEE_ITEMS_FOR_DISCOUNT,
  AVAILABLE_CLASSES_FOR_DISCOUNT,
  AVAILABLE_STUDENTS_FOR_DISCOUNT,
  feeIdsMatch,
} from '../../services/mockDiscountData.ts';
import { evaluatePolicyStatus } from '../../utils/discountValidation.ts';

export interface DiscountState {
  policies: DiscountPolicy[];
  filters: DiscountFilterState;
  isCreateModalOpen: boolean;
  editingPolicy: DiscountPolicy | null;
  deletingPolicyId: string | null;
  inspectingBeneficiaryPolicy: DiscountPolicy | null;
}

const initialState: DiscountState = {
  policies: INITIAL_DISCOUNT_POLICIES.map((p) => ({
    ...p,
    status: evaluatePolicyStatus(p),
  })),
  filters: {
    search: '',
    statusFilter: 'all',
    feeItemIdFilter: 'all',
    scopeFilter: 'all',
  },
  isCreateModalOpen: false,
  editingPolicy: null,
  deletingPolicyId: null,
  inspectingBeneficiaryPolicy: null,
};

export const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<DiscountFilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilter: (state) => {
      state.filters = {
        search: '',
        statusFilter: 'all',
        feeItemIdFilter: 'all',
        scopeFilter: 'all',
      };
    },
    createDiscountPolicy: (
      state,
      action: PayloadAction<CreateDiscountPolicyPayload>
    ) => {
      const payload = action.payload;
      const newId = `disc-${Date.now()}`;
      const codeIndex = state.policies.length + 1;
      const code = `MG-2026-${codeIndex.toString().padStart(3, '0')}`;

      const matchedFee = AVAILABLE_FEE_ITEMS_FOR_DISCOUNT.find(
        (f) => f.id === payload.feeItemId
      );
      const feeItemName = matchedFee ? matchedFee.name : 'Khoản thu';

      const targets: DiscountTarget[] = payload.targetIds.map((targetId, idx) => {
        if (payload.scopeType === 'class') {
          const matchedClass = AVAILABLE_CLASSES_FOR_DISCOUNT.find(
            (c) => c.id === targetId
          );
          return {
            id: `tgt-${newId}-${idx}`,
            discountPolicyId: newId,
            targetType: 'class',
            targetId,
            targetName: matchedClass ? matchedClass.name : targetId,
          };
        } else {
          const matchedStudent = AVAILABLE_STUDENTS_FOR_DISCOUNT.find(
            (s) => s.id === targetId
          );
          return {
            id: `tgt-${newId}-${idx}`,
            discountPolicyId: newId,
            targetType: 'student',
            targetId,
            targetName: matchedStudent ? matchedStudent.name : targetId,
            targetClass: matchedStudent ? matchedStudent.className : undefined,
          };
        }
      });

      // Handle replacement rule:
      // If a student already has a policy for the same fee item, the old policy is replaced!
      const targetStudentIds: string[] =
        payload.scopeType === 'student'
          ? payload.targetIds
          : AVAILABLE_STUDENTS_FOR_DISCOUNT.filter((s) =>
              payload.targetIds.includes(s.classId)
            ).map((s) => s.id);

      for (const policy of state.policies) {
        if (!feeIdsMatch(policy.feeItemId, payload.feeItemId) && policy.feeItemId !== payload.feeItemId) {
          continue;
        }

        if (policy.scopeType === 'student') {
          // Remove conflicting student from old student policy targets
          policy.targets = policy.targets.filter(
            (t) => !(t.targetType === 'student' && targetStudentIds.includes(t.targetId))
          );
          if (policy.targets.length === 0) {
            policy.status = 'expired';
          }
        } else if (policy.scopeType === 'class') {
          // If the new policy is also a class policy, remove the overlapping classes from old policy
          if (payload.scopeType === 'class') {
            policy.targets = policy.targets.filter(
              (t) => !(t.targetType === 'class' && payload.targetIds.includes(t.targetId))
            );
            if (policy.targets.length === 0) {
              policy.status = 'expired';
            }
          }
          // Exclude student from old class policy
          if (!policy.excludedStudentIds) {
            policy.excludedStudentIds = [];
          }
          for (const sId of targetStudentIds) {
            if (!policy.excludedStudentIds.includes(sId)) {
              policy.excludedStudentIds.push(sId);
            }
          }
        }
      }

      const newPolicy: DiscountPolicy = {
        id: newId,
        schoolCode: 'demo',
        code,
        name: payload.name.trim(),
        discountType: payload.discountType,
        discountValue: payload.discountValue,
        feeItemId: payload.feeItemId,
        feeItemName,
        scopeType: payload.scopeType,
        validityType: payload.validityType,
        academicYearId: payload.academicYearId,
        academicYearName:
          payload.validityType === 'academic_year'
            ? 'Năm học 2026 - 2027'
            : undefined,
        fromMonth: payload.fromMonth,
        toMonth: payload.toMonth,
        reason: payload.reason ? payload.reason.trim() : '',
        status: 'active',
        targets,
        createdBy: 'Ban Quản Trị',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Check auto-expiration immediately
      newPolicy.status = evaluatePolicyStatus(newPolicy);
      state.policies.unshift(newPolicy);
      state.isCreateModalOpen = false;
    },
    updateDiscountPolicy: (
      state,
      action: PayloadAction<EditDiscountPolicyPayload>
    ) => {
      const payload = action.payload;
      const index = state.policies.findIndex((p) => p.id === payload.id);
      if (index === -1) return;

      const existing = state.policies[index];
      const matchedFee = AVAILABLE_FEE_ITEMS_FOR_DISCOUNT.find(
        (f) => f.id === payload.feeItemId
      );
      const feeItemName = matchedFee ? matchedFee.name : existing.feeItemName;

      const targets: DiscountTarget[] = payload.targetIds.map((targetId, idx) => {
        if (payload.scopeType === 'class') {
          const matchedClass = AVAILABLE_CLASSES_FOR_DISCOUNT.find(
            (c) => c.id === targetId
          );
          return {
            id: `tgt-${existing.id}-${idx}`,
            discountPolicyId: existing.id,
            targetType: 'class',
            targetId,
            targetName: matchedClass ? matchedClass.name : targetId,
          };
        } else {
          const matchedStudent = AVAILABLE_STUDENTS_FOR_DISCOUNT.find(
            (s) => s.id === targetId
          );
          return {
            id: `tgt-${existing.id}-${idx}`,
            discountPolicyId: existing.id,
            targetType: 'student',
            targetId,
            targetName: matchedStudent ? matchedStudent.name : targetId,
            targetClass: matchedStudent ? matchedStudent.className : undefined,
          };
        }
      });

      const targetStudentIds: string[] =
        payload.scopeType === 'student'
          ? payload.targetIds
          : AVAILABLE_STUDENTS_FOR_DISCOUNT.filter((s) =>
              payload.targetIds.includes(s.classId)
            ).map((s) => s.id);

      for (const policy of state.policies) {
        if (policy.id === payload.id) continue;
        if (!feeIdsMatch(policy.feeItemId, payload.feeItemId) && policy.feeItemId !== payload.feeItemId) {
          continue;
        }

        if (policy.scopeType === 'student') {
          policy.targets = policy.targets.filter(
            (t) => !(t.targetType === 'student' && targetStudentIds.includes(t.targetId))
          );
          if (policy.targets.length === 0) {
            policy.status = 'expired';
          }
        } else if (policy.scopeType === 'class') {
          if (payload.scopeType === 'class') {
            policy.targets = policy.targets.filter(
              (t) => !(t.targetType === 'class' && payload.targetIds.includes(t.targetId))
            );
            if (policy.targets.length === 0) {
              policy.status = 'expired';
            }
          }
          if (!policy.excludedStudentIds) {
            policy.excludedStudentIds = [];
          }
          for (const sId of targetStudentIds) {
            if (!policy.excludedStudentIds.includes(sId)) {
              policy.excludedStudentIds.push(sId);
            }
          }
        }
      }

      const updated: DiscountPolicy = {
        ...existing,
        name: payload.name.trim(),
        discountType: payload.discountType,
        discountValue: payload.discountValue,
        feeItemId: payload.feeItemId,
        feeItemName,
        scopeType: payload.scopeType,
        validityType: payload.validityType,
        academicYearId: payload.academicYearId,
        fromMonth: payload.fromMonth,
        toMonth: payload.toMonth,
        reason: payload.reason ? payload.reason.trim() : existing.reason,
        targets,
        updatedAt: new Date().toISOString(),
      };

      updated.status = evaluatePolicyStatus(updated);
      state.policies[index] = updated;
      state.editingPolicy = null;
    },
    togglePolicyStatus: (state, action: PayloadAction<string>) => {
      const policyId = action.payload;
      const policy = state.policies.find((p) => p.id === policyId);
      if (!policy) return;

      if (policy.status === 'active') {
        policy.status = 'paused';
      } else if (policy.status === 'paused') {
        // Re-evaluate if it has already expired
        const evaluated = evaluatePolicyStatus({ ...policy, status: 'active' });
        policy.status = evaluated;
      }
      policy.updatedAt = new Date().toISOString();
    },
    deleteDiscountPolicy: (state, action: PayloadAction<string>) => {
      const policyId = action.payload;
      state.policies = state.policies.filter((p) => p.id !== policyId);
      state.deletingPolicyId = null;
    },
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
    openEditModal: (state, action: PayloadAction<DiscountPolicy>) => {
      state.editingPolicy = action.payload;
    },
    closeEditModal: (state) => {
      state.editingPolicy = null;
    },
    openDeleteModal: (state, action: PayloadAction<string>) => {
      state.deletingPolicyId = action.payload;
    },
    closeDeleteModal: (state) => {
      state.deletingPolicyId = null;
    },
    openBeneficiaryModal: (state, action: PayloadAction<DiscountPolicy>) => {
      state.inspectingBeneficiaryPolicy = action.payload;
    },
    closeBeneficiaryModal: (state) => {
      state.inspectingBeneficiaryPolicy = null;
    },
  },
});

export const {
  setFilter,
  resetFilter,
  createDiscountPolicy,
  updateDiscountPolicy,
  togglePolicyStatus,
  deleteDiscountPolicy,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openDeleteModal,
  closeDeleteModal,
  openBeneficiaryModal,
  closeBeneficiaryModal,
} = discountSlice.actions;

export default discountSlice.reducer;
