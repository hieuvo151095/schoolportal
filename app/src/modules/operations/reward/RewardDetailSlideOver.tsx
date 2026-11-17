import React, { useState, useEffect } from 'react';
import { SlideOver, Button, StatusTag } from '@/components/ds';
import type { StudentRewardRecord, WeekHistoryItem } from '@/types/reward';

interface RewardDetailSlideOverProps {
  record: StudentRewardRecord | null;
  open: boolean;
  onClose: () => void;
  onSave: (studentId: string, isAwarded: boolean, comment: string) => void;
}

const QUICK_COMMENTS = [
  'Bé đi học chăm ngoan, ăn hết suất và ngủ ngoan.',
  'Bé tích cực tham gia các trò chơi và hoạt động góc.',
  'Bé lễ phép, biết chào hỏi cô giáo và chia sẻ đồ chơi cùng bạn.',
  'Bé phát biểu to rõ, có nhiều tiến bộ trong tuần qua.',
  'Bé cần cố gắng tự xúc cơm nhanh hơn và tập trung hơn trong giờ học.',
];

export default function RewardDetailSlideOver({
  record,
  open,
  onClose,
  onSave,
}: RewardDetailSlideOverProps) {
  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number>(0);
  const [isAwarded, setIsAwarded] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    if (record) {
      setIsAwarded(record.isAwarded);
      setComment(record.teacherComment || '');
      // Find current monthWeek index in record.monthHistory (1-based to 0-based)
      const currentIdx = record.monthHistory.findIndex((h) => h.week === record.monthWeek);
      setSelectedWeekIdx(currentIdx >= 0 ? currentIdx : 0);
    }
  }, [record, open]);

  if (!record) return null;

  const currentHistoryItem: WeekHistoryItem | undefined =
    record.monthHistory[selectedWeekIdx] || record.monthHistory[0];

  const isCurrentViewingWeek = currentHistoryItem?.week === record.monthWeek;
  // If viewing current active week, use the local editable isAwarded state; else use history state
  const displayedAwarded = isCurrentViewingWeek ? isAwarded : (currentHistoryItem?.isAwarded ?? false);

  const handleToggleReward = () => {
    setIsAwarded(!isAwarded);
  };

  const handleSelectQuickComment = (text: string) => {
    setComment(text);
  };

  const handleSave = () => {
    onSave(record.studentId, isAwarded, comment);
    onClose();
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Phiếu Bé Ngoan</span>
          <span className="text-xs font-normal text-slate-500 font-mono">
            ({record.studentCode})
          </span>
        </div>
      }
      description={`Chi tiết kết quả rèn luyện của bé ${record.fullName}`}
      width={520}
      primaryAction={{
        label: 'Lưu thay đổi',
        onClick: handleSave,
      }}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-6 pb-4">
        {/* Student Quick Bio Card */}
        <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-[var(--radius-8)] border border-slate-200">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white border border-slate-200 shadow-sm">
            <img
              src={record.avatarUrl}
              alt={record.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="font-semibold text-[15px] text-[var(--text-heading)] truncate">
              {record.fullName} {record.nickname ? `(${record.nickname})` : ''}
            </h4>
            <p className="text-[12px] text-slate-500 truncate">
              Mã: <span className="font-mono text-slate-700">{record.studentCode}</span> • PH: {record.parentName} ({record.parentPhone})
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="text-[12px] text-slate-600 block">Nghỉ tuần:</span>
            <span className="text-[12px] font-semibold text-slate-800">
              CP: {record.excusedAbsenceCount} | KP: {record.unexcusedAbsenceCount}
            </span>
          </div>
        </div>

        {/* Certificate Preview Card — Designed to match sample portal exactly */}
        <div className="relative rounded-2xl border-2 border-amber-200/90 bg-gradient-to-b from-[#fffef7] to-[#fff9e6] p-6 shadow-sm overflow-hidden text-center">
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Month Week Indicators [1], [2], [3], [4] */}
          <div className="relative z-10 flex items-center justify-center gap-3.5 mb-5">
            {record.monthHistory.map((item, idx) => {
              const isSelected = idx === selectedWeekIdx;
              const hasAward = item.week === record.monthWeek ? isAwarded : item.isAwarded;

              return (
                <button
                  key={item.week}
                  type="button"
                  onClick={() => setSelectedWeekIdx(idx)}
                  className={`w-12 h-16 rounded-xl border flex flex-col items-center justify-center transition-all shadow-xs ${
                    isSelected
                      ? 'border-blue-500 bg-white ring-2 ring-blue-100'
                      : 'border-slate-200 bg-white/80 hover:bg-white hover:border-slate-300'
                  }`}
                  title={`${item.weekLabel} - ${hasAward ? 'Đã nhận phiếu' : 'Chưa nhận phiếu'}`}
                >
                  {/* Top dot indicator */}
                  <div className="h-3 flex items-center justify-center mb-1">
                    {hasAward ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-xs" />
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-slate-300 inline-block" />
                    )}
                  </div>

                  {/* Week number badge */}
                  {isSelected ? (
                    <div className="w-7 h-7 rounded-full bg-[var(--eco-blue-strong)] text-white font-bold text-[13px] flex items-center justify-center shadow-xs">
                      {item.week}
                    </div>
                  ) : (
                    <div className="text-[14px] font-semibold text-slate-700">
                      {item.week}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sun Character Illustration (Awarded vs Unawarded) */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[170px]">
            {displayedAwarded ? (
              <img
                src="/images/reward/sun_awarded.png"
                alt="Chúc mừng bé đã nhận Phiếu Bé Ngoan"
                className="w-40 h-40 object-contain drop-shadow-lg animate-in zoom-in-95 duration-200"
              />
            ) : (
              <img
                src="/images/reward/sun_unawarded.png"
                alt="Chưa có Phiếu Bé Ngoan"
                className="w-40 h-40 object-contain grayscale opacity-65"
              />
            )}
          </div>

          {/* Status Title */}
          <h3 className="relative z-10 text-[18px] font-bold text-slate-900 mt-3">
            {displayedAwarded
              ? 'Chúc mừng bé đã nhận Phiếu Bé Ngoan'
              : 'Chưa có Phiếu Bé Ngoan'}
          </h3>

          {/* Week Pill Badge */}
          <div className="relative z-10 mt-2">
            <span className="inline-block px-4 py-1 rounded-full border border-amber-500 bg-amber-50/90 text-amber-800 text-[12.5px] font-medium shadow-xs">
              {currentHistoryItem?.weekLabel || `Tuần ${record.monthWeek}`}
            </span>
          </div>

          {/* Publication Date */}
          <p className="relative z-10 text-[12px] text-slate-500 mt-2">
            {record.isPublished && record.publishedAt
              ? `Gửi vào ${record.publishedAt}`
              : 'Chưa gửi thông báo cho phụ huynh qua ứng dụng'}
          </p>

          {/* Quick Grant/Revoke Button inside preview when on active week */}
          {isCurrentViewingWeek && (
            <div className="relative z-10 mt-4 pt-3 border-t border-amber-200/60 flex justify-center">
              <Button
                variant={isAwarded ? 'secondary' : 'primary'}
                icon={isAwarded ? 'x-mark' : 'circle-check'}
                onClick={handleToggleReward}
                className={
                  isAwarded
                    ? 'border-amber-400 text-amber-900 hover:bg-amber-100/60'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }
              >
                {isAwarded ? 'Hủy cấp phiếu tuần này' : 'Cấp phiếu bé ngoan ngay'}
              </Button>
            </div>
          )}
        </div>

        {/* Attendance Context */}
        <div className="bg-slate-50 rounded-[var(--radius-8)] border border-slate-200 p-3.5 text-[13px]">
          <div className="font-semibold text-slate-700 mb-2 flex items-center justify-between">
            <span>Tình hình chuyên cần tuần {record.weekNumber} ({record.weekRange}):</span>
            {record.unexcusedAbsenceCount === 0 && record.excusedAbsenceCount === 0 ? (
              <StatusTag tone="success">Đi học đầy đủ 5/5 ngày</StatusTag>
            ) : (
              <StatusTag tone={record.unexcusedAbsenceCount > 0 ? 'danger' : 'warning'}>
                Có ngày vắng
              </StatusTag>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-slate-600">
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="block text-xs text-slate-500">Nghỉ có phép:</span>
              <strong className="text-slate-800 text-[15px]">{record.excusedAbsenceCount}</strong> buổi
            </div>
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="block text-xs text-slate-500">Nghỉ không phép:</span>
              <strong className={`text-[15px] ${record.unexcusedAbsenceCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                {record.unexcusedAbsenceCount}
              </strong> buổi
            </div>
          </div>
        </div>

        {/* Teacher Comment Section */}
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Nhận xét của giáo viên phụ trách:
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Nhập lời khen ngợi, động viên hoặc nhắc nhở dành cho bé trong tuần..."
            className="w-full p-3 text-[13px] bg-white border border-[var(--border-default)] rounded-[var(--radius-8)] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-1 focus:ring-[var(--eco-blue-strong)] transition-all resize-none"
          />

          {/* Quick Comment Templates */}
          <div className="mt-2.5">
            <span className="text-[12px] font-medium text-slate-500 mb-1.5 block">
              Mẫu nhận xét nhanh:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_COMMENTS.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuickComment(template)}
                  className="text-left text-[11.5px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[var(--radius-8)] border border-slate-200 transition-colors"
                >
                  + {template}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideOver>
  );
}
