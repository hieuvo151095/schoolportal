import React, { useState, useEffect } from 'react';
import { SlideOver, Button, StatusTag, Icon } from '@/components/ds';
import type {
  StudentCareRecord,
  BulkCarePayload,
  MealBehavior,
  MealAmount,
  NapBehavior,
  NapDuration,
  HydrationBehavior,
  HydrationAmount,
  HygieneActivity,
  HygieneGeneralBehavior,
  HygienePoopBehavior,
} from '@/types/nutrition';
import {
  createDefaultMealCare,
  createDefaultSleepCare,
  createDefaultHydrationCare,
  createDefaultHygieneCare,
} from '@/utils/nutritionValidation';

interface CareSlideOverProps {
  open: boolean;
  onClose: () => void;
  isBulkMode: boolean;
  activeStudent: StudentCareRecord | null;
  selectedStudents: StudentCareRecord[];
  onRemoveStudentFromBulk?: (studentId: string) => void;
  onSaveSingle: (record: StudentCareRecord) => void;
  onSaveBulk: (payload: BulkCarePayload) => void;
}

const MEAL_QUICK_NOTES = [
  'Tự xúc ăn hết suất cơm trưa',
  'Ăn ngoan, biết mời cô và các bạn',
  'Cần cô động viên và xúc thêm',
  'Ăn chậm, chưa ăn hết phần rau',
  'Hôm nay kén ăn, ăn được nửa suất',
];

const SLEEP_QUICK_NOTES = [
  'Ngủ ngoan, ngủ say suốt giấc',
  'Dễ ngủ, tự giác vào chỗ nằm',
  'Khó ngủ, trằn trọc khoảng 30 phút',
  'Thỉnh thoảng giật mình thức giấc',
  'Dậy đúng giờ, tỉnh táo vui vẻ',
];

const HYDRATION_QUICK_NOTES = [
  'Chủ động uống nước',
  'Uống đủ nước sau khi vận động',
  'Cần cô nhắc nhở uống thêm nước',
  'Uống ít nước, thích uống từng ngụm nhỏ',
];

const HYGIENE_QUICK_NOTES = [
  'Biết tự gọi cô khi muốn đi vệ sinh',
  'Tự giác rửa tay sạch bằng xà phòng',
  'Đại tiện bình thường, phân khuôn',
  'Có đi tiêu lỏng 1 lần, đã theo dõi',
  'Cần cô hỗ trợ lau chùi và thay đồ',
];

