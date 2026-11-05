import type { PhotoAsset, PhotoAlbum, MediaFilterState } from '../types/media.ts';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface ProtectionResult {
  canDelete: boolean;
  canRename: boolean;
  error?: string;
}

/**
 * BR01: System Album Protection Rule
 * Protects system albums ("Hoạt động" & "Điểm danh") from deletion or rename.
 */
export function validateSystemAlbumProtection(album: Partial<PhotoAlbum>): ProtectionResult {
  if (album.isSystem) {
    return {
      canDelete: false,
      canRename: false,
      error: 'Không thể đổi tên hoặc xóa album hệ thống',
    };
  }
  return {
    canDelete: true,
    canRename: true,
  };
}

/**
 * BR02: Album Creation Title Validation
 * Requires non-empty album title.
 */
export function validateAlbumCreation(title: string): ValidationResult {
  const trimmed = (title || '').trim();
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Tên album không được để trống',
    };
  }
  return { valid: true };
}

/**
 * BR06: Advanced Filter Selection Constraint
 * Limits specific student filter to maximum 5 students or special options "Cả lớp" / "Không gắn thẻ".
 */
export function validateStudentFilterSelection(
  selectedIds: string[],
  filterType: 'students' | 'all' | 'unassigned' = 'all'
): ValidationResult {
  if (filterType === 'students' && (selectedIds || []).length > 5) {
    return {
      valid: false,
      error: 'Vui lòng chọn tối đa 5 học sinh',
    };
  }
  return { valid: true };
}

/**
 * BR04: Group Photos by Upload Date
 * Organizes photos chronologically into date buckets (YYYY-MM-DD).
 */
export function groupPhotosByUploadDate(photos: PhotoAsset[]): Record<string, PhotoAsset[]> {
  const groups: Record<string, PhotoAsset[]> = {};

  for (const photo of photos) {
    const dateKey = (photo.uploadedAt || '').slice(0, 10) || 'Chưa rõ ngày';
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(photo);
  }

  return groups;
}

/**
 * Filter & Sort Photos
 * Applies filterType and sortBy order.
 */
export function filterPhotos(photos: PhotoAsset[], filter: MediaFilterState): PhotoAsset[] {
  const filtered = photos.filter((photo) => {
    if (filter.filterType === 'students') {
      if (!filter.selectedStudentIds || filter.selectedStudentIds.length === 0) {
        return true;
      }
      return (photo.taggedStudentIds || []).some((id) =>
        filter.selectedStudentIds.includes(id)
      );
    }

    if (filter.filterType === 'unassigned') {
      return !photo.taggedStudentIds || photo.taggedStudentIds.length === 0;
    }

    // filterType === 'all'
    return true;
  });

  return [...filtered].sort((a, b) => {
    const timeA = new Date(a.uploadedAt || 0).getTime();
    const timeB = new Date(b.uploadedAt || 0).getTime();
    if (filter.sortBy === 'oldest') {
      return timeA - timeB;
    }
    // Default: newest first
    return timeB - timeA;
  });
}
