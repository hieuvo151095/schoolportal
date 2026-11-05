import type { FoodIngredient, TraceabilityStatus, WeeklyMenu, DishItem, WeekdayKey } from '../types/menu.ts';

/**
 * Standard known GTIN barcode supplier prefixes for Vietnamese certified food safety
 */
export const KNOWN_GTIN_SUPPLIERS: Record<string, string> = {
  '893603602': 'Công ty Cổ phần Chăn nuôi C.P. Việt Nam',
  '8934563': 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
  '8935001': 'Công ty Cổ phần Sữa Ba Vì',
  '8938501': 'Tập đoàn Masan MEATDeli',
  '8934608': 'Công ty Việt Nam Kỹ Nghệ Súc Sản (Vissan)',
  '8936014': 'Hợp tác xã Rau sạch Đà Lạt Gap',
  '8935217': 'Công ty TNHH San Hà (Gia cầm sạch)',
};

/**
 * BR08: Automatically look up certified food supplier by GTIN barcode
 */
export function lookupSupplierByGTIN(gtin?: string): { supplierName: string; verified: boolean } {
  if (!gtin || !gtin.trim()) {
    return { supplierName: '', verified: false };
  }

  const cleanGtin = gtin.trim().replace(/\D/g, '');
  if (!cleanGtin) {
    return { supplierName: '', verified: false };
  }

  // Check prefix matches against known certified suppliers
  for (const [prefix, name] of Object.entries(KNOWN_GTIN_SUPPLIERS)) {
    if (cleanGtin.startsWith(prefix)) {
      return { supplierName: name, verified: true };
    }
  }

  // GS1 Vietnam standard: 893 prefix
  if (cleanGtin.startsWith('893') && cleanGtin.length === 13) {
    return { supplierName: 'Nhà sản xuất nông sản / thực phẩm đạt chuẩn GS1 Việt Nam', verified: true };
  }

  return { supplierName: 'Nhà cung cấp nông sản địa phương', verified: false };
}

/**
 * BR07: Evaluate ingredient traceability status
 * - Method 'gtin': requires both gtin and lotNumber
 * - Method 'internal': requires internalCode
 * - Empty or missing required fields: returns 'chua_truy_xuat'
 */
export function evaluateIngredientTraceability(ingredient: Partial<FoodIngredient>): TraceabilityStatus {
  if (!ingredient) return 'chua_truy_xuat';

  if (ingredient.traceabilityMethod === 'gtin') {
    const hasGtin = Boolean(ingredient.gtin && ingredient.gtin.trim().length >= 8);
    const hasLot = Boolean(ingredient.lotNumber && ingredient.lotNumber.trim().length > 0);
    return hasGtin && hasLot ? 'dat_chuan' : 'chua_truy_xuat';
  }

  if (ingredient.traceabilityMethod === 'internal') {
    const hasInternal = Boolean(ingredient.internalCode && ingredient.internalCode.trim().length > 0);
    return hasInternal ? 'dat_chuan' : 'chua_truy_xuat';
  }

  return 'chua_truy_xuat';
}

/**
 * BR01: Maximum planning horizon of 8 weeks in advance from current week
 */
export function isWeekWithin8Weeks(targetDate: Date, currentDate: Date = new Date()): boolean {
  const current = new Date(currentDate);
  current.setHours(0, 0, 0, 0);

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  // Maximum allowed diff is 8 weeks = 8 * 7 = 56 days
  const diffDays = Math.ceil((target.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
  
  // Past dates or dates up to 56 days ahead are permissible; beyond 56 days violates horizon
  return diffDays <= 56;
}

/**
 * BR02: Resolve class menu for a given week with school-wide fallback
 * If a class has no bespoke menu, it automatically falls back to the school-wide ('all') menu.
 */
export function resolveClassMenuForWeek(
  classId: string,
  weekNumber: number,
  year: number,
  menus: WeeklyMenu[]
): WeeklyMenu | null {
  // First, search for a bespoke class menu
  const classMenu = menus.find(
    (m) => m.scope === 'class' && m.classId === classId && m.weekNumber === weekNumber && m.year === year
  );
  if (classMenu) {
    return classMenu;
  }

  // Second, fall back to school-wide menu
  const schoolWideMenu = menus.find(
    (m) => m.scope === 'all' && m.weekNumber === weekNumber && m.year === year
  );
  return schoolWideMenu || null;
}

/**
 * BR05: Asymmetric action toolbar check
 * Only grid-based menus can be cloned. File-based menus cannot be cloned.
 */
export function canCloneMenu(menu: WeeklyMenu): boolean {
  return menu.contentType === 'grid';
}

/**
 * Calculate ISO Week number and year
 */
export function getWeekNumber(d: Date = new Date()): { weekNumber: number; year: number } {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = target.getTime();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);
  return { weekNumber, year: target.getUTCFullYear() };
}

/**
 * Get Monday and Saturday dates for a given week number and year
 */
export function getWeekDates(weekNumber: number, year: number): { startDate: string; endDate: string } {
  const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }

  const mon = new Date(ISOweekStart);
  const sat = new Date(ISOweekStart);
  sat.setDate(sat.getDate() + 5);

  const format = (dt: Date) => dt.toISOString().split('T')[0];
  return { startDate: format(mon), endDate: format(sat) };
}

/**
 * Format date range in Vietnamese format: DD/MM/YYYY - DD/MM/YYYY
 */
export function formatMenuDateRange(startDateStr: string, endDateStr: string): string {
  const formatDate = (iso: string) => {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return iso;
  };
  return `${formatDate(startDateStr)} - ${formatDate(endDateStr)}`;
}

/**
 * Calculate food safety traceability counts for a list of dishes
 */
export function getTraceabilitySummary(dishes: DishItem[] = []): {
  totalIngredients: number;
  datChuanCount: number;
  chuaTruyXuatCount: number;
} {
  let totalIngredients = 0;
  let datChuanCount = 0;
  let chuaTruyXuatCount = 0;

  for (const dish of dishes) {
    for (const ing of dish.ingredients || []) {
      totalIngredients += 1;
      if (ing.status === 'dat_chuan') {
        datChuanCount += 1;
      } else {
        chuaTruyXuatCount += 1;
      }
    }
  }

  return { totalIngredients, datChuanCount, chuaTruyXuatCount };
}

export const WEEKDAY_OFFSETS: Record<WeekdayKey, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
};

/**
 * Format specific calendar date for a weekday given the start date of the week (e.g. 12/10/2026)
 */
export function getWeekdayDateLabel(startDateStr?: string, day?: WeekdayKey): string {
  if (!startDateStr || !day) return '';
  try {
    const parts = startDateStr.split('-').map(Number);
    if (parts.length === 3) {
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      const offset = WEEKDAY_OFFSETS[day] ?? 0;
      date.setDate(date.getDate() + offset);
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    }
  } catch (e) {
    // fallback
  }
  return '';
}

export const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  monday: 'Thứ 2',
  tuesday: 'Thứ 3',
  wednesday: 'Thứ 4',
  thursday: 'Thứ 5',
  friday: 'Thứ 6',
  saturday: 'Thứ 7',
};

export const MEAL_LABELS: Record<'breakfast' | 'lunch' | 'snack', string> = {
  breakfast: 'Ăn sáng',
  lunch: 'Ăn trưa',
  snack: 'Ăn xế',
};
