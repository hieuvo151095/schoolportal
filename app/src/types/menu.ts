export type MenuContentType = 'grid' | 'file';
export type MenuStatus = 'draft' | 'published';
export type MenuScopeType = 'all' | 'class'; // 'all' = Toàn trường, 'class' = Lớp cụ thể
export type MealType = 'breakfast' | 'lunch' | 'snack'; // Ăn sáng, Ăn trưa, Ăn xế
export type TraceabilityStatus = 'dat_chuan' | 'chua_truy_xuat';
export type TraceabilityMethod = 'gtin' | 'internal';

export interface FoodIngredient {
  id: string;
  name: string;
  traceabilityMethod?: TraceabilityMethod;
  gtin?: string;
  lotNumber?: string;
  internalCode?: string;
  supplierName?: string;
  supplierVerified?: boolean;
  status: TraceabilityStatus;
}

export interface DishItem {
  id: string;
  name: string;
  calories?: number;
  ingredients: FoodIngredient[];
  /**
   * @deprecated Tick Xanh is now managed per Meal Session (DayMealSchedule.tickXanh)
   */
  tickXanhUrl?: string;
  tickXanhVerified?: boolean;
}

export interface MealSessionTickXanh {
  url?: string;
  verified?: boolean;
}

export interface DayMealSchedule {
  breakfast: DishItem[];
  lunch: DishItem[];
  snack: DishItem[];
  /**
   * Tick Xanh Trách Nhiệm configuration by meal session (breakfast, lunch, snack)
   * Governed by HCMC Department of Industry & Trade (Sở Công Thương TP.HCM)
   */
  tickXanh?: Partial<Record<MealType, MealSessionTickXanh>>;
}

// Key is day of week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
export type WeekdayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface MenuSendHistoryEntry {
  id: string;
  sentAt: string; // ISO date string
  senderName: string;
  senderRole: string;
  channel: 'announcement_board' | 'portal_only';
  note?: string;
}

export interface WeeklyMenu {
  id: string;
  title: string; // e.g., "Thực đơn tuần: 15/09/2026 - 20/09/2026"
  scope: MenuScopeType;
  classId?: string;
  className?: string; // e.g. "Lớp 10A1" or undefined if 'all'
  weekNumber: number;
  year: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  contentType: MenuContentType;
  status: MenuStatus;
  publishedViaAnnouncement?: boolean; // True if published via Bảng Thông Tin
  publishedAt?: string;
  updatedAt: string;
  
  // Grid mode data
  schedule?: Record<WeekdayKey, DayMealSchedule>;
  
  // File mode data
  fileAttachment?: {
    name: string;
    size: number;
    url: string;
    mimeType: string;
  };

  // Audit history
  sendHistory: MenuSendHistoryEntry[];
}

export interface MenuFilterState {
  searchQuery: string;
  classId: string; // 'all' (Tất cả lớp), 'toan_truong' (Chỉ toàn trường), or specific classId
  useFileOnly: 'all' | 'file_only' | 'grid_only';
  status: 'all' | 'draft' | 'published';
  selectedMonth?: string; // YYYY-MM
}

export interface CreateMenuPayload {
  title?: string;
  scope: MenuScopeType;
  classId?: string;
  className?: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  contentType: MenuContentType;
  schedule?: Record<WeekdayKey, DayMealSchedule>;
  fileAttachment?: {
    name: string;
    size: number;
    url: string;
    mimeType: string;
  };
  publishNow?: boolean;
  publishedViaAnnouncement?: boolean;
}
