import test from 'node:test';
import assert from 'node:assert/strict';
import {
  removeVietnameseTones,
  filterStudentFaceRecords,
  canSubmitRegistration,
  canSubmitEdit,
  formatRegistrationDate,
  formatPhotoDisplay,
  getActionButtons,
  getDeleteConfirmPrompt,
  validateRegisterPayload,
  validateUpdatePayload,
  validateDeletePayload,
} from '../../src/utils/faceRecognitionValidation.ts';
import faceRecognitionReducer, {
  setFilterState,
  openRegisterModal,
  openEditModal,
  openDeleteModal,
  closeModal,
  registerFacePhoto,
  updateFacePhoto,
  deleteFacePhoto,
  clearToast,
} from '../../src/store/slices/faceRecognitionSlice.ts';
import {
  MOCK_STUDENT_FACE_RECORDS,
  MOCK_CLASSES,
} from '../../src/services/mockFaceRecognitionData.ts';

test('Face Recognition Management (Nhan dien) Test Suite - Feature 048 / Epic 33', async (t) => {
  // -------------------------------------------------------------
  // Suite 1: Helper Utilities & Formatting (BR01)
  // -------------------------------------------------------------
  await t.test('Helper: removeVietnameseTones correctly strips accents and lowercases', () => {
    assert.equal(removeVietnameseTones('Nguyễn Văn An'), 'nguyen van an');
    assert.equal(removeVietnameseTones('Trần Thị Thu Hương'), 'tran thi thu huong');
    assert.equal(removeVietnameseTones('Đỗ Đăng Khoa'), 'do dang khoa');
    assert.equal(removeVietnameseTones('Phạm Lê Bảo Châu'), 'pham le bao chau');
  });

  await t.test('BR01: formatRegistrationDate returns hyphen for unregistered and formatted date for registered', () => {
    assert.equal(formatRegistrationDate(undefined, false), '-');
    assert.equal(formatRegistrationDate('', false), '-');
    assert.equal(formatRegistrationDate(undefined, true), '-');
    assert.equal(formatRegistrationDate('10/09/2026', true), '10/09/2026');
    assert.equal(formatRegistrationDate('12/09/2026', true), '12/09/2026');
  });

  await t.test('BR01: formatPhotoDisplay returns correct representation for table column', () => {
    const unreg = formatPhotoDisplay({
      isRegistered: false,
      facePhotoUrl: undefined,
    });
    assert.equal(unreg.isRegistered, false);
    assert.equal(unreg.displayText, '-');

    const reg = formatPhotoDisplay({
      isRegistered: true,
      facePhotoUrl: 'https://images.unsplash.com/photo-1',
    });
    assert.equal(reg.isRegistered, true);
    assert.equal(reg.photoUrl, 'https://images.unsplash.com/photo-1');
  });

  // -------------------------------------------------------------
  // Suite 2: Action Column Affordance Duality (BR02, K087)
  // -------------------------------------------------------------
  await t.test('BR02 & K087: getActionButtons provides single register action for unregistered and edit + delete for registered', () => {
    const unregisteredButtons = getActionButtons(false);
    assert.deepEqual(unregisteredButtons, ['register']);

    const registeredButtons = getActionButtons(true);
    assert.deepEqual(registeredButtons, ['edit', 'delete']);
  });

  // -------------------------------------------------------------
  // Suite 3: Registration and Edit Invariant Logic (BR04, BR05, K086)
  // -------------------------------------------------------------
  await t.test('BR04 & K086: canSubmitRegistration disables submission without photo', () => {
    assert.equal(canSubmitRegistration(false), false);
    assert.equal(canSubmitRegistration(true), true);
  });

  await t.test('BR04, BR05 & K086: canSubmitEdit strictly requires new file upload', () => {
    // When editing, displaying existing photo is NOT enough.
    // hasNewUpload must be true.
    assert.equal(canSubmitEdit(false), false);
    assert.equal(canSubmitEdit(true), true);
  });

  // -------------------------------------------------------------
  // Suite 4: Deletion Confirmation Prompt (BR06, K088, NFR01)
  // -------------------------------------------------------------
  await t.test('BR06 & K088: getDeleteConfirmPrompt articulates student full name', () => {
    const prompt1 = getDeleteConfirmPrompt('Nguyễn Minh Anh');
    assert.equal(
      prompt1,
      'Vui lòng xác nhận xóa thông tin nhận diện của học sinh Nguyễn Minh Anh'
    );

    const prompt2 = getDeleteConfirmPrompt('Trần Đức Bo');
    assert.equal(
      prompt2,
      'Vui lòng xác nhận xóa thông tin nhận diện của học sinh Trần Đức Bo'
    );
  });

  // -------------------------------------------------------------
  // Suite 5: Payload Validation Engine
  // -------------------------------------------------------------
  await t.test('Validation: validateRegisterPayload verifies required parameters', () => {
    const valid = validateRegisterPayload({
      studentId: 'hs-001',
      facePhotoUrl: 'data:image/jpeg;base64,abc',
    });
    assert.equal(valid.isValid, true);
    assert.equal(valid.error, undefined);

    const missingId = validateRegisterPayload({
      studentId: '',
      facePhotoUrl: 'data:image/jpeg;base64,abc',
    });
    assert.equal(missingId.isValid, false);
    assert.equal(missingId.error, 'Thiếu định danh học sinh');

    const missingPhoto = validateRegisterPayload({
      studentId: 'hs-001',
      facePhotoUrl: '',
    });
    assert.equal(missingPhoto.isValid, false);
    assert.equal(missingPhoto.error, 'Vui lòng chọn ảnh nhận diện');
  });

  await t.test('Validation: validateUpdatePayload verifies required parameters', () => {
    const valid = validateUpdatePayload({
      studentId: 'hs-001',
      facePhotoUrl: 'data:image/jpeg;base64,def',
    });
    assert.equal(valid.isValid, true);

    const missingPhoto = validateUpdatePayload({
      studentId: 'hs-001',
      facePhotoUrl: '   ',
    });
    assert.equal(missingPhoto.isValid, false);
    assert.equal(missingPhoto.error, 'Vui lòng chọn ảnh nhận diện mới');
  });

  await t.test('Validation: validateDeletePayload verifies required studentId', () => {
    const valid = validateDeletePayload({ studentId: 'hs-001' });
    assert.equal(valid.isValid, true);

    const invalid = validateDeletePayload({ studentId: '' });
    assert.equal(invalid.isValid, false);
    assert.equal(invalid.error, 'Thiếu định danh học sinh');
  });

  // -------------------------------------------------------------
  // Suite 6: Filtering & Conjunction Logic (BR07, BR08)
  // -------------------------------------------------------------
  await t.test('BR07 & BR08: filterStudentFaceRecords searches by name (accent-sensitive & insensitive) and code', () => {
    // Search with exact diacritics
    const resDiacritic = filterStudentFaceRecords(MOCK_STUDENT_FACE_RECORDS, {
      searchQuery: 'Nguyễn Minh Anh',
      classId: 'all',
      registrationStatus: 'all',
      page: 1,
      pageSize: 10,
    });
    assert.ok(resDiacritic.length >= 1);
    assert.equal(resDiacritic[0].studentCode, 'HS-2026-001');

    // Search without diacritics
    const resNoDiacritic = filterStudentFaceRecords(MOCK_STUDENT_FACE_RECORDS, {
      searchQuery: 'nguyen minh anh',
      classId: 'all',
      registrationStatus: 'all',
      page: 1,
      pageSize: 10,
    });
    assert.ok(resNoDiacritic.length >= 1);
    assert.equal(resNoDiacritic[0].studentCode, 'HS-2026-001');

    // Search by student code
    const resCode = filterStudentFaceRecords(MOCK_STUDENT_FACE_RECORDS, {
      searchQuery: 'HS-2026-002',
      classId: 'all',
      registrationStatus: 'all',
      page: 1,
      pageSize: 10,
    });
    assert.equal(resCode.length, 1);
    assert.equal(resCode[0].fullName, 'Trần Gia Bảo');
  });

  await t.test('BR07 & BR08: filterStudentFaceRecords filters by class and registration status', () => {
    // Filter class 1A1
    const resClass = filterStudentFaceRecords(MOCK_STUDENT_FACE_RECORDS, {
      searchQuery: '',
      classId: 'class-1a1',
      registrationStatus: 'all',
      page: 1,
      pageSize: 10,
    });
    assert.ok(resClass.every((r) => r.classId === 'class-1a1'));

    // Filter registered only
    const resRegistered = filterStudentFaceRecords(MOCK_STUDENT_FACE_RECORDS, {
      searchQuery: '',
      classId: 'all',
      registrationStatus: 'registered',
      page: 1,
      pageSize: 10,
    });
    assert.ok(resRegistered.every((r) => r.isRegistered === true));

    // Filter unregistered only
    const resUnregistered = filterStudentFaceRecords(MOCK_STUDENT_FACE_RECORDS, {
      searchQuery: '',
      classId: 'all',
      registrationStatus: 'unregistered',
      page: 1,
      pageSize: 10,
    });
    assert.ok(resUnregistered.every((r) => r.isRegistered === false));
  });

  await t.test('BR07 & BR08: filterStudentFaceRecords applies conjunction (AND) across criteria', () => {
    const resAnd = filterStudentFaceRecords(MOCK_STUDENT_FACE_RECORDS, {
      searchQuery: 'Trần',
      classId: 'class-1a1',
      registrationStatus: 'unregistered',
      page: 1,
      pageSize: 10,
    });
    assert.ok(resAnd.length >= 1);
    for (const r of resAnd) {
      assert.ok(removeVietnameseTones(r.fullName).includes('tran'));
      assert.equal(r.classId, 'class-1a1');
      assert.equal(r.isRegistered, false);
    }
  });

  // -------------------------------------------------------------
  // Suite 7: Redux State Machine Transitions
  // -------------------------------------------------------------
  await t.test('Redux: Modal lifecycle transitions (openRegisterModal, openEditModal, openDeleteModal, closeModal)', () => {
    const targetStudent = MOCK_STUDENT_FACE_RECORDS[0];
    let state = faceRecognitionReducer(undefined, { type: '@@INIT' });

    // Open Register modal
    state = faceRecognitionReducer(state, openRegisterModal(targetStudent));
    assert.equal(state.activeModal, 'register');
    assert.equal(state.selectedStudent?.studentId, targetStudent.studentId);

    // Close modal
    state = faceRecognitionReducer(state, closeModal());
    assert.equal(state.activeModal, null);
    assert.equal(state.selectedStudent, null);

    // Open Edit modal
    state = faceRecognitionReducer(state, openEditModal(targetStudent));
    assert.equal(state.activeModal, 'edit');
    assert.equal(state.selectedStudent?.studentId, targetStudent.studentId);

    // Open Delete modal
    state = faceRecognitionReducer(state, openDeleteModal(targetStudent));
    assert.equal(state.activeModal, 'delete');
    assert.equal(state.selectedStudent?.studentId, targetStudent.studentId);
  });

  await t.test('Redux: registerFacePhoto successfully registers biometric profile', () => {
    let state = faceRecognitionReducer(undefined, { type: '@@INIT' });
    const unregisteredStudent = state.records.find((r) => !r.isRegistered);
    assert.ok(unregisteredStudent);

    state = faceRecognitionReducer(
      state,
      registerFacePhoto({
        studentId: unregisteredStudent.studentId,
        facePhotoUrl: 'data:image/jpeg;base64,newRegisteredImage',
      })
    );

    const updated = state.records.find((r) => r.studentId === unregisteredStudent.studentId);
    assert.equal(updated.isRegistered, true);
    assert.equal(updated.facePhotoUrl, 'data:image/jpeg;base64,newRegisteredImage');
    assert.ok(updated.registeredDate !== undefined);
    assert.equal(state.activeModal, null);
    assert.ok(state.toastMessage?.includes('thành công'));
  });

  await t.test('Redux: updateFacePhoto successfully replaces biometric image', () => {
    let state = faceRecognitionReducer(undefined, { type: '@@INIT' });
    const registeredStudent = state.records.find((r) => r.isRegistered);
    assert.ok(registeredStudent);

    state = faceRecognitionReducer(
      state,
      updateFacePhoto({
        studentId: registeredStudent.studentId,
        facePhotoUrl: 'data:image/jpeg;base64,replacedImage',
      })
    );

    const updated = state.records.find((r) => r.studentId === registeredStudent.studentId);
    assert.equal(updated.isRegistered, true);
    assert.equal(updated.facePhotoUrl, 'data:image/jpeg;base64,replacedImage');
    assert.equal(state.activeModal, null);
    assert.ok(state.toastMessage?.includes('thành công'));
  });

  await t.test('Redux: deleteFacePhoto clears photo and resets status to unregistered (BR06)', () => {
    let state = faceRecognitionReducer(undefined, { type: '@@INIT' });
    const registeredStudent = state.records.find((r) => r.isRegistered);
    assert.ok(registeredStudent);

    state = faceRecognitionReducer(
      state,
      deleteFacePhoto({
        studentId: registeredStudent.studentId,
      })
    );

    const updated = state.records.find((r) => r.studentId === registeredStudent.studentId);
    assert.equal(updated.isRegistered, false);
    assert.equal(updated.facePhotoUrl, undefined);
    assert.equal(updated.registeredDate, undefined);
    assert.equal(state.activeModal, null);
    assert.ok(state.toastMessage?.includes('Đã xóa thông tin'));
  });

  await t.test('Redux: setFilterState and clearToast', () => {
    let state = faceRecognitionReducer(undefined, { type: '@@INIT' });
    state = faceRecognitionReducer(
      state,
      setFilterState({ searchQuery: 'Bảo Nam', page: 2 })
    );
    assert.equal(state.filterState.searchQuery, 'Bảo Nam');
    assert.equal(state.filterState.page, 2);

    state = faceRecognitionReducer(state, clearToast());
    assert.equal(state.toastMessage, null);
  });
});
