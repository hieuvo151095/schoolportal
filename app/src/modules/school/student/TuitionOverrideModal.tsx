import React, { useState } from 'react';
import { Icon, SlideOver } from '@/components/ds';
import { Student } from '../../../types/student';
import { useAppDispatch } from '../../../store';
import { updateTuitionOverride } from '../../../store/slices/studentSlice';
import { addToast } from '../../../store/slices/toastSlice';

interface TuitionOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const TuitionOverrideModal: React.FC<TuitionOverrideModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const dispatch = useAppDispatch();
  const [discountPercent, setDiscountPercent] = useState<number>(student?.tuitionDiscountPercent || 0);
  const [fixedOverride, setFixedOverride] = useState<string>(
    student?.tuitionFixedOverride ? student.tuitionFixedOverride.toString() : ''
  );
  const [showConfirm, setShowConfirm] = useState(false);

  React.useEffect(() => {
    if (student) {
      setDiscountPercent(student.tuitionDiscountPercent || 0);
      setFixedOverride(student.tuitionFixedOverride ? student.tuitionFixedOverride.toString() : '');
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSave = () => {
    dispatch(
      updateTuitionOverride({
        studentId: student.id,
        tuitionDiscountPercent: discountPercent > 0 ? discountPercent : undefined,
        tuitionFixedOverride: fixedOverride ? parseFloat(fixedOverride) : undefined,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Cập nhật chính sách học phí',
        message: `Đã cập nhật mức ưu đãi học phí cho học sinh ${student.fullName}`,
      })
    );

    setShowConfirm(false);
    onClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Miễn giảm & Ưu đãi học phí"
      description={`${student.fullName} • ${student.className}`}
      icon="coins"
      width={480}
      primaryAction={{
        label: showConfirm ? 'Xác nhận áp dụng' : 'Lưu thay đổi',
        icon: 'circle-check',
        onClick: showConfirm ? handleSave : () => setShowConfirm(true),
      }}
      secondaryAction={{
        label: showConfirm ? 'Quay lại' : 'Hủy bỏ',
        onClick: showConfirm ? () => setShowConfirm(false) : onClose,
      }}
    >
      <div className="space-y-4">
        {!showConfirm ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tỷ lệ giảm trừ học bổng / miễn giảm (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) =>
                    setDiscountPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))
                  }
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden font-bold text-slate-800"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                  %
                </span>
              </div>
              <span className="text-2xs text-slate-400 mt-1 block">
                Áp dụng giảm trừ trực tiếp trên tổng học phí định kỳ hàng tháng.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mức học phí cố định đặc biệt (VNĐ / tháng)
              </label>
              <input
                type="number"
                placeholder="Để trống nếu áp dụng theo biểu phí lớp học"
                value={fixedOverride}
                onChange={(e) => setFixedOverride(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden text-slate-800"
              />
              <span className="text-2xs text-slate-400 mt-1 block">
                Nếu nhập, hệ thống sẽ ghi đè biểu phí chuẩn của lớp bằng mức phí cố định này.
              </span>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-800">
              Khi lưu, chính sách học phí mới sẽ áp dụng cho tất cả các đợt phát hành hóa đơn tiếp theo của học sinh.
            </div>
          </>
        ) : (
          <div className="text-center py-3 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl">
              <Icon name="triangle-exclamation" size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">
                Xác nhận thay đổi chính sách học phí?
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Bạn đang thay đổi mức ưu đãi học phí cho học sinh{' '}
                <span className="font-semibold text-slate-900">{student.fullName}</span> thành{' '}
                <span className="font-bold text-emerald-600">{discountPercent}%</span>
                {fixedOverride
                  ? ` (hoặc mức cố định ${parseInt(fixedOverride).toLocaleString('vi-VN')} VNĐ)`
                  : ''}
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};
