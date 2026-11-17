import type {
  StudentCareRecord,
  NutritionSummary,
  BulkCarePayload,
  MealCareItem,
  NapCare,
  HydrationCare,
  HygieneCare,
} from '../types/nutrition.ts';

export const createDefaultMealCare = (): MealCareItem => ({
  behavior: 'tu_an',
  amount: 'an_het_suat',
  note: '',
});

export const createDefaultSleepCare = (): NapCare => ({
  behavior: 'tu_ngu',
  duration: 'ngu_sau',
  note: '',
});

export const createDefaultHydrationCare = (): HydrationCare => ({
  behavior: 'chu_dong',
  amount: 'thuong_xuyen',
  note: '',
});

export const createDefaultHygieneCare = (): HygieneCare => ({
  general: {
    activities: ['rua_tay', 'thay_quan_ao'],
    behavior: 'chu_dong',
    note: '',
  },
  poop: {
    behavior: 'chu_dong_tu_di',
    note: '',
  },
});

export const createEmptyCareRecord = (
  student: {
    studentId: string;
    studentCode: string;
    fullName: string;
    nickname?: string;
    avatarUrl: string;
    gender: 'male' | 'female';
    parentName: string;
    parentPhone: string;
    classId: string;
  },
  date: string
): StudentCareRecord => ({
  studentId: student.studentId,
  studentCode: student.studentCode,
  fullName: student.fullName,
  nickname: student.nickname,
  avatarUrl: student.avatarUrl,
  gender: student.gender,
  parentName: student.parentName,
  parentPhone: student.parentPhone,
  classId: student.classId,
  date,
  isEvaluated: false,
  meals: {
    breakfast: createDefaultMealCare(),
    lunch: createDefaultMealCare(),
    snack: createDefaultMealCare(),
  },
  sleep: createDefaultSleepCare(),
  hydration: createDefaultHydrationCare(),
  hygiene: createDefaultHygieneCare(),
  generalNote: '',
});

export function calculateNutritionSummary(records: StudentCareRecord[]): NutritionSummary {
  const totalStudents = records.length;
  let evaluatedCount = 0;
  let ateFullPortionCount = 0;
  let sleptWellCount = 0;

  for (const r of records) {
    if (r.isEvaluated) {
      evaluatedCount++;
      if (r.meals.lunch.amount === 'an_het_suat') {
        ateFullPortionCount++;
      }
      if (r.sleep.duration === 'ngu_sau') {
        sleptWellCount++;
      }
    }
  }

  return {
    totalStudents,
    evaluatedCount,
    pendingCount: Math.max(0, totalStudents - evaluatedCount),
    ateFullPortionCount,
    sleptWellCount,
  };
}

export function applyBulkCareToRecords(
  records: StudentCareRecord[],
  payload: BulkCarePayload,
  author: string = 'Giáo viên phụ trách'
): StudentCareRecord[] {
  const now = new Date().toISOString();
  const idSet = new Set(payload.studentIds);

  return records.map((rec) => {
    if (!idSet.has(rec.studentId)) return rec;

    const updated: StudentCareRecord = {
      ...rec,
      isEvaluated: true,
      updatedAt: now,
      updatedBy: author,
      meals: {
        breakfast: {
          ...rec.meals.breakfast,
          ...(payload.meals?.breakfast || {}),
        },
        lunch: {
          ...rec.meals.lunch,
          ...(payload.meals?.lunch || {}),
        },
        snack: {
          ...rec.meals.snack,
          ...(payload.meals?.snack || {}),
        },
      },
      sleep: {
        ...rec.sleep,
        ...(payload.sleep || {}),
      },
      hydration: {
        ...rec.hydration,
        ...(payload.hydration || {}),
      },
      hygiene: {
        general: {
          ...rec.hygiene.general,
          ...(payload.hygiene?.general || {}),
        },
        poop: {
          ...rec.hygiene.poop,
          ...(payload.hygiene?.poop || {}),
        },
      },
      generalNote: payload.generalNote !== undefined ? payload.generalNote : rec.generalNote,
    };

    return updated;
  });
}
