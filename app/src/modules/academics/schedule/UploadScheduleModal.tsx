import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createSchedule, setUploadModalOpen } from '../../../store/slices/scheduleSlice';
import { generateAutoTitle } from '../../../utils/scheduleValidation';

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
  max-width: 540px;
  overflow: hidden;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const DropZone = styled.div<{ $hasFile: boolean }>`
  border: 2px dashed ${(props) => (props.$hasFile ? '#16a34a' : '#cbd5e1')};
  background: ${(props) => (props.$hasFile ? '#f0fdf4' : '#f8fafc')};
  border-radius: 12px;
  padding: 28px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => (props.$hasFile ? '#15803d' : '#0070ce')};
    background: ${(props) => (props.$hasFile ? '#dcfce7' : '#eff6ff')};
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const Button = styled.button<{ $primary?: boolean; $disabled?: boolean }>`
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  border: 1px solid
    ${(props) =>
      props.$disabled ? '#e2e8f0' : props.$primary ? '#0070ce' : '#cbd5e1'};
  background: ${(props) =>
    props.$disabled ? '#f1f5f9' : props.$primary ? '#0070ce' : '#ffffff'};
  color: ${(props) =>
    props.$disabled ? '#94a3b8' : props.$primary ? '#ffffff' : '#334155'};
  transition: all 0.15s ease;

  &:hover {
    background: ${(props) =>
      props.$disabled
        ? '#f1f5f9'
        : props.$primary
        ? '#005bb5'
        : '#f8fafc'};
  }
`;

export const UploadScheduleModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isUploadModalOpen, classes, semesters } = useAppSelector(
    (state) => state.schedule
  );

  const [classId, setClassId] = useState(classes[0]?.id || 'cls-1a1');
  const [semesterId, setSemesterId] = useState(semesters[0]?.id || 'sem-2026-hk1');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);

  const selectedSemester = semesters.find((s) => s.id === semesterId);

  useEffect(() => {
    if (selectedSemester) {
      setTitle(generateAutoTitle(selectedSemester.name));
    }
  }, [selectedSemester]);

  if (!isUploadModalOpen) return null;

  const handleClose = () => {
    dispatch(setUploadModalOpen(false));
    setFileName(null);
  };

  const handleSimulateFilePick = () => {
    setFileName('thoi-khoa-bieu-lop-1a1-chinh-thuc.pdf');
    setFileSize(1428570);
  };

  const handleSubmit = () => {
    if (!fileName) return; // BR04 guard

    const targetClass = classes.find((c) => c.id === classId);
    const targetSem = semesters.find((s) => s.id === semesterId);
    if (!targetClass || !targetSem) return;

    dispatch(
      createSchedule({
        title,
        schoolCode: 'demo',
        classId: targetClass.id,
        className: targetClass.name,
        gradeLevel: targetClass.gradeLevel,
        semesterId: targetSem.id,
        semesterName: targetSem.name,
        academicYear: targetSem.academicYear,
        startDate: targetSem.startDate,
        endDate: targetSem.endDate,
        type: 'file',
        status: 'published',
        fileUrl: `/mock/documents/${fileName}`,
        fileName,
        fileSize,
        fileType: 'application/pdf',
        slots: [],
        autoSend: true,
        senderName: 'Văn Phòng Giáo Vụ',
      })
    );

    handleClose();
  };

  const hasFile = Boolean(fileName);

  return (
    <Overlay onClick={handleClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>📤 Tải Lên Tệp Thời Khóa Biểu (PDF / Hình ảnh)</Title>
          <CloseButton onClick={handleClose}>✕</CloseButton>
        </Header>

        <Body>
          <FormGroup>
            <Label>Lớp học áp dụng *</Label>
            <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
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
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.name} ({sem.academicYear})
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
              placeholder="Thời khóa biểu: Học kỳ..."
            />
          </FormGroup>

          <FormGroup>
            <Label>Tệp đính kèm (PDF, PNG, JPG - Tối đa 25MB) *</Label>
            <DropZone $hasFile={hasFile} onClick={handleSimulateFilePick}>
              {hasFile ? (
                <div>
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>📄</div>
                  <div style={{ fontWeight: 700, color: '#15803d' }}>
                    {fileName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {(fileSize / 1024 / 1024).toFixed(2)} MB • Nhấp để chọn tệp khác
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>📁</div>
                  <div style={{ fontWeight: 600, color: '#0070ce' }}>
                    Kéo thả hoặc nhấp để chọn tệp thời khóa biểu
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Hỗ trợ định dạng PDF, JPG, PNG
                  </div>
                </div>
              )}
            </DropZone>
          </FormGroup>
        </Body>

        <Footer>
          <Button onClick={handleClose}>Hủy bỏ</Button>
          <Button
            $primary
            $disabled={!hasFile}
            disabled={!hasFile}
            onClick={handleSubmit}
          >
            {hasFile ? 'Tải lên & Phát hành' : 'Vui lòng chọn tệp (BR04)'}
          </Button>
        </Footer>
      </ModalCard>
    </Overlay>
  );
};
