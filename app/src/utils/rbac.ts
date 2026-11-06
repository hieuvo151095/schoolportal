/**
 * Mô hình phân quyền RBAC 3 cấp độ (DN-02):
 * 1. Cấp 1 (Module): Module hệ thống (finance, operations, academics, school, settings...)
 * 2. Cấp 2 (Resource:Action): Tài nguyên & Hành động (vd: finance:invoice:approve)
 * 3. Cấp 3 (Data Scope): Phạm vi dữ liệu (school: Toàn trường, grade: Khối, class: Lớp, self: Cá nhân)
 */

import type { UserRole } from '../types/auth.ts';

export type SystemModule =
  | 'overview'
  | 'operations'
  | 'academics'
  | 'finance'
  | 'school'
  | 'settings'
  | 'auth';

export type DataScope = 'school' | 'grade' | 'class' | 'self';

export interface ParsedPermission {
  module: SystemModule;
  resource: string;
  action: string;
}

/**
 * Danh mục quyền mặc định theo vai trò người dùng (RBAC Matrix)
 */
export const ROLE_PERMISSIONS: Record<UserRole, {
  wildcards?: string[];
  permissions: string[];
  defaultScope: Record<SystemModule, DataScope>;
}> = {
  admin: {
    wildcards: ['*'],
    permissions: [
      'finance:*',
      'operations:*',
      'academics:*',
      'school:*',
      'settings:*',
      'overview:*',
    ],
    defaultScope: {
      overview: 'school',
      operations: 'school',
      academics: 'school',
      finance: 'school',
      school: 'school',
      settings: 'school',
      auth: 'school',
    },
  },
  accountant: {
    permissions: [
      'overview:dashboard:view',
      'finance:invoice:view',
      'finance:invoice:create',
      'finance:invoice:approve',
      'finance:fee_catalog:view',
      'finance:fee_catalog:manage',
      'finance:expense:view',
      'finance:expense:create',
      'finance:expense:approve',
      'finance:reconciliation:execute',
      'finance:report:view',
      'school:student:view',
      'school:class:view',
      'school:academic_year:view',
    ],
    defaultScope: {
      overview: 'school',
      operations: 'school',
      academics: 'school',
      finance: 'school',
      school: 'school',
      settings: 'school',
      auth: 'self',
    },
  },
  teacher: {
    permissions: [
      'overview:dashboard:view',
      'operations:attendance:view',
      'operations:attendance:record',
      'operations:medication:view',
      'operations:medication:confirm',
      'operations:activity:post',
      'operations:conversation:message',
      'academics:timetable:view',
      'academics:homework:create',
      'academics:homework:grade',
      'academics:gradebook:view',
      'academics:gradebook:input',
      'school:student:view',
      'school:class:view',
    ],
    defaultScope: {
      overview: 'class',
      operations: 'class',
      academics: 'class',
      finance: 'self',
      school: 'class',
      settings: 'self',
      auth: 'self',
    },
  },
};

/**
 * Bóc tách chuỗi quyền 3 cấp độ: module:resource:action
 */
export function parsePermission(permissionStr: string): ParsedPermission | null {
  if (!permissionStr) return null;
  const parts = permissionStr.split(':');
  if (parts.length < 3) return null;
  return {
    module: parts[0] as SystemModule,
    resource: parts[1],
    action: parts[2],
  };
}

/**
 * Kiểm tra quyền cơ bản dựa trên vai trò (Role-to-Permission)
 */
export function hasPermission(role: UserRole, permissionStr: string): boolean {
  if (!role || !permissionStr) return false;
  const roleConfig = ROLE_PERMISSIONS[role];
  if (!roleConfig) return false;

  // Quyền wildcard toàn năng của Super-Admin
  if (roleConfig.wildcards?.includes('*')) return true;

  // Khớp chính xác hoặc wildcard theo module
  const parsed = parsePermission(permissionStr);
  if (!parsed) return false;

  const moduleWildcard = `${parsed.module}:*`;
  if (roleConfig.permissions.includes(moduleWildcard)) return true;

  return roleConfig.permissions.includes(permissionStr);
}

/**
 * Kiểm tra phân quyền 3 cấp độ kèm phạm vi dữ liệu (Data Scope Guard)
 */
export function checkAccessScope(
  role: UserRole,
  permissionStr: string,
  context?: {
    requiredScope?: DataScope;
    targetClassId?: string;
    userAssignedClassIds?: string[];
  }
): { allowed: boolean; reason?: string } {
  // 1. Kiểm tra Cấp 1 & 2: Module + Resource:Action
  if (!hasPermission(role, permissionStr)) {
    return {
      allowed: false,
      reason: `Vai trò [${role}] không có quyền thực hiện thao tác [${permissionStr}].`,
    };
  }

  // Admin có phạm vi toàn trường
  if (role === 'admin') return { allowed: true };

  const parsed = parsePermission(permissionStr);
  if (!parsed) return { allowed: true };

  const roleConfig = ROLE_PERMISSIONS[role];
  const userScope = roleConfig.defaultScope[parsed.module] || 'self';

  // 2. Kiểm tra Cấp 3: Data Scope
  if (context?.requiredScope) {
    const scopeRank: Record<DataScope, number> = {
      self: 1,
      class: 2,
      grade: 3,
      school: 4,
    };

    if (scopeRank[userScope] < scopeRank[context.requiredScope]) {
      return {
        allowed: false,
        reason: `Phạm vi dữ liệu yêu cầu [${context.requiredScope}], nhưng vai trò [${role}] chỉ có quyền cấp [${userScope}].`,
      };
    }
  }

  // 3. Nếu là giáo viên thao tác trên lớp cụ thể, kiểm tra lớp được phân công
  if (role === 'teacher' && context?.targetClassId && context.userAssignedClassIds) {
    if (!context.userAssignedClassIds.includes(context.targetClassId)) {
      return {
        allowed: false,
        reason: `Giáo viên không được phân công phụ trách lớp [${context.targetClassId}].`,
      };
    }
  }

  return { allowed: true };
}
