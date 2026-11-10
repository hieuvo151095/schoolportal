import React from 'react';
import { Icon } from '@/components/ds';
import { StudentVoterRecord } from '@/types/poll';

interface VoteHistoryModalProps {
  voter: StudentVoterRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VoteHistoryModal: React.FC<VoteHistoryModalProps> = ({
  voter,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !voter) return null;

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#0070CE]">
            <Icon name="clock" className="w-4 h-4" />
            <span className="text-sm font-bold text-slate-800">
              Lịch sử bình chọn: {voter.studentName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <Icon name="xmark" className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
            <div>
              <p className="text-xs text-slate-500 font-medium">Học sinh:</p>
              <p className="text-sm font-bold text-slate-900">{voter.studentName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">Lớp:</p>
              <p className="text-sm font-bold text-[#0070CE]">{voter.className}</p>
            </div>
          </div>

          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Toàn bộ các lần thay đổi lựa chọn ({voter.voteHistory.length} lần):
          </h4>

          {voter.voteHistory.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-4 text-center">
              Chưa có lịch sử thay đổi nào được ghi nhận.
            </p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {voter.voteHistory.map((item, index) => {
                const isLatest = index === voter.voteHistory.length - 1;
                return (
                  <div
                    key={item.id || index}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isLatest
                        ? 'bg-emerald-50/50 border-emerald-200 shadow-sm'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          isLatest
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        Lần {index + 1} {isLatest && '(Hiện tại)'}
                      </span>
                      <span className="text-slate-500 font-medium flex items-center">
                        <Icon name="clock" className="mr-1 w-3 h-3 text-slate-400" />
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-slate-800 flex items-start mt-2">
                      <Icon
                        name="check"
                        className={`mr-2 mt-1 w-3.5 h-3.5 shrink-0 ${
                          isLatest ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                      <div>
                        {item.selectedOptionTitles.map((title, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-block bg-white px-2 py-0.5 rounded border border-slate-200 text-xs font-medium text-slate-800 mr-1 mb-1 shadow-2xs"
                          >
                            {title}
                          </span>
                        ))}
                      </div>
                    </div>

                    {item.voterName && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        Người thực hiện: {item.voterName}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
export default VoteHistoryModal;
