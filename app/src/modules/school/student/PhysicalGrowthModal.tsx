import React, { useState, useMemo } from 'react';
import { Icon } from '@/components/ds';
import { Student } from '../../../types/student';
import { useAppDispatch } from '../../../store';
import { addGrowthRecord } from '../../../store/slices/studentSlice';
import { addToast } from '../../../store/slices/toastSlice';
import { calculateBmi, classifyBmi, formatBmiClassification, getBmiBadgeStyle } from '../../../utils/studentValidation';

interface PhysicalGrowthModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const PhysicalGrowthModal: React.FC<PhysicalGrowthModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const dispatch = useAppDispatch();
  const [heightCm, setHeightCm] = useState<string>('115');
  const [weightKg, setWeightKg] = useState<string>('20.5');
  const [measuredAt, setMeasuredAt] = useState<string>(new Date().toISOString().split('T')[0]);
  const [measuredBy, setMeasuredBy] = useState<string>('Y tế học đường - Cô Mai');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const numHeight = parseFloat(heightCm) || 0;
  const numWeight = parseFloat(weightKg) || 0;

  const liveBmi = useMemo(() => {
    return calculateBmi(numHeight, numWeight);
  }, [numHeight, numWeight]);

  const liveClassification = useMemo(() => {
    return classifyBmi(liveBmi);
  }, [liveBmi]);

  const badgeStyle = useMemo(() => {
    return getBmiBadgeStyle(liveClassification);
  }, [liveClassification]);

  if (!isOpen || !student) return null;

  const handleSave = () => {
    if (numHeight <= 40 || numHeight > 220) {
      setError('Chiều cao không hợp lệ (từ 40cm đến 220cm)');
      return;
    }
    if (numWeight <= 5 || numWeight > 150) {
      setError('Cân nặng không hợp lệ (từ 5kg đến 150kg)');
      return;
    }

    dispatch(
      addGrowthRecord({
        studentId: student.id,
        record: {
          measuredAt,
          heightCm: numHeight,
          weightKg: numWeight,
          measuredBy,
          notes: notes.trim() || undefined,
        },
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Ghi nhận thể trạng thành công',
        message: `Đã lưu chỉ số BMI (${liveBmi} - ${formatBmiClassification(liveClassification)}) cho học sinh ${student.fullName}`,
      })
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-semibold text-sm">
              <svg className="w-4 h-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Đo thể trạng & BMI</h3>
              <p className="text-xs text-slate-500">{student.fullName} • {student.className}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Đóng"
          >
            <Icon name="xmark" size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Live BMI Result Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-blue-50/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Chỉ số BMI ước tính:</span>
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                {liveBmi > 0 ? liveBmi : '--'}
              </span>
            </div>
            <div>
              <span
                className="px-3 py-1.5 rounded-full text-xs font-bold shadow-2xs"
                style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
              >
                {formatBmiClassification(liveClassification)}
              </span>
            </div>
          </div>

          {/* Measurements Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Chiều cao (cm) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden text-slate-800 font-semibold"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                  cm
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cân nặng (kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden text-slate-800 font-semibold"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* Date & Measurer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ngày đo kiểm *
              </label>
              <input
                type="date"
                value={measuredAt}
                onChange={(e) => setMeasuredAt(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cán bộ y tế đo
              </label>
              <input
                type="text"
                value={measuredBy}
                onChange={(e) => setMeasuredBy(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ghi chú thể chất
            </label>
            <input
              type="text"
              placeholder="VD: Cân nặng tăng trưởng đạt chuẩn, nhanh nhẹn..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden text-slate-800"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-lg transition-colors shadow-xs"
          >
            <Icon name="circle-check" size={14} />
            <span>Lưu chỉ số</span>
          </button>
        </div>
      </div>
    </div>
  );
};
