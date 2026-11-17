export type RewardStatusFilter = 'all' | 'awarded' | 'unawarded';

export interface WeekHistoryItem {
  week: number; // 1, 2, 3, 4 (week of the month)
  weekLabel: string; // e.g. "Tuần 1 • 05/10 - 11/10"
  weekRange: string;
  isAwarded: boolean;
  publishedAt?: string;
  teacherComment?: string;
}

export interface StudentRewardRecord {
  studentId: string;
  studentCode: string;
  fullName: string;
  nickname?: string;
  avatarUrl: string;
  gender: 'male' | 'female';
  parentName: string;
  parentPhone: string;
  classId: string;
  weekNumber: number; // e.g. 29
  weekRange: string; // e.g. "16/11 - 20/11/2026"
  monthWeek: number; // 1, 2, 3, 4
  isAwarded: boolean;
  isPublished: boolean;
  publishedAt?: string;
  excusedAbsenceCount: number;
  unexcusedAbsenceCount: number;
  teacherComment: string;
  updatedAt?: string;
  updatedBy?: string;
  monthHistory: WeekHistoryItem[];
}

export interface RewardWeekOption {
  weekNumber: number;
  label: string; // e.g. "Tuần 29 (16/11 - 20/11/2026) - Hiện tại"
  weekRange: string;
  monthWeek: number;
  isCurrent: boolean;
  isPublished: boolean;
}

export interface RewardSummary {
  totalStudents: number;
  awardedCount: number;
  unawardedCount: number;
  publishedCount: number;
  fullAttendanceCount: number;
}
