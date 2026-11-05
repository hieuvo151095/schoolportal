// Types for Module 1: Vận Hành - Báo Cáo (Attendance & Extended Reports)

export type ReportLifecycleStatus = 'draft' | 'sent' | 'completed';

export type ReportTemplateId = 'tieng_viet' | 'toan' | 'english' | 'thu_tuan';

export type AttendanceDayStatus = 'present' | 'absent_excused' | 'absent_unexcused' | 'unmarked';

export interface DailyAttendanceRecord {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  weekday: string; // T2, T3, T4, T5, T6, T7, CN
  status: AttendanceDayStatus;
  checkInTime: string | null;
  checkInStaff: string | null;
  checkOutTime: string | null;
  checkOutStaff: string | null;
  temperature: number | null;
  healthStatus: string | null;
  isLateArrival: boolean;
  isLateDeparture: boolean;
  lateArrivalMinutes: number;
  lateDepartureMinutes: number;
  notes?: string;
}

export interface StudentMonthlyAttendance {
  studentId: string;
  studentName: string;
  studentCode: string;
  avatarUrl: string;
  parentName?: string;
  phone?: string;
  records: { [date: string]: DailyAttendanceRecord };
  totalPresent: number;
  totalAbsentExcused: number;
  totalAbsentUnexcused: number;
  totalLateArrivals: number;
  totalLateArrivalMinutes: number;
  totalLateDepartures: number;
  totalLateDepartureMinutes: number;
  estimatedLateFee: number;
}

export interface StaffDailyRecord {
  date: string;
  dayNumber: number;
  weekday: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  isPresent: boolean;
}

export interface StaffMonthlyAttendance {
  staffId: string;
  staffName: string;
  staffCode: string;
  role: 'admin' | 'giao_vien' | 'quan_ly' | 'nhan_vien';
  roleName: string;
  department: string;
  avatarUrl: string;
  phone?: string;
  records: { [date: string]: StaffDailyRecord };
  totalPresent: number;
  totalAbsentExcused: number;
  totalAbsentUnexcused: number;
  totalLate?: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
  levels?: string[]; // e.g. ["Nghe Được Âm", "Gọi Tên Chữ Cái", "Viết Chữ Cái"]
}

export interface DevelopmentalTemplate {
  id: ReportTemplateId;
  name: string;
  category: string;
  description: string;
  sections: ChecklistSection[];
}

export interface ExtendedReport {
  id: string;
  title: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  studentAge: string;
  studentAvatar: string;
  parentName: string;
  classId: string;
  className: string;
  templateId: ReportTemplateId;
  templateName: string;
  dateType: 'date_range' | 'stage';
  startDate: string;
  endDate: string;
  stageName?: string;
  status: ReportLifecycleStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  checklistData: { [sectionId: string]: { [itemId: string]: boolean } };
  generalNotes?: string;
}

export interface ReportFilterCriteria {
  searchQuery: string;
  classId: string;
  templateId: 'all' | ReportTemplateId;
  status: 'all' | ReportLifecycleStatus;
  startDate?: string;
  endDate?: string;
}
