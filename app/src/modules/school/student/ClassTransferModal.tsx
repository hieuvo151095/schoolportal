import React, { useState } from 'react';
import { Icon, Dropdown } from '@/components/ds';
import { Student } from '../../../types/student';
import { useAppDispatch } from '../../../store';
import { transferStudents } from '../../../store/slices/studentSlice';
import { addToast } from '../../../store/slices/toastSlice';
import { validateClassTransfer } from '../../../utils/studentValidation';

interface ClassTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

const AVAILABLE_CLASSES = [
  { id: 'class-10a1', name: 'Lớp 10A1' },
  { id: 'class-10a2', name: 'Lớp 10A2' },
  { id: 'class-10a3', name: 'Lớp 10A3' },
  { id: 'class-11a1', name: 'Lớp 11A1' },
  { id: 'class-11a2', name: 'Lớp 11A2' },
  { id: 'class-12a1', name: 'Lớp 12A1' },
  { id: 'lop-1a1', name: 'Lớp 1A1' },
  { id: 'lop-1a2', name: 'Lớp 1A2' },
  { id: 'lop-2a1', name: 'Lớp 2A1' },
];

export const ClassTransferModal: React.FC<ClassTransferModalProps> = ({
  isOpen,
  onClose,
  students,
}) => {
  const dispatch = useAppDispatch();
  const [targetClassId, setTargetClassId] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('2026-09-16');
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || students.length === 0) return null;

  const sourceClassId = students[0].classId;
  const sourceClassName = students[0].className || 'Chưa xếp lớp';
  const targetClass = AVAILABLE_CLASSES.find((c) => c.id === targetClassId);

  const handleProceed = () => {
    const validation = validateClassTransfer({
      studentIds: students.map((s) => s.id),
      sourceClassId,
      targetClassId,
      effectiveDate,
      remapFees: true,
      updateChat: true,
      pruneEvaluations: false,
    });

    if (!validation.isValid) {
      setError(validation.error || 'Dữ liệu chuyển lớp không hợp lệ');
      return;
    }

    setError(null);
    setShowConfirmStep(true);
  };

  const handleExecuteTransfer = () => {
    dispatch(
      transferStudents({
        studentIds: students.map((s) => s.id),
        sourceClassId,
        targetClassId,
        targetClassName: targetClass?.name || targetClassId,
        effectiveDate,
        remapFees: true,
        updateChat: true,
        pruneEvaluations: false,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Chuyển lớp thành công',
        message: `Đã chuyển ${students.length} học sinh sang ${targetClass?.name || targetClassId}`,
      })
    );

    setShowConfirmStep(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-semibold text-sm">
              <Icon name="rotate-right" size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {showConfirmStep ? 'Xác nhận chuyển lớp' : 'Chuyển lớp học'}
            </h3>
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
          {!showConfirmStep ? (
            <>
              {/* Target Students List summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Danh sách học sinh ({students.length})
                </label>
                <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-2.5 space-y-1.5 bg-slate-50">
                  {students.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white border border-slate-100"
                    >
                      <span className="font-medium text-slate-800">{st.fullName}</span>
                      <span className="text-slate-500">
                        {st.studentCode || 'Chưa có mã'} • {st.className}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source & Destination */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Lớp hiện tại
                  </label>
                  <input
                    type="text"
                    disabled
                    value={sourceClassName}
                    className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Lớp chuyển đến *
                  </label>
                  <Dropdown
                    value={targetClassId}
                    onChange={(val) => setTargetClassId(val)}
                    options={[
                      { value: '', label: '-- Chọn lớp chuyển đến --' },
                      ...AVAILABLE_CLASSES.map((c) => ({
                        value: c.id,
                        label: c.name,
                      })),
                    ]}
                    placeholder="-- Chọn lớp chuyển đến --"
                    fullWidth
                  />
                </div>
              </div>

              {/* Effective Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ngày áp dụng chuyển lớp *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden text-slate-800"
                  />
                </div>
              </div>

              {/* Automated Cascade Warning Box (ADR-009) */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs">
                  <Icon name="triangle-exclamation" size={14} />
                  <span>3 Quy tắc hệ thống tự động áp dụng (ADR-009):</span>
                </div>
                <ul className="text-xs text-amber-900 space-y-1 pl-5 list-disc">
                  <li>Biểu phí học phí sẽ tự động được liên kết theo lớp học mới.</li>
                  <li>Tự động thêm phụ huynh vào nhóm chat trao đổi của lớp mới.</li>
                  <li>Bảo lưu lịch sử điểm số và đánh giá các môn học đã ghi nhận.</li>
                </ul>
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {error}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl">
                <Icon name="triangle-exclamation" size={24} />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-slate-800">Xác nhận chuyển lớp học sinh?</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Bạn đang chuẩn bị chuyển{' '}
                  <span className="font-semibold text-slate-900">{students.length} học sinh</span> từ{' '}
                  <span className="font-semibold text-slate-900">{sourceClassName}</span> sang{' '}
                  <span className="font-semibold text-[#0070CE]">{targetClass?.name}</span>, áp dụng
                  từ ngày {effectiveDate}.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <Icon name="circle-check" size={14} />
                  <span>Biểu phí học phí lớp mới đã sẵn sàng kích hoạt</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <Icon name="circle-check" size={14} />
                  <span>Kênh trao đổi phụ huynh sẽ tự động phân quyền</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={showConfirmStep ? () => setShowConfirmStep(false) : onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            {showConfirmStep ? 'Quay lại' : 'Hủy bỏ'}
          </button>
          <button
            type="button"
            disabled={!showConfirmStep && !targetClassId}
            onClick={showConfirmStep ? handleExecuteTransfer : handleProceed}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-xs ${
              !showConfirmStep && !targetClassId
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-[#0070CE] hover:bg-[#005ba8] cursor-pointer'
            }`}
          >
            {showConfirmStep ? 'Xác nhận chuyển ngay' : 'Tiếp tục'}
          </button>
        </div>
      </div>
    </div>
  );
};
