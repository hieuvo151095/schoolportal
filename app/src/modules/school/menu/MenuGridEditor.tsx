import React, { useState } from 'react';
import { Icon } from '../../../components/ds';
import {
  DayMealSchedule,
  WeekdayKey,
  MealType,
  DishItem,
  FoodIngredient,
} from '../../../types/menu';
import {
  WEEKDAY_LABELS,
  MEAL_LABELS,
  getWeekdayDateLabel,
} from '../../../utils/menuValidation';
import { FoodIngredientModal } from './FoodIngredientModal';
import { FoodIngredientViewModal } from './FoodIngredientViewModal';
import { MealSessionTickXanhModal } from './MealSessionTickXanhModal';

interface MenuGridEditorProps {
  schedule: Record<WeekdayKey, DayMealSchedule>;
  onScheduleChange: (newSchedule: Record<WeekdayKey, DayMealSchedule>) => void;
  readOnly?: boolean;
  startDate?: string;
  onSaveMealTickXanh?: (
    day: WeekdayKey,
    meal: MealType,
    url: string,
    verified: boolean
  ) => void;
}

export const MenuGridEditor: React.FC<MenuGridEditorProps> = ({
  schedule,
  onScheduleChange,
  readOnly = false,
  startDate,
  onSaveMealTickXanh,
}) => {
  const weekdays: WeekdayKey[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const mealTypes: MealType[] = ['breakfast', 'lunch', 'snack'];

  // Modals state for ingredient declaration / view
  const [activeIngredientModal, setActiveIngredientModal] = useState<{
    day: WeekdayKey;
    meal: MealType;
    dish: DishItem;
  } | null>(null);

  const [activeViewModal, setActiveViewModal] = useState<DishItem | null>(null);

  // Modal state for Meal Session Tick Xanh
  const [activeTickXanhModal, setActiveTickXanhModal] = useState<{
    day: WeekdayKey;
    meal: MealType;
    initialApplyToAll?: boolean;
  } | null>(null);

  // Adding new dish quick inputs
  const [quickDishName, setQuickDishName] = useState<{
    day: WeekdayKey;
    meal: MealType;
    name: string;
  } | null>(null);

  const handleAddDish = (day: WeekdayKey, meal: MealType) => {
    if (!quickDishName || !quickDishName.name.trim()) return;

    const newDish: DishItem = {
      id: `dish-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: quickDishName.name.trim(),
      calories: meal === 'snack' ? 120 : meal === 'breakfast' ? 350 : 450,
      ingredients: [],
    };

    const updated = JSON.parse(JSON.stringify(schedule || {}));
    if (!updated[day]) updated[day] = { breakfast: [], lunch: [], snack: [] };
    if (!updated[day][meal]) updated[day][meal] = [];
    updated[day][meal].push(newDish);

    onScheduleChange(updated);
    setQuickDishName(null);
  };

  const handleRemoveDish = (day: WeekdayKey, meal: MealType, dishId: string) => {
    const updated = JSON.parse(JSON.stringify(schedule || {}));
    if (updated[day] && updated[day][meal]) {
      updated[day][meal] = updated[day][meal].filter((d: DishItem) => d.id !== dishId);
      onScheduleChange(updated);
    }
  };

  const handleSaveIngredients = (
    day: WeekdayKey,
    meal: MealType,
    dishId: string,
    ingredients: FoodIngredient[],
    tickXanhUrl?: string,
    tickXanhVerified?: boolean
  ) => {
    const updated = JSON.parse(JSON.stringify(schedule || {}));
    if (updated[day] && updated[day][meal]) {
      const dish = updated[day][meal].find((d: DishItem) => d.id === dishId);
      if (dish) {
        dish.ingredients = ingredients;
        if (tickXanhUrl !== undefined) dish.tickXanhUrl = tickXanhUrl;
        if (tickXanhVerified !== undefined) dish.tickXanhVerified = tickXanhVerified;
        onScheduleChange(updated);
      }
    }
  };

  const handleSaveTickXanh = (url: string, verified: boolean, applyToAllDay?: boolean) => {
    if (!activeTickXanhModal) return;
    const { day, meal } = activeTickXanhModal;
    const updated = JSON.parse(JSON.stringify(schedule || {}));
    if (!updated[day]) updated[day] = { breakfast: [], lunch: [], snack: [] };
    if (!updated[day].tickXanh) updated[day].tickXanh = {};

    if (applyToAllDay) {
      mealTypes.forEach((m) => {
        updated[day].tickXanh[m] = {
          url: url || undefined,
          verified: verified,
        };
        if (onSaveMealTickXanh) {
          onSaveMealTickXanh(day, m, url, verified);
        }
      });
    } else {
      updated[day].tickXanh[meal] = {
        url: url || undefined,
        verified: verified,
      };
      if (onSaveMealTickXanh) {
        onSaveMealTickXanh(day, meal, url, verified);
      }
    }

    onScheduleChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Grid Table Container */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200/90 shadow-sm">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-sky-50/40 border-b border-gray-200 text-gray-700">
              <th className="p-3.5 text-center font-bold uppercase tracking-wider w-28 border-r border-gray-200">
                Bữa ăn
              </th>
              {weekdays.map((day) => {
                const dateLabel = getWeekdayDateLabel(startDate, day);
                const daySchedule = schedule?.[day];
                const dayTickCount = mealTypes.filter(
                  (m) => Boolean(daySchedule?.tickXanh?.[m]?.url && daySchedule.tickXanh[m].url.trim().length > 0)
                ).length;

                return (
                  <th
                    key={day}
                    className="p-3 text-center font-bold tracking-wider min-w-[200px] border-r border-gray-200 last:border-r-0"
                  >
                    <div className="text-xs font-semibold text-gray-800">{WEEKDAY_LABELS[day]}</div>
                    {dateLabel && (
                      <div className="text-[11px] font-normal text-gray-500 mt-0.5">({dateLabel})</div>
                    )}
                    <div className="mt-1.5 flex justify-center">
                      {dayTickCount === 3 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                          <Icon name="circle-check" className="w-2.5 h-2.5 text-emerald-600" />
                          Tick Xanh (3/3)
                        </span>
                      ) : !readOnly ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveTickXanhModal({
                              day,
                              meal: 'breakfast',
                              initialApplyToAll: true,
                            })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-dashed border-emerald-400 transition-all cursor-pointer shadow-2xs group"
                          title="Bấm để khai báo hoặc gán nhanh link Tick Xanh cho tất cả bữa ăn trong ngày"
                        >
                          <Icon
                            name="plus"
                            className="w-2.5 h-2.5 text-emerald-600 group-hover:scale-125 transition-transform"
                          />
                          <span>Gán Tick Xanh ({dayTickCount}/3)</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-normal text-gray-400 bg-gray-50 border border-gray-200">
                          Tick Xanh ({dayTickCount}/3)
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mealTypes.map((meal) => (
              <tr key={meal} className="divide-x divide-gray-200">
                {/* Row Header: Meal Type */}
                <td className="p-3.5 bg-gray-50/50 font-semibold text-gray-800 text-center align-top">
                  <div className="w-8 h-8 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                    <Icon name="utensils" className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-amber-600 font-semibold text-xs">{MEAL_LABELS[meal]}</div>
                </td>

                {/* Weekday Cells */}
                {weekdays.map((day) => {
                  const daySchedule = schedule?.[day] || { breakfast: [], lunch: [], snack: [] };
                  const dishes = daySchedule[meal] || [];
                  const tickXanhInfo = daySchedule.tickXanh?.[meal];
                  const hasTickXanh = Boolean(tickXanhInfo?.url && tickXanhInfo.url.trim().length > 0);

                  return (
                    <td
                      key={day}
                      className="p-2.5 align-top bg-white hover:bg-sky-50/10 transition-colors h-full"
                      style={{ height: '1px' }}
                    >
                      <div className="flex flex-col justify-between h-full space-y-2" style={{ minHeight: '180px' }}>
                        {/* Dishes list */}
                        <div className="space-y-2 flex-1">
                          {dishes.length === 0 ? (
                            <div className="text-center py-4 text-gray-300 italic text-[11px]">
                              Chưa có món ăn
                            </div>
                          ) : (
                            dishes.map((dish) => {
                              const ingCount = dish.ingredients ? dish.ingredients.length : 0;
                              const datChuanCount = (dish.ingredients || []).filter(
                                (i) => i.status === 'dat_chuan'
                              ).length;
                              const isAllDatChuan = ingCount > 0 && datChuanCount === ingCount;

                              return (
                                <div
                                  key={dish.id}
                                  className="p-2 rounded-xl border border-gray-200 bg-white hover:border-blue-300 transition-all space-y-1.5 shadow-2xs group"
                                >
                                  <div className="flex items-start justify-between gap-1.5">
                                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                      <span className="font-semibold text-gray-900 text-xs leading-snug truncate">
                                        {dish.name}
                                      </span>
                                      <span className="text-gray-400">
                                        <Icon name="utensils" className="w-2.5 h-2.5" />
                                      </span>
                                    </div>
                                    {!readOnly && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveDish(day, meal, dish.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-0.5"
                                        title="Xóa món ăn này"
                                      >
                                        <Icon name="trash" className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>

                                  {dish.calories && (
                                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                      <Icon name="fire" className="w-2.5 h-2.5 text-amber-500" />
                                      <span>{dish.calories} kcal</span>
                                    </div>
                                  )}

                                  {/* Ingredient Traceability Tag */}
                                  <div className="flex items-center justify-between pt-0.5">
                                    {ingCount === 0 ? (
                                      <div className="flex items-center justify-between w-full">
                                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                                          <Icon name="circle-info" className="w-2.5 h-2.5" />
                                          Chưa nhập
                                        </span>
                                        {!readOnly && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setActiveIngredientModal({ day, meal, dish })
                                            }
                                            className="text-xs text-blue-600 hover:text-blue-800 p-0.5 font-medium flex items-center gap-0.5"
                                            title="Khai báo nguyên liệu"
                                          >
                                            <Icon name="plus" className="w-2.5 h-2.5" />
                                            <span className="text-[10px]">Thêm</span>
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between w-full">
                                        {/* Badge "N thực phẩm" */}
                                        <button
                                          type="button"
                                          onClick={() => setActiveViewModal(dish)}
                                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium cursor-pointer hover:opacity-90 ${
                                            isAllDatChuan
                                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                                          }`}
                                        >
                                          <Icon name="leaf" className="w-2.5 h-2.5" />
                                          {ingCount} thực phẩm
                                        </button>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-1">
                                          <button
                                            type="button"
                                            onClick={() => setActiveViewModal(dish)}
                                            className="text-gray-400 hover:text-blue-600 p-0.5"
                                            title="Xem chi tiết nguyên liệu"
                                          >
                                            <Icon name="eye" className="w-3 h-3" />
                                          </button>
                                          {!readOnly && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setActiveIngredientModal({ day, meal, dish })
                                              }
                                              className="text-gray-400 hover:text-emerald-600 p-0.5"
                                              title="Chỉnh sửa nguyên liệu"
                                            >
                                              <Icon name="pencil" className="w-3 h-3" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}

                          {/* Inline Quick Add Dish (only if not read-only) */}
                          {!readOnly && (
                            <div className="pt-1">
                              {quickDishName &&
                              quickDishName.day === day &&
                              quickDishName.meal === meal ? (
                                <div className="space-y-1.5 p-2 bg-blue-50/50 rounded-xl border border-blue-200">
                                  <input
                                    type="text"
                                    placeholder="Nhập tên món ăn..."
                                    value={quickDishName.name}
                                    onChange={(e) =>
                                      setQuickDishName({ ...quickDishName, name: e.target.value })
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleAddDish(day, meal);
                                      if (e.key === 'Escape') setQuickDishName(null);
                                    }}
                                    autoFocus
                                    className="w-full px-2 py-1 text-xs bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setQuickDishName(null)}
                                      className="px-2 py-0.5 text-[10px] text-gray-500 hover:bg-gray-100 rounded"
                                    >
                                      Hủy
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleAddDish(day, meal)}
                                      className="px-2 py-0.5 text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded"
                                    >
                                      Thêm
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setQuickDishName({ day, meal, name: '' })
                                  }
                                  className="w-full py-1 border border-dashed border-gray-200 hover:border-blue-400 text-gray-400 hover:text-blue-600 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 transition-all"
                                >
                                  <Icon name="plus" className="w-2.5 h-2.5" />
                                  Thêm món
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* AT BOTTOM OF CELL: Meal Session Tick Xanh Button */}
                        <div className="pt-2 border-t border-gray-100">
                          {hasTickXanh ? (
                            <button
                              type="button"
                              onClick={() => setActiveTickXanhModal({ day, meal })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100/90 hover:border-emerald-400 flex items-center justify-between text-[11px] font-medium transition-all shadow-2xs group cursor-pointer"
                              title="Buổi ăn đã có liên kết Tick Xanh - Bấm để xem hoặc cập nhật"
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse"></span>
                                <span className="truncate font-semibold text-emerald-900">
                                  Đã có tick xanh
                                </span>
                              </span>
                              <div className="flex items-center gap-1 text-emerald-600">
                                <Icon
                                  name="circle-check"
                                  className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0"
                                />
                                {!readOnly && (
                                  <span className="text-[10px] text-emerald-700 ml-1 underline opacity-0 group-hover:opacity-100 transition-opacity">
                                    Sửa
                                  </span>
                                )}
                              </div>
                            </button>
                          ) : !readOnly ? (
                            <button
                              type="button"
                              onClick={() => setActiveTickXanhModal({ day, meal })}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-dashed border-emerald-500/80 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-600 hover:text-emerald-900 flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-all shadow-2xs group cursor-pointer"
                              title="Chưa có link Tick Xanh cho buổi ăn này - Bấm để thêm mới"
                            >
                              <Icon
                                name="plus"
                                className="w-2.5 h-2.5 text-emerald-600 group-hover:scale-125 transition-transform"
                              />
                              <span>Thêm link Tick Xanh</span>
                            </button>
                          ) : (
                            <div className="w-full px-2.5 py-1.5 rounded-lg bg-gray-50 border border-dashed border-gray-200 text-gray-400 flex items-center justify-start gap-1.5 text-[11px]">
                              <span className="w-2 h-2 rounded-full border border-gray-300 flex-shrink-0"></span>
                              <span className="truncate">Chưa có tick xanh</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Meal Session Tick Xanh Modal */}
      {activeTickXanhModal && (
        <MealSessionTickXanhModal
          isOpen={Boolean(activeTickXanhModal)}
          day={activeTickXanhModal.day}
          meal={activeTickXanhModal.meal}
          dateLabel={getWeekdayDateLabel(startDate, activeTickXanhModal.day)}
          dishes={schedule?.[activeTickXanhModal.day]?.[activeTickXanhModal.meal] || []}
          currentUrl={
            schedule?.[activeTickXanhModal.day]?.tickXanh?.[activeTickXanhModal.meal]?.url || ''
          }
          initialApplyToAll={activeTickXanhModal.initialApplyToAll}
          onClose={() => setActiveTickXanhModal(null)}
          onSave={(url, verified, applyToAllDay) => {
            handleSaveTickXanh(url, verified, applyToAllDay);
            setActiveTickXanhModal(null);
          }}
        />
      )}

      {/* Ingredient Declaration Modal */}
      {activeIngredientModal && (
        <FoodIngredientModal
          isOpen={Boolean(activeIngredientModal)}
          dish={activeIngredientModal.dish}
          onClose={() => setActiveIngredientModal(null)}
          onSaveIngredients={(ings, tickXanhUrl, tickXanhVerified) => {
            handleSaveIngredients(
              activeIngredientModal.day,
              activeIngredientModal.meal,
              activeIngredientModal.dish.id,
              ings,
              tickXanhUrl,
              tickXanhVerified
            );
            setActiveIngredientModal(null);
          }}
        />
      )}

      {/* Ingredient Read-only View Modal */}
      {activeViewModal && (
        <FoodIngredientViewModal
          isOpen={Boolean(activeViewModal)}
          dish={activeViewModal}
          onClose={() => setActiveViewModal(null)}
          onOpenEdit={
            !readOnly
              ? () => {
                  for (const d of weekdays) {
                    for (const m of mealTypes) {
                      const found = schedule?.[d]?.[m]?.find((item) => item.id === activeViewModal.id);
                      if (found) {
                        setActiveIngredientModal({ day: d, meal: m, dish: found });
                        break;
                      }
                    }
                  }
                }
              : undefined
          }
        />
      )}
    </div>
  );
};
