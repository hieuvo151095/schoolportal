import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  openAbsenceEditModal,
  openDayDetailModal,
  openLateFeeModal,
} from '../../../store/slices/reportsSlice';
import { computeDaysInMonth } from '../../../utils/reportsValidation';
import { DailyAttendanceRecord } from '../../../types/reports';

const GridWrapper = styled.div`
  background: transparent;
  border-radius: 0;
  border: none;
  overflow: hidden;
  box-shadow: none;
  display: flex;
  flex-direction: column;
`;

const ScrollContainer = styled.div`
  overflow-x: auto;
  max-width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  white-space: nowrap;
`;

const Th = styled.th<{ $isWeekend?: boolean; $isSticky?: boolean; $isHeaderTitle?: boolean }>`
  background: ${(props) =>
    props.$isHeaderTitle
      ? '#EFF6FF'
      : props.$isWeekend
      ? '#fef2f2'
      : '#f8fafc'};
  color: ${(props) =>
    props.$isHeaderTitle
      ? '#0070CE'
      : props.$isWeekend
      ? '#dc2626'
      : '#475569'};
  padding: ${(props) => (props.$isHeaderTitle ? '10px 16px' : '8px 4px')};
  text-align: center;
  font-weight: 700;
  border: 1px solid #e2e8f0;
  min-width: 32px;

  ${(props) =>
    props.$isSticky &&
    `
    position: sticky;
    left: 0;
    z-index: 10;
    min-width: 280px;
    width: 280px;
    text-align: left;
    padding-left: 16px;
    background: #f8fafc;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.03);

    @media (max-width: 640px) {
      min-width: 170px;
      width: 170px;
      padding-left: 8px;
    }
  `}
`;

const Td = styled.td<{ $isSticky?: boolean; $isWeekend?: boolean }>`
  border: 1px solid #e2e8f0;
  padding: 4px 4px;
  text-align: center;
  background: ${(props) => (props.$isWeekend ? '#fafafa' : '#ffffff')};

  ${(props) =>
    props.$isSticky &&
    `
    position: sticky;
    left: 0;
    z-index: 5;
    background: #ffffff;
    padding: 10px 16px;
    text-align: left;
    min-width: 280px;
    width: 280px;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.03);

    @media (max-width: 640px) {
      min-width: 170px;
      width: 170px;
      padding: 8px 8px;
    }
  `}
`;

const CellBtn = styled.button<{ $hasData: boolean }>`
  border: none;
  background: none;
  width: 100%;
  height: 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  border-radius: 4px;
  cursor: ${(props) => (props.$hasData ? 'pointer' : 'default')};
  transition: all 0.15s;

  &:hover {
    background: ${(props) => (props.$hasData ? '#f1f5f9' : 'transparent')};
  }
`;

const CheckMark = styled.span`
  color: #10b981;
  font-weight: 800;
  font-size: 13px;
  line-height: 1;
`;

const LateClock = styled.span`
  font-size: 11px;
  line-height: 1;
`;

const CircleP = styled.span`
  color: #0284c7;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
`;

const CircleKP = styled.span`
  color: #ef4444;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
`;

const StudentFrame = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const AvatarImg = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
`;

const AvatarPlaceholder = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const StudentInfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

const StudentNameText = styled.a`
  font-weight: 800;
  font-size: 13px;
  color: #0070ce;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`;

const ParentNameText = styled.div`
  font-size: 11px;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PhoneText = styled.div`
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TotalsBadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  font-size: 11px;
  color: #334155;
  background: #f8fafc;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid #f1f5f9;
  width: fit-content;

  .item {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-weight: 700;
  }

  .sep {
    color: #cbd5e1;
    font-weight: 400;
  }
`;

const LegendBar = styled.div`
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 12px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #334155;
  font-weight: 600;
