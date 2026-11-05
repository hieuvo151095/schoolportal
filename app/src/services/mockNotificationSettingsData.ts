/**
 * Mock Seed Data for Notification Settings (Cấu Hình - Thông Báo)
 * Feature: 050-settings-notifications-thong-bao
 * Epic: E-035-settings-notifications
 * Target Tenant: Eco School Tân Bình (Demo)
 */

import type {
  ExtracurricularClassOption,
  SchoolNotificationSettings,
} from '../types/notificationSettings.ts';
import { DEFAULT_NOTIFICATION_SETTINGS } from '../utils/notificationSettingsValidation.ts';

/**
 * Enrolled Extracurricular Classes for Eco School Tân Bình
 */
export const MOCK_EXTRACURRICULAR_CLASSES: ExtracurricularClassOption[] = [
  { id: 'ext-01', name: 'Lớp Bóng rổ Ngoại khóa (Thứ 3 & 5)' },
  { id: 'ext-02', name: 'Lớp Bơi lội Dolphin (Thứ 7)' },
  { id: 'ext-03', name: 'Lớp Mỹ thuật Sáng tạo (Thứ 4)' },
  { id: 'ext-04', name: 'Lớp Tiếng Anh Cambridge (Thứ 2 & 6)' },
  { id: 'ext-05', name: 'Lớp Cờ vua Trí tuệ (Chủ nhật)' },
];

/**
 * Initial Mock School Notification Settings
 */
export const MOCK_INITIAL_NOTIFICATION_SETTINGS: SchoolNotificationSettings = {
  ...DEFAULT_NOTIFICATION_SETTINGS,
  attendance: {
    ...DEFAULT_NOTIFICATION_SETTINGS.attendance,
  },
  birthday: {
    ...DEFAULT_NOTIFICATION_SETTINGS.birthday,
  },
  tuition: {
    ...DEFAULT_NOTIFICATION_SETTINGS.tuition,
  },
  other: {
    ...DEFAULT_NOTIFICATION_SETTINGS.other,
  },
  parent: {
    ...DEFAULT_NOTIFICATION_SETTINGS.parent,
  },
};
