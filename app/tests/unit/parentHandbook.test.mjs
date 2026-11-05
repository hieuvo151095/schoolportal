/**
 * Unit Test Suite for School Parent Handbook (Sổ Tay PH)
 * Module: M5 - Nhà Trường / Sổ Tay PH
 * Standards: VR-HNB-01 through VR-HNB-05, BR01 through BR12
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeSearchText,
  validateCategory,
  validateArticle,
  buildCategoryTree,
  toggleAccordionState,
  filterTreeByArticleCriteria,
  getCascadingDeleteTargets,
  reorderSiblings,
} from '../../src/utils/parentHandbookValidation.ts';

import parentHandbookReducer, {
  createCategory,
  updateCategory,
  deleteCategoryCascade,
  createArticle,
  updateArticle,
  toggleArticleStatus,
  deleteArticle,
  toggleAccordion,
  setActiveArticleId,
  setFilterStatus,
  setSearchQuery,
  resetHandbookFilters,
} from '../../src/store/slices/parentHandbookSlice.ts';

import {
  INITIAL_HANDBOOK_CATEGORIES,
  INITIAL_HANDBOOK_ARTICLES,
} from '../../src/services/mockParentHandbookData.ts';

describe('Sổ Tay Phụ Huynh - Pure Validation & Tree Algorithms', () => {
  test('normalizeSearchText: strips Vietnamese diacritics and converts to lowercase', () => {
    assert.equal(normalizeSearchText('Đưa Đón Học Sinh'), 'dua don hoc sinh');
    assert.equal(normalizeSearchText('Quy định Y TẾ & BHYT'), 'quy dinh y te & bhyt');
    assert.equal(normalizeSearchText(''), '');
  });

  test('validateCategory (VR-HNB-01, VR-HNB-03): enforces name length and 2-tier depth cap', () => {
    // Empty name
    const emptyRes = validateCategory({ name: '   ' }, INITIAL_HANDBOOK_CATEGORIES);
    assert.equal(emptyRes.isValid, false);
    assert.match(emptyRes.error, /Tên danh mục không được để trống/);

    // Valid root category
    const validRoot = validateCategory(
      { name: 'Ngoại khóa & CLB', parentCategoryId: null },
      INITIAL_HANDBOOK_CATEGORIES
    );
    assert.equal(validRoot.isValid, true);

    // Valid sub-category under root 'cat-01'
    const validSub = validateCategory(
      { name: 'CLB Tiếng Anh', parentCategoryId: 'cat-01' },
      INITIAL_HANDBOOK_CATEGORIES
    );
    assert.equal(validSub.isValid, true);

    // Invalid sub-category under another sub-category 'cat-01-01' (BR01 depth cap violation!)
    const invalidDeep = validateCategory(
      { name: 'Lớp xe tuyến số 3', parentCategoryId: 'cat-01-01' },
      INITIAL_HANDBOOK_CATEGORIES
    );
    assert.equal(invalidDeep.isValid, false);
    assert.match(invalidDeep.error, /Giới hạn phân cấp tối đa 2 cấp/);
  });

  test('validateArticle (VR-HNB-04): validates title, content, and category assignment', () => {
    // Missing title
    const noTitle = validateArticle({ title: '', content: 'Nội dung', categoryId: 'cat-01' });
    assert.equal(noTitle.isValid, false);
    assert.match(noTitle.error, /Tiêu đề bài viết không được để trống/);

    // Missing content
    const noContent = validateArticle({ title: 'Quy chế', content: '  ', categoryId: 'cat-01' });
    assert.equal(noContent.isValid, false);
    assert.match(noContent.error, /Nội dung bài viết không được để trống/);

    // Missing category
    const noCat = validateArticle({ title: 'Quy chế', content: 'Nội dung', categoryId: '' });
    assert.equal(noCat.isValid, false);
    assert.match(noCat.error, /Vui lòng chọn danh mục/);

    // Valid article
    const valid = validateArticle(
      { title: 'Nội quy bán trú', content: '<p>Chi tiết</p>', categoryId: 'cat-01-01' },
      INITIAL_HANDBOOK_CATEGORIES
    );
    assert.equal(valid.isValid, true);
  });

  test('buildCategoryTree (BR01): correctly structures 2-tier tree without deep nesting', () => {
    const tree = buildCategoryTree(INITIAL_HANDBOOK_CATEGORIES, INITIAL_HANDBOOK_ARTICLES);
    assert.ok(tree.length >= 3, 'Should have root categories');

    const cat01 = tree.find((c) => c.id === 'cat-01');
    assert.ok(cat01, 'cat-01 root must exist');
    assert.ok(cat01.subCategories.length >= 2, 'cat-01 has 2 sub-categories');
    assert.ok(cat01.articles.length >= 1, 'cat-01 has 1 direct article');

    // Check sub-category depth constraint: subCategories inside sub-category MUST be empty
    const sub01 = cat01.subCategories.find((s) => s.id === 'cat-01-01');
    assert.ok(sub01, 'cat-01-01 sub-category exists');
    assert.equal(sub01.subCategories.length, 0, 'Sub-category cannot have nested sub-categories');
    assert.ok(sub01.articles.length >= 2, 'Sub-category has articles');
  });

  test('toggleAccordionState (BR02, VR-HNB-02): enforces single-active accordion within sibling group', () => {
    // Initial: cat-01 is expanded
    let expanded = ['cat-01'];

    // Expanding sibling cat-02 collapses cat-01!
    expanded = toggleAccordionState(expanded, 'cat-02', INITIAL_HANDBOOK_CATEGORIES);
    assert.ok(!expanded.includes('cat-01'), 'cat-01 should collapse');
    assert.ok(expanded.includes('cat-02'), 'cat-02 should be expanded');

    // Clicking already expanded cat-02 collapses it
    expanded = toggleAccordionState(expanded, 'cat-02', INITIAL_HANDBOOK_CATEGORIES);
    assert.ok(!expanded.includes('cat-02'), 'cat-02 should collapse');
    assert.equal(expanded.length, 0);

    // Sub-category siblings under cat-01:
    expanded = ['cat-01', 'cat-01-01'];
    // Expanding cat-01-02 collapses sibling cat-01-01 while keeping parent cat-01 expanded!
    expanded = toggleAccordionState(expanded, 'cat-01-02', INITIAL_HANDBOOK_CATEGORIES);
    assert.ok(expanded.includes('cat-01'), 'Parent root cat-01 remains expanded');
    assert.ok(!expanded.includes('cat-01-01'), 'Sibling cat-01-01 collapses');
    assert.ok(expanded.includes('cat-01-02'), 'Target cat-01-02 expands');
  });

  test('filterTreeByArticleCriteria (BR10, K051): article-centric pruning and auto-expansion', () => {
    const rawTree = buildCategoryTree(INITIAL_HANDBOOK_CATEGORIES, INITIAL_HANDBOOK_ARTICLES);

    // Search for "dua don" (matches art-01 in cat-01-01)
    const { filteredTree, autoExpandedIds } = filterTreeByArticleCriteria(
      rawTree,
      'dua don',
      'all'
    );

    assert.ok(filteredTree.length > 0, 'Filtered tree should not be empty');
    assert.ok(filteredTree.some((c) => c.id === 'cat-01'), 'Must keep root category cat-01');
    assert.ok(!filteredTree.some((c) => c.id === 'cat-02'), 'Must prune cat-02 (no matching articles)');
    assert.ok(autoExpandedIds.includes('cat-01'), 'Ancestor root cat-01 must be auto-expanded');
    assert.ok(autoExpandedIds.includes('cat-01-01'), 'Ancestor sub cat-01-01 must be auto-expanded');

    // Search for impossible string -> empty tree (ST-03)
    const emptyResult = filterTreeByArticleCriteria(rawTree, 'xyz-non-existent-keyword', 'all');
    assert.equal(emptyResult.filteredTree.length, 0, 'Must prune to empty when zero articles match');
    assert.equal(emptyResult.autoExpandedIds.length, 0);

    // Status filter: draft only
    const draftResult = filterTreeByArticleCriteria(rawTree, '', 'draft');
    assert.ok(draftResult.filteredTree.length > 0);
    // Every article in filtered tree must have status === 'draft'
    for (const root of draftResult.filteredTree) {
      for (const a of root.articles) {
        assert.equal(a.status, 'draft');
      }
      for (const sub of root.subCategories) {
        for (const a of sub.articles) {
          assert.equal(a.status, 'draft');
        }
      }
    }
  });

  test('getCascadingDeleteTargets (BR09, VR-HNB-05, ST-01): finds all child categories and nested articles', () => {
    const targets = getCascadingDeleteTargets(
      INITIAL_HANDBOOK_CATEGORIES,
      INITIAL_HANDBOOK_ARTICLES,
      'cat-01'
    );

    assert.equal(targets.targetCategoryName, 'Quy định chung & Nội quy nhà trường');
    // cat-01 has 2 sub-categories: cat-01-01, cat-01-02 -> total 3 category IDs
    assert.equal(targets.categoryIdsToDelete.length, 3);
    assert.ok(targets.categoryIdsToDelete.includes('cat-01'));
    assert.ok(targets.categoryIdsToDelete.includes('cat-01-01'));
    assert.ok(targets.categoryIdsToDelete.includes('cat-01-02'));

    // Articles in cat-01 + cat-01-01 + cat-01-02
    assert.ok(targets.articleIdsToDelete.length >= 6);
  });

  test('reorderSiblings (BR04, K053): updates displayOrder according to orderedIds', () => {
    const items = [
      { id: 'item-A', displayOrder: 0, title: 'A' },
      { id: 'item-B', displayOrder: 1, title: 'B' },
      { id: 'item-C', displayOrder: 2, title: 'C' },
    ];

    const reordered = reorderSiblings(items, ['item-C', 'item-A', 'item-B']);
    const map = new Map(reordered.map((i) => [i.id, i.displayOrder]));
    assert.equal(map.get('item-C'), 0);
    assert.equal(map.get('item-A'), 1);
    assert.equal(map.get('item-B'), 2);
  });
});

describe('Sổ Tay Phụ Huynh - Redux State Machine', () => {
  test('createCategory: creates root category and sub-category with auto-expansion', () => {
    let state = parentHandbookReducer(undefined, { type: '@@INIT' });

    // 1. Create root category
    state = parentHandbookReducer(
      state,
      createCategory({ name: 'Học bổng & Khen thưởng', note: 'Chính sách thưởng' })
    );
    const createdRoot = state.categories.find((c) => c.name === 'Học bổng & Khen thưởng');
    assert.ok(createdRoot);
    assert.equal(createdRoot.parentCategoryId, null);

    // 2. Create sub-category under new root
    state = parentHandbookReducer(
      state,
      createCategory({
        name: 'Khen thưởng học kỳ',
        note: 'Tiêu chí kỳ 1',
        parentCategoryId: createdRoot.id,
      })
    );
    const createdSub = state.categories.find((c) => c.name === 'Khen thưởng học kỳ');
    assert.ok(createdSub);
    assert.equal(createdSub.parentCategoryId, createdRoot.id);
    assert.ok(state.expandedCategoryIds.includes(createdRoot.id));
  });

  test('toggleArticleStatus (BR05, BR12): 1-click transition between draft and published', () => {
    let state = parentHandbookReducer(undefined, { type: '@@INIT' });

    // art-03 is initially draft
    const art03 = state.articles.find((a) => a.id === 'art-03');
    assert.equal(art03.status, 'draft');

    // 1-Click publish
    state = parentHandbookReducer(
      state,
      toggleArticleStatus({ id: 'art-03', status: 'published' })
    );
    const published = state.articles.find((a) => a.id === 'art-03');
    assert.equal(published.status, 'published');
    assert.ok(published.publishedAt);

    // 1-Click unpublish / hide
    state = parentHandbookReducer(
      state,
      toggleArticleStatus({ id: 'art-03', status: 'draft' })
    );
    const drafted = state.articles.find((a) => a.id === 'art-03');
    assert.equal(drafted.status, 'draft');
  });

  test('deleteCategoryCascade (BR09): removes category and all nested child categories & articles', () => {
    let state = parentHandbookReducer(undefined, { type: '@@INIT' });
    const initialCategoryCount = state.categories.length;
    const initialArticleCount = state.articles.length;

    // Delete root category cat-02
    state = parentHandbookReducer(state, deleteCategoryCascade('cat-02'));

    // cat-02 and its 2 sub-categories (cat-02-01, cat-02-02) should be removed
    assert.equal(state.categories.length, initialCategoryCount - 3);
    assert.ok(!state.categories.some((c) => c.id === 'cat-02'));
    assert.ok(!state.categories.some((c) => c.id === 'cat-02-01'));
    assert.ok(!state.categories.some((c) => c.id === 'cat-02-02'));

    // Articles in cat-02 should be wiped
    assert.ok(state.articles.length < initialArticleCount);
    assert.ok(!state.articles.some((a) => a.categoryId === 'cat-02-01'));
  });

  test('createArticle: creates article, sets activeArticleId, and auto-expands category', () => {
    let state = parentHandbookReducer(undefined, { type: '@@INIT' });

    state = parentHandbookReducer(
      state,
      createArticle({
        title: 'Quy trình phòng cháy chữa cháy cơ sở',
        content: '<p>Chi tiết lối thoát hiểm...</p>',
        categoryId: 'cat-01-01',
        status: 'published',
      })
    );

    const created = state.articles.find(
      (a) => a.title === 'Quy trình phòng cháy chữa cháy cơ sở'
    );
    assert.ok(created);
    assert.equal(created.status, 'published');
    assert.equal(state.activeArticleId, created.id);
    assert.ok(state.expandedCategoryIds.includes('cat-01-01'));
    assert.ok(state.expandedCategoryIds.includes('cat-01'));
  });

  test('filter and search setters: update state appropriately', () => {
    let state = parentHandbookReducer(undefined, { type: '@@INIT' });

    state = parentHandbookReducer(state, setFilterStatus('draft'));
    assert.equal(state.filterState.status, 'draft');

    state = parentHandbookReducer(state, setSearchQuery('bảo hiểm'));
    assert.equal(state.filterState.searchQuery, 'bảo hiểm');

    state = parentHandbookReducer(state, resetHandbookFilters());
    assert.equal(state.filterState.status, 'all');
    assert.equal(state.filterState.searchQuery, '');
  });
});
