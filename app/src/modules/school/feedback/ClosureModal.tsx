import React from 'react';
import { Icon, SlideOver } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  closeClosureModal,
  confirmCloseFeedback,
} from '@/store/slices/feedbackSlice';

export default function ClosureModal() {
  const dispatch = useAppDispatch();
  const { isClosureModalOpen, targetFeedbackForClosure } = useAppSelector(
    (state) => state.feedback
  );

  if (!targetFeedbackForClosure) {
    return null;
  }

  const handleConfirm = () => {
    dispatch(confirmCloseFeedback(targetFeedbackForClosure.id));
  };

  const handleCancel = () => {
    dispatch(closeClosureModal());
  };

  return (
    <SlideOver
      open={isClosureModalOpen}
      onClose={handleCancel}
      title="Xác nhận đóng góp ý"
      description="Kết thúc quy trình xử lý phản hồi và gửi thông báo nghiệm thu tới phụ huynh"
      icon="circle-check"
      width={480}
      primaryAction={{
        label: 'Xác nhận đóng',
        icon: 'circle-check',
        onClick: handleConfirm,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: handleCancel,
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-3 border-2 border-emerald-300">
            <Icon name="circle-check" size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Đóng góp ý này?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Quy trình xử lý phản ánh sẽ chuyển sang trạng thái Hoàn tất.
          </p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <Icon name="triangle-exclamation" size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            Vui lòng xác nhận Đóng góp ý{' '}
            <strong className="underline">{targetFeedbackForClosure.title}</strong>{' '}
            ({targetFeedbackForClosure.code}).
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed p-4 bg-slate-50 border border-slate-200 rounded-xl">
          Hành động này sẽ chuyển trạng thái của góp ý thành{' '}
          <strong className="text-emerald-600">Hoàn tất</strong>. Luồng trao đổi sẽ được đóng lại và phụ huynh sẽ nhận được thông báo giải quyết chính thức qua ứng dụng.
        </p>
      </div>
    </SlideOver>
  );
}
