import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { updateSchedule } from '../../../../../store/slices/scheduleSlice';
import { validateSemesterInterval } from '../../../../../utils/scheduleValidation';
import { DayOfWeek, TimeSlotRow, TimetableCell } from '../../../../../types/schedule';
import { TimetableGridView } from '../../../../../modules/academics/schedule/TimetableGridView';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

const BreadcrumbBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;

  a {
    color: #0070ce;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const FormCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: #ffffff;
  outline: none;

  &:focus {
    border-color: #0070ce;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  outline: none;

  &:focus {
    border-color: #0070ce;
  }
`;

const StickyFooter = styled.div`
  position: sticky;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
  margin: 0 -24px -24px -24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
  z-index: 10;
`;

const Button = styled.button<{ $primary?: boolean; $warning?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid
    ${(props) =>
      props.$primary ? '#0070ce' : props.$warning ? '#f59e0b' : '#cbd5e1'};
  background: ${(props) =>
    props.$primary ? '#0070ce' : props.$warning ? '#d97706' : '#ffffff'};
  color: ${(props) => (props.$primary || props.$warning ? '#ffffff' : '#334155')};
  transition: all 0.15s ease;

  &:hover {
    background: ${(props) =>
      props.$primary ? '#005bb5' : props.$warning ? '#b45309' : '#f8fafc'};
  }
`;

export default function EditSchedulePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const scheduleId = (router.query.scheduleId as string) || 'sch-001';

  const { timetables, classes, semesters } = useAppSelector((state) => state.schedule);
  const targetSchedule = timetables.find((t) => t.id === scheduleId) || timetables[0];

  const [classId, setClassId] = useState(targetSchedule?.classId || 'cls-1a1');
  const [semesterId, setSemesterId] = useState(targetSchedule?.semesterId || 'sem-2026-hk1');
  const [title, setTitle] = useState(targetSchedule?.title || '');
  const [startDate, setStartDate] = useState(targetSchedule?.startDate || '2026-09-01');
  const [endDate, setEndDate] = useState(targetSchedule?.endDate || '2027-01-15');
  const [slots, setSlots] = useState<TimeSlotRow[]>(targetSchedule?.slots || []);

  useEffect(() => {
    if (targetSchedule) {
      setClassId(targetSchedule.classId);
      setSemesterId(targetSchedule.semesterId);
      setTitle(targetSchedule.title);
      setStartDate(targetSchedule.startDate);
      setEndDate(targetSchedule.endDate);
      setSlots(targetSchedule.slots || []);
    }
  }, [targetSchedule]);

  if (!targetSchedule) {
    return (
      <PortalLayout>
        <PageContainer>
          <div>Không tìm thấy thời khóa biểu cần sửa.</div>
        </PageContainer>
      </PortalLayout>
    );
  }

  const selectedSemester = semesters.find((s) => s.id === semesterId);

  const handleCellChange = (
    slotId: string,
    day: DayOfWeek,
    cell: TimetableCell | undefined
  ) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.slotId !== slotId) return s;
        return {
          ...s,
          days: {
            ...s.days,
            [day]: cell,
          },
        };
      })
    );
  };

  const handleTimeChange = (slotId: string, startTime: string, endTime: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.slotId === slotId ? { ...s, startTime, endTime } : s))
    );
  };

  const handleSlotNameChange = (slotId: string, slotName: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.slotId === slotId ? { ...s, slotName } : s))
    );
  };

  const handleAddSlot = () => {
    setSlots((prev) => {
      const nextNum = prev.length + 1;
      const lastSlot = prev[prev.length - 1];
      let newStart = '08:55';
      let newEnd = '09:40';

      if (lastSlot && lastSlot.endTime) {
        const [h, m] = lastSlot.endTime.split(':').map(Number);
        if (!isNaN(h) && !isNaN(m)) {
          const totalStartMin = h * 60 + m + 10;
          const totalEndMin = totalStartMin + 45;
          const startH = Math.floor(totalStartMin / 60) % 24;
          const startM = totalStartMin % 60;
          const endH = Math.floor(totalEndMin / 60) % 24;
          const endM = totalEndMin % 60;
          newStart = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
          newEnd = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
        }
      }

      const newSlot: TimeSlotRow = {
        slotId: `slot-${Date.now()}`,
        slotName: `Tiết ${nextNum}`,
        startTime: newStart,
        endTime: newEnd,
        isBreak: false,
        days: {},
      };

      return [...prev, newSlot];
    });
  };

  const handleRemoveSlot = (slotId: string) => {
    setSlots((prev) => prev.filter((s) => s.slotId !== slotId));
  };

  const handleSave = (andSend: boolean) => {
    const targetClass = classes.find((c) => c.id === classId);
    const targetSem = semesters.find((s) => s.id === semesterId);

    dispatch(
      updateSchedule({
        id: targetSchedule.id,
        changes: {
          title,
          classId: targetClass?.id || targetSchedule.classId,
          className: targetClass?.name || targetSchedule.className,
          semesterId: targetSem?.id || targetSchedule.semesterId,
          semesterName: targetSem?.name || targetSchedule.semesterName,
          academicYear: targetSem?.academicYear || targetSchedule.academicYear,
          startDate,
          endDate,
          slots: targetSchedule.type === 'grid' ? slots : targetSchedule.slots,
        },
        andSend,
        senderName: 'Cô Lan Hương (GVCN)',
        note: 'Cập nhật thời khóa biểu và phát hành lại cho phụ huynh',
      })
    );

    router.push(`/${schoolCode}/school/schedule/${targetSchedule.id}/`);
  };

  return (
    <PortalLayout>
      <Head>
        <title>Chỉnh Sửa Thời Khóa Biểu | Finviet School Operating Portal</title>
      </Head>

      <PageContainer>
        <BreadcrumbBar>
          <Link href={`/${schoolCode}/school/schedule/`}>Thời khóa biểu</Link>
          <span>›</span>
          <Link href={`/${schoolCode}/school/schedule/${targetSchedule.id}/`}>
            {targetSchedule.title}
          </Link>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>Chỉnh sửa</span>
        </BreadcrumbBar>

        <FormCard>
          <CardTitle>Chỉnh sửa thời khóa biểu</CardTitle>

          <FormGrid>
            <FormGroup>
              <Label>Lớp học áp dụng</Label>
              <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Học kỳ áp dụng</Label>
              <Select
                value={semesterId}
                onChange={(e) => setSemesterId(e.target.value)}
              >
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.academicYear})
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Tên thời khóa biểu</Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormGroup>
          </FormGrid>

          <FormGrid>
            <FormGroup>
              <Label>Ngày bắt đầu</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Ngày kết thúc</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormGroup>
          </FormGrid>

          {targetSchedule.type === 'grid' ? (
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', color: '#334155' }}>
                Điều chỉnh ma trận tiết học (BR05)
              </div>
              <TimetableGridView
                slots={slots}
                isEditable
                onCellChange={handleCellChange}
                onTimeChange={handleTimeChange}
                onSlotNameChange={handleSlotNameChange}
                onAddSlot={handleAddSlot}
                onRemoveSlot={handleRemoveSlot}
              />
            </div>
          ) : (
            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
              <div style={{ fontWeight: 600 }}>Tệp thời khóa biểu hiện tại: {targetSchedule.fileName}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                Thời khóa biểu dạng file không chỉnh sửa được từng tiết học. Bạn có thể thay thế tệp hoặc quay lại danh sách.
              </div>
            </div>
          )}

          {/* Action Footer: Hủy bỏ & Cập nhật */}
          <StickyFooter>
            <Link
              href={`/${schoolCode}/school/schedule/${targetSchedule.id}/`}
              passHref
              legacyBehavior
            >
              <Button as="a">Hủy bỏ</Button>
            </Link>

            <Button $primary onClick={() => handleSave(false)}>
              Cập nhật
            </Button>
          </StickyFooter>
        </FormCard>
      </PageContainer>
    </PortalLayout>
  );
}
