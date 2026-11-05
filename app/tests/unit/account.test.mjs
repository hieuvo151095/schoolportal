import test from 'node:test';
import assert from 'node:assert/strict';
import {
  removeVietnameseTones,
  formatRoleLabel,
  getRoleBadgeStyle,
  formatStaffFunctionLabel,
  canEditAccount,
  canDeleteAccount,
  canEditFullName,
  canToggleRowStatus,
  validateCreateUserPayload,
  validateUpdateUserPayload,
  validateEmailPayload,
  validatePasswordPayload,
  validateStudentAccountPayload,
  filterUserAccounts,
  filterStudentAccounts,
} from '../../src/utils/accountValidation.ts';
import accountReducer, {
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
} from '../../src/store/slices/accountSlice.ts';
import {
  MOCK_USER_ACCOUNTS,
  MOCK_STUDENT_ACCOUNT_ITEMS,
} from '../../src/services/mockAccountData.ts';

test('Account Management (Tai khoan) Test Suite - Feature 047 / Epic 32', async (t) => {
  // -------------------------------------------------------------
  // Suite 1: Helper Utilities & Vietnamese Formatting
  // -------------------------------------------------------------
  await t.test('Helper: removeVietnameseTones correctly strips accents', () => {
    assert.equal(removeVietnameseTones('Nguyễn Văn An'), 'nguyen van an');
    assert.equal(removeVietnameseTones('Trần Thị Thu Hương'), 'tran thi thu huong');
    assert.equal(removeVietnameseTones('Đặng Quốc Đạt'), 'dang quoc dat');
  });

  await t.test('Helper: formatRoleLabel maps all system roles accurately', () => {
    assert.equal(formatRoleLabel('admin'), 'Quản trị viên');
    assert.equal(formatRoleLabel('quan_ly'), 'Quản lý');
    assert.equal(formatRoleLabel('giao_vien'), 'Giáo viên');
    assert.equal(formatRoleLabel('nhan_vien'), 'Nhân viên');
    assert.equal(formatRoleLabel('phu_huynh'), 'Phụ huynh');
  });

  await t.test('Helper: getRoleBadgeStyle assigns distinct visual tokens', () => {
    assert.ok(getRoleBadgeStyle('admin').bg.includes('bg-red-50'));
    assert.ok(getRoleBadgeStyle('quan_ly').bg.includes('bg-purple-50'));
    assert.ok(getRoleBadgeStyle('giao_vien').bg.includes('bg-blue-50'));
    assert.ok(getRoleBadgeStyle('nhan_vien').bg.includes('bg-amber-50'));
    assert.ok(getRoleBadgeStyle('phu_huynh').bg.includes('bg-emerald-50'));
  });

  await t.test('Helper: formatStaffFunctionLabel returns institutional titles', () => {
    assert.equal(formatStaffFunctionLabel('diem_danh'), 'Điểm danh');
    assert.equal(formatStaffFunctionLabel('ke_toan'), 'Kế toán');
    assert.equal(formatStaffFunctionLabel('thong_bao'), 'Thông báo');
    assert.equal(formatStaffFunctionLabel('cham_soc_y_te'), 'Chăm sóc/Y tế');
  });

  // -------------------------------------------------------------
  // Suite 2: Permission Gates & Security Protection (BR03, BR04, BR05, BR06, K077, K078)
  // -------------------------------------------------------------
  await t.test('BR03 & K077: Super-Admin accounts cannot be edited or deleted', () => {
    const adminUser = MOCK_USER_ACCOUNTS.find((u) => u.roles.includes('admin'));
    const teacherUser = MOCK_USER_ACCOUNTS.find((u) => !u.roles.includes('admin'));

    assert.ok(adminUser, 'Admin mock user must exist');
    assert.ok(teacherUser, 'Teacher mock user must exist');

    assert.equal(canEditAccount(adminUser), false, 'Admin account edit must be rejected');
    assert.equal(canDeleteAccount(adminUser), false, 'Admin account delete must be rejected');

    assert.equal(canEditAccount(teacherUser), true, 'Teacher account edit must be allowed');
    assert.equal(canDeleteAccount(teacherUser), true, 'Teacher account delete must be allowed');
  });

  await t.test('BR05 & K078: CSDL So synced accounts have locked full names', () => {
    const csdlUser = MOCK_USER_ACCOUNTS.find((u) => u.isSyncedCsdlSo);
    const manualUser = MOCK_USER_ACCOUNTS.find((u) => !u.isSyncedCsdlSo && !u.roles.includes('admin'));

    assert.ok(csdlUser, 'CSDL So synced user must exist');
    assert.ok(manualUser, 'Manual user must exist');

    assert.equal(canEditFullName(csdlUser), false, 'CSDL synced full name cannot be edited');
    assert.equal(canEditFullName(manualUser), true, 'Manual user full name can be edited');
  });

  await t.test('BR06 & K078: CSDL So synced accounts reject row-level status toggle with TK-03', () => {
    const csdlUser = MOCK_USER_ACCOUNTS.find((u) => u.isSyncedCsdlSo);
    const manualUser = MOCK_USER_ACCOUNTS.find((u) => !u.isSyncedCsdlSo);

    const csdlCheck = canToggleRowStatus(csdlUser);
    assert.equal(csdlCheck.allowed, false);
    assert.equal(csdlCheck.errorCode, 'TK-03');

    const manualCheck = canToggleRowStatus(manualUser);
    assert.equal(manualCheck.allowed, true);
    assert.equal(manualCheck.errorCode, undefined);
  });

  // -------------------------------------------------------------
  // Suite 3: User Payload Validations (BR01, BR02, BR04, BR10, K081, TK-01, TK-02)
  // -------------------------------------------------------------
  await t.test('BR01, BR04, TK-01, TK-02: validateCreateUserPayload enforces integrity rules', () => {
    // Missing required fields
    const emptyResult = validateCreateUserPayload({
      fullName: '',
      email: '',
      roles: [],
    });
    assert.equal(emptyResult.isValid, false);
    assert.ok(emptyResult.errors.fullName?.includes('họ và tên'));
    assert.ok(emptyResult.errors.email?.includes('email'));
    assert.ok(emptyResult.errors.roles?.includes('vai trò'));

    // Attempting to create an admin account (BR04)
    const adminCreateResult = validateCreateUserPayload({
      fullName: 'New Admin',
      email: 'new.admin@school.edu.vn',
      roles: ['admin', 'giao_vien'],
    });
    assert.equal(adminCreateResult.isValid, false);
    assert.ok(adminCreateResult.errors.roles?.includes('Quản trị viên'));

    // Staff without staffFunctions (BR10, TK-02)
    const staffNoFnResult = validateCreateUserPayload({
      fullName: 'Nguyen Thi Staff',
      email: 'staff@school.edu.vn',
      roles: ['nhan_vien'],
      staffFunctions: [],
    });
    assert.equal(staffNoFnResult.isValid, false);
    assert.ok(staffNoFnResult.errors.staffFunctions?.includes('chức năng'));

    // Valid teacher payload
    const validTeacher = validateCreateUserPayload({
      fullName: 'Le Thi Mai',
      email: 'mai.le@school.edu.vn',
      phone: '0909123456',
      roles: ['giao_vien'],
    });
    assert.equal(validTeacher.isValid, true);
    assert.deepEqual(validTeacher.errors, {});

    // Valid staff payload with functions
    const validStaff = validateCreateUserPayload({
      fullName: 'Pham Van Tai',
      email: 'tai.pham@school.edu.vn',
      roles: ['nhan_vien'],
      staffFunctions: ['ke_toan', 'diem_danh'],
      staffCode: 'NV-2026-099',
    });
    assert.equal(validStaff.isValid, true);
  });

  await t.test('BR05: validateUpdateUserPayload rejects full name change for CSDL So accounts', () => {
    const csdlUser = MOCK_USER_ACCOUNTS.find((u) => u.isSyncedCsdlSo);

    const modifiedNameResult = validateUpdateUserPayload(
      {
        id: csdlUser.id,
        fullName: 'Ten Moi Da Sua',
        roles: csdlUser.roles,
        status: 'active',
        managedClassIds: csdlUser.managedClassIds,
      },
      csdlUser
    );
    assert.equal(modifiedNameResult.isValid, false);
    assert.ok(modifiedNameResult.errors.fullName?.includes('không được phép thay đổi'));

    // Unmodified name passes
    const unchangedNameResult = validateUpdateUserPayload(
      {
        id: csdlUser.id,
        fullName: csdlUser.fullName,
        roles: csdlUser.roles,
        status: 'active',
        managedClassIds: csdlUser.managedClassIds,
      },
      csdlUser
    );
    assert.equal(unchangedNameResult.isValid, true);
  });

  await t.test('BR08 & BR09: Email and Password validations', () => {
    // Email
    assert.equal(validateEmailPayload('').isValid, false);
    assert.equal(validateEmailPayload('notanemail').isValid, false);
    assert.equal(validateEmailPayload('valid@school.edu.vn').isValid, true);

    // Password
    const shortPwd = validatePasswordPayload('12345', '12345');
    assert.equal(shortPwd.isValid, false);
    assert.ok(shortPwd.errors.newPassword?.includes('ít nhất 6 ký tự'));

    const mismatchPwd = validatePasswordPayload('123456', '654321');
    assert.equal(mismatchPwd.isValid, false);
    assert.ok(mismatchPwd.errors.confirmPassword?.includes('không khớp'));

    const validPwd = validatePasswordPayload('SecurePass2026', 'SecurePass2026');
    assert.equal(validPwd.isValid, true);
  });

  await t.test('BR20 & K082: validateStudentAccountPayload enforces alphanumeric username pattern', () => {
    // Empty username
    assert.equal(validateStudentAccountPayload({ studentId: 's1', username: '', password: '123', confirmPassword: '123' }, true).isValid, false);

    // Invalid characters (spaces, special characters)
    const invalidCharResult = validateStudentAccountPayload({ studentId: 's1', username: 'hoc sinh@2026', password: '123456', confirmPassword: '123456' }, true);
    assert.equal(invalidCharResult.isValid, false);
    assert.ok(invalidCharResult.errors.username?.includes('chữ cái, số'));

    // Valid usernames
    assert.equal(validateStudentAccountPayload({ studentId: 's1', username: 'nguyenvana_1a', password: 'password123', confirmPassword: 'password123' }, true).isValid, true);
    assert.equal(validateStudentAccountPayload({ studentId: 's1', username: 'hocsinh.2026', password: 'password123', confirmPassword: 'password123' }, true).isValid, true);
    assert.equal(validateStudentAccountPayload({ studentId: 's1', username: 'HS-00192', password: 'password123', confirmPassword: 'password123' }, true).isValid, true);
    assert.equal(validateStudentAccountPayload({ studentId: 's1', username: 'student123', password: 'password123', confirmPassword: 'password123' }, true).isValid, true);
  });

  // -------------------------------------------------------------
  // Suite 4: Query Filtering Engine (BR16, BR21)
  // -------------------------------------------------------------
  await t.test('BR16: filterUserAccounts searches across name/email and filters by role/status/csdl', () => {
    // Default filter active users only
    const activeUsers = filterUserAccounts(MOCK_USER_ACCOUNTS, {
      searchQuery: '',
      roleFilter: 'all',
      statusFilter: 'active',
      csdlSoFilter: 'all',
    });
    assert.ok(activeUsers.length > 0);
    assert.ok(activeUsers.every((u) => u.status === 'active'));

    // Search by diacritic-free name
    const searchedUsers = filterUserAccounts(MOCK_USER_ACCOUNTS, {
      searchQuery: 'nguyen',
      roleFilter: 'all',
      statusFilter: 'all',
      csdlSoFilter: 'all',
    });
    assert.ok(searchedUsers.length > 0);
    assert.ok(
      searchedUsers.every(
        (u) =>
          removeVietnameseTones(u.fullName).includes('nguyen') ||
          u.email.toLowerCase().includes('nguyen')
      )
    );

    // Filter by role: giao_vien
    const teachers = filterUserAccounts(MOCK_USER_ACCOUNTS, {
      searchQuery: '',
      roleFilter: 'giao_vien',
      statusFilter: 'all',
      csdlSoFilter: 'all',
    });
    assert.ok(teachers.length > 0);
    assert.ok(teachers.every((u) => u.roles.includes('giao_vien')));

    // Filter by CSDL So
    const csdlOnly = filterUserAccounts(MOCK_USER_ACCOUNTS, {
      searchQuery: '',
      roleFilter: 'all',
      statusFilter: 'all',
      csdlSoFilter: 'yes',
    });
    assert.ok(csdlOnly.length > 0);
    assert.ok(csdlOnly.every((u) => u.isSyncedCsdlSo));
  });

  await t.test('BR21: filterStudentAccounts filters by class and account status', () => {
    // Filter by class c1a1
    const class1A1Students = filterStudentAccounts(MOCK_STUDENT_ACCOUNT_ITEMS, {
      searchQuery: '',
      classFilter: 'c1a1',
      accountStatusFilter: 'all',
    });
    assert.ok(class1A1Students.length > 0);
    assert.ok(class1A1Students.every((s) => s.classId === 'c1a1'));

    // Filter by has_account
    const withAccount = filterStudentAccounts(MOCK_STUDENT_ACCOUNT_ITEMS, {
      searchQuery: '',
      classFilter: 'all',
      accountStatusFilter: 'has_account',
    });
    assert.ok(withAccount.length > 0);
    assert.ok(withAccount.every((s) => s.hasAccount));

    // Filter by no_account
    const withoutAccount = filterStudentAccounts(MOCK_STUDENT_ACCOUNT_ITEMS, {
      searchQuery: '',
      classFilter: 'all',
      accountStatusFilter: 'no_account',
    });
    assert.ok(withoutAccount.length > 0);
    assert.ok(withoutAccount.every((s) => !s.hasAccount));
  });

  // -------------------------------------------------------------
  // Suite 5: Redux State Machine Transitions
  // -------------------------------------------------------------
  await t.test('Redux: Tab navigation and filter criteria dispatch', () => {
    let state = accountReducer(undefined, { type: '@@INIT' });

    assert.equal(state.activeTab, 'users');
    assert.equal(state.userFilters.statusFilter, 'active');

    // Switch tab to students
    state = accountReducer(state, setActiveTab('students'));
    assert.equal(state.activeTab, 'students');

    // Set user search
    state = accountReducer(state, setUserFilters({ searchQuery: 'Trần' }));
    assert.equal(state.userFilters.searchQuery, 'Trần');

    // Set role filter
    state = accountReducer(state, setUserFilters({ roleFilter: 'nhan_vien' }));
    assert.equal(state.userFilters.roleFilter, 'nhan_vien');

    // Set student filter
    state = accountReducer(state, setStudentFilters({ classFilter: 'c1a1' }));
    assert.equal(state.studentFilters.classFilter, 'c1a1');

    state = accountReducer(state, setStudentFilters({ accountStatusFilter: 'no_account' }));
    assert.equal(state.studentFilters.accountStatusFilter, 'no_account');
  });

  await t.test('Redux: Modal lifecycle for user creation, editing, and deletion', () => {
    let state = accountReducer(undefined, { type: '@@INIT' });

    // Open create user modal
    state = accountReducer(state, openCreateUserModal());
    assert.equal(state.isUserFormOpen, true);
    assert.equal(state.userFormMode, 'create');
    assert.equal(state.selectedUser, null);

    // Close user form modal
    state = accountReducer(state, closeUserFormModal());
    assert.equal(state.isUserFormOpen, false);

    // Open edit user modal
    const testUser = state.users[1];
    state = accountReducer(state, openEditUserModal(testUser.id));
    assert.equal(state.isUserFormOpen, true);
    assert.equal(state.userFormMode, 'edit');
    assert.equal(state.selectedUser?.id, testUser.id);

    // Open delete user modal
    state = accountReducer(state, openDeleteUserModal(testUser.id));
    assert.equal(state.isDeleteUserOpen, true);
    assert.equal(state.targetDeleteUser?.id, testUser.id);

    state = accountReducer(state, closeDeleteUserModal());
    assert.equal(state.isDeleteUserOpen, false);
  });

  await t.test('Redux: createUserAccount appends new user with active status and toast', () => {
    let state = accountReducer(undefined, { type: '@@INIT' });
    const initialCount = state.users.length;

    state = accountReducer(
      state,
      createUserAccount({
        fullName: 'Đoàn Thị Bích',
        email: 'bich.doan@ecoschool.edu.vn',
        phone: '0988776655',
        roles: ['giao_vien'],
      })
    );

    assert.equal(state.users.length, initialCount + 1);
    const createdUser = state.users[0];
    assert.equal(createdUser.fullName, 'Đoàn Thị Bích');
    assert.equal(createdUser.status, 'active');
    assert.equal(state.isUserFormOpen, false);
    assert.ok(state.toast?.message?.includes('thành công'));
  });

  await t.test('Redux: confirmUserUpdate applies form changes upon TK-05 confirmation', () => {
    let state = accountReducer(undefined, { type: '@@INIT' });
    const targetUser = state.users.find((u) => !u.isSyncedCsdlSo && !u.roles.includes('admin'));

    // Open confirm update modal
    const updatePayload = {
      id: targetUser.id,
      fullName: 'Tên Đã Cập Nhật',
      phone: '0911223344',
      status: 'inactive',
      roles: targetUser.roles,
    };

    state = accountReducer(state, openConfirmUpdateModal(updatePayload));
    assert.equal(state.isConfirmUpdateOpen, true);
    assert.deepEqual(state.pendingUpdatePayload, updatePayload);

    // Confirm update
    state = accountReducer(state, confirmUserUpdate());
    assert.equal(state.isConfirmUpdateOpen, false);
    assert.equal(state.pendingUpdatePayload, null);

    const updatedUser = state.users.find((u) => u.id === targetUser.id);
    assert.equal(updatedUser.fullName, 'Tên Đã Cập Nhật');
    assert.equal(updatedUser.phone, '0911223344');
    assert.equal(updatedUser.status, 'inactive');
    assert.ok(state.toast?.message?.includes('thành công'));
  });

  await t.test('Redux: toggleUserStatus enforces asymmetric confirmation & CSDL rejection (TK-03 vs TK-06)', () => {
    let state = accountReducer(undefined, { type: '@@INIT' });
    const csdlUser = state.users.find((u) => u.isSyncedCsdlSo);
    const manualUser = state.users.find((u) => !u.isSyncedCsdlSo && !u.roles.includes('admin'));

    const initialCsdlStatus = csdlUser.status;
    const initialManualStatus = manualUser.status;

    // Toggle CSDL user -> Rejected with TK-03 banner
    state = accountReducer(state, toggleUserStatus(csdlUser.id));
    const postCsdlUser = state.users.find((u) => u.id === csdlUser.id);
    assert.equal(postCsdlUser.status, initialCsdlStatus, 'CSDL status must not change');
    assert.equal(state.errorBanner?.code, 'TK-03');
    assert.equal(state.toast, null);

    // Clear error banner
    state = accountReducer(state, clearErrorBanner());
    assert.equal(state.errorBanner, null);

    // Toggle Manual user -> Applied immediately with TK-06 toast
    state = accountReducer(state, toggleUserStatus(manualUser.id));
    const postManualUser = state.users.find((u) => u.id === manualUser.id);
    const expectedStatus = initialManualStatus === 'active' ? 'inactive' : 'active';
    assert.equal(postManualUser.status, expectedStatus, 'Manual user status must toggle');
    assert.ok(state.toast?.message?.includes('Đã'));
  });

  await t.test('Redux: confirmDeleteUser removes non-admin user with toast and blocks admin', () => {
    let state = accountReducer(undefined, { type: '@@INIT' });
    const adminUser = state.users.find((u) => u.roles.includes('admin'));
    const normalUser = state.users.find((u) => !u.roles.includes('admin'));

    const initialCount = state.users.length;

    // Attempt to open delete Admin modal -> Blocked, modal does not open
    state = accountReducer(state, openDeleteUserModal(adminUser.id));
    assert.equal(state.isDeleteUserOpen, false);
    assert.equal(state.targetDeleteUser, null);

    // Open and confirm delete normal user
    state = accountReducer(state, openDeleteUserModal(normalUser.id));
    assert.equal(state.isDeleteUserOpen, true);
    assert.equal(state.targetDeleteUser?.id, normalUser.id);

    state = accountReducer(state, confirmDeleteUser());
    assert.equal(state.users.length, initialCount - 1);
    assert.equal(state.users.some((u) => u.id === normalUser.id), false);
    assert.ok(state.toast?.message?.includes('Đã xoá tài khoản'));
  });

  await t.test('Redux: confirmChangeEmail and changeUserPassword handlers', () => {
    let state = accountReducer(undefined, { type: '@@INIT' });
    const targetUser = state.users[1];

    // Change email
    state = accountReducer(
      state,
      confirmChangeEmail({
        userId: targetUser.id,
        newEmail: 'new.email@ecoschool.edu.vn',
      })
    );
    const updatedUser = state.users.find((u) => u.id === targetUser.id);
    assert.equal(updatedUser.email, 'new.email@ecoschool.edu.vn');
    assert.ok(state.toast?.message?.includes('email'));

    // Change password
    state = accountReducer(
      state,
      changeUserPassword({
        userId: targetUser.id,
        newPassword: 'NewSecurePassword2026',
      })
    );
    assert.ok(state.toast?.message?.includes('mật khẩu'));
  });

  await t.test('Redux: Student account creation and update via saveStudentAccount', () => {
    let state = accountReducer(undefined, { type: '@@INIT' });
    const targetStudent = state.studentAccounts.find((s) => !s.hasAccount);

    // Open student account modal
    state = accountReducer(state, openCreateStudentModal(targetStudent.studentId));
    assert.equal(state.isStudentModalOpen, true);
    assert.equal(state.studentModalMode, 'create');
    assert.equal(state.selectedStudent?.studentId, targetStudent.studentId);

    // Create student account
    state = accountReducer(
      state,
      saveStudentAccount({
        studentId: targetStudent.studentId,
        username: 'student.new2026',
        active: true,
        password: 'password123',
      })
    );

    const updatedStudent = state.studentAccounts.find((s) => s.studentId === targetStudent.studentId);
    assert.equal(updatedStudent.hasAccount, true);
    assert.equal(updatedStudent.username, 'student.new2026');
    assert.equal(updatedStudent.status, 'active');
    assert.equal(state.isStudentModalOpen, false);
    assert.ok(state.toast?.message?.includes('tài khoản học sinh'));
  });
});
