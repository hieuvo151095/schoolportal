import React, { useState } from 'react';
import { Poll } from '@/types/poll';

interface SendPollModalProps {
  poll: Poll | null;
  isOpen: boolean;
  availableClasses: Array<{ id: string; name: string }>;
  onClose: () => void;
  onConfirm: (payload: {
    pollId: string;
    audienceScope: 'toan_truong' | 'lop_hoc';
    targetClassIds?: string[];
    targetClassNames?: string[];
  }) => void;
}

export const SendPollModal: React.FC<SendPollModalProps> = ({
  poll,
  isOpen,
  availableClasses,
  onClose,
  onConfirm,
}) => {
  const [scope, setScope] = useState<'toan_truong' | 'lop_hoc'>('toan_truong');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !poll) return null;

  const handleToggleClass = (classId: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
    setError(null);
  };

  const handleConfirm = () => {
    if (scope === 'lop_hoc' && selectedClassIds.length === 0) {
      setError('Vui lòng chọn ít nhất một lớp học');
      return;
    }

    const selectedNames = availableClasses
      .filter((c) => selectedClassIds.includes(c.id))
      .map((c) => c.name);

    onConfirm({
      pollId: poll.id,
      audienceScope: scope,
      targetClassIds: scope === 'lop_hoc' ? selectedClassIds : undefined,
      targetClassNames: scope === 'lop_hoc' ? selectedNames : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with 3 colored circles (characteristic legacy spec UI) */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2">
              Xác nhận phát hành
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-base font-bold text-slate-800 mb-2">
            Vui lòng xác nhận gửi Bình chọn{' '}
            <span className="text-[#0070CE]">&ldquo;{poll.title}&rdquo;</span>
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Sau khi phát hành, bình chọn sẽ chuyển sang trạng thái &ldquo;Đã gửi&rdquo; và bắt đầu nhận phiếu từ người dùng.
          </p>

          {/* Audience Scope Selection (UC-04, BR05) */}
          <div className="space-y-3 mb-5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Gửi đến:
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  scope === 'toan_truong'
                    ? 'border-[#0070CE] bg-blue-50/50 text-[#0070CE] font-bold shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="audienceScope"
                  checked={scope === 'toan_truong'}
                  onChange={() => {
                    setScope('toan_truong');
                    setError(null);
                  }}
                  className="mr-2 text-[#0070CE] focus:ring-[#0070CE]"
                />
                <span className="text-sm">Toàn trường</span>
              </label>

              <label
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  scope === 'lop_hoc'
                    ? 'border-[#0070CE] bg-blue-50/50 text-[#0070CE] font-bold shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="audienceScope"
                  checked={scope === 'lop_hoc'}
                  onChange={() => setScope('lop_hoc')}
                  className="mr-2 text-[#0070CE] focus:ring-[#0070CE]"
                />
                <span className="text-sm">Lớp học cụ thể</span>
              </label>
            </div>
          </div>

          {/* Conditional Multi-Class Selector */}
          {scope === 'lop_hoc' && (
            <div className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Chọn các lớp học áp dụng:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                {availableClasses.map((cls) => {
                  const isChecked = selectedClassIds.includes(cls.id);
                  return (
                    <label
                      key={cls.id}
                      className={`flex items-center px-3 py-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                        isChecked
                          ? 'bg-blue-100/70 border-[#0070CE] text-[#0070CE] font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleClass(cls.id)}
                        className="mr-2 rounded text-[#0070CE] focus:ring-[#0070CE]"
                      />
                      <span>{cls.name}</span>
                    </label>
                  );
                })}
              </div>
              {error && <p className="text-xs text-rose-600 mt-2 font-medium">{error}</p>}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-lg bg-[#0070CE] hover:bg-[#005bb5] text-white text-sm font-semibold shadow-sm transition-colors"
          >
            Xác nhận gửi
          </button>
        </div>
      </div>
    </div>
  );
};
export default SendPollModal;
