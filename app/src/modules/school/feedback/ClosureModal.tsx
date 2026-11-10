import React from 'react';
import styled from 'styled-components';
import { Icon } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  closeClosureModal,
  confirmCloseFeedback,
} from '@/store/slices/feedbackSlice';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalFadeIn 0.15s ease-out;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export default function ClosureModal() {
  const dispatch = useAppDispatch();
  const { isClosureModalOpen, targetFeedbackForClosure } = useAppSelector(
    (state) => state.feedback
  );

  if (!isClosureModalOpen || !targetFeedbackForClosure) {
    return null;
  }

  const handleConfirm = () => {
    dispatch(confirmCloseFeedback(targetFeedbackForClosure.id));
  };

  const handleCancel = () => {
    dispatch(closeClosureModal());
  };

  return (
    <ModalOverlay onClick={handleCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">
              <Icon name="circle-check" className="w-4 h-4 text-emerald-600" />
            </span>
            <h3 className="text-sm font-bold text-slate-800">Xác nhận đóng góp ý</h3>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <Icon name="xmark" className="w-4 h-4" />
          </button>
        </div>

        {/* Body (Message GY-01) */}
        <div className="p-5">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2.5 mb-4">
            <Icon name="triangle-exclamation" className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              Vui lòng xác nhận Đóng góp ý{' '}
              <span className="font-bold underline">{targetFeedbackForClosure.title}</span> ({targetFeedbackForClosure.code}).
            </p>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Hành động này sẽ chuyển trạng thái của góp ý thành{' '}
            <span className="font-semibold text-emerald-600">Hoàn tất</span>. Luồng trao đổi sẽ được đóng lại và phụ huynh sẽ nhận được thông báo giải quyết chính thức qua ứng dụng.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
          >
            Xác nhận đóng
          </button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}
