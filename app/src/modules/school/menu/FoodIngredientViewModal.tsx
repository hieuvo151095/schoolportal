import React from 'react';
import { Icon } from '../../../components/ds';
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
  if (!isOpen || !dish) return null;

  const ingredients = dish.ingredients || [];
  const datChuanCount = ingredients.filter((i) => i.status === 'dat_chuan').length;
  const chuaTruyXuatCount = ingredients.length - datChuanCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-600">
              <Icon name="utensils" className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Chi tiết truy xuất nguồn gốc thực phẩm
              </h3>
              <p className="text-xs text-gray-500">
                Món ăn: <span className="font-semibold text-gray-800">{dish.name}</span>
                {dish.calories ? ` (${dish.calories} kcal)` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <Icon name="xmark" className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Summary status badge row */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div>
              <div className="text-xs font-semibold text-gray-800">
                Tổng cộng {ingredients.length} nguyên liệu cấu thành
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Được kiểm soát theo tiêu chuẩn an toàn vệ sinh thực phẩm học đường
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <Icon name="circle-check" className="w-3.5 h-3.5 text-emerald-800" />
                {datChuanCount} Đạt chuẩn
              </span>
              {chuaTruyXuatCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  <Icon name="circle-exclamation" className="w-3.5 h-3.5 text-amber-800" />
                  {chuaTruyXuatCount} Chưa đủ thông tin
                </span>
              )}
            </div>
          </div>

          {/* List of Ingredients */}
          {ingredients.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs italic">
              Chưa có nguyên liệu nào được khai báo cho món ăn này.
            </div>
          ) : (
            <div className="space-y-2.5">
              {ingredients.map((ing, idx) => (
                <div
                  key={ing.id || idx}
                  className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{ing.name}</span>
                    </div>
                    {ing.status === 'dat_chuan' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        <Icon name="circle-check" className="w-3 h-3 text-emerald-800" />
                        Đạt chuẩn
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                        <Icon name="circle-exclamation" className="w-3 h-3 text-amber-800" />
                        Chưa đủ thông tin
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100">
                    <div className="space-y-1">
                      {ing.traceabilityMethod === 'gtin' ? (
                        <>
                          <div className="text-gray-600 flex items-center gap-1.5 font-mono text-[11px]">
                            <Icon name="barcode" className="w-3.5 h-3.5 text-gray-400" />
                            <span>Mã vạch GTIN: {ing.gtin || 'Chưa nhập'}</span>
                          </div>
                          {ing.lotNumber && (
                            <div className="text-gray-600 flex items-center gap-1.5 font-mono text-[11px]">
                              <Icon name="box" className="w-3.5 h-3.5 text-gray-400" />
                              <span>Số lô: {ing.lotNumber}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-gray-600 flex items-center gap-1.5 font-mono text-[11px]">
                          <Icon name="barcode" className="w-3.5 h-3.5 text-gray-400" />
                          <span>Mã tem nội bộ: {ing.internalCode || 'Chưa nhập'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      {ing.supplierName ? (
                        <div className="text-gray-600 flex items-start gap-1.5 text-[11px]">
                          <Icon name="building" className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                          <div>
                            <div>Nhà cung cấp: <strong className="text-gray-800">{ing.supplierName}</strong></div>
                            {ing.supplierVerified && (
                              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 inline-block mt-0.5">
                                Doanh nghiệp đạt chuẩn VSATTP
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 italic text-[11px]">
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

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Đóng
          </button>
          {onOpenEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenEdit();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Icon name="pencil" className="w-3.5 h-3.5" />
              Chỉnh sửa nguyên liệu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
