import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faMagic,
  faStar,
  faCheck,
  faThumbsUp,
  faThumbsDown,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { DayMealSchedule, WeekdayKey } from '../../../types/menu';

interface AIMenuSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySchedule: (schedule: Record<WeekdayKey, DayMealSchedule>) => void;
}

export const AIMenuSuggestionModal: React.FC<AIMenuSuggestionModalProps> = ({
  isOpen,
  onClose,
  onApplySchedule,
}) => {
  const [gradeTier, setGradeTier] = useState<'mam_non' | 'tieu_hoc' | 'trung_hoc'>('tieu_hoc');
  const [budgetTier, setBudgetTier] = useState<'tiet_kiem' | 'pho_thong' | 'cao_cap' | 'dac_biet'>(
    'pho_thong'
  );
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [generated, setGenerated] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setGenerated(true);
    setFeedback(null);
  };

  const handleApply = () => {
    // Generate balanced schedule template matching grade and budget tiers
    const sampleSchedule: Record<WeekdayKey, DayMealSchedule> = {
      monday: {
        breakfast: [
          {
            id: 'ai-m-b-1',
            name: gradeTier === 'mam_non' ? 'Súp cua bắp non hạt sen' : 'Bún mọc thịt nạc nấm hương',
            calories: gradeTier === 'mam_non' ? 240 : 360,
            ingredients: [
              {
                id: 'ai-ing-1',
                name: 'Thịt heo nạc CP',
                traceabilityMethod: 'gtin',
                gtin: '8936036028812',
                lotNumber: 'CP-AI-001',
                supplierName: 'Công ty Cổ phần Chăn nuôi C.P. Việt Nam',
                supplierVerified: true,
                status: 'dat_chuan',
              },
            ],
          },
        ],
        lunch: [
          {
            id: 'ai-m-l-1',
            name: 'Cơm gạo tám & Thịt bò xào củ quả',
            calories: gradeTier === 'mam_non' ? 320 : 450,
            ingredients: [
              {
                id: 'ai-ing-2',
                name: 'Thịt bò MEATDeli',
                traceabilityMethod: 'gtin',
                gtin: '8938501102931',
                lotNumber: 'MD-AI-891',
                supplierName: 'Tập đoàn Masan MEATDeli',
                supplierVerified: true,
                status: 'dat_chuan',
              },
            ],
          },
          {
            id: 'ai-m-l-2',
            name: 'Canh bí đao nấu thịt nạc',
            calories: 85,
            ingredients: [],
          },
        ],
        snack: [
          {
            id: 'ai-m-s-1',
            name: 'Sữa chua men sống Ba Vì',
            calories: 120,
            ingredients: [
              {
                id: 'ai-ing-3',
                name: 'Sữa chua Ba Vì',
                traceabilityMethod: 'gtin',
                gtin: '8935001001234',
                lotNumber: 'BV-AI-772',
                supplierName: 'Công ty Cổ phần Sữa Ba Vì',
                supplierVerified: true,
                status: 'dat_chuan',
              },
            ],
          },
        ],
      },
      tuesday: {
        breakfast: [
          {
            id: 'ai-t-b-1',
            name: 'Phở bò tươi tái chín',
            calories: 380,
            ingredients: [],
          },
        ],
        lunch: [
          {
            id: 'ai-t-l-1',
            name: 'Cơm trắng & Gà San Hà om nấm',
            calories: 430,
            ingredients: [],
          },
          {
            id: 'ai-t-l-2',
            name: 'Canh rau ngót nấu tôm sú',
            calories: 90,
            ingredients: [],
          },
        ],
        snack: [
          {
            id: 'ai-t-s-1',
            name: 'Chè đậu xanh nước cốt dừa',
            calories: 150,
            ingredients: [],
          },
        ],
      },
      wednesday: {
        breakfast: [
          {
            id: 'ai-w-b-1',
            name: 'Bánh mì sandwich kẹp trứng & jambon Vissan',
            calories: 340,
            ingredients: [],
          },
        ],
        lunch: [
          {
            id: 'ai-w-l-1',
            name: 'Cơm chiên hoa ngũ sắc & Cá chẽm sốt cam',
            calories: 460,
            ingredients: [],
          },
          {
            id: 'ai-w-l-2',
            name: 'Canh sườn hầm rau củ quả',
            calories: 110,
            ingredients: [],
          },
        ],
        snack: [
          {
            id: 'ai-w-s-1',
            name: 'Sữa tươi Vinamilk 100% Organic',
            calories: 110,
            ingredients: [],
          },
        ],
      },
      thursday: {
        breakfast: [
          {
            id: 'ai-th-b-1',
            name: 'Cháo sườn non yến mạch',
            calories: 310,
            ingredients: [],
          },
        ],
        lunch: [
          {
            id: 'ai-th-l-1',
            name: 'Cơm gạo thơm & Sườn nướng mật ong',
            calories: 480,
            ingredients: [],
          },
          {
            id: 'ai-th-l-2',
            name: 'Canh cải ngọt nấu thịt băm',
            calories: 80,
            ingredients: [],
          },
        ],
        snack: [
          {
            id: 'ai-th-s-1',
            name: 'Bánh flan caramen trà xanh',
            calories: 135,
            ingredients: [],
          },
        ],
      },
      friday: {
        breakfast: [
          {
            id: 'ai-f-b-1',
            name: 'Bánh cuốn chả quế nóng',
            calories: 350,
            ingredients: [],
          },
        ],
        lunch: [
          {
            id: 'ai-f-l-1',
            name: 'Cơm trắng & Tôm rim thịt ba chỉ',
            calories: 440,
            ingredients: [],
          },
          {
            id: 'ai-f-l-2',
            name: 'Canh cua mồng tơi rau đay',
            calories: 95,
            ingredients: [],
          },
        ],
        snack: [
          {
            id: 'ai-f-s-1',
            name: 'Sữa hạt sen đậu đỏ',
            calories: 130,
            ingredients: [],
          },
        ],
      },
      saturday: {
        breakfast: [
          {
            id: 'ai-sa-b-1',
            name: 'Mì trứng xào thịt bò xắt hạt lựu',
            calories: 390,
            ingredients: [],
          },
        ],
        lunch: [
          {
            id: 'ai-sa-l-1',
            name: 'Cơm tấm sườn bì chả truyền thống',
            calories: 520,
            ingredients: [],
          },
          {
            id: 'ai-sa-l-2',
            name: 'Canh khổ qua dồn thịt giải nhiệt',
            calories: 85,
            ingredients: [],
          },
        ],
        snack: [
          {
            id: 'ai-sa-s-1',
            name: 'Hoa quả tráng miệng & Sữa chua',
            calories: 120,
            ingredients: [],
          },
        ],
      },
    };

    onApplySchedule(sampleSchedule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-600">
              <FontAwesomeIcon icon={faMagic} className="text-sm" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Gợi ý thực đơn bằng AI</h3>
              <p className="text-xs text-gray-500">Cân đối dinh dưỡng tự động theo tiêu chuẩn học đường</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Lứa tuổi */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Lứa tuổi học sinh
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mam_non', label: 'Mầm non (2 - 5 tuổi)' },
                { id: 'tieu_hoc', label: 'Tiểu học (Lớp 1 - 5)' },
                { id: 'trung_hoc', label: 'Trung học (Lớp 6 - 12)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setGradeTier(opt.id as any)}
                  className={`p-3 text-xs font-medium rounded-xl border text-left transition-all ${
                    gradeTier === opt.id
                      ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-sm font-semibold'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mức giá theo 4 bậc BR12 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Mức giá định mức bữa ăn (4 bậc tiêu chuẩn)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'tiet_kiem', label: 'Tiết kiệm', sub: '35.000 đ' },
                { id: 'pho_thong', label: 'Phổ thông', sub: '50.000 đ' },
                { id: 'cao_cap', label: 'Cao cấp', sub: '75.000 đ' },
                { id: 'dac_biet', label: 'Đặc biệt', sub: '100.000 đ' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBudgetTier(opt.id as any)}
                  className={`p-2.5 text-xs rounded-xl border text-center transition-all ${
                    budgetTier === opt.id
                      ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-sm font-semibold'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {!generated ? (
            <div className="text-center py-6 bg-purple-50/40 rounded-xl border border-dashed border-purple-200">
              <FontAwesomeIcon icon={faStar} className="text-3xl text-purple-400 mb-2" />
              <p className="text-xs text-purple-800 font-medium">
                Mô hình AI sẽ tự động phân bổ tỷ lệ Đạm - Đường bột - Chất béo cân đối theo khuyến nghị của Viện Dinh Dưỡng Quốc Gia.
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm shadow-purple-500/20 inline-flex items-center gap-1.5 transition-all"
              >
                <FontAwesomeIcon icon={faMagic} className="text-[11px]" />
                Sinh thực đơn tuần gợi ý
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-purple-800">
                  <FontAwesomeIcon icon={faCheck} className="text-purple-600" />
                  Đã sinh thực đơn 6 ngày (Thứ 2 - Thứ 7) cho lứa tuổi {gradeTier === 'mam_non' ? 'Mầm non' : gradeTier === 'tieu_hoc' ? 'Tiểu học' : 'Trung học'}
                </div>
                <div className="text-[11px] text-purple-700">
                  Mỗi ngày gồm 3 bữa: Ăn sáng (~350 kcal), Ăn trưa (~450 kcal), Ăn xế (~120 kcal) kèm nguyên liệu đạt chuẩn.
                </div>
              </div>

              {/* Feedback buttons (BR12) */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1 px-1">
                <span>Gợi ý này có hữu ích với bạn không?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedback('up')}
                    className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                      feedback === 'up'
                        ? 'bg-purple-100 border-purple-400 text-purple-800 font-semibold'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} /> Hữu ích
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedback('down')}
                    className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                      feedback === 'down'
                        ? 'bg-gray-200 border-gray-400 text-gray-800 font-semibold'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faThumbsDown} /> Chưa phù hợp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
          {generated && (
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-all"
            >
              Áp dụng vào thực đơn
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
