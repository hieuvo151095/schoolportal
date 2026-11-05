import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  WeeklyMenu,
  MenuFilterState,
  CreateMenuPayload,
  FoodIngredient,
  WeekdayKey,
  MealType,
  DayMealSchedule,
} from '../../types/menu.ts';
import { INITIAL_MENUS } from '../../services/mockMenuData.ts';
import { formatMenuDateRange } from '../../utils/menuValidation.ts';

interface MenuState {
  menus: WeeklyMenu[];
  filters: MenuFilterState;
  selectedMenuId: string | null;
  loading: boolean;
  error: string | null;
}

const initialFilters: MenuFilterState = {
  searchQuery: '',
  classId: 'all',
  useFileOnly: 'all',
  status: 'all',
};

const initialState: MenuState = {
  menus: INITIAL_MENUS,
  filters: initialFilters,
  selectedMenuId: null,
  loading: false,
  error: null,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<MenuFilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    setSelectedMenuId: (state, action: PayloadAction<string | null>) => {
      state.selectedMenuId = action.payload;
    },
    createMenu: (state, action: PayloadAction<CreateMenuPayload>) => {
      const payload = action.payload;
      const id = `menu-${Date.now()}`;
      const title =
        payload.title || `Thực đơn tuần: ${formatMenuDateRange(payload.startDate, payload.endDate)}`;
      const now = new Date().toISOString();

      const newMenu: WeeklyMenu = {
        id,
        title,
        scope: payload.scope,
        classId: payload.classId,
        className: payload.className,
        weekNumber: payload.weekNumber,
        year: payload.year,
        startDate: payload.startDate,
        endDate: payload.endDate,
        contentType: payload.contentType,
        status: payload.publishNow ? 'published' : 'draft',
        publishedViaAnnouncement: payload.publishedViaAnnouncement,
        publishedAt: payload.publishNow ? now : undefined,
        updatedAt: now,
        schedule: payload.contentType === 'grid' ? payload.schedule || createEmptyWeekSchedule() : undefined,
        fileAttachment: payload.contentType === 'file' ? payload.fileAttachment : undefined,
        sendHistory: payload.publishNow
          ? [
              {
                id: `sh-${Date.now()}`,
                sentAt: now,
                senderName: 'Ban Giám Hiệu',
                senderRole: 'Quản trị viên',
                channel: payload.publishedViaAnnouncement ? 'announcement_board' : 'portal_only',
                note: payload.publishedViaAnnouncement
                  ? 'Công bố kèm thông báo qua Bảng Thông Tin'
                  : 'Chỉ xuất bản trên cổng',
              },
            ]
          : [],
      };

      state.menus.unshift(newMenu);
    },
    updateMenu: (state, action: PayloadAction<{ id: string; changes: Partial<WeeklyMenu> }>) => {
      const index = state.menus.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.menus[index] = {
          ...state.menus[index],
          ...action.payload.changes,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    publishMenu: (
      state,
      action: PayloadAction<{ id: string; viaAnnouncement: boolean; note?: string }>
    ) => {
      const { id, viaAnnouncement, note } = action.payload;
      const menu = state.menus.find((m) => m.id === id);
      if (menu) {
        const now = new Date().toISOString();
        menu.status = 'published';
        menu.publishedViaAnnouncement = viaAnnouncement;
        menu.publishedAt = now;
        menu.updatedAt = now;
        menu.sendHistory.unshift({
          id: `sh-${Date.now()}`,
          sentAt: now,
          senderName: 'Ban Giám Hiệu',
          senderRole: 'Quản trị viên',
          channel: viaAnnouncement ? 'announcement_board' : 'portal_only',
          note: note || (viaAnnouncement ? 'Công bố kèm thông báo Bảng Thông Tin' : 'Chỉ xuất bản'),
        });
      }
    },
    cloneMenu: (
      state,
      action: PayloadAction<{
        sourceMenuId: string;
        targetWeekNumber: number;
        targetYear: number;
        targetStartDate: string;
        targetEndDate: string;
      }>
    ) => {
      const { sourceMenuId, targetWeekNumber, targetYear, targetStartDate, targetEndDate } =
        action.payload;
      const source = state.menus.find((m) => m.id === sourceMenuId);
      if (!source || source.contentType !== 'grid') {
        return; // BR05: only grid menus can be cloned
      }

      const id = `menu-${Date.now()}`;
      const now = new Date().toISOString();
      const cloned: WeeklyMenu = {
        ...source,
        id,
        title: `Thực đơn tuần: ${formatMenuDateRange(targetStartDate, targetEndDate)}`,
        weekNumber: targetWeekNumber,
        year: targetYear,
        startDate: targetStartDate,
        endDate: targetEndDate,
        status: 'draft',
        publishedAt: undefined,
        publishedViaAnnouncement: false,
        updatedAt: now,
        sendHistory: [],
        schedule: JSON.parse(JSON.stringify(source.schedule || {})),
      };

      state.menus.unshift(cloned);
    },
    deleteMenu: (state, action: PayloadAction<string>) => {
      // BR11: only draft menus can be deleted
      state.menus = state.menus.filter((m) => !(m.id === action.payload && m.status === 'draft'));
    },
    updateDishIngredients: (
      state,
      action: PayloadAction<{
        menuId: string;
        day: WeekdayKey;
        meal: MealType;
        dishId: string;
        ingredients: FoodIngredient[];
        tickXanhUrl?: string;
        tickXanhVerified?: boolean;
      }>
    ) => {
      const { menuId, day, meal, dishId, ingredients, tickXanhUrl, tickXanhVerified } = action.payload;
      const menu = state.menus.find((m) => m.id === menuId);
      if (menu && menu.schedule && menu.schedule[day] && menu.schedule[day][meal]) {
        const dish = menu.schedule[day][meal].find((d) => d.id === dishId);
        if (dish) {
          dish.ingredients = ingredients;
          if (tickXanhUrl !== undefined) {
            dish.tickXanhUrl = tickXanhUrl;
          }
          if (tickXanhVerified !== undefined) {
            dish.tickXanhVerified = tickXanhVerified;
          }
          menu.updatedAt = new Date().toISOString();
        }
      }
    },
    updateMealSessionTickXanh: (
      state,
      action: PayloadAction<{
        menuId: string;
        day: WeekdayKey;
        meal: MealType;
        tickXanhUrl?: string;
        tickXanhVerified?: boolean;
      }>
    ) => {
      const { menuId, day, meal, tickXanhUrl, tickXanhVerified } = action.payload;
      const menu = state.menus.find((m) => m.id === menuId);
      if (menu && menu.schedule && menu.schedule[day]) {
        if (!menu.schedule[day].tickXanh) {
          menu.schedule[day].tickXanh = {};
        }
        menu.schedule[day].tickXanh[meal] = {
          url: tickXanhUrl,
          verified:
            tickXanhVerified !== undefined
              ? tickXanhVerified
              : Boolean(tickXanhUrl && tickXanhUrl.trim().length > 0),
        };
        menu.updatedAt = new Date().toISOString();
      }
    },
    addDish: (
      state,
      action: PayloadAction<{
        menuId: string;
        day: WeekdayKey;
        meal: MealType;
        dish: { name: string; calories?: number };
      }>
    ) => {
      const { menuId, day, meal, dish } = action.payload;
      const menu = state.menus.find((m) => m.id === menuId);
      if (menu && menu.schedule && menu.schedule[day] && menu.schedule[day][meal]) {
        menu.schedule[day][meal].push({
          id: `dish-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: dish.name,
          calories: dish.calories,
          ingredients: [],
        });
        menu.updatedAt = new Date().toISOString();
      }
    },
    removeDish: (
      state,
      action: PayloadAction<{
        menuId: string;
        day: WeekdayKey;
        meal: MealType;
        dishId: string;
      }>
    ) => {
      const { menuId, day, meal, dishId } = action.payload;
      const menu = state.menus.find((m) => m.id === menuId);
      if (menu && menu.schedule && menu.schedule[day] && menu.schedule[day][meal]) {
        menu.schedule[day][meal] = menu.schedule[day][meal].filter((d) => d.id !== dishId);
        menu.updatedAt = new Date().toISOString();
      }
    },
  },
});

function createEmptyWeekSchedule(): Record<WeekdayKey, DayMealSchedule> {
  const emptyDay = (): DayMealSchedule => ({
    breakfast: [],
    lunch: [],
    snack: [],
  });

  return {
    monday: emptyDay(),
    tuesday: emptyDay(),
    wednesday: emptyDay(),
    thursday: emptyDay(),
    friday: emptyDay(),
    saturday: emptyDay(),
  };
}

export const {
  setFilters,
  resetFilters,
  setSelectedMenuId,
  createMenu,
  updateMenu,
  publishMenu,
  cloneMenu,
  deleteMenu,
  updateDishIngredients,
  updateMealSessionTickXanh,
  addDish,
  removeDish,
} = menuSlice.actions;

export default menuSlice.reducer;
