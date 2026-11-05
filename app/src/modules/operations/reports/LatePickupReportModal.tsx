import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeLateFeeModal } from '../../../store/slices/reportsSlice';
import { computeLatePickupFee } from '../../../utils/reportsValidation';

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
  max-width: 580px;
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
  max-height: 70vh;
  overflow-y: auto;
`;

const SurchargeNotice = styled.div`
  background-color: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  color: #92400E;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon {
    font-size: 18px;
  }
`;

const SummaryStatBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  background: #F8FAFC;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;

  .stat-item {
    text-align: center;
    .label {
      font-size: 11px;
      color: #64748B;
      font-weight: 600;
      text-transform: uppercase;
    }
    .value {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      margin-top: 4px;
    }
    .highlight {
      color: #EF4444;
    }
  }
`;

const OvertimeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    background: #F1F5F9;
    color: #475569;
    font-weight: 600;
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid #CBD5E1;
  }

  td {
    padding: 10px 12px;
    border-bottom: 1px solid #F1F5F9;
    color: #334155;
  }

  tr:hover td {
    background-color: #F8FAFC;
  }

  .fee {
    font-weight: 700;
    color: #EF4444;
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

export const LatePickupReportModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const student = useAppSelector(state => state.reports.selectedLateFeeReport);

  if (!student) return null;

  const handleClose = () => {
    dispatch(closeLateFeeModal());
  };

  // Filter records where late departure occurred
  const lateRecords = Object.entries(student.records)
    .filter(([_, rec]) => rec.isLateDeparture && (rec.lateDepartureMinutes || 0) > 0)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB));

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalCard onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="late-fee-title">
        <ModalHeader>
          <h3 id="late-fee-title">Báo Cáo Đón Muộn — {student.studentName}</h3>
          <button onClick={handleClose} aria-label="Đóng">&times;</button>
        </ModalHeader>

        <ModalBody>
          <SurchargeNotice>
            <span className="icon">⏱️</span>
            <div>
              <strong>Quy định đón muộn (BR05, BR06):</strong> Giờ tan học chuẩn là <strong>17:30</strong>. Phụ phí áp dụng <strong>50.000 đ / block 30 phút</strong> hoặc phần lẻ 30 phút quá giờ.
            </div>
          </SurchargeNotice>

          <SummaryStatBox>
            <div className="stat-item">
              <div className="label">Số lần đón muộn</div>
              <div className="value">{student.totalLateDepartures} lần</div>
            </div>
            <div className="stat-item">
              <div className="label">Tổng phút muộn</div>
              <div className="value">{student.totalLateDepartureMinutes} phút</div>
            </div>
            <div className="stat-item">
              <div className="label">Tổng tiền phụ phí</div>
              <div className="value highlight">{student.estimatedLateFee.toLocaleString('vi-VN')} đ</div>
            </div>
          </SummaryStatBox>

          <OvertimeTable>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Giờ về</th>
                <th>Số phút muộn</th>
                <th>Phụ phí tính</th>
              </tr>
            </thead>
            <tbody>
              {lateRecords.map(([date, rec]) => {
                const mins = rec.lateDepartureMinutes || 0;
                const fee = computeLatePickupFee(mins);
                return (
                  <tr key={date}>
                    <td><strong>{date} ({rec.weekday})</strong></td>
                    <td>{rec.checkOutTime || '--:--'}</td>
                    <td>+{mins} phút</td>
                    <td className="fee">{fee.toLocaleString('vi-VN')} đ</td>
                  </tr>
                );
              })}
            </tbody>
          </OvertimeTable>
        </ModalBody>

        <ModalFooter>
          <Button $variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button $variant="primary" onClick={() => {
            alert(`Đã xuất bảng tính phụ phí đón muộn cho học sinh ${student.studentName}: ${student.estimatedLateFee.toLocaleString('vi-VN')} đ.`);
            handleClose();
          }}>
            Xuất Phiếu Thu Phụ Phí
          </Button>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};
