import React from 'react';
import styled from 'styled-components';
import { DailyAttendanceRecord } from '../../../types/reports';
import { Icon } from '@/components/ds';

interface PersonDetailData {
  name: string;
  code: string;
  roleOrClass: string;
  phone?: string;
  avatarUrl?: string;
  isStaff: boolean;
  totalPresent: number;
  totalAbsentExcused: number;
  totalAbsentUnexcused: number;
  totalLate: number;
  records: Record<string, any>;
}

interface Props {
  person: PersonDetailData;
  days: Array<{ date: string; dayNumber: number; weekday: string }>;
  month: number;
  year: number;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  backdrop-filter: blur(2px);
  padding: 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8fafc;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const Avatar = styled.div<{ $src?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${(props) => (props.$src ? `url(${props.$src}) center/cover no-repeat` : '#e2e8f0')};
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  border: 1px solid #cbd5e1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  line-height: 1;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const Body = styled.div`
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div<{ $bg: string; $color: string; $border: string }>`
  background: ${(props) => props.$bg};
  border: 1px solid ${(props) => props.$border};
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  .label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
  }

  .value {
    font-size: 18px;
    font-weight: 800;
    color: ${(props) => props.$color};
  }
`;

const HistoryTable = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
`;

const HistoryHeader = styled.div`
  padding: 10px 14px;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RecordRow = styled.div<{ $isWeekend?: boolean }>`
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid #f1f5f9;
  background: ${(props) => (props.$isWeekend ? '#fafafa' : '#ffffff')};
  font-size: 12px;

  &:last-child {
    border-bottom: none;
  }
`;

const StatusPill = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  background: ${(props) => {
    switch (props.$type) {
      case 'present':
        return '#dcfce7';
      case 'absent_excused':
        return '#e0f2fe';
      case 'absent_unexcused':
        return '#fee2e2';
      default:
        return '#f1f5f9';
    }
  }};
  color: ${(props) => {
    switch (props.$type) {
      case 'present':
        return '#15803d';
      case 'absent_excused':
        return '#0369a1';
      case 'absent_unexcused':
        return '#b91c1c';
      default:
        return '#64748b';
    }
  }};
`;

export const PersonAttendanceDetailModal: React.FC<Props> = ({
  person,
  days,
  month,
  year,
  onClose,
}) => {
  const monthDisplay = month < 10 ? `0${month}` : `${month}`;

  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderInfo>
            <Avatar $src={person.avatarUrl}>{!person.avatarUrl && '👤'}</Avatar>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                {person.name}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {person.roleOrClass} • Mã: {person.code}
              </div>
            </div>
          </HeaderInfo>
          <CloseButton onClick={onClose} title="Đóng">
            ✕
          </CloseButton>
        </Header>

        <Body>
          {/* 4 Stat Overview Cards */}
          <StatGrid>
            <StatCard $bg="#f0fdf4" $color="#15803d" $border="#bbf7d0">
              <span className="label">Có mặt</span>
              <span className="value">{person.totalPresent} ngày</span>
            </StatCard>

            <StatCard $bg="#f0f9ff" $color="#0369a1" $border="#bae6fd">
              <span className="label">Vắng có phép</span>
              <span className="value">{person.totalAbsentExcused} ngày</span>
            </StatCard>

            <StatCard $bg="#fef2f2" $color="#b91c1c" $border="#fecaca">
              <span className="label">Vắng không phép</span>
              <span className="value">{person.totalAbsentUnexcused} ngày</span>
            </StatCard>

            <StatCard $bg="#fffbeb" $color="#b45309" $border="#fde68a">
              <span className="label">Đi / Về muộn</span>
              <span className="value">{person.totalLate} lần</span>
            </StatCard>
          </StatGrid>

          {/* Daily Records List */}
          <HistoryTable>
            <HistoryHeader>
              <span>Nhật ký điểm danh tháng {monthDisplay}/{year}</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Tổng: {days.length} ngày</span>
            </HistoryHeader>

            {days.map((d) => {
              const isWeekend = d.weekday === 'T7' || d.weekday === 'CN';
              const rec = person.records[d.date];
              const isPresent = rec?.isPresent ?? (rec?.status === 'present');
              const status = rec?.status || (isPresent ? 'present' : isWeekend ? 'weekend' : 'unmarked');

              return (
                <RecordRow key={d.date} $isWeekend={isWeekend}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '95px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: isWeekend ? '#ef4444' : '#64748b',
                        width: '24px',
                      }}
                    >
                      {d.weekday}
                    </span>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>
                      {d.dayNumber}/{monthDisplay}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isWeekend ? (
                      <span style={{ color: '#94a3b8', fontSize: '11px', fontStyle: 'italic' }}>
                        Nghỉ cuối tuần
                      </span>
                    ) : (
                      <>
                        <StatusPill $type={status}>
                          {status === 'present' && '✓ Có mặt'}
                          {status === 'absent_excused' && '⭕ Vắng CP'}
                          {status === 'absent_unexcused' && '⭕ Vắng KP'}
                          {status === 'unmarked' && 'Chưa ghi nhận'}
                        </StatusPill>

                        {rec?.checkInTime && (
                          <span style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace' }}>
                            {rec.checkInTime}
                            {rec.checkOutTime ? ` - ${rec.checkOutTime}` : ''}
                          </span>
                        )}

                        {(rec?.isLateArrival || rec?.isLateDeparture) && (
                          <span
                            title="Đi hoặc về muộn"
                            style={{
                              fontSize: '10px',
                              background: '#fef3c7',
                              color: '#b45309',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              fontWeight: 700,
                            }}
                          >
                            Muộn
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </RecordRow>
              );
            })}
          </HistoryTable>
        </Body>
      </Card>
    </Overlay>
  );
};
