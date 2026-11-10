import React, { useState, useMemo } from 'react';
import { SlideOver } from '@/components/ds';
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
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Đo thể trạng & BMI"
      description={`${student.fullName} • ${student.className}`}
      icon="heart"
      width={480}
      primaryAction={{
        label: 'Lưu chỉ số',
        icon: 'circle-check',
        onClick: handleSave,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-4">
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
    </SlideOver>
  );
};
