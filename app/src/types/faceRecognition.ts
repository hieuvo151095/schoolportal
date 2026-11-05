/**
 * Domain contracts and data types for Settings Face Recognition (Cấu Hình - Nhận Diện)
 * Feature: 048-settings-face-recognition-nhan-dien
 * Specification: docs_legacy/operating-portal/M6-cau-hinh/SM4-nhan-dien.md
 */

export type Gender = 'nam' | 'nu';

export type FaceRegistrationStatus = 'all' | 'registered' | 'unregistered';

export interface StudentFaceRecord {
  id: string;
  studentId: string;
  studentCode: string;
  fullName: string;
  nickname?: string;
  gender: Gender;
  dateOfBirth: string; // DD/MM/YYYY
  classId: string;
  className: string;
  avatarUrl?: string;
  isRegistered: boolean;
  facePhotoUrl?: string;
  registeredDate?: string; // DD/MM/YYYY
}

export interface FaceRecognitionFilterState {
  searchQuery: string;
  classId: string; // 'all' or specific classId
  registrationStatus: FaceRegistrationStatus;
  page: number;
  pageSize: number;
}

export interface RegisterFacePayload {
  studentId: string;
  facePhotoUrl: string;
  registeredDate?: string;
}

export interface UpdateFacePayload {
  studentId: string;
  facePhotoUrl: string;
  registeredDate?: string;
}

export interface DeleteFacePayload {
  studentId: string;
}

export type FaceRecognitionModalType = 'register' | 'edit' | 'delete' | null;

export interface FaceRecognitionUIState {
  activeModal: FaceRecognitionModalType;
  selectedStudent: StudentFaceRecord | null;
  toastMessage: string | null;
}
