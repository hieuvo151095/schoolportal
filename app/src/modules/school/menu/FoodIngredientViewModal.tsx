import React from 'react';
import { Icon, SlideOver } from '../../../components/ds';
import { DishItem } from '../../../types/menu';

interface FoodIngredientViewModalProps {
  isOpen: boolean;
  dish: DishItem | null;
  onClose: () => void;
  onOpenEdit?: () => void;
}

export const FoodIngredientViewModal: React.FC<FoodIngredientViewModalProps> = ({
  isOpen,
  dish,
  onClose,
  onOpenEdit,
}) => {
  if (!dish) return null;

  const ingredients = dish.ingredients || [];
  const datChuanCount = ingredients.filter((i) => i.status === 'dat_chuan').length;
  const chuaTruyXuatCount = ingredients.length - datChuanCount;

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Chi tiết nguồn gốc thực phẩm"
      description={`Món ăn: ${dish.name}${dish.calories ? ` (${dish.calories} kcal)` : ''}`}
      icon="utensils"
      width={560}
      primaryAction={
        onOpenEdit
          ? {
              label: 'Chỉnh sửa nguyên liệu',
              icon: 'pen-to-square',
              onClick: () => {
                onClose();
                onOpenEdit();
              },
            }
          : undefined
      }
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-4">
        {/* Summary status badge row */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <div className="text-xs font-semibold text-slate-800">
              Tổng cộng {ingredients.length} nguyên liệu cấu thành
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Định mức dinh dưỡng cho suất ăn học đường
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200">
              {datChuanCount} Đạt chuẩn
            </span>
            {chuaTruyXuatCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-md border border-amber-200">
                {chuaTruyXuatCount} Chưa xác thực
              </span>
            )}
          </div>
        </div>

        {/* Ingredients list */}
        {ingredients.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            Món ăn này chưa được khai báo nguyên liệu chi tiết.
          </div>
        ) : (
          <div className="space-y-3">
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{ing.name}</span>
                    {ing.lotNumber && (
                      <span className="text-xs text-slate-500 font-normal">
                        (Lô: {ing.lotNumber})
                      </span>
                    )}
                  </div>
                  <div>
                    {ing.status === 'dat_chuan' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Icon name="circle-check" size={12} className="text-emerald-600" />
                        Đạt chuẩn VSATTP
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] bg-amber-50 text-amber-700 border border-amber-200">
                        <Icon name="clock" size={12} className="text-amber-600" />
                        Chờ thẩm định
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    {ing.gtin || ing.internalCode ? (
                      <div className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                        <Icon name="barcode" size={12} className="text-slate-400 shrink-0" />
                        <span>Mã truy xuất: <strong className="text-slate-800">{ing.gtin || ing.internalCode}</strong></span>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px]">
                        Chưa có mã định danh
                      </div>
                    )}
                  </div>

                  <div>
                    {ing.supplierName ? (
                      <div className="text-slate-600 flex items-start gap-1.5 text-[11px]">
                        <Icon name="building" size={12} className="text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <div>Nhà cung cấp: <strong className="text-slate-800">{ing.supplierName}</strong></div>
                          {ing.supplierVerified && (
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 inline-block mt-0.5">
                              Doanh nghiệp đạt chuẩn VSATTP
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px]">
                        Chưa có thông tin nhà cung cấp
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SlideOver>
  );
};
