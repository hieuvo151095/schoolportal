import React from 'react';
import styled from 'styled-components';
import { DayOfWeek, TimeSlotRow, TimetableCell } from '../../../types/schedule';
import { mockSubjects } from '../../../services/mockScheduleData';

const GridWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 180px repeat(6, 1fr);
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
`;

const HeaderCell = styled.div`
  padding: 12px 10px;
  text-align: center;
  font-weight: 700;
  font-size: 13px;
  color: #334155;
  border-right: 1px solid #e2e8f0;

  &:last-child {
    border-right: none;
  }
`;

const SlotRow = styled.div`
  display: grid;
  grid-template-columns: 180px repeat(6, 1fr);
  border-bottom: 1px solid #f1f5f9;
  background: #ffffff;
  min-height: 90px;
  transition: background 0.15s ease;

  &:hover {
    background: #fafafa;
  }
`;

const TimeCol = styled.div`
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  gap: 4px;
`;

const SlotName = styled.div`
  font-weight: 700;
  font-size: 13px;
  color: #1e293b;
`;

const SlotTime = styled.div`
  font-size: 12px;
  color: #64748b;
  font-family: monospace;
  margin-top: 2px;
`;

const SlotNameInput = styled.input`
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  background: #ffffff;
  outline: none;

  &:focus {
    border-color: #0070ce;
  }
`;

const TimeInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  justify-content: center;
  font-size: 12px;
  color: #64748b;
`;

const TimeInput = styled.input`
  width: 68px;
  padding: 3px 4px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 11px;
  font-family: monospace;
  text-align: center;
  background: #ffffff;
  outline: none;

  &:focus {
    border-color: #0070ce;
  }
`;

const RemoveSlotBtn = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 2px;
  transition: all 0.15s ease;

  &:hover {
    background: #fee2e2;
  }
`;

const DayCell = styled.div`
  padding: 8px;
  border-right: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:last-child {
    border-right: none;
  }
`;

const SubjectBadge = styled.div<{ $color: string }>`
  background: ${(props) => props.$color + '15'};
  border-left: 3px solid ${(props) => props.$color};
  border-radius: 6px;
  padding: 6px 8px;
  margin-bottom: 4px;
`;

const SubjectName = styled.div<{ $color: string }>`
  font-weight: 700;
  font-size: 13px;
  color: ${(props) => props.$color};
`;

const TeacherText = styled.div`
  font-size: 12px;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
`;

const RoomBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #64748b;
  margin-top: 4px;
  align-self: flex-start;
`;

const EmptyCellPlaceholder = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  font-size: 13px;
  font-style: italic;
`;

const CellSelect = styled.select`
  width: 100%;
  padding: 4px 6px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  outline: none;

  &:focus {
    border-color: #0070ce;
  }
`;

const CellInput = styled.input`
  width: 100%;
  padding: 3px 6px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 11px;
  color: #334155;
  margin-bottom: 2px;
  outline: none;

  &:focus {
    border-color: #0070ce;
  }
`;

const AddSlotBar = styled.div`
  padding: 12px 16px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
`;

const AddSlotButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: #ffffff;
  border: 1px dashed #0070ce;
  border-radius: 8px;
  color: #0070ce;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #eff6ff;
    border-color: #005bb5;
    color: #005bb5;
  }
`;

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Thứ Hai' },
  { key: 'tuesday', label: 'Thứ Ba' },
  { key: 'wednesday', label: 'Thứ Tư' },
  { key: 'thursday', label: 'Thứ Năm' },
  { key: 'friday', label: 'Thứ Sáu' },
  { key: 'saturday', label: 'Thứ Bảy' },
];

interface TimetableGridViewProps {
  slots: TimeSlotRow[];
  isEditable?: boolean;
  onCellChange?: (
    slotId: string,
    day: DayOfWeek,
    cell: TimetableCell | undefined
  ) => void;
  onTimeChange?: (slotId: string, startTime: string, endTime: string) => void;
  onSlotNameChange?: (slotId: string, slotName: string) => void;
  onAddSlot?: () => void;
  onRemoveSlot?: (slotId: string) => void;
}

