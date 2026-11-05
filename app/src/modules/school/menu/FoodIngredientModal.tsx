import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUtensils,
  faPlus,
  faTrashAlt,
  faBarcode,
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import { FoodIngredient, DishItem } from '../../../types/menu';
import {
  lookupSupplierByGTIN,
  evaluateIngredientTraceability,
} from '../../../utils/menuValidation';

interface FoodIngredientModalProps {
  isOpen: boolean;
  dish: DishItem | null;
  onClose: () => void;
  onSaveIngredients: (
    ingredients: FoodIngredient[],
    tickXanhUrl?: string,
    tickXanhVerified?: boolean
  ) => void;
}

export const FoodIngredientModal: React.FC<FoodIngredientModalProps> = ({
  isOpen,
  dish,
  onClose,
  onSaveIngredients,
}) => {
  // Ingredients states
  const [ingredients, setIngredients] = useState<FoodIngredient[]>([]);

  // Sync state when modal opens
  useEffect(() => {
    if (dish) {
      setIngredients(
        (dish.ingredients || []).map((ing) => ({
          ...ing,
        }))
      );
    }
  }, [dish, isOpen]);

  if (!isOpen || !dish) return null;

  // Ingredients handlers
  const handleAddIngredient = () => {
    const newIng: FoodIngredient = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: '',
      traceabilityMethod: 'gtin',
      gtin: '',
      lotNumber: '',
      internalCode: '',
      status: 'chua_truy_xuat',
    };
    setIngredients([...ingredients, newIng]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const handleIngredientChange = (id: string, field: keyof FoodIngredient, val: any) => {
    setIngredients((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: val };

        // Auto lookup supplier if GTIN changed
        if (field === 'gtin' || (field === 'traceabilityMethod' && val === 'gtin')) {
          const gtinVal = field === 'gtin' ? val : updated.gtin;
          const lookup = lookupSupplierByGTIN(gtinVal);
          updated.supplierName = lookup.supplierName;
          updated.supplierVerified = lookup.verified;
        }

        // Recalculate status
        updated.status = evaluateIngredientTraceability(updated);
        return updated;
      })
    );
  };

  const handleSave = () => {
    const valid = ingredients.filter((i) => i.name.trim().length > 0);
    onSaveIngredients(valid, dish.tickXanhUrl, dish.tickXanhVerified);
    onClose();
  };

  const datChuanCount = ingredients.filter((i) => i.status === 'dat_chuan').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 to-teal-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-600">
              <FontAwesomeIcon icon={faUtensils} className="text-sm" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Khai báo nguyên liệu thực phẩm &amp; Mã vạch GTIN
              </h3>
              <p className="text-xs text-gray-500">
                Món ăn: <span className="font-semibold text-emerald-800">{dish.name}</span>
                {dish.calories ? ` (${dish.calories} kcal)` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Summary / Guideline banner */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 text-sm" />
              <span>
                Khai báo danh mục nguyên liệu cấu thành món ăn để minh bạch thông tin và truy xuất nguồn gốc.
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="font-semibold text-gray-800">
                {datChuanCount}/{ingredients.length}
              </span>
              <span className="text-gray-500 text-[11px]">đạt chuẩn</span>
            </div>
          </div>

          {/* Ingredients list */}
          {ingredients.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                <FontAwesomeIcon icon={faUtensils} />
              </div>
              <p className="text-xs text-gray-500">Chưa có nguyên liệu nào được khai báo cho món ăn này.</p>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="mt-2 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg inline-flex items-center gap-1.5 transition-colors border border-emerald-200"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                Thêm nguyên liệu đầu tiên
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {ingredients.map((ing, idx) => (
                <div
                  key={ing.id}
                  className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 transition-all space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Nguyên liệu #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {ing.status === 'dat_chuan' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-[9px]" />
                          Đạt chuẩn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                          <FontAwesomeIcon icon={faExclamationCircle} className="text-[9px]" />
                          Chưa đủ thông tin
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ing.id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Xóa nguyên liệu"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Tên nguyên liệu / thực phẩm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Thịt bò phi lê, Gạo tấm..."
                        value={ing.name}
                        onChange={(e) => handleIngredientChange(ing.id, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Phương thức truy xuất
                      </label>
                      <select
                        value={ing.traceabilityMethod || 'gtin'}
                        onChange={(e) =>
                          handleIngredientChange(
                            ing.id,
                            'traceabilityMethod',
                            e.target.value as 'gtin' | 'internal'
                          )
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      >
                        <option value="gtin">Mã vạch quốc gia GTIN (GS1 Việt Nam)</option>
                        <option value="internal">Mã tem nội bộ / Chứng chỉ cơ sở</option>
                      </select>
                    </div>
                  </div>

                  {ing.traceabilityMethod === 'gtin' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          <FontAwesomeIcon icon={faBarcode} className="mr-1 text-gray-400" />
                          Mã số GTIN (8-13 số)
                        </label>
                        <input
                          type="text"
                          placeholder="8938501102931"
                          value={ing.gtin || ''}
                          onChange={(e) => handleIngredientChange(ing.id, 'gtin', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Số lô hàng (Lot Number)
                        </label>
                        <input
                          type="text"
                          placeholder="LOT-20261012-A1"
                          value={ing.lotNumber || ''}
                          onChange={(e) => handleIngredientChange(ing.id, 'lotNumber', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Mã kiểm soát nội bộ
                      </label>
                      <input
                        type="text"
                        placeholder="TEM-NB-PHO-2026"
                        value={ing.internalCode || ''}
                        onChange={(e) => handleIngredientChange(ing.id, 'internalCode', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  )}

                  {ing.supplierName && (
                    <div className="pt-1 text-[11px] text-gray-600 flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faBuilding} className="text-gray-400" />
                      <span>Nhà cung cấp: <strong className="text-gray-800">{ing.supplierName}</strong></span>
                      {ing.supplierVerified && (
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Đã chứng nhận
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddIngredient}
                className="w-full py-2 border border-dashed border-emerald-300 hover:border-emerald-500 text-emerald-700 hover:bg-emerald-50/50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                Thêm nguyên liệu khác
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
          >
            Lưu thay đổi ({ingredients.length} nguyên liệu)
          </button>
        </div>
      </div>
    </div>
  );
};
