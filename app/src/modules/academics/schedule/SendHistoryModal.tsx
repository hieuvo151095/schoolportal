import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setSendHistoryModalOpen,
  sendScheduleNotification,
} from '../../../store/slices/scheduleSlice';
import { SlideOver, Dropdown, Button, Tag, StatusTag, Icon } from '@/components/ds';

export const SendHistoryModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isSendHistoryModalOpen, activeModalScheduleId, timetables } =
    useAppSelector((state) => state.schedule);

  const [newNote, setNewNote] = useState('');
  const [channel, setChannel] = useState<'all' | 'app_notification' | 'zalo' | 'sms'>('all');

  if (!isSendHistoryModalOpen) return null;

  const targetSchedule = timetables.find((t) => t.id === activeModalScheduleId);
  if (!targetSchedule) return null;

  const handleSendNew = () => {
    dispatch(
      sendScheduleNotification({
        scheduleId: targetSchedule.id,
        senderName: 'Cô Lan Hương (GVCN)',
        senderRole: 'Giáo viên chủ nhiệm',
        channel,
        recipientsCount: 32,
        note: newNote.trim() || 'Thông báo cập nhật thời khóa biểu',
      })
    );
    setNewNote('');
  };

  const handleClose = () => {
    dispatch(setSendHistoryModalOpen({ isOpen: false }));
    setNewNote('');
  };

  const channelOptions = [
    { value: 'all', label: 'Tất cả kênh (App + Zalo OA)' },
    { value: 'app_notification', label: 'Ứng dụng ECO School Phụ huynh' },
    { value: 'zalo', label: 'Zalo Thông báo (ZNS)' },
    { value: 'sms', label: 'Tin nhắn SMS Brandname' },
  ];

  const getChannelBadge = (ch: string) => {
    switch (ch) {
      case 'all':
        return <Tag variant="default">Đa kênh</Tag>;
      case 'app_notification':
        return <Tag variant="default">App PH</Tag>;
      case 'zalo':
        return <Tag variant="success">Zalo OA</Tag>;
      case 'sms':
        return <Tag variant="warning">SMS</Tag>;
      default:
        return <Tag variant="default">{ch}</Tag>;
    }
  };

  return (
    <SlideOver
      open={isSendHistoryModalOpen}
      onClose={handleClose}
      title="Nhật ký & Phát hành thông báo"
      description="Xem lịch sử và gửi thông báo thời khóa biểu đến phụ huynh học sinh"
      icon="paper-plane"
      width={560}
      secondaryAction={{
        label: 'Đóng',
        onClick: handleClose,
      }}
    >
      <div className="space-y-5">
        {/* Schedule Summary Banner */}
        <div className="bg-slate-50 border border-[var(--border-default)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-[var(--text-heading)]">{targetSchedule.title}</h4>
            <p className="text-xs text-[var(--text-subtle)] mt-0.5">
              Lớp <strong>{targetSchedule.className}</strong> • Học kỳ <strong>{targetSchedule.semesterName}</strong>
            </p>
          </div>
          <div className="text-xs text-[var(--text-subtle)] flex items-center gap-1.5 sm:self-center">
            <span>Tổng số lần gửi:</span>
            <span className="font-bold text-[var(--text-heading)] px-2 py-0.5 bg-white border border-[var(--border-default)] rounded-full">
              {targetSchedule.sendHistory.length}
            </span>
          </div>
        </div>

        {/* Dispatch New Notification Card */}
        <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <Icon name="bell" size={14} className="text-[var(--eco-blue-strong)]" />
            <span>Phát hành thông báo mới ngay</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
              Kênh thông báo
            </label>
            <Dropdown
              fullWidth
              value={channel}
              onChange={(val) => setChannel(val as any)}
              options={channelOptions}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
              Ghi chú gửi kèm phụ huynh
            </label>
            <input
              type="text"
              className="w-full h-9 px-3 border border-[var(--border-default)] rounded-lg text-xs bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="VD: Điều chỉnh lịch học tiết chiều từ ngày 15/09..."
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button
              variant="primary"
              size="sm"
              icon="paper-plane"
              onClick={handleSendNew}
            >
              Gửi thông báo (32 PH)
            </Button>
          </div>
        </div>

        {/* History Log List */}
        <div>
          <h5 className="text-xs font-bold text-[var(--text-heading)] mb-2.5">
            Lịch sử các lần phát hành trước (BR07)
          </h5>

          {targetSchedule.sendHistory.length === 0 ? (
            <div className="p-6 text-center text-xs text-[var(--text-subtle)] bg-[var(--bg-muted)] rounded-xl border border-dashed border-[var(--border-default)]">
              Thời khóa biểu này chưa từng gửi thông báo cho phụ huynh.
            </div>
          ) : (
            <div className="space-y-2.5">
              {targetSchedule.sendHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white border border-[var(--border-default)] rounded-xl p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-[var(--text-heading)]">
                      {entry.senderName}
                      <span className="text-[var(--text-subtle)] font-normal ml-1">({entry.senderRole})</span>
                    </span>
                    <span className="text-[11px] text-[var(--text-subtle)] font-mono">
                      {new Date(entry.sentAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      {getChannelBadge(entry.channel)}
                      <span className="text-emerald-700 font-semibold font-numeric inline-flex items-center gap-1">
                        <Icon name="check" size={11} />
                        <span>{entry.recipientsCount} phụ huynh</span>
                      </span>
                    </div>
                  </div>

                  {entry.note && (
                    <div className="text-[11px] text-[var(--text-subtle)] bg-[var(--bg-muted)] p-2 rounded-lg">
                      {entry.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SlideOver>
  );
};

export default SendHistoryModal;