export const TimetableGridView: React.FC<TimetableGridViewProps> = ({
  slots,
  isEditable = false,
  onCellChange,
  onTimeChange,
  onSlotNameChange,
  onAddSlot,
  onRemoveSlot,
}) => {
  const getSubjectColor = (subjectId?: string) => {
    const found = mockSubjects.find((s) => s.id === subjectId);
    return found?.color || '#0070CE';
  };

  const handleSubjectSelect = (
    slotId: string,
    day: DayOfWeek,
    currentCell: TimetableCell | undefined,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (!onCellChange) return;
    const val = e.target.value;
    if (!val) {
      onCellChange(slotId, day, undefined);
      return;
    }
    const found = mockSubjects.find((s) => s.id === val);
    if (!found) return;

    onCellChange(slotId, day, {
      subjectId: found.id,
      subjectName: found.name,
      teacherName: currentCell?.teacherName || 'GV Bộ môn',
      room: currentCell?.room || 'Phòng 101',
    });
  };

  const handleTeacherChange = (
    slotId: string,
    day: DayOfWeek,
    currentCell: TimetableCell,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!onCellChange) return;
    onCellChange(slotId, day, {
      ...currentCell,
      teacherName: e.target.value,
    });
  };

  const handleRoomChange = (
    slotId: string,
    day: DayOfWeek,
    currentCell: TimetableCell,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!onCellChange) return;
    onCellChange(slotId, day, {
      ...currentCell,
      room: e.target.value,
    });
  };

  return (
    <GridWrapper>
      <HeaderRow>
        <HeaderCell>Tiết học / Giờ</HeaderCell>
        {DAYS.map((d) => (
          <HeaderCell key={d.key}>{d.label}</HeaderCell>
        ))}
      </HeaderRow>

      {slots.map((slot) => {
        return (
          <SlotRow key={slot.slotId}>
            {isEditable ? (
              <TimeCol>
                <SlotNameInput
                  type="text"
                  value={slot.slotName}
                  onChange={(e) => onSlotNameChange?.(slot.slotId, e.target.value)}
                  placeholder="Tiết học"
                />
                <TimeInputGroup>
                  <TimeInput
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      onTimeChange?.(slot.slotId, e.target.value, slot.endTime)
                    }
                    title="Giờ bắt đầu"
                  />
                  <span>-</span>
                  <TimeInput
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      onTimeChange?.(slot.slotId, slot.startTime, e.target.value)
                    }
                    title="Giờ kết thúc"
                  />
                </TimeInputGroup>
                {slots.length > 1 && onRemoveSlot && (
                  <RemoveSlotBtn
                    type="button"
                    onClick={() => onRemoveSlot(slot.slotId)}
                    title="Xóa tiết này"
                  >
                    🗑️ Xóa dòng
                  </RemoveSlotBtn>
                )}
              </TimeCol>
            ) : (
              <TimeCol>
                <SlotName>{slot.slotName}</SlotName>
                <SlotTime>
                  {slot.startTime} - {slot.endTime}
                </SlotTime>
              </TimeCol>
            )}

            {DAYS.map((day) => {
              const cell = slot.days[day.key];
              const color = getSubjectColor(cell?.subjectId);

              if (isEditable) {
                return (
                  <DayCell key={day.key}>
                    <CellSelect
                      value={cell?.subjectId || ''}
                      onChange={(e) =>
                        handleSubjectSelect(slot.slotId, day.key, cell, e)
                      }
                    >
                      <option value="">-- Trống --</option>
                      {mockSubjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </CellSelect>

                    {cell && (
                      <>
                        <CellInput
                          type="text"
                          placeholder="Giáo viên"
                          value={cell.teacherName || ''}
                          onChange={(e) =>
                            handleTeacherChange(slot.slotId, day.key, cell, e)
                          }
                        />
                        <CellInput
                          type="text"
                          placeholder="Phòng học"
                          value={cell.room || ''}
                          onChange={(e) =>
                            handleRoomChange(slot.slotId, day.key, cell, e)
                          }
                        />
                      </>
                    )}
                  </DayCell>
                );
              }

              return (
                <DayCell key={day.key}>
                  {cell ? (
                    <SubjectBadge $color={color}>
                      <SubjectName $color={color}>{cell.subjectName}</SubjectName>
                      {cell.teacherName && (
                        <TeacherText>
                          <span>👤</span>
                          <span>{cell.teacherName}</span>
                        </TeacherText>
                      )}
                      {cell.room && <RoomBadge>📍 {cell.room}</RoomBadge>}
                    </SubjectBadge>
                  ) : (
                    <EmptyCellPlaceholder>—</EmptyCellPlaceholder>
                  )}
                </DayCell>
              );
            })}
          </SlotRow>
        );
      })}

      {isEditable && onAddSlot && (
        <AddSlotBar>
          <AddSlotButton type="button" onClick={onAddSlot}>
            <span>[+]</span>
            <span>Thêm tiết học</span>
          </AddSlotButton>
        </AddSlotBar>
      )}
    </GridWrapper>
  );
};
