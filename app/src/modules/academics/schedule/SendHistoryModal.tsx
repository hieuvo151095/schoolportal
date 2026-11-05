import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setSendHistoryModalOpen,
  sendScheduleNotification,
} from '../../../store/slices/scheduleSlice';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;

  &:hover {
    color: #0f172a;
  }
`;

const Body = styled.div`
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ScheduleBanner = styled.div`
  background: #f1f5f9;
  border-left: 4px solid #0070ce;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
  }

  th {
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
  }
`;

const ChannelBadge = styled.span<{ $channel: string }>`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: #eff6ff;
  color: #1d4ed8;
`;

const DispatchCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  color: #1e293b;
  outline: none;
  resize: vertical;
  min-height: 60px;

  &:focus {
    border-color: #0070ce;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${(props) => (props.$primary ? '#0070ce' : '#cbd5e1')};
  background: ${(props) => (props.$primary ? '#0070ce' : '#ffffff')};
  color: ${(props) => (props.$primary ? '#ffffff' : '#334155')};
  transition: all 0.15s ease;

  &:hover {
    background: ${(props) => (props.$primary ? '#005bb5' : '#f8fafc')};
  }
`;

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
  };

  return (
    <Overlay onClick={handleClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>📋 Lịch Sử Gửi Thông Báo Thời Khóa Biểu</Title>
          <CloseButton onClick={handleClose}>✕</CloseButton>
        </Header>

        <Body>
          <ScheduleBanner>
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>
                {targetSchedule.title}
              </div>
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                Lớp: <strong>{targetSchedule.className}</strong> • Học kỳ: <strong>{targetSchedule.semesterName}</strong>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Tổng số lần gửi: <strong>{targetSchedule.sendHistory.length}</strong>
            </div>
          </ScheduleBanner>

          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px', color: '#334155' }}>
              Nhật ký phát hành thông báo (BR07)
            </div>

            {targetSchedule.sendHistory.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                Thời khóa biểu này chưa từng gửi thông báo cho phụ huynh.
              </div>
            ) : (
              <HistoryTable>
                <thead>
                  <tr>
                    <th>Thời gian gửi</th>
                    <th>Người gửi</th>
                    <th>Kênh</th>
                    <th>Người nhận</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {targetSchedule.sendHistory.map((entry) => (
                    <tr key={entry.id}>
                      <td style={{ whiteSpace: 'nowrap', color: '#475569' }}>
                        {new Date(entry.sentAt).toLocaleString('vi-VN')}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{entry.senderName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {entry.senderRole}
                        </div>
                      </td>
                      <td>
                        <ChannelBadge $channel={entry.channel}>
                          {entry.channel === 'all' && 'Đa kênh (App + Zalo)'}
                          {entry.channel === 'app_notification' && 'App phụ huynh'}
                          {entry.channel === 'zalo' && 'Zalo OA'}
                          {entry.channel === 'sms' && 'SMS'}
                        </ChannelBadge>
                      </td>
                      <td style={{ fontWeight: 600, color: '#15803d' }}>
                        {entry.recipientsCount} PH
                      </td>
                      <td style={{ color: '#334155' }}>{entry.note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </HistoryTable>
            )}
          </div>

          <DispatchCard>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
              📢 Gửi thông báo cập nhật mới ngay bây giờ
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Kênh phát hành:
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              >
                <option value="all">Tất cả kênh (App + Zalo OA)</option>
                <option value="app_notification">Chỉ App Phụ Huynh</option>
                <option value="zalo">Zalo OA</option>
                <option value="sms">Tin nhắn SMS</option>
              </select>
            </div>
            <Textarea
              placeholder="Nhập nội dung lưu ý cho phụ huynh (ví dụ: Thay đổi phòng học môn Tin học từ tuần sau)..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button $primary type="button" onClick={handleSendNew}>
                Gửi thông báo & Cập nhật
              </Button>
            </div>
          </DispatchCard>
        </Body>

        <Footer>
          <Button onClick={handleClose}>Đóng</Button>
        </Footer>
      </ModalCard>
    </Overlay>
  );
};