`;

export const AttendanceCalendarGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    activeTab,
    selectedYear,
    selectedMonth,
    selectedClassId,
    selectedRole,
    studentRoster,
    staffRoster,
    staffSearchQuery,
  } = useAppSelector((state) => state.reports);

  const days = computeDaysInMonth(selectedYear, selectedMonth);

  const handleCellClick = (
    studentName: string,
    studentId: string,
    record: DailyAttendanceRecord
  ) => {
    if (
      record.status === 'present' ||
      record.isLateArrival ||
      record.isLateDeparture
    ) {
      dispatch(openDayDetailModal({ studentName, record }));
    } else if (
      record.status === 'absent_excused' ||
      record.status === 'absent_unexcused'
    ) {
      dispatch(openAbsenceEditModal({ studentId, studentName, record }));
    }
  };

  if (activeTab === 'staff') {
    const filteredStaff = staffRoster.filter((s) => {
      const matchesSearch =
        s.staffName.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        s.staffCode.toLowerCase().includes(staffSearchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || s.role === selectedRole;
      return matchesSearch && matchesRole;
    });

    const monthDisplay = selectedMonth < 10 ? `0${selectedMonth}` : `${selectedMonth}`;

    return (
      <GridWrapper>
        <ScrollContainer>
          <Table>
            <thead>
              {/* Row 1: Fixed Headers and Spanning Month Title */}
              <tr>
                <Th rowSpan={2} style={{ width: '40px', textAlign: 'center' }}>
                  #
                </Th>
                <Th rowSpan={2} $isSticky>
                  <span>Nhân viên</span>
                  <span style={{ color: '#94a3b8', marginLeft: '6px' }}>⇅</span>
                </Th>
                <Th rowSpan={2} style={{ width: '64px', textAlign: 'center' }}>
                  Buổi
                </Th>
                <Th
                  colSpan={days.length}
                  $isHeaderTitle
                >
                  Báo cáo điểm danh nhân viên tháng {monthDisplay}/{selectedYear}
                </Th>
              </tr>

              {/* Row 2: Subheaders for Each Day */}
              <tr>
                {days.map((d) => {
                  const isWeekend = d.weekday === 'T7' || d.weekday === 'CN';
                  return (
                    <Th
                      key={d.date}
                      $isWeekend={isWeekend}
                      style={{ minWidth: '32px', padding: '4px 2px' }}
                    >
                      <div style={{ fontSize: '10px', opacity: 0.85 }}>{d.weekday}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700 }}>{d.dayNumber}</div>
                    </Th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff, index) => {
                const staffIdx = index + 1;

                return (
                  <React.Fragment key={staff.staffId}>
                    {/* Row 1: Sáng (Morning) */}
                    <tr>
                      {/* STT (#) Cell */}
                      <Td
                        rowSpan={2}
                        style={{
                          textAlign: 'center',
                          fontWeight: 600,
                          color: '#64748b',
                          background: '#f8fafc',
                        }}
                      >
                        {staffIdx}
                      </Td>

                      {/* Staff Info Card (Sticky with Totals in Frame) */}
                      <Td rowSpan={2} $isSticky>
                        <StudentFrame>
                          {staff.avatarUrl ? (
                            <AvatarImg
                              src={staff.avatarUrl}
                              alt={staff.staffName}
                            />
                          ) : (
                            <AvatarPlaceholder>👤</AvatarPlaceholder>
                          )}

                          <StudentInfoCol>
                            <StudentNameText
                              style={{ cursor: 'default' }}
                              title={`Mã nhân viên: ${staff.staffCode}`}
                            >
                              {staff.staffName}
                            </StudentNameText>

                            <ParentNameText>
                              {staff.roleName} • {staff.department}
                            </ParentNameText>

                            <PhoneText>
                              <span>📞</span>
                              <span>{staff.phone || staff.staffCode}</span>
                            </PhoneText>

                            {/* Totals inside Staff's Name Frame */}
                            <TotalsBadgeRow>
                              <span
                                className="item"
                                style={{ color: '#10b981' }}
                                title="Tổng ngày làm / tham dự"
                              >
                                <span style={{ fontSize: '12px' }}>✓</span>
                                <span>{staff.totalPresent}</span>
                              </span>

                              <span className="sep">-</span>

                              <span
                                className="item"
                                style={{ color: '#0284c7' }}
                                title="Vắng có phép"
                              >
                                <span style={{ fontSize: '12px' }}>⭕</span>
                                <span>{staff.totalAbsentExcused || 0}</span>
                              </span>

                              <span className="sep">-</span>

                              <span
                                className="item"
                                style={{ color: '#ef4444' }}
                                title="Vắng không phép"
                              >
                                <span style={{ fontSize: '12px' }}>⭕</span>
                                <span>{staff.totalAbsentUnexcused || 0}</span>
                              </span>

                              <span className="sep">-</span>

                              <span
                                className="item"
                                style={{ color: '#f59e0b' }}
                                title="Đến hoặc về muộn"
                              >
                                <span style={{ fontSize: '11px' }}>⏱️</span>
                                <span>{staff.totalLate || 0}</span>
                              </span>
                            </TotalsBadgeRow>
                          </StudentInfoCol>
                        </StudentFrame>
                      </Td>

                      {/* Buổi: Sáng */}
                      <Td
                        style={{
                          textAlign: 'center',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#475569',
                          background: '#f8fafc',
                        }}
                      >
                        Sáng
                      </Td>

                      {/* Morning Day Cells */}
                      {days.map((d) => {
                        const isWeekend = d.weekday === 'T7' || d.weekday === 'CN';
                        const isExcusedAbsent = staff.staffId === 'gv-002' && d.dayNumber === 15;

                        return (
                          <Td key={`staff-m-${d.date}`} $isWeekend={isWeekend}>
                            {!isWeekend && (
                              isExcusedAbsent ? (
                                <CircleP title="Vắng có phép">⭕</CircleP>
                              ) : (
                                <CheckMark title="Tham dự">✓</CheckMark>
                              )
                            )}
                          </Td>
                        );
                      })}
                    </tr>

                    {/* Row 2: Chiều (Afternoon) */}
                    <tr>
                      {/* Buổi: Chiều */}
                      <Td
                        style={{
                          textAlign: 'center',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#475569',
                          background: '#f8fafc',
                        }}
                      >
                        Chiều
                      </Td>

                      {/* Afternoon Day Cells */}
                      {days.map((d) => {
                        const isWeekend = d.weekday === 'T7' || d.weekday === 'CN';
                        const isExcusedAbsent = staff.staffId === 'gv-002' && d.dayNumber === 15;

                        return (
                          <Td key={`staff-a-${d.date}`} $isWeekend={isWeekend}>
                            {!isWeekend && (
                              isExcusedAbsent ? (
                                <CircleP title="Vắng có phép">⭕</CircleP>
                              ) : (
                                <CheckMark title="Tham dự">✓</CheckMark>
                              )
                            )}
                          </Td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </ScrollContainer>

        {/* Bottom Legend Bar */}
        <LegendBar>
          <LegendItem>
            <CheckMark>✓</CheckMark>
            <span>Tham dự</span>
          </LegendItem>

          <LegendItem>
            <CircleP>⭕</CircleP>
            <span>Vắng có phép</span>
          </LegendItem>

          <LegendItem>
            <CircleKP>⭕</CircleKP>
            <span>Vắng không phép</span>
          </LegendItem>

          <LegendItem>
            <LateClock>⏱️</LateClock>
            <span>Đến/Về muộn</span>
          </LegendItem>
        </LegendBar>
      </GridWrapper>
    );
  }

  // Student Monthly Grid - Redesigned per Reference Screenshot
  const monthDisplay = selectedMonth < 10 ? `0${selectedMonth}` : `${selectedMonth}`;
  const classDisplayName =
    selectedClassId === 'lop-1a2'
      ? 'Lá'
      : selectedClassId === 'infant'
      ? 'Nhà trẻ'
      : 'Lá';

  return (
    <GridWrapper>
      <ScrollContainer>
        <Table>
          <thead>
            {/* Row 1: Fixed Headers and Spanning Month Title */}
            <tr>
              <Th rowSpan={2} style={{ width: '40px', textAlign: 'center' }}>
                #
              </Th>
              <Th rowSpan={2} $isSticky>
                <span>Học sinh</span>
                <span style={{ color: '#94a3b8', marginLeft: '6px' }}>⇅</span>
              </Th>
              <Th rowSpan={2} style={{ width: '64px', textAlign: 'center' }}>
                Buổi
              </Th>
              <Th
                colSpan={days.length}
                $isHeaderTitle
              >
                Báo cáo điểm danh lớp {classDisplayName} tháng {monthDisplay}/{selectedYear}
              </Th>
            </tr>

            {/* Row 2: Subheaders for Each Day */}
            <tr>
              {days.map((d) => {
                const isWeekend = d.weekday === 'T7' || d.weekday === 'CN';
                return (
                  <Th
                    key={d.date}
                    $isWeekend={isWeekend}
                    style={{ minWidth: '32px', padding: '4px 2px' }}
                  >
                    <div style={{ fontSize: '10px', opacity: 0.85 }}>{d.weekday}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700 }}>{d.dayNumber}</div>
                  </Th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {studentRoster.map((student, index) => {
              const studentIdx = index + 1;

              return (
                <React.Fragment key={student.studentId}>
                  {/* Row 1: Sáng (Morning) */}
                  <tr>
                    {/* STT (#) Cell */}
                    <Td
                      rowSpan={2}
                      style={{
                        textAlign: 'center',
                        fontWeight: 600,
                        color: '#64748b',
                        background: '#f8fafc',
                      }}
                    >
                      {studentIdx}
                    </Td>

                    {/* Student Info Card (Sticky with Totals in Frame) */}
                    <Td rowSpan={2} $isSticky>
                      <StudentFrame>
                        {student.avatarUrl ? (
                          <AvatarImg
                            src={student.avatarUrl}
                            alt={student.studentName}
                          />
                        ) : (
                          <AvatarPlaceholder>👤</AvatarPlaceholder>
                        )}

                        <StudentInfoCol>
                          <StudentNameText
                            title="Bấm để xem hồ sơ học sinh"
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(openLateFeeModal(student));
                            }}
                          >
                            {student.studentName}
                          </StudentNameText>

                          <ParentNameText>
                            {student.parentName || 'Nguyễn Hoàng Huyền My'}
                          </ParentNameText>

                          <PhoneText>
                            <span>📞</span>
                            <span>{student.phone || '012067164112'}</span>
                          </PhoneText>

                          {/* The Totals frame in student's name frame */}
                          <TotalsBadgeRow>
                            <span
                              className="item"
                              style={{ color: '#10b981' }}
                              title="Tổng ngày tham dự"
                            >
                              <span style={{ fontSize: '12px' }}>✓</span>
                              <span>{student.totalPresent}</span>
                            </span>

                            <span className="sep">-</span>

                            <span
                              className="item"
                              style={{ color: '#0284c7' }}
                              title="Vắng có phép"
                            >
                              <span style={{ fontSize: '12px' }}>⭕</span>
                              <span>{student.totalAbsentExcused}</span>
                            </span>

                            <span className="sep">-</span>

                            <span
                              className="item"
                              style={{ color: '#ef4444' }}
                              title="Vắng không phép"
                            >
                              <span style={{ fontSize: '12px' }}>⭕</span>
                              <span>{student.totalAbsentUnexcused}</span>
                            </span>

                            <span className="sep">-</span>

                            <span
                              className="item"
                              style={{ color: '#f59e0b' }}
                              title="Đến hoặc về muộn"
                            >
                              <span style={{ fontSize: '11px' }}>⏱️</span>
                              <span>
                                {student.totalLateArrivals + student.totalLateDepartures}
                              </span>
                            </span>
                          </TotalsBadgeRow>
                        </StudentInfoCol>
                      </StudentFrame>
                    </Td>

                    {/* Buổi: Sáng */}
                    <Td
                      style={{
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#475569',
                        background: '#f8fafc',
                      }}
                    >
                      Sáng
                    </Td>

                    {/* Morning Day Cells */}
                    {days.map((d) => {
                      const record = student.records[d.date];
                      const isWeekend = d.weekday === 'T7' || d.weekday === 'CN';
                      const hasData = record && record.status !== 'unmarked';

                      return (
                        <Td key={`m-${d.date}`} $isWeekend={isWeekend}>
                          {record && hasData && !isWeekend ? (
                            <CellBtn
                              $hasData={true}
                              onClick={() =>
                                handleCellClick(
                                  student.studentName,
                                  student.studentId,
                                  record
                                )
                              }
                              title={`Buổi sáng ${d.dayNumber}/${monthDisplay}: ${
                                record.status === 'present'
                                  ? 'Tham dự'
                                  : record.status === 'absent_excused'
                                  ? 'Vắng có phép'
                                  : 'Vắng không phép'
                              }`}
                            >
                              {record.status === 'present' && (
                                <>
                                  <CheckMark>✓</CheckMark>
                                  {record.isLateArrival && (
                                    <LateClock title="Đến muộn">⏱️</LateClock>
                                  )}
                                </>
                              )}
                              {record.status === 'absent_excused' && (
                                <CircleP title="Vắng có phép">⭕</CircleP>
                              )}
                              {record.status === 'absent_unexcused' && (
                                <CircleKP title="Vắng không phép">⭕</CircleKP>
                              )}
                            </CellBtn>
                          ) : null}
                        </Td>
                      );
                    })}
                  </tr>

                  {/* Row 2: Chiều (Afternoon) */}
                  <tr>
                    {/* Buổi: Chiều */}
                    <Td
                      style={{
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#475569',
                        background: '#f8fafc',
                      }}
                    >
                      Chiều
                    </Td>

                    {/* Afternoon Day Cells */}
                    {days.map((d) => {
                      const record = student.records[d.date];
                      const isWeekend = d.weekday === 'T7' || d.weekday === 'CN';
                      const hasData = record && record.status !== 'unmarked';

                      return (
                        <Td key={`a-${d.date}`} $isWeekend={isWeekend}>
                          {record && hasData && !isWeekend ? (
                            <CellBtn
                              $hasData={true}
                              onClick={() =>
                                handleCellClick(
                                  student.studentName,
                                  student.studentId,
                                  record
                                )
                              }
                              title={`Buổi chiều ${d.dayNumber}/${monthDisplay}: ${
                                record.status === 'present'
                                  ? 'Tham dự'
                                  : record.status === 'absent_excused'
                                  ? 'Vắng có phép'
                                  : 'Vắng không phép'
                              }`}
                            >
                              {record.status === 'present' && (
                                <>
                                  <CheckMark>✓</CheckMark>
                                  {record.isLateDeparture && (
                                    <LateClock title="Về muộn">⏱️</LateClock>
                                  )}
                                </>
                              )}
                              {record.status === 'absent_excused' && (
                                <CircleP title="Vắng có phép">⭕</CircleP>
                              )}
                              {record.status === 'absent_unexcused' && (
                                <CircleKP title="Vắng không phép">⭕</CircleKP>
                              )}
                            </CellBtn>
                          ) : null}
                        </Td>
                      );
                    })}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </Table>
      </ScrollContainer>

      {/* Bottom Legend Bar */}
      <LegendBar>
        <LegendItem>
          <CheckMark>✓</CheckMark>
          <span>Tham dự</span>
        </LegendItem>

        <LegendItem>
          <CircleP>⭕</CircleP>
          <span>Vắng có phép</span>
        </LegendItem>

        <LegendItem>
          <CircleKP>⭕</CircleKP>
          <span>Vắng không phép</span>
        </LegendItem>

        <LegendItem>
          <LateClock>⏱️</LateClock>
          <span>Đến/Về muộn</span>
        </LegendItem>
      </LegendBar>
    </GridWrapper>
  );
};
