import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { DayOfWeek, TimeSlotRow, TimetableCell } from '../../../types/schedule';
import { mockSubjects } from '../../../services/mockScheduleData';
import { Dropdown, Icon } from '@/components/ds';

const GridWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-height: 380px;
  padding-bottom: 40px;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 160px repeat(6, minmax(130px, 1fr));
  min-width: 940px;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
`;

const HeaderCell = styled.div<{ $sticky?: boolean }>`
  padding: 12px 10px;
  text-align: center;
  font-weight: 700;
  font-size: 13px;
  color: #334155;
  border-right: 1px solid #e2e8f0;
  background: inherit;

  ${(p) =>
    p.$sticky &&
    `
    position: sticky;
    left: 0;
    z-index: 3;
    background: #f8fafc;
    border-right: 2px solid #cbd5e1;
  `}

  &:last-child {
    border-right: none;
  }
`;

const SlotRow = styled.div`
  display: grid;
  grid-template-columns: 160px repeat(6, minmax(130px, 1fr));
  min-width: 940px;
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
  border-right: 2px solid #cbd5e1;
  gap: 4px;
  position: sticky;
  left: 0;
  z-index: 2;
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
  width: 72px;
  padding: 4px 6px;
  border: 1px solid var(--border-default, #cbd5e1);
  border-radius: 6px;
  font-size: 12px;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  text-align: center;
  background: var(--bg-surface, #ffffff);
  color: var(--text-heading, #1e293b);
  outline: none;
  transition: all 0.15s ease;

  /* HIDE NATIVE WEB-KIT CLOCK PICKER INDICATOR SO IT NEVER OBSCURS DIGITS */
  &::-webkit-calendar-picker-indicator {
    display: none !important;
    -webkit-appearance: none !important;
    appearance: none !important;
    margin: 0 !important;
    opacity: 0 !important;
    pointer-events: none !important;
    width: 0 !important;
    height: 0 !important;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-clear-button {
    display: none !important;
    -webkit-appearance: none !important;
  }

  &:focus {
    border-color: var(--color-primary-500, #0070ce);
    box-shadow: 0 0 0 2px rgba(0, 112, 206, 0.12);
  }
`;

const RemoveSlotBtn = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 4px;
  margin-top: 3px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
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
  position: relative;

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
  display: inline-flex;
  align-items: center;
  gap: 3px;
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

const CellInput = styled.input`
  width: 100%;
  padding: 4px 6px;
  border: 1px solid var(--border-default, #e2e8f0);
  border-radius: 6px;
  font-size: 11px;
  color: var(--text-heading, #1e293b);
  background: var(--bg-surface, #ffffff);
  margin-bottom: 2px;
  outline: none;
  transition: all 0.15s ease;

  &:focus {
    border-color: var(--color-primary-500, #0070ce);
    box-shadow: 0 0 0 2px rgba(0, 112, 206, 0.12);
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

const DayTabBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const DayTabBtn = styled.button<{ $active: boolean }>`
  flex: none;
  white-space: nowrap;
  min-height: 40px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid ${(p) => (p.$active ? '#0070ce' : '#cbd5e1')};
  background: ${(p) => (p.$active ? '#0070ce' : '#ffffff')};
  color: ${(p) => (p.$active ? '#ffffff' : '#334155')};
  transition: all 0.15s ease;

  &:hover {
    background: ${(p) => (p.$active ? '#005bb5' : '#f1f5f9')};
  }
`;

const DayCardViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
`;

const DaySlotCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DaySlotHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 8px;
`;

const DaySlotTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: #0f172a;
`;

const DaySlotTime = styled.div`
  font-size: 12px;
  font-family: monospace;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
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
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'all'>('monday');

  const subjectOptions = useMemo(
    () => [
      { value: '', label: '-- Trống --' },
      ...mockSubjects.map((s) => ({ value: s.id, label: s.name })),
    ],
    []
  );

  const subjectOptionsMobile = useMemo(
    () => [
      { value: '', label: '-- Trống / Nghỉ --' },
      ...mockSubjects.map((s) => ({ value: s.id, label: s.name })),
    ],
    []
  );

  const getSubjectColor = (subjectId?: string) => {
    const found = mockSubjects.find((s) => s.id === subjectId);
    return found?.color || '#0070CE';
  };

  const handleSubjectSelect = (
    slotId: string,
    day: DayOfWeek,
    currentCell: TimetableCell | undefined,
    val: string
  ) => {
    if (!onCellChange) return;
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
    <div>
      {/* 1. Mobile Day Selector Tab Bar & Day Card View */}
      <div className="block md:hidden">
        <DayTabBar>
          {DAYS.map((d) => (
            <DayTabBtn
              key={d.key}
              type="button"
              $active={selectedDay === d.key}
              onClick={() => setSelectedDay(d.key)}
            >
              {d.label}
            </DayTabBtn>
          ))}
          <DayTabBtn
            type="button"
            $active={selectedDay === 'all'}
            onClick={() => setSelectedDay('all')}
          >
            Lưới cả tuần ⊞
          </DayTabBtn>
        </DayTabBar>

        {selectedDay !== 'all' && (
          <DayCardViewContainer>
            {slots.map((slot) => {
              const cell = slot.days[selectedDay];
              const color = getSubjectColor(cell?.subjectId);
              return (
                <DaySlotCard key={slot.slotId}>
                  <DaySlotHeader>
                    {isEditable ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <SlotNameInput
                            type="text"
                            value={slot.slotName}
                            onChange={(e) => onSlotNameChange?.(slot.slotId, e.target.value)}
                            placeholder="Tiết học"
                            style={{ maxWidth: '140px', textAlign: 'left' }}
                          />
                          {slots.length > 1 && onRemoveSlot && (
                            <RemoveSlotBtn
                              type="button"
                              onClick={() => onRemoveSlot(slot.slotId)}
                              title="Xóa tiết này"
                            >
                              <Icon name="trash" size={11} />
                              <span>Xóa</span>
                            </RemoveSlotBtn>
                          )}
                        </div>
                        <TimeInputGroup style={{ justifyContent: 'flex-start' }}>
                          <TimeInput
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => onTimeChange?.(slot.slotId, e.target.value, slot.endTime)}
                            title="Giờ bắt đầu"
                          />
                          <span>-</span>
                          <TimeInput
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => onTimeChange?.(slot.slotId, slot.startTime, e.target.value)}
                            title="Giờ kết thúc"
                          />
                        </TimeInputGroup>
                      </div>
                    ) : (
                      <>
                        <DaySlotTitle>{slot.slotName}</DaySlotTitle>
                        <DaySlotTime>{slot.startTime} - {slot.endTime}</DaySlotTime>
                      </>
                    )}
                  </DaySlotHeader>

                  {isEditable ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Môn học:</label>
                      <Dropdown
                        size="md"
                        value={cell?.subjectId || ''}
                        onChange={(val) => handleSubjectSelect(slot.slotId, selectedDay, cell, val)}
                        options={subjectOptionsMobile}
                        placeholder="-- Trống / Nghỉ --"
                        searchable
                        fullWidth
                      />

                      {cell && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div>
                            <label style={{ fontSize: '11px', color: '#64748b' }}>Giáo viên:</label>
                            <CellInput
                              type="text"
                              placeholder="GV Bộ môn"
                              value={cell.teacherName || ''}
                              onChange={(e) => handleTeacherChange(slot.slotId, selectedDay, cell, e)}
                              style={{ minHeight: '36px' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '11px', color: '#64748b' }}>Phòng học:</label>
                            <CellInput
                              type="text"
                              placeholder="Phòng học"
                              value={cell.room || ''}
                              onChange={(e) => handleRoomChange(slot.slotId, selectedDay, cell, e)}
                              style={{ minHeight: '36px' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {cell ? (
                        <SubjectBadge $color={color} style={{ margin: 0 }}>
                          <SubjectName $color={color} style={{ fontSize: '14px' }}>{cell.subjectName}</SubjectName>
                          {cell.teacherName && (
                            <TeacherText style={{ fontSize: '13px', marginTop: '4px' }}>
                              <Icon name="user" size={11} className="text-slate-400" />
                              <span>{cell.teacherName}</span>
                            </TeacherText>
                          )}
                          {cell.room && (
                            <RoomBadge style={{ marginTop: '6px' }}>
                              <Icon name="location-dot" size={10} className="text-slate-400" />
                              <span>{cell.room}</span>
                            </RoomBadge>
                          )}
                        </SubjectBadge>
                      ) : (
                        <div style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', padding: '8px 0' }}>
                          — Tiết trống / Không có lịch học —
                        </div>
                      )}
                    </div>
                  )}
                </DaySlotCard>
              );
            })}

            {isEditable && onAddSlot && (
              <AddSlotButton type="button" onClick={onAddSlot} style={{ width: '100%', justifyContent: 'center' }}>
                <Icon name="plus" size={13} />
                <span>Thêm tiết học</span>
              </AddSlotButton>
            )}
          </DayCardViewContainer>
        )}
      </div>

      {/* 2. Full Week Grid View (Desktop always; Mobile when 'all' is selected) */}
      <div className={selectedDay === 'all' ? 'block' : 'hidden md:block'}>
        <GridWrapper>
          <HeaderRow>
            <HeaderCell $sticky={true}>Tiết học / Giờ</HeaderCell>
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
                        <Icon name="trash" size={11} />
                        <span>Xóa dòng</span>
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
                        <Dropdown
                          size="sm"
                          value={cell?.subjectId || ''}
                          onChange={(val) =>
                            handleSubjectSelect(slot.slotId, day.key, cell, val)
                          }
                          options={subjectOptions}
                          placeholder="-- Trống --"
                          searchable={false}
                          fullWidth
                          menuStyle={{ minWidth: '160px', width: 'max-content', maxWidth: '220px' }}
                          className="mb-1"
                        />

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
                              <Icon name="user" size={11} className="text-slate-400" />
                              <span>{cell.teacherName}</span>
                            </TeacherText>
                          )}
                          {cell.room && (
                            <RoomBadge>
                              <Icon name="location-dot" size={10} className="text-slate-400" />
                              <span>{cell.room}</span>
                            </RoomBadge>
                          )}
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
                <Icon name="plus" size={13} />
                <span>Thêm tiết học</span>
              </AddSlotButton>
            </AddSlotBar>
          )}
        </GridWrapper>
      </div>
    </div>
  );
};
