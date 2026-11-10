import React from 'react';
import { Icon, SlideOver } from '../../../components/ds';
import { WeeklyMenu } from '../../../types/menu';

interface SendHistoryModalProps {
  isOpen: boolean;
  menu: WeeklyMenu | null;
  onClose: () => void;
}

export const SendHistoryModal: React.FC<SendHistoryModalProps> = ({ isOpen, menu, onClose }) => {
  if (!menu) return null;

  const history = menu.sendHistory || [];

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Lịch sử gửi thực đơn"
      description={`Nhật ký các lần xuất bản và gửi thông báo cho ${menu.title}`}
      icon="clock-rotate-left"
      width={500}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            Chưa có lịch sử gửi nào được ghi nhận cho thực đơn này.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100">
            {history.map((entry, index) => {
              const isAnnouncement = entry.channel === 'announcement_board';
              return (
                <div key={entry.id || index} className="relative">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 border-white bg-[#0070CE] shadow-xs flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Icon name="user" size={12} className="text-slate-400" />
                        {entry.senderName}
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({entry.senderRole})
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatTimestamp(entry.sentAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-medium text-[11px] ${
                          isAnnouncement
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        <Icon
                          name={isAnnouncement ? 'bullhorn' : 'globe'}
                          size={12}
                        />
                        {isAnnouncement ? 'Qua Bảng Thông Tin' : 'Chỉ xuất bản cổng'}
                      </span>
                    </div>

                    {entry.note && (
                      <p className="text-slate-600 text-[11px] pt-1 italic bg-white p-2.5 rounded-lg border border-slate-100">
                        &quot;{entry.note}&quot;
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SlideOver>
  );
};
