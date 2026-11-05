/**
 * Redux State Machine for Account Management
 * Feature: 047-settings-account-management-tai-khoan
 * Standards: BR01-BR21, K076-K082, TK-01 to TK-07
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  UserAccount,
  StudentAccountItem,
  UserAccountFilterState,
  StudentAccountFilterState,
  CreateUserAccountPayload,
  UpdateUserAccountPayload,
  ChangeEmailPayload,
  ChangePasswordPayload,
  CreateStudentAccountPayload,
  UpdateStudentAccountPayload,
} from '../../types/account.ts';
import {
  INITIAL_USER_ACCOUNTS,
  INITIAL_STUDENT_ACCOUNTS,
} from '../../services/mockAccountData.ts';

export interface AccountState {
  users: UserAccount[];
  studentAccounts: StudentAccountItem[];
  userFilters: UserAccountFilterState;
  studentFilters: StudentAccountFilterState;
  activeTab: 'users' | 'students';

  // User form & confirmation modals
  isUserFormOpen: boolean;
  userFormMode: 'create' | 'edit';
  selectedUser: UserAccount | null;
  isConfirmUpdateOpen: boolean;
  pendingUpdatePayload: UpdateUserAccountPayload | null;
  isDeleteUserOpen: boolean;
  targetDeleteUser: UserAccount | null;
  isChangeEmailOpen: boolean;
  targetEmailUser: UserAccount | null;

  // Student account modal
  isStudentModalOpen: boolean;
  studentModalMode: 'create' | 'edit';
  selectedStudent: StudentAccountItem | null;

  // Notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  errorBanner: { code: string; message: string } | null;
}

const initialState: AccountState = {
  users: INITIAL_USER_ACCOUNTS,
  studentAccounts: INITIAL_STUDENT_ACCOUNTS,
  userFilters: {
    searchQuery: '',
    roleFilter: 'all',
    statusFilter: 'active', // BR16: Default is "Đang hoạt động"
    csdlSoFilter: 'all',
  },
  studentFilters: {
    searchQuery: '',
    classFilter: 'all',
    accountStatusFilter: 'all',
  },
  activeTab: 'users',

  isUserFormOpen: false,
  userFormMode: 'create',
  selectedUser: null,
  isConfirmUpdateOpen: false,
  pendingUpdatePayload: null,
  isDeleteUserOpen: false,
  targetDeleteUser: null,
  isChangeEmailOpen: false,
  targetEmailUser: null,

  isStudentModalOpen: false,
  studentModalMode: 'create',
  selectedStudent: null,

  toast: null,
  errorBanner: null,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'users' | 'students'>) => {
      state.activeTab = action.payload;
      state.errorBanner = null;
    },

    setUserFilters: (state, action: PayloadAction<Partial<UserAccountFilterState>>) => {
      state.userFilters = { ...state.userFilters, ...action.payload };
    },

    setStudentFilters: (state, action: PayloadAction<Partial<StudentAccountFilterState>>) => {
      state.studentFilters = { ...state.studentFilters, ...action.payload };
    },

    openCreateUserModal: (state) => {
      state.isUserFormOpen = true;
      state.userFormMode = 'create';
      state.selectedUser = null;
      state.errorBanner = null;
    },

    openEditUserModal: (state, action: PayloadAction<string>) => {
      const target = state.users.find((u) => u.id === action.payload);
      if (target) {
        state.isUserFormOpen = true;
        state.userFormMode = 'edit';
        state.selectedUser = target;
        state.errorBanner = null;
      }
    },

    closeUserFormModal: (state) => {
      state.isUserFormOpen = false;
      state.selectedUser = null;
    },

    createUserAccount: (state, action: PayloadAction<CreateUserAccountPayload>) => {
      const now = new Date().toISOString();
      const newId = `user-${Date.now()}`;
      const newUser: UserAccount = {
        id: newId,
        fullName: action.payload.fullName.trim(),
        email: action.payload.email.trim(),
        phone: action.payload.phone?.trim(),
        roles: action.payload.roles,
        status: 'active',
        isSyncedCsdlSo: false,
        staffFunctions: action.payload.staffFunctions,
        staffCode: action.payload.staffCode?.trim(),
        managedClassIds: action.payload.managedClassIds,
        additionalInfo: action.payload.additionalInfo,
        createdAt: now,
        updatedAt: now,
      };

      state.users.unshift(newUser);
      state.isUserFormOpen = false;
      state.toast = {
        type: 'success',
        message: 'Tạo tài khoản người dùng thành công',
      };
    },

    openConfirmUpdateModal: (state, action: PayloadAction<UpdateUserAccountPayload>) => {
      state.pendingUpdatePayload = action.payload;
      state.isConfirmUpdateOpen = true;
    },

    closeConfirmUpdateModal: (state) => {
      state.isConfirmUpdateOpen = false;
      state.pendingUpdatePayload = null;
    },

    confirmUserUpdate: (state) => {
      if (!state.pendingUpdatePayload) return;

      const payload = state.pendingUpdatePayload;
      const index = state.users.findIndex((u) => u.id === payload.id);
      if (index !== -1) {
        const existing = state.users[index];
        state.users[index] = {
          ...existing,
          fullName: existing.isSyncedCsdlSo ? existing.fullName : payload.fullName.trim(),
          phone: payload.phone?.trim(),
          status: payload.status,
          roles: payload.roles,
          staffFunctions: payload.staffFunctions,
          staffCode: payload.staffCode?.trim(),
          managedClassIds: payload.managedClassIds,
          additionalInfo: payload.additionalInfo,
          updatedAt: new Date().toISOString(),
        };
      }

      state.isConfirmUpdateOpen = false;
      state.pendingUpdatePayload = null;
      state.isUserFormOpen = false;
      state.selectedUser = null;
      state.toast = {
        type: 'success',
        message: 'Cập nhật tài khoản người dùng thành công',
      };
    },

    toggleUserStatus: (state, action: PayloadAction<string>) => {
      const user = state.users.find((u) => u.id === action.payload);
      if (!user) return;

      // BR06, K078: Rejection for CSDL Sở accounts
      if (user.isSyncedCsdlSo) {
        state.errorBanner = {
          code: 'TK-03',
          message: 'Không thể cập nhật với đối tượng được đồng bộ từ CSDL ngành',
        };
        return;
      }

      // Normal account: immediate update with TK-06 toast
      user.status = user.status === 'active' ? 'inactive' : 'active';
      user.updatedAt = new Date().toISOString();
      state.toast = {
        type: 'success',
        message: `Đã ${user.status === 'active' ? 'kích hoạt' : 'ngừng hoạt động'} tài khoản ${user.fullName}`,
      };
      state.errorBanner = null;
    },

    openDeleteUserModal: (state, action: PayloadAction<string>) => {
      const target = state.users.find((u) => u.id === action.payload);
      if (target && !target.roles.includes('admin')) {
        state.targetDeleteUser = target;
        state.isDeleteUserOpen = true;
      }
    },

    closeDeleteUserModal: (state) => {
      state.isDeleteUserOpen = false;
      state.targetDeleteUser = null;
    },

    confirmDeleteUser: (state) => {
      if (!state.targetDeleteUser) return;
      const targetName = state.targetDeleteUser.fullName;
      state.users = state.users.filter((u) => u.id !== state.targetDeleteUser!.id);
      state.isDeleteUserOpen = false;
      state.targetDeleteUser = null;
      state.toast = {
        type: 'success',
        message: `Đã xoá tài khoản ${targetName}`,
      };
    },

    openChangeEmailModal: (state, action: PayloadAction<string>) => {
      const target = state.users.find((u) => u.id === action.payload);
      if (target) {
        state.targetEmailUser = target;
        state.isChangeEmailOpen = true;
      }
    },

    closeChangeEmailModal: (state) => {
      state.isChangeEmailOpen = false;
      state.targetEmailUser = null;
    },

    confirmChangeEmail: (state, action: PayloadAction<ChangeEmailPayload>) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user) {
        user.email = action.payload.newEmail.trim();
        user.updatedAt = new Date().toISOString();
        if (state.selectedUser && state.selectedUser.id === user.id) {
          state.selectedUser.email = user.email;
        }
      }
      state.isChangeEmailOpen = false;
      state.targetEmailUser = null;
      state.toast = {
        type: 'success',
        message: 'Thay đổi email tài khoản thành công',
      };
    },

    changeUserPassword: (
      state,
      action: PayloadAction<{ userId: string; newPassword: string }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user) {
        user.updatedAt = new Date().toISOString();
      }
      state.toast = {
        type: 'success',
        message: 'Đổi mật khẩu người dùng thành công. Các phiên đăng nhập cũ đã được thu hồi.',
      };
    },

    openCreateStudentModal: (state, action: PayloadAction<string>) => {
      const student = state.studentAccounts.find((s) => s.studentId === action.payload);
      if (student) {
        state.selectedStudent = student;
        state.studentModalMode = 'create';
        state.isStudentModalOpen = true;
      }
    },

    openEditStudentModal: (state, action: PayloadAction<string>) => {
      const student = state.studentAccounts.find((s) => s.studentId === action.payload);
      if (student) {
        state.selectedStudent = student;
        state.studentModalMode = 'edit';
        state.isStudentModalOpen = true;
      }
    },

    closeStudentModal: (state) => {
      state.isStudentModalOpen = false;
      state.selectedStudent = null;
    },

    saveStudentAccount: (
      state,
      action: PayloadAction<{
        studentId: string;
        username: string;
        active?: boolean;
        password?: string;
      }>
    ) => {
      const student = state.studentAccounts.find((s) => s.studentId === action.payload.studentId);
      if (student) {
        student.hasAccount = true;
        student.username = action.payload.username.trim();
        if (action.payload.active !== undefined) {
          student.status = action.payload.active ? 'active' : 'inactive';
        }
      }
      state.isStudentModalOpen = false;
      state.selectedStudent = null;
      state.toast = {
        type: 'success',
        message: 'Cập nhật tài khoản học sinh thành công',
      };
    },

    clearToast: (state) => {
      state.toast = null;
    },

    clearErrorBanner: (state) => {
      state.errorBanner = null;
    },
  },
});

export const {
  setActiveTab,
  setUserFilters,
  setStudentFilters,
  openCreateUserModal,
  openEditUserModal,
  closeUserFormModal,
  createUserAccount,
  openConfirmUpdateModal,
  closeConfirmUpdateModal,
  confirmUserUpdate,
  toggleUserStatus,
  openDeleteUserModal,
  closeDeleteUserModal,
  confirmDeleteUser,
  openChangeEmailModal,
  closeChangeEmailModal,
  confirmChangeEmail,
  changeUserPassword,
  openCreateStudentModal,
  openEditStudentModal,
  closeStudentModal,
  saveStudentAccount,
  clearToast,
  clearErrorBanner,
} = accountSlice.actions;

export default accountSlice.reducer;
