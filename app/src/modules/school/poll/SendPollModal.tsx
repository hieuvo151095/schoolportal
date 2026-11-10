import React, { useState } from 'react';
import { Poll } from '@/types/poll';
import { SlideOver } from '@/components/ds';

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
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Xác nhận phát hành bình chọn"
      description={poll.title}
      icon="paper-plane"
      width={560}
      primaryAction={{
        label: 'Xác nhận gửi',
        icon: 'paper-plane',
        onClick: handleConfirm,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-5">
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
          Sau khi phát hành, bình chọn sẽ chuyển sang trạng thái <strong>&ldquo;Đã gửi&rdquo;</strong> và bắt đầu nhận phiếu từ người dùng.
        </div>

        {/* Audience Scope Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Phạm vi đối tượng gửi đến:
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                scope === 'toan_truong'
                  ? 'border-[#0070CE] bg-blue-50/50 text-[#0070CE] font-bold shadow-xs'
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
                  ? 'border-[#0070CE] bg-blue-50/50 text-[#0070CE] font-bold shadow-xs'
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
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Chọn các lớp học áp dụng:
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
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
    </SlideOver>
  );
};

export default SendPollModal;
