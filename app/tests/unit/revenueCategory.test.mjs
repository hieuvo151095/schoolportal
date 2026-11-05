import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import revenueCategoryReducer, {
  setFilter,
  setPage,
  syncStart,
  syncSuccess,
  toggleCategoryStatus,
} from '../../src/store/slices/revenueCategorySlice.ts';
import { mockRevenueCategories } from '../../src/mock/mockRevenueCategories.ts';
import { filterFeeItems } from '../../src/utils/schoolFeeValidation.ts';

describe('Revenue Category (Danh Mục Thu) Business Rules & State Machine', () => {
  it('initial state contains all 21 synchronized revenue categories', () => {
    const state = revenueCategoryReducer(undefined, { type: '@@INIT' });
    assert.equal(state.list.length, mockRevenueCategories.length);
    assert.equal(state.dropdownList.length, mockRevenueCategories.filter((c) => c.active).length);
    assert.equal(state.filter.status, '');
    assert.equal(state.pagination.currentPage, 1);
  });

  it('BR-RC-01: Filters revenue categories by search keyword and status', () => {
    let state = revenueCategoryReducer(undefined, { type: '@@INIT' });

    // Filter by keyword 'Xe'
    state = revenueCategoryReducer(state, setFilter({ search: 'Xe' }));
    assert.equal(state.filter.search, 'Xe');

    // Filter by active status
    state = revenueCategoryReducer(state, setFilter({ status: 1 }));
    assert.equal(state.filter.status, 1);

    // Filter by inactive status
    state = revenueCategoryReducer(state, setFilter({ status: 0 }));
    assert.equal(state.filter.status, 0);
  });

  it('BR-RC-02: Page change updates current page in state and pagination', () => {
    let state = revenueCategoryReducer(undefined, { type: '@@INIT' });
    state = revenueCategoryReducer(state, setPage(2));
    assert.equal(state.pagination.currentPage, 2);
    assert.equal(state.filter.page, 2);
  });

  it('BR-RC-03: CSDL Synchronization flow updates items and syncing flag', () => {
    let state = revenueCategoryReducer(undefined, { type: '@@INIT' });
    state = revenueCategoryReducer(state, syncStart());
    assert.equal(state.syncing, true);

    const updatedCategories = [
      ...mockRevenueCategories,
      {
        id: 99,
        code: 'NEW001',
        name: 'Khoản thu kiểm tra mới',
        unit: 'Tháng',
        effective_from: '01/10/2026',
        status: 'PUBLISHED',
        active: true,
        usable: true,
      },
    ];

    state = revenueCategoryReducer(state, syncSuccess(updatedCategories));
    assert.equal(state.syncing, false);
    assert.equal(state.list.length, updatedCategories.length);
    assert.equal(state.dropdownList.some((c) => c.id === 99), true);
  });

  it('BR-RC-04: Toggles revenue category active/usable status', () => {
    let state = revenueCategoryReducer(undefined, { type: '@@INIT' });
    const targetId = mockRevenueCategories[0].id;
    const initialActive = mockRevenueCategories[0].active;

    state = revenueCategoryReducer(
      state,
      toggleCategoryStatus({ id: targetId, active: !initialActive })
    );

    const updated = state.list.find((c) => c.id === targetId);
    assert.equal(updated.active, !initialActive);
    assert.equal(updated.usable, !initialActive);
  });

  it('BR-RC-05: Integrates with Fee Catalog by filtering fee items by revenue_category_id', () => {
    const sampleFees = [
      {
        id: 'f1',
        code: 'F1',
        name: 'Phí A',
        type: 'custom',
        exportElectronicInvoice: true,
        revenue_category_id: 37, // XD001
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'f2',
        code: 'F2',
        name: 'Phí B',
        type: 'custom',
        exportElectronicInvoice: false,
        revenue_category_id: 20, // HP001
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'f3',
        code: 'F3',
        name: 'Phí C',
        type: 'custom',
        exportElectronicInvoice: true,
        revenue_category_id: null,
        createdAt: '',
        updatedAt: '',
      },
    ];

    // Filter by revenueCategoryFilter = 37
    const filtered37 = filterFeeItems(sampleFees, {
      search: '',
      exportElectronicInvoiceFilter: 'all',
      revenueCategoryFilter: 37,
    });
    assert.equal(filtered37.length, 1);
    assert.equal(filtered37[0].id, 'f1');

    // Filter by revenueCategoryFilter = 'all'
    const filteredAll = filterFeeItems(sampleFees, {
      search: '',
      exportElectronicInvoiceFilter: 'all',
      revenueCategoryFilter: 'all',
    });
    assert.equal(filteredAll.length, 3);
  });
});
