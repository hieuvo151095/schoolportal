export type AudienceScope = 'current_class' | 'whole_school' | 'custom_classes';

export interface PhotoAsset {
  id: string;
  albumId: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  uploadedBy: string;
  uploadedAt: string;
  taggedStudentIds: string[];
  recognizedFaceCount: number;
}

export interface PhotoAlbum {
  id: string;
  classId: string;
  title: string;
  description?: string;
  coverPhotoUrl: string;
  audienceScope: AudienceScope;
  isSystem: boolean; // BR01: true for Hoạt động & Điểm danh
  systemType?: 'activity' | 'attendance';
  photoCount: number;
  taggedStudentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentRecognitionStat {
  studentId: string;
  studentName: string;
  avatarUrl: string;
  recognizedPhotosCount: number;
  confidenceRate: number;
}

export type MediaFilterType = 'all' | 'unassigned' | 'students';

export interface MediaFilterState {
  filterType: MediaFilterType;
  selectedStudentIds: string[]; // BR06: max 5 students if filterType === 'students'
  sortBy: 'newest' | 'oldest';
}

export type MediaGalleryViewMode = 'grid' | 'list';
export type InsideAlbumViewMode = 'by_date' | 'flat';
