/**
 * Mock Data Fixtures for School Profile & Operational Configuration
 * Feature: 046-settings-school-profile-truong
 */

import type { SchoolProfile, DayOperatingHour, AttendanceRules } from '../types/schoolProfile.ts';
import { getDefaultOperatingHours, getDefaultAttendanceRules } from '../utils/schoolProfileValidation.ts';

export const mockSchoolProfile: SchoolProfile = {
  schoolCode: 'BANMAI-01',
  name: 'Trường Mầm Non Ban Mai',
  shortName: 'Ban Mai Kindergarten',
  address: 'Số 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  website: 'https://banmai.edu.vn',
  phone: '028 3822 9999',
  email: 'info@banmai.edu.vn',
  slogan: 'Nơi ươm mầm tương lai tươi sáng và hạnh phúc cho trẻ thơ',
  contactInfo: 'Phòng Tuyển sinh & Chăm sóc khách hàng - Hotline: 0909 123 456',
  defaultLanguage: 'vi',
  logoUrl: '',
  educationStages: ['01-MN', '02-TH'],
};

export const mockDayOperatingHours: DayOperatingHour[] = getDefaultOperatingHours();

export const mockAttendanceRules: AttendanceRules = getDefaultAttendanceRules();
