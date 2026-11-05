import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeDayDetailModal, openAbsenceEditModal } from '../../../store/slices/reportsSlice';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(2px);
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 1px solid #E2E8F0;
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F8FAFC;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1E293B;
    margin: 0;
  }

  button {
    background: none;
    border: none;
    color: #64748B;
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
    padding: 4px;
    &:hover {
      color: #0F172A;
    }
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 6px 0;
  border-bottom: 1px dashed #F1F5F9;

  .label {
    color: #64748B;
    font-weight: 500;
  }
  .value {
    color: #0F172A;
    font-weight: 600;
  }
`;

const StatusTag = styled.span<{ $type: 'present' | 'absent_excused' | 'absent_unexcused' | 'unmarked' }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background-color: ${props => 
    props.$type === 'present' ? '#DCFCE7' : 
    props.$type === 'absent_excused' ? '#FEF3C7' : 
    props.$type === 'absent_unexcused' ? '#FEE2E2' : '#F1F5F9'};
  color: ${props => 
    props.$type === 'present' ? '#166534' : 
    props.$type === 'absent_excused' ? '#92400E' : 
    props.$type === 'absent_unexcused' ? '#991B1B' : '#64748B'};
`;

const NoteBox = styled.div`
  background: #F8FAFC;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #E2E8F0;
  font-size: 13px;
  color: #334155;
  .title {
    font-weight: 600;
    color: #475569;
    margin-bottom: 4px;
  }
`;

const ModalFooter = styled.div`
  padding: 14px 20px;
  border-top: 1px solid #E2E8F0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background-color: #F8FAFC;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  border: 1px solid ${props => (props.$variant === 'primary' ? '#0070CE' : '#CBD5E1')};
  background-color: ${props => (props.$variant === 'primary' ? '#0070CE' : '#FFFFFF')};
  color: ${props => (props.$variant === 'primary' ? '#FFFFFF' : '#334155')};

  &:hover {
    background-color: ${props => (props.$variant === 'primary' ? '#005bb5' : '#F1F5F9')};
  }
`;

export const DailyAttendanceModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedDayDetail = useAppSelector(state => state.reports.selectedDayDetail);

  if (!selectedDayDetail) return null;

  const { studentName, record } = selectedDayDetail;
  const isAbsent = record.status === 'absent_excused' || record.status === 'absent_unexcused';

  const handleClose = () => {
    dispatch(closeDayDetailModal());
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalCard onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="day-detail-title">
        <ModalHeader>
          <h3 id="day-detail-title">Chi Tiết Điểm Danh — {record.date}</h3>
          <button onClick={handleClose} aria-label="Đóng">&times;</button>
        </ModalHeader>

        <ModalBody>
          <InfoRow>
            <span className="label">Học sinh</span>
            <span className="value">{studentName}</span>
          </InfoRow>

          <InfoRow>
            <span className="label">Trạng thái</span>
            <StatusTag $type={record.status}>
              {record.status === 'present' && 'Có mặt'}
              {record.status === 'absent_excused' && 'Nghỉ có phép (P)'}
              {record.status === 'absent_unexcused' && 'Nghỉ không phép (KP)'}
              {record.status === 'unmarked' && 'Chưa ghi nhận'}
            </StatusTag>
          </InfoRow>

          {record.status === 'present' ? (
            <>
              <InfoRow>
                <span className="label">Giờ đến (Check-in)</span>
                <span className="value">
                  {record.checkInTime || '--:--'}
                  {record.isLateArrival && (
                    <span style={{ color: '#F59E0B', marginLeft: 6, fontWeight: 700 }}>
                      (+{record.lateArrivalMinutes}p đến muộn)
                    </span>
                  )}
                </span>
              </InfoRow>

              <InfoRow>
                <span className="label">Giáo viên đón</span>
                <span className="value">{record.checkInStaff || 'Cô Nguyễn Mai'}</span>
              </InfoRow>

              <InfoRow>
                <span className="label">Giờ về (Check-out)</span>
                <span className="value">
                  {record.checkOutTime || '--:--'}
                  {record.isLateDeparture && (
                    <span style={{ color: '#EF4444', marginLeft: 6, fontWeight: 700 }}>
                      (+{record.lateDepartureMinutes}p về muộn)
                    </span>
                  )}
                </span>
              </InfoRow>

              <InfoRow>
                <span className="label">Giáo viên trả trẻ</span>
                <span className="value">{record.checkOutStaff || 'Cô Thu Thủy'}</span>
              </InfoRow>

              <InfoRow>
                <span className="label">Thân nhiệt</span>
                <span className="value">
                  {record.temperature ? `${record.temperature}°C` : '36.5°C (Bình thường)'}
                </span>
              </InfoRow>

              <InfoRow>
                <span className="label">Tình trạng sức khỏe</span>
                <span className="value">{record.healthStatus || 'Tốt, vui vẻ'}</span>
              </InfoRow>
            </>
          ) : (
            <>
              <NoteBox>
                <div className="title">Lý do vắng mặt:</div>
                <div>{record.notes || 'Gia đình có việc riêng, phụ huynh đã gửi đơn xin nghỉ qua cổng Trao đổi.'}</div>
              </NoteBox>

              <InfoRow>
                <span className="label">Người duyệt / ghi nhận</span>
                <span className="value">{record.checkInStaff || 'Cô Nguyễn Mai'}</span>
              </InfoRow>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button $variant="primary" onClick={handleClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};
