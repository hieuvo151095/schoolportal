import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { cloneSchedule, setCloneModalOpen } from '../../../store/slices/scheduleSlice';
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
  max-width: 520px;
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

const SourceInfo = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #1e40af;
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

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
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

export const CloneScheduleModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isCloneModalOpen, activeModalScheduleId, timetables, classes, semesters } =
    useAppSelector((state) => state.schedule);

  const targetSchedule = timetables.find((t) => t.id === activeModalScheduleId);

  const [targetClassId, setTargetClassId] = useState(classes[1]?.id || 'cls-2a2');
  const [targetSemesterId, setTargetSemesterId] = useState(semesters[0]?.id || 'sem-2026-hk1');
  const [title, setTitle] = useState('');

  const selectedSemester = semesters.find((s) => s.id === targetSemesterId);

  useEffect(() => {
    if (selectedSemester) {
      setTitle(generateAutoTitle(selectedSemester.name));
    }
  }, [selectedSemester]);

  if (!isCloneModalOpen || !targetSchedule) return null;

  const handleClose = () => {
    dispatch(setCloneModalOpen({ isOpen: false }));
  };

  const handleClone = () => {
    const targetClass = classes.find((c) => c.id === targetClassId);
    const targetSem = semesters.find((s) => s.id === targetSemesterId);

    if (!targetClass || !targetSem) return;

    dispatch(
      cloneSchedule({
        sourceId: targetSchedule.id,
        targetClassId: targetClass.id,
        targetClassName: targetClass.name,
        targetSemesterId: targetSem.id,
        targetSemesterName: targetSem.name,
        customTitle: title,
      })
    );
  };

  return (
    <Overlay onClick={handleClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>📋 Tạo Bản Sao Thời Khóa Biểu</Title>
          <CloseButton onClick={handleClose}>✕</CloseButton>
        </Header>

        <Body>
          <SourceInfo>
            Sao chép khung giờ và ma trận tiết học từ thời khóa biểu gốc:
            <div style={{ fontWeight: 700, marginTop: '2px' }}>
              {targetSchedule.title} ({targetSchedule.className})
            </div>
          </SourceInfo>

          <FormGroup>
            <Label>Lớp học đích áp dụng *</Label>
            <Select
              value={targetClassId}
              onChange={(e) => setTargetClassId(e.target.value)}
            >
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
              value={targetSemesterId}
              onChange={(e) => setTargetSemesterId(e.target.value)}
            >
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.name} ({sem.academicYear})
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Tên thời khóa biểu mới (Tự động tạo - BR02)</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Thời khóa biểu: Học kỳ..."
            />
          </FormGroup>
        </Body>

        <Footer>
          <Button onClick={handleClose}>Hủy bỏ</Button>
          <Button $primary onClick={handleClone}>
            Tạo bản sao
          </Button>
        </Footer>
      </ModalCard>
    </Overlay>
  );
};
