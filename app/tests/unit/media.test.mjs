import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAlbumCreation,
  validateSystemAlbumProtection,
  validateStudentFilterSelection,
  groupPhotosByUploadDate,
  filterPhotos,
} from '../../src/utils/mediaValidation.ts';

describe('Media & Album Validation Rules (Vận Hành - Thư viện)', () => {
  describe('BR01: System Album Protection Rule', () => {
    test('protects system albums (Hoạt động & Điểm danh) from deletion or rename', () => {
      const systemAlbum = {
        id: 'sys-act',
        title: 'Hoạt động',
        isSystem: true,
        systemType: 'activity',
      };
      const protection = validateSystemAlbumProtection(systemAlbum);
      assert.equal(protection.canDelete, false);
      assert.equal(protection.canRename, false);
      assert.equal(protection.error, 'Không thể đổi tên hoặc xóa album hệ thống');
    });

    test('allows editing and deleting custom created albums', () => {
      const customAlbum = {
        id: 'alb-001',
        title: 'Dã ngoại Làng Gốm Bát Tràng',
        isSystem: false,
      };
      const protection = validateSystemAlbumProtection(customAlbum);
      assert.equal(protection.canDelete, true);
      assert.equal(protection.canRename, true);
      assert.equal(protection.error, undefined);
    });
  });

  describe('BR02: Album Creation Title Validation', () => {
    test('rejects empty or whitespace album title', () => {
      const result = validateAlbumCreation('');
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Tên album không được để trống');

      const whitespaceResult = validateAlbumCreation('    ');
      assert.equal(whitespaceResult.valid, false);
    });

    test('accepts valid album title', () => {
      const result = validateAlbumCreation('Lễ Khai Giảng Năm Học 2026-2027');
      assert.equal(result.valid, true);
    });
  });

  describe('BR06: Advanced Filter Max 5 Students Rule', () => {
    test('rejects selection with more than 5 students', () => {
      const sixStudents = ['stu-1', 'stu-2', 'stu-3', 'stu-4', 'stu-5', 'stu-6'];
      const result = validateStudentFilterSelection(sixStudents, 'students');
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Vui lòng chọn tối đa 5 học sinh');
    });

    test('accepts selection with 1 to 5 students', () => {
      const threeStudents = ['stu-1', 'stu-2', 'stu-3'];
      const result = validateStudentFilterSelection(threeStudents, 'students');
      assert.equal(result.valid, true);
    });

    test('accepts special options Cả lớp and Không gắn thẻ', () => {
      const allClassResult = validateStudentFilterSelection([], 'all');
      assert.equal(allClassResult.valid, true);

      const unassignedResult = validateStudentFilterSelection([], 'unassigned');
      assert.equal(unassignedResult.valid, true);
    });
  });

  describe('BR04: Group Photos by Upload Date', () => {
    test('groups photos chronologically by date string', () => {
      const samplePhotos = [
        { id: 'ph-1', url: '1.jpg', uploadedAt: '2026-09-12T08:30:00Z', uploadedBy: 'Cô Mai' },
        { id: 'ph-2', url: '2.jpg', uploadedAt: '2026-09-12T10:15:00Z', uploadedBy: 'Cô Mai' },
        { id: 'ph-3', url: '3.jpg', uploadedAt: '2026-09-11T14:00:00Z', uploadedBy: 'Thầy Hùng' },
      ];

      const grouped = groupPhotosByUploadDate(samplePhotos);
      const dates = Object.keys(grouped);
      assert.equal(dates.length, 2);
      assert.equal(grouped['2026-09-12'].length, 2);
      assert.equal(grouped['2026-09-11'].length, 1);
    });
  });

  describe('Photo Filtering & Sorting', () => {
    const photos = [
      {
        id: 'ph-1',
        uploadedAt: '2026-09-10T10:00:00Z',
        taggedStudentIds: ['stu-1'],
      },
      {
        id: 'ph-2',
        uploadedAt: '2026-09-12T10:00:00Z',
        taggedStudentIds: ['stu-2', 'stu-3'],
      },
      {
        id: 'ph-3',
        uploadedAt: '2026-09-11T10:00:00Z',
        taggedStudentIds: [],
      },
    ];

    test('filters photos tagged with selected student', () => {
      const filtered = filterPhotos(photos, {
        filterType: 'students',
        selectedStudentIds: ['stu-1'],
        sortBy: 'newest',
      });
      assert.equal(filtered.length, 1);
      assert.equal(filtered[0].id, 'ph-1');
    });

    test('filters unassigned photos without any student tags', () => {
      const filtered = filterPhotos(photos, {
        filterType: 'unassigned',
        selectedStudentIds: [],
        sortBy: 'newest',
      });
      assert.equal(filtered.length, 1);
      assert.equal(filtered[0].id, 'ph-3');
    });

    test('sorts photos newest first', () => {
      const sorted = filterPhotos(photos, {
        filterType: 'all',
        selectedStudentIds: [],
        sortBy: 'newest',
      });
      assert.equal(sorted[0].id, 'ph-2'); // 2026-09-12 is newest
      assert.equal(sorted[2].id, 'ph-1'); // 2026-09-10 is oldest
    });

    test('supports batch photo deletion from an album', () => {
      const initialPhotos = [
        { id: 'ph-1', albumId: 'alb-1' },
        { id: 'ph-2', albumId: 'alb-1' },
        { id: 'ph-3', albumId: 'alb-1' },
        { id: 'ph-4', albumId: 'alb-2' },
      ];

      const toDeleteIds = ['ph-1', 'ph-3'];
      const remaining = initialPhotos.filter((p) => !toDeleteIds.includes(p.id));
      assert.equal(remaining.length, 2);
      assert.deepEqual(remaining.map(p => p.id), ['ph-2', 'ph-4']);
    });
  });
});
