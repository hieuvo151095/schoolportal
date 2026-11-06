import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parsePermission,
  hasPermission,
  checkAccessScope,
  ROLE_PERMISSIONS,
} from '../../src/utils/rbac.ts';

describe('RBAC 3 Cấp Độ (DN-02) — Bóc tách cú pháp Module -> Resource:Action', () => {
  it('bóc tách đúng định dạng 3 cấp độ module:resource:action', () => {
    const p1 = parsePermission('finance:invoice:approve');
    assert.deepEqual(p1, {
      module: 'finance',
      resource: 'invoice',
      action: 'approve',
    });

    const p2 = parsePermission('operations:attendance:record');
    assert.deepEqual(p2, {
      module: 'operations',
      resource: 'attendance',
      action: 'record',
    });

    assert.equal(parsePermission(''), null);
    assert.equal(parsePermission('invalid-format'), null);
  });
});

describe('RBAC 3 Cấp Độ (DN-02) — Phân quyền theo vai trò (Role Permissions)', () => {
  it('Admin có toàn quyền truy cập (wildcard *) trên mọi module', () => {
    assert.equal(hasPermission('admin', 'finance:invoice:approve'), true);
    assert.equal(hasPermission('admin', 'operations:medication:confirm'), true);
    assert.equal(hasPermission('admin', 'settings:account:manage'), true);
    assert.equal(hasPermission('admin', 'any:custom:action'), true);
  });

  it('Kế toán (accountant) có quyền trên phân hệ Tài chính, không được duyệt sổ điểm', () => {
    assert.equal(hasPermission('accountant', 'finance:invoice:approve'), true);
    assert.equal(hasPermission('accountant', 'finance:fee_catalog:manage'), true);
    assert.equal(hasPermission('accountant', 'finance:reconciliation:execute'), true);
    assert.equal(hasPermission('accountant', 'school:student:view'), true);

    // Kế toán không thể can thiệp sổ điểm hoặc điểm danh của giáo viên
    assert.equal(hasPermission('accountant', 'academics:gradebook:input'), false);
    assert.equal(hasPermission('accountant', 'operations:attendance:record'), false);
  });

  it('Giáo viên (teacher) có quyền điểm danh, giao bài tập, nhưng bị chặn phê duyệt tài chính', () => {
    assert.equal(hasPermission('teacher', 'operations:attendance:record'), true);
    assert.equal(hasPermission('teacher', 'operations:medication:confirm'), true);
    assert.equal(hasPermission('teacher', 'academics:homework:create'), true);
    assert.equal(hasPermission('teacher', 'academics:gradebook:input'), true);

    // Giáo viên bị cấm tuyệt đối các thao tác kế toán
    assert.equal(hasPermission('teacher', 'finance:invoice:approve'), false);
    assert.equal(hasPermission('teacher', 'finance:expense:approve'), false);
    assert.equal(hasPermission('teacher', 'settings:account:manage'), false);
  });
});

describe('RBAC 3 Cấp Độ (DN-02) — Kiểm soát phạm vi dữ liệu (Data Scope Guard)', () => {
  it('chặn truy cập nếu vượt quá cấp độ dữ liệu (school vs class vs self)', () => {
    // Giáo viên yêu cầu quyền phạm vi toàn trường (school) trên màn hình học tập -> BỊ TỪ CHỐI
    const r1 = checkAccessScope('teacher', 'academics:gradebook:view', {
      requiredScope: 'school',
    });
    assert.equal(r1.allowed, false);
    assert.ok(r1.reason && r1.reason.toLowerCase().includes('phạm vi'));

    // Admin yêu cầu phạm vi toàn trường -> ĐƯỢC CHẤP NHẬN
    const r2 = checkAccessScope('admin', 'academics:gradebook:view', {
      requiredScope: 'school',
    });
    assert.equal(r2.allowed, true);
  });

  it('cô lập lớp học: giáo viên chỉ được thao tác trên lớp được phân công phụ trách', () => {
    const userClasses = ['lop-1a1', 'lop-1a2'];

    // Điểm danh cho lớp mình phụ trách -> Cho phép
    const okCheckin = checkAccessScope('teacher', 'operations:attendance:record', {
      targetClassId: 'lop-1a1',
      userAssignedClassIds: userClasses,
    });
    assert.equal(okCheckin.allowed, true);

    // Điểm danh cho lớp khác -> Bị từ chối
    const blockedCheckin = checkAccessScope('teacher', 'operations:attendance:record', {
      targetClassId: 'lop-2a1',
      userAssignedClassIds: userClasses,
    });
    assert.equal(blockedCheckin.allowed, false);
    assert.ok(blockedCheckin.reason && blockedCheckin.reason.includes('không được phân công'));
  });
});
