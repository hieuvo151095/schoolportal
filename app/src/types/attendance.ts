export type HealthCondition =
  | 'Bình thường'
  | 'Cảm sốt'
  | 'Sốt cao'
  | 'Đỏ mắt'
  | 'Mụn rộp'
  | 'Đau bụng'
  | 'Thủy đậu'
  | 'Sốt xuất huyết'
  | 'Tay chân miệng';

export const HEALTH_CONDITIONS: HealthCondition[] = [
  'Bình thường',
  'Cảm sốt',
  'Sốt cao',
  'Đỏ mắt',
  'Mụn rộp',
  'Đau bụng',
  'Thủy đậu',
  'Sốt xuất huyết',
  'Tay chân miệng',
];

export type AttendanceStatus = 'present' | 'excused_absent' | 'unexcused_absent' | 'unmarked';

export interface Guardian {
  id: string;
  fullName: string;
  relationship: string;
  phoneNumber: string;
  isAuthorizedPickup: boolean;
}

export interface StudentAttendance {
  studentId: string;
  studentCode: string;
  fullName: string;
  avatarUrl: string;
  gender: 'male' | 'female';
  arrivalTime: string | null;
  departureTime: string | null;
  status: AttendanceStatus;
  isLate: boolean;
  temperature: number;
  healthCondition: HealthCondition;
  notes: string;
  pickupGuardianId: string | null;
  pickupGuardianName: string | null;
  refundEligible: boolean;
  guardians: Guardian[];
}

export interface AttendanceSummary {
  totalStudents: number;
  presentCount: number;
  absentExcusedCount: number;
  absentUnexcusedCount: number;
  unmarkedCount: number;
}
