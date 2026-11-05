/**
 * Automated Unit Test Suite for School Weekly Menus & Food Safety Traceability (Thực Đơn)
 * Tests BR01 through BR12, class fallback resolution, GTIN lookup, asymmetric cloning, and Redux state machine.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  isWeekWithin8Weeks,
  resolveClassMenuForWeek,
  lookupSupplierByGTIN,
  evaluateIngredientTraceability,
  canCloneMenu,
  getWeekNumber,
  getWeekDates,
  formatMenuDateRange,
  getTraceabilitySummary,
  getWeekdayDateLabel,
} from '../../src/utils/menuValidation.ts';

import menuReducer, {
  setFilters,
  resetFilters,
  createMenu,
  updateMenu,
  publishMenu,
  cloneMenu,
  deleteMenu,
  updateDishIngredients,
  updateMealSessionTickXanh,
  addDish,
  removeDish,
} from '../../src/store/slices/menuSlice.ts';

import { INITIAL_MENUS } from '../../src/services/mockMenuData.ts';

describe('School Menu (Thực Đơn) Business Rules & Validation Engine', () => {

  test('BR01: isWeekWithin8Weeks enforces maximum 8-week advance limit', () => {
    const today = new Date('2026-09-15T00:00:00Z');

    // 1 week ahead: permissible
    const in1Week = new Date('2026-09-22T00:00:00Z');
    assert.equal(isWeekWithin8Weeks(in1Week, today), true);

    // 7 weeks ahead: permissible
    const in7Weeks = new Date('2026-11-03T00:00:00Z');
    assert.equal(isWeekWithin8Weeks(in7Weeks, today), true);

    // 8 weeks ahead (56 days): boundary permissible
    const in8Weeks = new Date('2026-11-10T00:00:00Z');
    assert.equal(isWeekWithin8Weeks(in8Weeks, today), true);

    // 9 weeks ahead (63 days): exceeds 8 weeks -> false
    const in9Weeks = new Date('2026-11-17T00:00:00Z');
    assert.equal(isWeekWithin8Weeks(in9Weeks, today), false);

    // Past week: permissible (historical view)
    const inPast = new Date('2026-09-01T00:00:00Z');
    assert.equal(isWeekWithin8Weeks(inPast, today), true);
  });

  test('BR02: resolveClassMenuForWeek falls back to school-wide menu if class has no custom menu', () => {
    // In INITIAL_MENUS:
    // - Week 38: has 'toan_truong' menu (menu-w38-all) and bespoke class menu for 10A1 (menu-w38-10a1)
    // - Week 38: class 10A2 has no bespoke menu -> should fall back to menu-w38-all
    const menuFor10A1 = resolveClassMenuForWeek('10A1', 38, 2026, INITIAL_MENUS);
    assert.ok(menuFor10A1);
    assert.equal(menuFor10A1.id, 'menu-w38-10a1');
    assert.equal(menuFor10A1.scope, 'class');
    assert.equal(menuFor10A1.classId, '10A1');

    // Class 10A2 has no bespoke menu for week 38 -> falls back to school-wide menu
    const menuFor10A2 = resolveClassMenuForWeek('10A2', 38, 2026, INITIAL_MENUS);
    assert.ok(menuFor10A2);
    assert.equal(menuFor10A2.id, 'menu-w38-all');
    assert.equal(menuFor10A2.scope, 'all');

    // Non-existent week has no menus -> returns null
    const menuForWeek99 = resolveClassMenuForWeek('10A1', 99, 2026, INITIAL_MENUS);
    assert.equal(menuForWeek99, null);
  });

  test('BR04 & BR05: canCloneMenu allows cloning only for grid menus and forbids file menus', () => {
    const gridMenu = {
      id: 'menu-grid-1',
      title: 'Thực đơn lưới',
      scope: 'all',
      weekNumber: 38,
      year: 2026,
      startDate: '2026-09-15',
      endDate: '2026-09-20',
      contentType: 'grid',
      status: 'published',
      sendHistory: [],
      updatedAt: '2026-09-15',
    };

    const fileMenu = {
      id: 'menu-file-1',
      title: 'Thực đơn file',
      scope: 'all',
      weekNumber: 38,
      year: 2026,
      startDate: '2026-09-15',
      endDate: '2026-09-20',
      contentType: 'file',
      status: 'published',
      sendHistory: [],
      updatedAt: '2026-09-15',
    };

    assert.equal(canCloneMenu(gridMenu), true);
    assert.equal(canCloneMenu(fileMenu), false);
  });

  test('BR07: evaluateIngredientTraceability evaluates status based on barcodes and lot numbers', () => {
    // Method GTIN: both gtin and lotNumber present -> dat_chuan
    assert.equal(
      evaluateIngredientTraceability({
        traceabilityMethod: 'gtin',
        gtin: '8936036028812',
        lotNumber: 'LOT-2026-001',
      }),
      'dat_chuan'
    );

    // Method GTIN: missing lotNumber -> chua_truy_xuat
    assert.equal(
      evaluateIngredientTraceability({
        traceabilityMethod: 'gtin',
        gtin: '8936036028812',
        lotNumber: '',
      }),
      'chua_truy_xuat'
    );

    // Method GTIN: missing gtin -> chua_truy_xuat
    assert.equal(
      evaluateIngredientTraceability({
        traceabilityMethod: 'gtin',
        gtin: '',
        lotNumber: 'LOT-2026-001',
      }),
      'chua_truy_xuat'
    );

    // Method internal: internalCode present -> dat_chuan
    assert.equal(
      evaluateIngredientTraceability({
        traceabilityMethod: 'internal',
        internalCode: 'TEM-NB-001',
      }),
      'dat_chuan'
    );

    // Method internal: empty internalCode -> chua_truy_xuat
    assert.equal(
      evaluateIngredientTraceability({
        traceabilityMethod: 'internal',
        internalCode: '  ',
      }),
      'chua_truy_xuat'
    );

    // Empty or undefined traceability method -> chua_truy_xuat
    assert.equal(
      evaluateIngredientTraceability({
        name: 'Hạt sen',
      }),
      'chua_truy_xuat'
    );
  });

  test('BR08: lookupSupplierByGTIN resolves certified Vietnamese suppliers', () => {
    // CP Vietnam
    const cp = lookupSupplierByGTIN('8936036028812');
    assert.equal(cp.supplierName, 'Công ty Cổ phần Chăn nuôi C.P. Việt Nam');
    assert.equal(cp.verified, true);

    // Vinamilk
    const vnm = lookupSupplierByGTIN('8934563889910');
    assert.equal(vnm.supplierName, 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)');
    assert.equal(vnm.verified, true);

    // Ba Vi Milk
    const bv = lookupSupplierByGTIN('8935001001234');
    assert.equal(bv.supplierName, 'Công ty Cổ phần Sữa Ba Vì');
    assert.equal(bv.verified, true);

    // Masan MEATDeli
    const meat = lookupSupplierByGTIN('8938501102931');
    assert.equal(meat.supplierName, 'Tập đoàn Masan MEATDeli');
    assert.equal(meat.verified, true);

    // Vissan
    const vissan = lookupSupplierByGTIN('8934608112233');
    assert.equal(vissan.supplierName, 'Công ty Việt Nam Kỹ Nghệ Súc Sản (Vissan)');
    assert.equal(vissan.verified, true);

    // Generic GS1 Vietnam (13 digits starting with 893)
    const genericVN = lookupSupplierByGTIN('8939999999999');
    assert.equal(genericVN.verified, true);

    // Unknown or empty
    assert.equal(lookupSupplierByGTIN('').verified, false);
    assert.equal(lookupSupplierByGTIN(undefined).verified, false);
    assert.equal(lookupSupplierByGTIN('1234567890123').verified, false);
  });

  test('formatMenuDateRange and getWeekDates format dates accurately', () => {
    const dates = getWeekDates(38, 2026);
    assert.ok(dates.startDate);
    assert.ok(dates.endDate);

    const formatted = formatMenuDateRange('2026-09-15', '2026-09-20');
    assert.equal(formatted, '15/09/2026 - 20/09/2026');
  });

  test('getTraceabilitySummary calculates correct counts for dishes', () => {
    const dishes = [
      {
        id: 'd1',
        name: 'Món 1',
        ingredients: [
          { id: 'i1', name: 'Thịt heo', status: 'dat_chuan' },
          { id: 'i2', name: 'Rau', status: 'dat_chuan' },
        ],
      },
      {
        id: 'd2',
        name: 'Món 2',
        ingredients: [
          { id: 'i3', name: 'Gia vị', status: 'chua_truy_xuat' },
        ],
      },
    ];

    const summary = getTraceabilitySummary(dishes);
    assert.equal(summary.totalIngredients, 3);
    assert.equal(summary.datChuanCount, 2);
    assert.equal(summary.chuaTruyXuatCount, 1);
  });
});

describe('School Menu Redux State Machine', () => {
  const initialSliceState = {
    menus: INITIAL_MENUS,
    filters: {
      searchQuery: '',
      classId: 'all',
      useFileOnly: 'all',
      status: 'all',
    },
    selectedMenuId: null,
    loading: false,
    error: null,
  };

  test('createMenu adds new draft or published menu to state', () => {
    const action = createMenu({
      title: 'Thực đơn tuần thử nghiệm',
      scope: 'all',
      weekNumber: 41,
      year: 2026,
      startDate: '2026-10-06',
      endDate: '2026-10-11',
      contentType: 'grid',
      publishNow: false,
    });

    const nextState = menuReducer(initialSliceState, action);
    assert.equal(nextState.menus.length, initialSliceState.menus.length + 1);
    const created = nextState.menus[0];
    assert.equal(created.status, 'draft');
    assert.equal(created.weekNumber, 41);
    assert.equal(created.sendHistory.length, 0);
  });

  test('publishMenu updates status to published and appends to sendHistory', () => {
    // Start with draft menu
    const draftMenu = initialSliceState.menus.find((m) => m.id === 'menu-w39-all');
    assert.equal(draftMenu?.status, 'draft');

    const action = publishMenu({
      id: 'menu-w39-all',
      viaAnnouncement: true,
      note: 'Gửi kèm thông báo Bảng Tin',
    });

    const nextState = menuReducer(initialSliceState, action);
    const updated = nextState.menus.find((m) => m.id === 'menu-w39-all');
    assert.equal(updated?.status, 'published');
    assert.equal(updated?.publishedViaAnnouncement, true);
    assert.equal(updated?.sendHistory.length, 1);
    assert.equal(updated?.sendHistory[0].channel, 'announcement_board');
  });

  test('BR05: cloneMenu duplicates structured grid menu into new target week', () => {
    const action = cloneMenu({
      sourceMenuId: 'menu-w38-all',
      targetWeekNumber: 42,
      targetYear: 2026,
      targetStartDate: '2026-10-13',
      targetEndDate: '2026-10-18',
    });

    const nextState = menuReducer(initialSliceState, action);
    assert.equal(nextState.menus.length, initialSliceState.menus.length + 1);
    const cloned = nextState.menus[0];
    assert.equal(cloned.weekNumber, 42);
    assert.equal(cloned.status, 'draft');
    assert.ok(cloned.schedule?.monday?.breakfast?.length);
  });

  test('BR05: cloneMenu ignores file-based menus', () => {
    const action = cloneMenu({
      sourceMenuId: 'menu-w38-file-mamnon', // file-based menu
      targetWeekNumber: 42,
      targetYear: 2026,
      targetStartDate: '2026-10-13',
      targetEndDate: '2026-10-18',
    });

    const nextState = menuReducer(initialSliceState, action);
    // Menu count does not increase because cloning is disallowed for file menus
    assert.equal(nextState.menus.length, initialSliceState.menus.length);
  });

  test('BR11: deleteMenu deletes only draft menus, preserving published menus', () => {
    // Attempt to delete draft menu (menu-w39-all)
    const stateAfterDraftDelete = menuReducer(
      initialSliceState,
      deleteMenu('menu-w39-all')
    );
    assert.equal(
      stateAfterDraftDelete.menus.some((m) => m.id === 'menu-w39-all'),
      false
    );

    // Attempt to delete published menu (menu-w38-all) -> must NOT be deleted
    const stateAfterPublishedDelete = menuReducer(
      initialSliceState,
      deleteMenu('menu-w38-all')
    );
    assert.equal(
      stateAfterPublishedDelete.menus.some((m) => m.id === 'menu-w38-all'),
      true
    );
  });

  test('updateDishIngredients, addDish, and removeDish manipulate meal items', () => {
    // Add dish
    const stateWithNewDish = menuReducer(
      initialSliceState,
      addDish({
        menuId: 'menu-w38-all',
        day: 'monday',
        meal: 'breakfast',
        dish: { name: 'Cháo gà thảo mộc', calories: 290 },
      })
    );
    const menuAfterAdd = stateWithNewDish.menus.find((m) => m.id === 'menu-w38-all');
    const addedDish = menuAfterAdd?.schedule?.monday?.breakfast?.find((d) => d.name === 'Cháo gà thảo mộc');
    assert.ok(addedDish);
    assert.equal(addedDish.calories, 290);

    // Update ingredients on added dish
    const stateWithIngredients = menuReducer(
      stateWithNewDish,
      updateDishIngredients({
        menuId: 'menu-w38-all',
        day: 'monday',
        meal: 'breakfast',
        dishId: addedDish.id,
        ingredients: [
          {
            id: 'ing-ga-1',
            name: 'Thịt gà San Hà',
            traceabilityMethod: 'gtin',
            gtin: '8935217990012',
            lotNumber: 'LOT-SH-881',
            supplierName: 'Công ty TNHH San Hà (Gia cầm sạch)',
            supplierVerified: true,
            status: 'dat_chuan',
          },
        ],
      })
    );
    const menuAfterIng = stateWithIngredients.menus.find((m) => m.id === 'menu-w38-all');
    const dishWithIng = menuAfterIng?.schedule?.monday?.breakfast?.find((d) => d.id === addedDish.id);
    assert.equal(dishWithIng?.ingredients.length, 1);
    assert.equal(dishWithIng?.ingredients[0].status, 'dat_chuan');

    // Remove dish
    const stateAfterRemove = menuReducer(
      stateWithIngredients,
      removeDish({
        menuId: 'menu-w38-all',
        day: 'monday',
        meal: 'breakfast',
        dishId: addedDish.id,
      })
    );
    const menuAfterRemove = stateAfterRemove.menus.find((m) => m.id === 'menu-w38-all');
    assert.equal(
      menuAfterRemove?.schedule?.monday?.breakfast?.some((d) => d.id === addedDish.id),
      false
    );
  });

  test('BR Tick Xanh: updateDishIngredients persists tickXanhUrl and tickXanhVerified status', () => {
    const action = updateDishIngredients({
      menuId: 'menu-w38-all',
      day: 'monday',
      meal: 'breakfast',
      dishId: 'dish-m-b-1',
      ingredients: [],
      tickXanhUrl: 'https://ttx.te-food.com/xxxxxx',
      tickXanhVerified: true,
    });

    const nextState = menuReducer(initialSliceState, action);
    const menu = nextState.menus.find((m) => m.id === 'menu-w38-all');
    const dish = menu?.schedule?.monday?.breakfast?.find((d) => d.id === 'dish-m-b-1');
    assert.ok(dish);
    assert.equal(dish.tickXanhUrl, 'https://ttx.te-food.com/xxxxxx');
    assert.equal(dish.tickXanhVerified, true);
  });

  test('BR Tick Xanh Theo Buổi Ăn: updateMealSessionTickXanh persists tickXanh for a specific meal session', () => {
    const action = updateMealSessionTickXanh({
      menuId: '135',
      day: 'wednesday',
      meal: 'lunch',
      tickXanhUrl: 'https://tfd.tf/26198-B-29-0040299',
      tickXanhVerified: true,
    });

    const nextState = menuReducer(initialSliceState, action);
    const menu = nextState.menus.find((m) => m.id === '135');
    assert.ok(menu);
    assert.equal(menu?.schedule?.wednesday?.tickXanh?.lunch?.url, 'https://tfd.tf/26198-B-29-0040299');
    assert.equal(menu?.schedule?.wednesday?.tickXanh?.lunch?.verified, true);
  });

  test('BR Tick Xanh Theo Buổi Ăn: getWeekdayDateLabel formats calendar date correctly', () => {
    const startDate = '2026-10-12'; // Monday
    assert.equal(getWeekdayDateLabel(startDate, 'monday'), '12/10/2026');
    assert.equal(getWeekdayDateLabel(startDate, 'tuesday'), '13/10/2026');
    assert.equal(getWeekdayDateLabel(startDate, 'wednesday'), '14/10/2026');
    assert.equal(getWeekdayDateLabel(startDate, 'thursday'), '15/10/2026');
    assert.equal(getWeekdayDateLabel(startDate, 'friday'), '16/10/2026');
    assert.equal(getWeekdayDateLabel(startDate, 'saturday'), '17/10/2026');
  });

  test('BR Tick Xanh: updateMealSessionTickXanh can set Tick Xanh across multiple meals of a day', () => {
    let state = initialSliceState;
    ['breakfast', 'lunch', 'snack'].forEach((meal) => {
      state = menuReducer(
        state,
        updateMealSessionTickXanh({
          menuId: '135',
          day: 'thursday',
          meal,
          tickXanhUrl: 'https://tfd.tf/26198-B-29-DAY-SHARED',
          tickXanhVerified: true,
        })
      );
    });

    const menu = state.menus.find((m) => m.id === '135');
    assert.equal(menu?.schedule?.thursday?.tickXanh?.breakfast?.url, 'https://tfd.tf/26198-B-29-DAY-SHARED');
    assert.equal(menu?.schedule?.thursday?.tickXanh?.lunch?.url, 'https://tfd.tf/26198-B-29-DAY-SHARED');
    assert.equal(menu?.schedule?.thursday?.tickXanh?.snack?.url, 'https://tfd.tf/26198-B-29-DAY-SHARED');
  });
});