export default function CareSlideOver({
  open,
  onClose,
  isBulkMode,
  activeStudent,
  selectedStudents,
  onRemoveStudentFromBulk,
  onSaveSingle,
  onSaveBulk,
}: CareSlideOverProps) {
  // Meal Tab State: 'breakfast' | 'lunch' | 'snack'
  const [mealTab, setMealTab] = useState<'breakfast' | 'lunch' | 'snack'>('lunch');

  // Form states
  const [meals, setMeals] = useState({
    breakfast: createDefaultMealCare(),
    lunch: createDefaultMealCare(),
    snack: createDefaultMealCare(),
  });

  const [sleep, setSleep] = useState(createDefaultSleepCare());
  const [hydration, setHydration] = useState(createDefaultHydrationCare());
  const [hygiene, setHygiene] = useState(createDefaultHygieneCare());
  const [generalNote, setGeneralNote] = useState('');

  // Synchronize state when opening single or bulk
  useEffect(() => {
    if (!open) return;

    if (!isBulkMode && activeStudent) {
      setMeals({
        breakfast: { ...activeStudent.meals.breakfast },
        lunch: { ...activeStudent.meals.lunch },
        snack: { ...activeStudent.meals.snack },
      });
      setSleep({ ...activeStudent.sleep });
      setHydration({ ...activeStudent.hydration });
      setHygiene({
        general: {
          activities: [...activeStudent.hygiene.general.activities],
          behavior: activeStudent.hygiene.general.behavior,
          note: activeStudent.hygiene.general.note,
        },
        poop: { ...activeStudent.hygiene.poop },
        note: activeStudent.hygiene.note || activeStudent.hygiene.general.note || '',
      });
      setGeneralNote(activeStudent.generalNote || '');
    } else {
      // Bulk default
      setMeals({
        breakfast: createDefaultMealCare(),
        lunch: createDefaultMealCare(),
        snack: createDefaultMealCare(),
      });
      setSleep(createDefaultSleepCare());
      setHydration(createDefaultHydrationCare());
      setHygiene(createDefaultHygieneCare());
      setGeneralNote('');
    }
  }, [open, isBulkMode, activeStudent]);

  // Apply Standard Preset
  const handleApplyPreset = () => {
    setMeals({
      breakfast: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết phần ăn sáng' },
      lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Tự xúc ăn hết suất cơm trưa' },
      snack: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết bữa xế dinh dưỡng' },
    });
    setSleep({ behavior: 'tu_ngu', duration: 'ngu_sau', note: 'Ngủ sâu giấc, ngon giấc' });
    setHydration({ behavior: 'chu_dong', amount: 'thuong_xuyen', note: 'Chủ động uống nước' });
    setHygiene({
      general: { activities: ['rua_tay', 'thay_quan_ao'], behavior: 'chu_dong', note: 'Tự rửa tay sạch trước sau ăn' },
      poop: { behavior: 'chu_dong_tu_di', note: 'Đã đi tiêu tốt trong ngày' },
      note: 'Biết tự gọi cô khi muốn đi vệ sinh, rửa tay sạch bằng xà phòng',
    });
  };

  const handleAppendNote = (
    current: string,
    phrase: string,
    setter: (val: string) => void
  ) => {
    if (!current || !current.trim()) {
      setter(phrase);
    } else if (current.includes(phrase)) {
      // already included
    } else {
      setter(`${current.trim()} - ${phrase}`);
    }
  };

  const renderQuickChips = (
    suggestions: string[],
    currentValue: string,
    onSelect: (phrase: string) => void
  ) => (
    <div className="pt-2">
      <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 font-medium mb-1.5">
        <Icon name="bolt" size={12} className="text-amber-500 shrink-0" />
        <span>Gợi ý nhận xét nhanh:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((phrase) => {
          const isSelected = currentValue.includes(phrase);
          return (
            <button
              key={phrase}
              type="button"
              onClick={() => onSelect(phrase)}
              className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full border transition-all text-left cursor-pointer ${
                isSelected
                  ? 'bg-teal-50 border-teal-300 text-teal-800 font-medium shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-teal-50/70 hover:border-teal-200 hover:text-teal-900'
              }`}
            >
              <span>{phrase}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const handleToggleActivity = (act: HygieneActivity) => {
    const current = hygiene.general.activities;
    const next = current.includes(act)
      ? current.filter((a) => a !== act)
      : [...current, act];
    setHygiene({
      ...hygiene,
      general: { ...hygiene.general, activities: next },
    });
  };

  const handleSave = () => {
    if (isBulkMode) {
      const payload: BulkCarePayload = {
        studentIds: selectedStudents.map((s) => s.studentId),
        meals,
        sleep,
        hydration,
        hygiene,
        generalNote,
      };
      onSaveBulk(payload);
    } else if (activeStudent) {
      const updated: StudentCareRecord = {
        ...activeStudent,
        isEvaluated: true,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Giáo viên phụ trách',
        meals,
        sleep,
        hydration,
        hygiene,
        generalNote,
      };
      onSaveSingle(updated);
    }
  };

  const currentMeal = meals[mealTab];

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      width={640}
      title={
        isBulkMode ? (
          <div className="flex items-center gap-2">
            <span className="text-teal-700">Chăm sóc hàng loạt</span>
            <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
              {selectedStudents.length} trẻ đã chọn
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Đánh giá chăm sóc hàng ngày</span>
          </div>
        )
      }
      description={
        isBulkMode
          ? 'Thiết lập chỉ số ăn uống, giấc ngủ, vệ sinh và gửi cập nhật đồng loạt cho các trẻ đang chọn.'
          : 'Ghi nhận bữa ăn, giấc ngủ, uống nước và vệ sinh cá nhân của học sinh trong ngày.'
      }
      primaryAction={{
        label: isBulkMode ? `Lưu cho ${selectedStudents.length} trẻ` : 'Lưu đánh giá',
        onClick: handleSave,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-6 pb-6">
        {/* Bulk Student Chips Banner */}
        {isBulkMode && (
          <div className="bg-teal-50 border border-teal-200 rounded-[var(--radius-8)] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-teal-900 uppercase tracking-wide">
                Học sinh đang được chọn ({selectedStudents.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {selectedStudents.map((s) => (
                <div
                  key={s.studentId}
                  className="inline-flex items-center gap-1.5 bg-white border border-teal-200 text-teal-900 text-xs px-2.5 py-1 rounded-full shadow-2xs"
                >
                  <span className="font-medium">{s.fullName}</span>
                  {s.nickname && <span className="text-teal-600">({s.nickname})</span>}
                  {onRemoveStudentFromBulk && (
                    <button
                      type="button"
                      onClick={() => onRemoveStudentFromBulk(s.studentId)}
                      className="text-slate-400 hover:text-red-500 font-bold ml-0.5"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Single Student Header Profile */}
        {!isBulkMode && activeStudent && (
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-[var(--border-default)] rounded-[var(--radius-8)]">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border border-slate-200 shrink-0">
                {activeStudent.avatarUrl ? (
                  <img
                    src={activeStudent.avatarUrl}
                    alt={activeStudent.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-base">
                    {activeStudent.fullName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-base text-[var(--text-heading)] flex items-center gap-2">
                  <span>{activeStudent.fullName}</span>
                  {activeStudent.nickname && (
                    <span className="text-xs font-normal text-slate-500">
                      ({activeStudent.nickname})
                    </span>
                  )}
                </h4>
                <div className="text-xs text-[var(--text-subtle)] flex items-center gap-2 mt-0.5">
                  <span className="font-mono">{activeStudent.studentCode}</span>
                  <span>•</span>
                  <span>PH: {activeStudent.parentName} ({activeStudent.parentPhone})</span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleApplyPreset}
                className="text-xs font-medium text-teal-600 hover:text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1.5 rounded-[var(--radius-8)] transition-colors"
              >
                ⚡ Áp dụng mẫu chuẩn
              </button>
            </div>
          </div>
        )}

        {/* SECTION 1: BỮA ĂN (MEALS) */}
        <section className="bg-white border border-[var(--border-default)] rounded-[var(--radius-8)] overflow-hidden shadow-2xs">
          <div className="p-3.5 bg-slate-50 border-b border-[var(--border-default)] flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text-heading)]">
              <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>1. Bữa ăn trong ngày</span>
            </div>

            {/* Meal Sub Tabs */}
            <div className="inline-flex p-0.5 bg-slate-200 rounded-[var(--radius-8)] text-xs">
              <button
                type="button"
                onClick={() => setMealTab('breakfast')}
                className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors ${
                  mealTab === 'breakfast'
                    ? 'bg-white text-teal-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ăn sáng
              </button>
              <button
                type="button"
                onClick={() => setMealTab('lunch')}
                className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors ${
                  mealTab === 'lunch'
                    ? 'bg-white text-teal-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ăn trưa
              </button>
              <button
                type="button"
                onClick={() => setMealTab('snack')}
                className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors ${
                  mealTab === 'snack'
                    ? 'bg-white text-teal-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ăn xế (Lỡ)
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Meal Behavior */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Hành vi ăn uống
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'tu_an', label: 'Tự ăn' },
                  { value: 'can_ho_tro', label: 'Cần GV hỗ trợ' },
                  { value: 'bo_bua', label: 'Bỏ bữa' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setMeals({
                        ...meals,
                        [mealTab]: { ...currentMeal, behavior: opt.value as MealBehavior },
                      })
                    }
                    className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-8)] border text-center transition-all ${
                      currentMeal.behavior === opt.value
                        ? 'border-teal-500 bg-teal-50 text-teal-800 font-semibold ring-1 ring-teal-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Amount */}
            {currentMeal.behavior !== 'bo_bua' && (
              <div>
                <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Định lượng thức ăn
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'an_so_sai', label: 'Ăn sơ sài' },
                    { value: 'an_nua_suat', label: 'Ăn nửa suất' },
                    { value: 'an_het_suat', label: 'Ăn hết suất' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setMeals({
                          ...meals,
                          [mealTab]: { ...currentMeal, amount: opt.value as MealAmount },
                        })
                      }
                      className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-8)] border text-center transition-all ${
                        currentMeal.amount === opt.value
                          ? 'border-teal-500 bg-teal-50 text-teal-800 font-semibold ring-1 ring-teal-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Meal Note */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Nhận xét bữa ăn
              </span>
              <textarea
                value={currentMeal.note}
                onChange={(e) =>
                  setMeals({
                    ...meals,
                    [mealTab]: { ...currentMeal, note: e.target.value },
                  })
                }
                rows={2}
                placeholder="Nhập ghi chú chi tiết món ăn hoặc biểu hiện ăn uống của trẻ..."
                className="w-full p-2.5 text-[13px] border border-[var(--border-default)] rounded-[var(--radius-8)] focus:outline-none focus:border-teal-600 transition-colors"
              />
              {renderQuickChips(
                MEAL_QUICK_NOTES,
                currentMeal.note,
                (phrase) =>
                  handleAppendNote(currentMeal.note, phrase, (val) =>
                    setMeals({
                      ...meals,
                      [mealTab]: { ...currentMeal, note: val },
                    })
                  )
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: GIẤC NGỦ (SLEEP / NAP) */}
        <section className="bg-white border border-[var(--border-default)] rounded-[var(--radius-8)] overflow-hidden shadow-2xs">
          <div className="p-3.5 bg-slate-50 border-b border-[var(--border-default)] flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text-heading)]">
              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span>2. Giấc ngủ trưa</span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Sleep Behavior */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Hành vi ngủ
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'tu_ngu', label: 'Tự ngủ' },
                  { value: 'gv_ho_tro', label: 'GV hỗ trợ' },
                  { value: 'khong_ngu', label: 'Không ngủ' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSleep({ ...sleep, behavior: opt.value as NapBehavior })}
                    className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-8)] border text-center transition-all ${
                      sleep.behavior === opt.value
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Duration */}
            {sleep.behavior !== 'khong_ngu' && (
              <div>
                <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Thời lượng & Chất lượng
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'ngu_sau', label: 'Ngủ sâu' },
                    { value: 'tam_60_phut', label: 'Ngủ ~60 phút' },
                    { value: 'tam_30_phut', label: 'Ngủ ~30 phút' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSleep({ ...sleep, duration: opt.value as NapDuration })}
                      className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-8)] border text-center transition-all ${
                        sleep.duration === opt.value
                          ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sleep Note */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Nhận xét giấc ngủ
              </span>
              <textarea
                value={sleep.note}
                onChange={(e) => setSleep({ ...sleep, note: e.target.value })}
                rows={2}
                placeholder="Ghi nhận giờ ngủ, dậy hoặc biểu hiện giật mình, khó ngủ..."
                className="w-full p-2.5 text-[13px] border border-[var(--border-default)] rounded-[var(--radius-8)] focus:outline-none focus:border-amber-600 transition-colors"
              />
              {renderQuickChips(
                SLEEP_QUICK_NOTES,
                sleep.note,
                (phrase) =>
                  handleAppendNote(sleep.note, phrase, (val) =>
                    setSleep({ ...sleep, note: val })
                  )
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: UỐNG NƯỚC (HYDRATION) */}
        <section className="bg-white border border-[var(--border-default)] rounded-[var(--radius-8)] overflow-hidden shadow-2xs">
          <div className="p-3.5 bg-slate-50 border-b border-[var(--border-default)] flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text-heading)]">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>3. Uống nước trong ngày</span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Hydration Behavior (Row 1) */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Hành vi uống nước
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'chu_dong', label: 'Chủ động' },
                  { value: 'gv_goi_y', label: 'GV gợi ý' },
                  { value: 'khong_uong', label: 'Không uống' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setHydration({ ...hydration, behavior: opt.value as HydrationBehavior })}
                    className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-8)] border text-center transition-all ${
                      hydration.behavior === opt.value
                        ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hydration Amount (Row 2) */}
            {hydration.behavior !== 'khong_uong' && (
              <div>
                <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Định lượng uống nước
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'thuong_xuyen', label: 'Thường xuyên' },
                    { value: 'thinh_thoang', label: 'Thỉnh thoảng' },
                    { value: 'hiem_khi', label: 'Hiếm khi' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setHydration({ ...hydration, amount: opt.value as HydrationAmount })}
                      className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-8)] border text-center transition-all ${
                        hydration.amount === opt.value
                          ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hydration Note */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Nhận xét uống nước
              </span>
              <textarea
                value={hydration.note}
                onChange={(e) => setHydration({ ...hydration, note: e.target.value })}
                rows={2}
                placeholder="Ghi chú lượng nước uống hoặc nhu cầu thêm nước của trẻ..."
                className="w-full p-2.5 text-[13px] border border-[var(--border-default)] rounded-[var(--radius-8)] focus:outline-none focus:border-blue-600 transition-colors"
              />
              {renderQuickChips(
                HYDRATION_QUICK_NOTES,
                hydration.note,
                (phrase) =>
                  handleAppendNote(hydration.note, phrase, (val) =>
                    setHydration({ ...hydration, note: val })
                  )
              )}
            </div>
          </div>
        </section>

        {/* SECTION 4: VỆ SINH (HYGIENE & POOP) */}
        <section className="bg-white border border-[var(--border-default)] rounded-[var(--radius-8)] overflow-hidden shadow-2xs">
          <div className="p-3.5 bg-slate-50 border-b border-[var(--border-default)] flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text-heading)]">
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>4. Vệ sinh cá nhân & Đại tiện</span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Vệ sinh chung */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Hoạt động vệ sinh chung
              </span>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { value: 'rua_tay', label: 'Rửa tay' },
                  { value: 'thay_quan_ao', label: 'Thay quần áo' },
                  { value: 'lau_don', label: 'Lau dọn' },
                ].map((act) => {
                  const checked = hygiene.general.activities.includes(act.value as HygieneActivity);
                  return (
                    <button
                      key={act.value}
                      type="button"
                      onClick={() => handleToggleActivity(act.value as HygieneActivity)}
                      className={`py-1.5 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                        checked
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${checked ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                      <span>{act.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'chu_dong', label: 'Chủ động' },
                  { value: 'gv_goi_y', label: 'GV gợi ý' },
                  { value: 'gv_ho_tro', label: 'GV hỗ trợ' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setHygiene({
                        ...hygiene,
                        general: { ...hygiene.general, behavior: opt.value as HygieneGeneralBehavior },
                      })
                    }
                    className={`py-2 px-2 text-xs font-medium rounded-[var(--radius-8)] border text-center transition-all ${
                      hygiene.general.behavior === opt.value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Đại tiện */}
            <div className="pt-2 border-t border-slate-100">
              <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Đại tiện tại trường
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'chu_dong_tu_di', label: 'Chủ động & Tự đi' },
                  { value: 'chu_dong_gv_ho_tro', label: 'Chủ động & GV hỗ trợ' },
                  { value: 'gv_khuyen_khich', label: 'GV khuyến khích' },
                  { value: 'khong_di', label: 'Không đi' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setHygiene({
                        ...hygiene,
                        poop: { ...hygiene.poop, behavior: opt.value as HygienePoopBehavior },
                      })
                    }
                    className={`py-2 px-2 text-xs font-medium rounded-[var(--radius-8)] border text-center transition-all ${
                      hygiene.poop.behavior === opt.value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hygiene Note */}
            <div className="pt-2 border-t border-slate-100">
              <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Nhận xét vệ sinh &amp; đại tiện
              </span>
              <textarea
                value={hygiene.note || ''}
                onChange={(e) => setHygiene({ ...hygiene, note: e.target.value })}
                rows={2}
                placeholder="Ghi chú thêm về nề nếp vệ sinh hoặc tình trạng tiêu hóa của trẻ..."
                className="w-full p-2.5 text-[13px] border border-[var(--border-default)] rounded-[var(--radius-8)] focus:outline-none focus:border-emerald-600 transition-colors"
              />
              {renderQuickChips(
                HYGIENE_QUICK_NOTES,
                hygiene.note || '',
                (phrase) =>
                  handleAppendNote(hygiene.note || '', phrase, (val) =>
                    setHygiene({ ...hygiene, note: val })
                  )
              )}
            </div>
          </div>
        </section>

        {/* SECTION 5: GHI CHÚ CHUNG GỬI PHỤ HUYNH */}
        <section className="bg-white border border-[var(--border-default)] rounded-[var(--radius-8)] p-4 shadow-2xs space-y-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Lời dặn / Ghi chú chung gửi phụ huynh
          </label>
          <textarea
            value={generalNote}
            onChange={(e) => setGeneralNote(e.target.value)}
            rows={3}
            placeholder="Nhập nhận xét tổng quan trong ngày, tâm trạng của trẻ hoặc dặn dò phụ huynh..."
            className="w-full p-2.5 text-[13px] border border-[var(--border-default)] rounded-[var(--radius-8)] focus:outline-none focus:border-teal-600 transition-colors"
          />
        </section>
      </div>
    </SlideOver>
  );
}
