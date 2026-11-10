import React from 'react';
import { Icon } from '../../../components/ds';
import { WeeklyMenu } from '../../../types/menu';

interface SendHistoryModalProps {
  isOpen: boolean;
  menu: WeeklyMenu | null;
  onClose: () => void;
}

export const SendHistoryModal: React.FC<SendHistoryModalProps> = ({ isOpen, menu, onClose }) => {
  if (!isOpen || !menu) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
              <Icon name="clock-rotate-left" className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Lịch sử gửi thực đơn</h3>
              <p className="text-xs text-gray-500">{menu.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <Icon name="xmark" className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              Chưa có lịch sử gửi nào được ghi nhận cho thực đơn này.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100">
              {history.map((entry, index) => {
                const isAnnouncement = entry.channel === 'announcement_board';
                return (
                  <div key={entry.id || index} className="relative">
                    {/* Timeline bullet dot */}
                    <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-600 shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    <div className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                          <Icon name="user" className="w-3 h-3 text-gray-400" />
                          {entry.senderName}
                          <span className="text-[10px] text-gray-500 font-normal">
                            ({entry.senderRole})
                          </span>
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {formatTimestamp(entry.sentAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px] ${
                            isAnnouncement
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          <Icon
                            name={isAnnouncement ? 'bullhorn' : 'globe'}
                            className="w-3 h-3"
                          />
                          {isAnnouncement ? 'Qua Bảng Thông Tin' : 'Chỉ xuất bản cổng'}
                        </span>
                      </div>

                      {entry.note && (
                        <p className="text-gray-600 text-[11px] pt-1 italic">{entry.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
