/**
 * Mock Data Fixtures for School Profile & Operational Configuration
 * Feature: 046-settings-school-profile-truong
 */

/**
 * Mock Data Fixtures for School Profile & Operational Configuration
 * Feature: 046-settings-school-profile-truong
 */

import type {
  SchoolProfile,
  DayOperatingHour,
  AttendanceRules,
  CameraAttendanceRules,
} from '../types/schoolProfile.ts';
import {
  getDefaultOperatingHours,
  getDefaultAttendanceRules,
  getDefaultCameraAttendanceRules,
} from '../utils/schoolProfileValidation.ts';

/** Cấu hình Trường K12 mặc định (code: 'demo') - 2 buổi */
export const mockK12SchoolProfile: SchoolProfile = {
  schoolCode: 'demo',
  name: 'Trường Phổ Thông Liên Cấp ECO',
  shortName: 'ECO K12 School',
  address: 'Khu Đô Thị Ecopark, Văn Giang, Hưng Yên',
  website: 'https://ecoschool.edu.vn',
  phone: '024 7300 8888',
  email: 'admin@demo.edu.vn',
  slogan: 'Kiến tạo thế hệ công dân toàn cầu ưu tú và nhân văn',
  contactInfo: 'Văn phòng Quản trị Vận hành K12 - Hotline: 1900 9005',
  defaultLanguage: 'vi',
  logoUrl: '',
  educationStages: ['02-TH', '03-THCS', '04-THPT'],
  educationalType: 'k12',
};

/** Cấu hình Trường Mầm Non (code: 'mamnon') - 1 buổi */
export const mockPreschoolProfile: SchoolProfile = {
  schoolCode: 'mamnon',
  name: 'Trường Mầm Non Ban Mai',
  shortName: 'Ban Mai Kindergarten',
  address: 'Số 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  website: 'https://banmai.edu.vn',
  phone: '028 3822 9999',
  email: 'admin@mamnon.edu.vn',
  slogan: 'Nơi ươm mầm tương lai tươi sáng và hạnh phúc cho trẻ thơ',
  contactInfo: 'Phòng Tuyển sinh & Chăm sóc khách hàng - Hotline: 0909 123 456',
  defaultLanguage: 'vi',
  logoUrl: '',
  educationStages: ['01-MN'],
  educationalType: 'mam_non',
};

export const mockDayOperatingHours: DayOperatingHour[] = getDefaultOperatingHours();

export const mockK12AttendanceRules: AttendanceRules = {
  ...getDefaultAttendanceRules(),
  attendanceMode: 'Điểm danh 2 buổi',
};

export const mockPreschoolAttendanceRules: AttendanceRules = {
  ...getDefaultAttendanceRules(),
  attendanceMode: 'Điểm danh 1 buổi',
  morningSessionTime: '06:30 - 11:45',
  afternoonSessionTime: '14:15 - 17:30',
};

export const mockK12CameraRules: CameraAttendanceRules = getDefaultCameraAttendanceRules('k12');
export const mockPreschoolCameraRules: CameraAttendanceRules = getDefaultCameraAttendanceRules('mam_non');

// Default exports pointing to K12 (Trường K12 demo)
export const mockSchoolProfile: SchoolProfile = mockK12SchoolProfile;
export const mockAttendanceRules: AttendanceRules = mockK12AttendanceRules;
export const mockCameraAttendanceRules: CameraAttendanceRules = mockK12CameraRules;

export function getSchoolProfileByCode(schoolCode: string): SchoolProfile {
  const code = (schoolCode || '').toLowerCase();
  if (code === 'mamnon' || code === 'banmai' || code === '74718333') {
    return mockPreschoolProfile;
  }
  return mockK12SchoolProfile;
}

export function getAttendanceRulesByCode(schoolCode: string): AttendanceRules {
  const code = (schoolCode || '').toLowerCase();
  if (code === 'mamnon' || code === 'banmai' || code === '74718333') {
    return mockPreschoolAttendanceRules;
  }
  return mockK12AttendanceRules;
}

export function getCameraAttendanceRulesByCode(schoolCode: string): CameraAttendanceRules {
  const code = (schoolCode || '').toLowerCase();
  if (code === 'mamnon' || code === 'banmai' || code === '74718333') {
    return mockPreschoolCameraRules;
  }
  return mockK12CameraRules;
}
