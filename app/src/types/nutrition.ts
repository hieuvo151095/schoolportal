export type MealBehavior = 'tu_an' | 'can_ho_tro' | 'bo_bua';
export type MealAmount = 'an_so_sai' | 'an_nua_suat' | 'an_het_suat';

export interface MealCareItem {
  behavior: MealBehavior;
  amount: MealAmount;
  note: string;
}

export type NapBehavior = 'tu_ngu' | 'gv_ho_tro' | 'khong_ngu';
export type NapDuration = 'ngu_sau' | 'tam_60_phut' | 'tam_30_phut';

export interface NapCare {
  behavior: NapBehavior;
  duration: NapDuration;
  note: string;
}

export type HydrationBehavior = 'chu_dong' | 'gv_goi_y' | 'khong_uong';
export type HydrationAmount = 'thuong_xuyen' | 'thinh_thoang' | 'hiem_khi';

export interface HydrationCare {
  behavior: HydrationBehavior;
  amount: HydrationAmount;
  note: string;
}

export type HygieneActivity = 'rua_tay' | 'thay_quan_ao' | 'lau_don';
export type HygieneGeneralBehavior = 'chu_dong' | 'gv_goi_y' | 'gv_ho_tro';
export type HygienePoopBehavior = 'chu_dong_tu_di' | 'chu_dong_gv_ho_tro' | 'gv_khuyen_khich' | 'khong_di';

export interface HygieneGeneralCare {
  activities: HygieneActivity[];
  behavior: HygieneGeneralBehavior;
  note: string;
}

export interface HygienePoopCare {
  behavior: HygienePoopBehavior;
  note: string;
}

export interface HygieneCare {
  general: HygieneGeneralCare;
  poop: HygienePoopCare;
  note?: string;
}

export interface StudentCareRecord {
  studentId: string;
  studentCode: string;
  fullName: string;
  nickname?: string;
  avatarUrl: string;
  gender: 'male' | 'female';
  parentName: string;
  parentPhone: string;
  classId: string;
  date: string;
  arrivalTime?: string | null;
  attendanceStatus?: 'present' | 'excused_absent' | 'unexcused_absent' | 'unmarked';
  isEvaluated: boolean;
  updatedAt?: string;
  updatedBy?: string;
  meals: {
    breakfast: MealCareItem;
    lunch: MealCareItem;
    snack: MealCareItem;
  };
  sleep: NapCare;
  hydration: HydrationCare;
  hygiene: HygieneCare;
  generalNote: string;
}

export interface NutritionSummary {
  totalStudents: number;
  evaluatedCount: number;
  pendingCount: number;
  ateFullPortionCount: number;
  sleptWellCount: number;
}

export interface BulkCarePayload {
  studentIds: string[];
  meals?: {
    breakfast?: Partial<MealCareItem>;
    lunch?: Partial<MealCareItem>;
    snack?: Partial<MealCareItem>;
  };
  sleep?: Partial<NapCare>;
  hydration?: Partial<HydrationCare>;
  hygiene?: {
    general?: Partial<HygieneGeneralCare>;
    poop?: Partial<HygienePoopCare>;
    note?: string;
  };
  generalNote?: string;
}
