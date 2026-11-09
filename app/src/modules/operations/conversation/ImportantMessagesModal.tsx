import React from 'react';
import { SlideOver, Icon } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import { dismissImportantAlert } from '../../../store/slices/conversationSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
}

export const ImportantMessagesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  conversationId,
}) => {
  const dispatch = useAppDispatch();
  const alerts = useAppSelector(
    (state) => state.conversation.importantAlertsByConversation[conversationId] || []
  );

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      icon="circle-exclamation"
      title="Tin Nhắn Quan Trọng Đang Diễn Ra"
      description="Danh sách các thông báo dặn thuốc, báo ốm và sự kiện cần lưu ý trong cuộc trò chuyện"
      width={480}
      primaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
      secondaryAction={null}
    >
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--text-subtle)]">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-subtle)]">
              <Icon name="check" size={20} />
            </div>
            Không có sự kiện quan trọng hoặc báo vắng nào cần lưu ý
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-[var(--radius-8)] p-3.5 flex items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      alert.type === 'bao_om'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {alert.type === 'bao_om' ? 'Báo ốm' : 'Báo vắng'}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-heading)]">
                    {alert.title}
                  </span>
                </div>

                <div className="text-xs text-[var(--text-subtle)] mb-1">
                  <strong>Thời gian:</strong> {alert.dateRange}
                </div>

                {alert.note && (
                  <div className="text-xs text-[var(--text-heading)] bg-[var(--bg-surface)] p-2 rounded-[var(--radius-6)] border border-[var(--border-subtle)] mt-1.5 leading-relaxed">
                    {alert.note}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  dispatch(dismissImportantAlert({ conversationId, alertId: alert.id }))
                }
                title="Gỡ thông báo này"
                className="shrink-0 px-2.5 py-1 text-xs font-semibold text-[var(--text-subtle)] hover:text-rose-700 hover:bg-rose-50 border border-[var(--border-default)] hover:border-rose-200 rounded-[var(--radius-6)] transition-all cursor-pointer"
              >
                Gỡ bỏ ✕
              </button>
            </div>
          ))
        )}
      </div>
    </SlideOver>
  );
};
