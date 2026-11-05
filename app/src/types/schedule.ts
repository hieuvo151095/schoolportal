export type ScheduleType = 'grid' | 'file';
export type ScheduleStatus = 'draft' | 'published' | 'updated';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface TimetableCell {
  subjectId: string;
  subjectName: string;
  teacherId?: string;
  teacherName?: string;
  room?: string;
  note?: string;
}

export interface TimeSlotRow {
  slotId: string;
  slotName: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  days: {
    monday?: TimetableCell;
    tuesday?: TimetableCell;
    wednesday?: TimetableCell;
    thursday?: TimetableCell;
    friday?: TimetableCell;
    saturday?: TimetableCell;
  };
}

export interface SendHistoryEntry {
  id: string;
  sentAt: string;
  senderName: string;
  senderRole: string;
  recipientsCount: number;
  channel: 'all' | 'app_notification' | 'zalo' | 'sms';
  note?: string;
}

export interface AcademicSemester {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface Timetable {
  id: string;
  title: string;
  schoolCode: string;
  classId: string;
  className: string;
  gradeLevel: number;
  semesterId: string;
  semesterName: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  type: ScheduleType;
  status: ScheduleStatus;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  slots: TimeSlotRow[];
  sendHistory: SendHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ScheduleActions {
  canSend: boolean;
  canEdit: boolean;
  canClone: boolean;
  canDownload: boolean;
  canDelete: boolean;
}

export interface ScheduleFilterCriteria {
  searchQuery: string;
  classId: string;
  semesterId: string;
  academicYear: string;
  type: 'all' | 'grid' | 'file';
  status: 'all' | 'draft' | 'published' | 'updated';
}

export interface SubjectOption {
  id: string;
  name: string;
  code: string;
  color: string;
}
