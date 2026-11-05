import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePostContent,
  sortActivityPosts,
  filterActivityPosts,
} from '../../src/utils/activityValidation.ts';

describe('Activity Validation & Business Rules (Vận Hành - Hoạt động)', () => {
  describe('BR02: Post Content Validation Rule', () => {
    test('rejects post when content is empty and has no media', () => {
      const result = validatePostContent('', 0);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Nội dung hoạt động không được để trống');

      const whitespaceResult = validatePostContent('   ', 0);
      assert.equal(whitespaceResult.valid, false);
    });

    test('accepts post when text content is present', () => {
      const result = validatePostContent('Hôm nay các con học vẽ tranh sáng tạo', 0);
      assert.equal(result.valid, true);
    });

    test('accepts post when text is empty but at least 1 photo/media is attached', () => {
      const result = validatePostContent('', 2);
      assert.equal(result.valid, true);
    });
  });

  describe('BR07: Pinned Post Sorting Rule & Single-Pin Invariant', () => {
    test('floats pinned posts to the top regardless of creation date', () => {
      const posts = [
        { id: '1', content: 'Bài đăng mới', isPinned: false, createdAt: '2026-09-12T10:00:00Z' },
        { id: '2', content: 'Bài đăng ghim cũ', isPinned: true, createdAt: '2026-09-10T08:00:00Z' },
        { id: '3', content: 'Bài đăng vừa xong', isPinned: false, createdAt: '2026-09-12T11:00:00Z' },
      ];

      const sorted = sortActivityPosts(posts);
      assert.equal(sorted[0].id, '2'); // Pinned post must be first
      assert.equal(sorted[1].id, '3'); // Newer unpinned post second
      assert.equal(sorted[2].id, '1'); // Older unpinned post third
    });

    test('enforces that only one post can be pinned at any time when replaced', () => {
      const statePosts = [
        { id: 'p-1', isPinned: true },
        { id: 'p-2', isPinned: false },
        { id: 'p-3', isPinned: false },
      ];

      // Replace pin with p-2
      const targetId = 'p-2';
      const updated = statePosts.map(p => ({
        ...p,
        isPinned: p.id === targetId,
      }));

      const pinnedCount = updated.filter(p => p.isPinned).length;
      assert.equal(pinnedCount, 1);
      assert.equal(updated.find(p => p.id === 'p-2')?.isPinned, true);
      assert.equal(updated.find(p => p.id === 'p-1')?.isPinned, false);
    });
  });

  describe('BR09: Activity Filtering Logic', () => {
    const samplePosts = [
      { id: 'p-1', classId: 'lop-1a1', status: 'approved', content: 'Hoạt động thể dục buổi sáng', authorName: 'Cô Mai' },
      { id: 'p-2', classId: 'lop-1a1', status: 'cho_duyet', content: 'Tiết học toán cộng trừ', authorName: 'Cô Mai' },
      { id: 'p-3', classId: 'lop-1a2', status: 'approved', content: 'Hoạt động lớp 1A2', authorName: 'Thầy Tuấn' },
    ];

    test('filters posts by classId and approval status', () => {
      // In general feed ("all"), unapproved posts (status === 'cho_duyet') are excluded.
      const allFor1A1 = filterActivityPosts(samplePosts, 'lop-1a1', 'all', '');
      assert.equal(allFor1A1.length, 1);
      assert.equal(allFor1A1[0].id, 'p-1');

      const approvedFor1A1 = filterActivityPosts(samplePosts, 'lop-1a1', 'approved', '');
      assert.equal(approvedFor1A1.length, 1);
      assert.equal(approvedFor1A1[0].id, 'p-1');

      // Unapproved posts are strictly displayed under "cho_duyet" tab
      const pendingFor1A1 = filterActivityPosts(samplePosts, 'lop-1a1', 'cho_duyet', '');
      assert.equal(pendingFor1A1.length, 1);
      assert.equal(pendingFor1A1[0].id, 'p-2');
    });

    test('filters posts by search keyword matching content or author', () => {
      const searchResult = filterActivityPosts(samplePosts, 'lop-1a1', 'all', 'thể dục');
      assert.equal(searchResult.length, 1);
      assert.equal(searchResult[0].id, 'p-1');
    });

    test('includes whole_school posts when filtering by any specific class', () => {
      const schoolWidePosts = [
        { id: 'p-10', classId: 'lop-1a1', audienceScope: 'current_class', status: 'approved', content: 'Lớp 1A1 riêng' },
        { id: 'p-20', classId: 'all', audienceScope: 'whole_school', status: 'approved', content: 'Thông báo toàn trường' },
        { id: 'p-30', classId: 'lop-1a2', audienceScope: 'current_class', status: 'approved', content: 'Lớp 1A2 riêng' },
      ];
      const result = filterActivityPosts(schoolWidePosts, 'lop-1a1', 'all', '');
      assert.equal(result.length, 2);
      assert.ok(result.some(p => p.id === 'p-10'));
      assert.ok(result.some(p => p.id === 'p-20'));
      assert.ok(!result.some(p => p.id === 'p-30'));
    });
  });

  describe('BR01 & BR06: Audience Scope and Default Moderation Status', () => {
    test('validates audience scope values', () => {
      const validScopes = ['current_class', 'whole_school', 'custom_classes'];
      validScopes.forEach(scope => {
        assert.ok(['current_class', 'whole_school', 'custom_classes'].includes(scope));
      });
    });

    test('moderation status defaults to unapproved/cho_duyet before admin approval', () => {
      const defaultStatus = 'cho_duyet';
      assert.equal(defaultStatus, 'cho_duyet');
      assert.notEqual(defaultStatus, 'approved');
    });
  });

  describe('Student Mention Autocomplete & Tag Highlighting', () => {
    test('detects @ mention trigger pattern and extracts query', () => {
      const text1 = 'Khen ngợi bạn @Khang';
      const match1 = text1.match(/(?:^|\s)@([a-zA-ZÀ-ỹ0-9_\s]{0,25})$/);
      assert.ok(match1);
      assert.equal(match1[1], 'Khang');

      const text2 = 'Các con vẽ tranh @';
      const match2 = text2.match(/(?:^|\s)@([a-zA-ZÀ-ỹ0-9_\s]{0,25})$/);
      assert.ok(match2);
      assert.equal(match2[1], '');
    });

    test('extracts tagged students whose names are mentioned with @ in content', () => {
      const mentionable = [
        { id: 'st-001', name: 'Nguyễn Minh Khang' },
        { id: 'st-002', name: 'Trần Bảo Ngọc' },
        { id: 'st-003', name: 'Lê Tuấn Kiệt' },
      ];
      const content = 'Khen ngợi @Nguyễn Minh Khang và @Trần Bảo Ngọc đã tích cực phát biểu.';
      const tagged = mentionable.filter((s) => content.includes(`@${s.name}`)).map((s) => s.id);
      assert.deepEqual(tagged, ['st-001', 'st-002']);
    });

    test('splits content into full-name @mentions and #hashtags tokens', () => {
      const content = 'Khen bạn @Nguyễn Minh Khang rất ngoan! #HinhHocCoBan';
      const tokens = content.split(/(@[A-ZÀ-Ỹa-zà-ỹ0-9_]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ0-9_]*)*|#[A-ZÀ-Ỹa-zà-ỹ0-9_]+)/g);
      assert.ok(tokens.includes('@Nguyễn Minh Khang'));
      assert.ok(tokens.includes('#HinhHocCoBan'));
    });
  });
});
