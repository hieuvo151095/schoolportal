import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { createSchedule } from '../../../../../store/slices/scheduleSlice';
import {
  generateAutoTitle,
  validateSemesterInterval,
} from '../../../../../utils/scheduleValidation';
import { DayOfWeek, ScheduleType, TimeSlotRow, TimetableCell } from '../../../../../types/schedule';
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

const TypeToggleGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
`;

const TypeOption = styled.div<{ $active: boolean }>`
  flex: 1;
  border: 2px solid ${(props) => (props.$active ? '#0070ce' : '#e2e8f0')};
  background: ${(props) => (props.$active ? '#eff6ff' : '#ffffff')};
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.15s ease;

  &:hover {
    border-color: #0070ce;
  }
`;

const DropZone = styled.div<{ $hasFile: boolean }>`
  border: 2px dashed ${(props) => (props.$hasFile ? '#16a34a' : '#cbd5e1')};
  background: ${(props) => (props.$hasFile ? '#f0fdf4' : '#f8fafc')};
  border-radius: 12px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => (props.$hasFile ? '#15803d' : '#0070ce')};
  }
`;

const WarningBox = styled.div`
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #b45309;
  display: flex;
  align-items: center;
  gap: 8px;
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

const Button = styled.button<{ $primary?: boolean; $danger?: boolean; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  border: 1px solid
    ${(props) =>
      props.$disabled
        ? '#e2e8f0'
        : props.$primary
        ? '#0070ce'
        : props.$danger
        ? '#ef4444'
        : '#cbd5e1'};
  background: ${(props) =>
    props.$disabled
      ? '#f1f5f9'
      : props.$primary
      ? '#0070ce'
      : props.$danger
      ? '#fee2e2'
      : '#ffffff'};
  color: ${(props) =>
    props.$disabled
      ? '#94a3b8'
      : props.$primary
      ? '#ffffff'
      : props.$danger
      ? '#b91c1c'
      : '#334155'};
  transition: all 0.15s ease;

  &:hover {
    background: ${(props) =>
      props.$disabled
        ? '#f1f5f9'
        : props.$primary
        ? '#005bb5'
        : props.$danger
        ? '#fecaca'
        : '#f8fafc'};
  }
`;

const initialSlots: TimeSlotRow[] = [
  {
    slotId: 'slot-1',
    slotName: 'Tiết 1',
    startTime: '08:00',
    endTime: '08:45',
    isBreak: false,
    days: {},
  },
];

export default function CreateSchedulePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const { classes, semesters } = useAppSelector((state) => state.schedule);

  const [classId, setClassId] = useState(classes[0]?.id || 'cls-1a1');
  const [semesterId, setSemesterId] = useState(semesters[0]?.id || 'sem-2026-hk1');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2027-01-15');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('grid');

  // File state
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);

  // Grid slots state - starts with 1 empty line
  const [slots, setSlots] = useState<TimeSlotRow[]>(initialSlots);

  const selectedSemester = semesters.find((s) => s.id === semesterId);

  useEffect(() => {
    if (selectedSemester) {
      setTitle(generateAutoTitle(selectedSemester.name));
      setStartDate(selectedSemester.startDate);
      setEndDate(selectedSemester.endDate);
    }
  }, [selectedSemester]);

  const dateValidation = validateSemesterInterval(startDate, endDate, selectedSemester);

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

  const handleSimulateFile = () => {
    setFileName('thoi-khoa-bieu-lop-1a1-chinh-thuc.pdf');
    setFileSize(1428570);
  };

  const handleSave = (autoSend: boolean) => {
    const targetClass = classes.find((c) => c.id === classId);
    const targetSem = semesters.find((s) => s.id === semesterId);
    if (!targetClass || !targetSem) return;

    if (scheduleType === 'file' && !fileName) {
      alert('Vui lòng đính kèm tệp trước khi lưu (BR04).');
      return;
    }

    dispatch(
      createSchedule({
        title,
        schoolCode,
        classId: targetClass.id,
        className: targetClass.name,
        gradeLevel: targetClass.gradeLevel,
        semesterId: targetSem.id,
        semesterName: targetSem.name,
        academicYear: targetSem.academicYear,
        startDate,
        endDate,
        type: scheduleType,
        status: autoSend ? 'published' : 'draft',
        fileUrl: fileName ? `/mock/documents/${fileName}` : undefined,
        fileName: fileName || undefined,
        fileSize: fileSize || undefined,
        fileType: fileName ? 'application/pdf' : undefined,
        slots: scheduleType === 'grid' ? slots : [],
        autoSend,
        senderName: 'Ban Giám Hiệu',
      })
    );

    router.push(`/${schoolCode}/school/schedule/`);
  };

  const isFileBlocked = scheduleType === 'file' && !fileName;

  return (
    <PortalLayout>
      <Head>
        <title>Tạo Thời Khóa Biểu Mới | Finviet School Operating Portal</title>
      </Head>

      <PageContainer>
        <BreadcrumbBar>
          <Link href={`/${schoolCode}/school/schedule/`}>Thời khóa biểu</Link>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>Thêm thời khóa biểu</span>
        </BreadcrumbBar>

        <FormCard>
          <CardTitle>Thông tin thời khóa biểu</CardTitle>

          <FormGrid>
            <FormGroup>
              <Label>Lớp học áp dụng *</Label>
              <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Học kỳ áp dụng *</Label>
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
              <Label>Tên thời khóa biểu (Tự động tạo - BR02)</Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormGroup>
          </FormGrid>

          <FormGrid>
            <FormGroup>
              <Label>Ngày bắt đầu áp dụng</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Ngày kết thúc áp dụng</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormGroup>
          </FormGrid>

          {dateValidation.warning && (
            <WarningBox>
              <span>⚠️</span>
              <span>{dateValidation.warning}</span>
            </WarningBox>
          )}

          <FormGroup>
            <Label>Định dạng thời khóa biểu (BR01)</Label>
            <TypeToggleGroup>
              <TypeOption
                $active={scheduleType === 'grid'}
                onClick={() => setScheduleType('grid')}
              >
                <div style={{ fontSize: '24px' }}>📊</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                    Dạng lưới (Grid Matrix)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Cấu hình từng tiết học chi tiết từ Thứ Hai đến Thứ Bảy
                  </div>
                </div>
              </TypeOption>

              <TypeOption
                $active={scheduleType === 'file'}
                onClick={() => setScheduleType('file')}
              >
                <div style={{ fontSize: '24px' }}>📄</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                    Dạng tệp đính kèm (PDF / Hình ảnh)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Tải lên file thời khóa biểu sẵn có của nhà trường
                  </div>
                </div>
              </TypeOption>
            </TypeToggleGroup>
          </FormGroup>

          {scheduleType === 'file' ? (
            <FormGroup>
              <Label>Tệp đính kèm *</Label>
              <DropZone $hasFile={Boolean(fileName)} onClick={handleSimulateFile}>
                {fileName ? (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '4px' }}>📄</div>
                    <div style={{ fontWeight: 700, color: '#15803d' }}>{fileName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {(fileSize / 1024 / 1024).toFixed(2)} MB • Nhấp để thay đổi
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '4px' }}>📁</div>
                    <div style={{ fontWeight: 600, color: '#0070ce' }}>
                      Nhấp để chọn tệp PDF / Hình ảnh thời khóa biểu
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      Bắt buộc phải đính kèm file trước khi phát hành (BR04)
                    </div>
                  </div>
                )}
              </DropZone>
            </FormGroup>
          ) : (
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', color: '#334155' }}>
                Thiết lập tiết học trong tuần (Nhấp vào từng ô để chọn môn học & giáo viên)
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
          )}

          <StickyFooter>
            <Link href={`/${schoolCode}/school/schedule/`} passHref legacyBehavior>
              <Button as="a">Hủy bỏ</Button>
            </Link>

            <Button
              $disabled={isFileBlocked}
              disabled={isFileBlocked}
              onClick={() => handleSave(false)}
            >
              Lưu bản nháp
            </Button>

            <Button
              $primary
              $disabled={isFileBlocked}
              disabled={isFileBlocked}
              onClick={() => handleSave(true)}
            >
              Lưu và phát hành (Gửi PH)
            </Button>
          </StickyFooter>
        </FormCard>
      </PageContainer>
    </PortalLayout>
  );
}
