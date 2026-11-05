import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  resetFilters,
  setFilterCriteria,
  setFilterDrawerOpen,
} from '../../../store/slices/scheduleSlice';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: modalFadeIn 0.2s ease-out;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
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
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
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

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    background: ${(props) => (props.$primary ? '#005bb5' : '#f1f5f9')};
  }
`;

export const ExtendedScheduleFilterModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isFilterDrawerOpen, filterCriteria, semesters } = useAppSelector(
    (state) => state.schedule
  );

  const [semesterId, setSemesterId] = useState(filterCriteria.semesterId);
  const [academicYear, setAcademicYear] = useState(filterCriteria.academicYear);
  const [type, setType] = useState(filterCriteria.type);
  const [status, setStatus] = useState(filterCriteria.status);

  if (!isFilterDrawerOpen) return null;

  const handleClose = () => {
    dispatch(setFilterDrawerOpen(false));
  };

  const handleApply = () => {
    dispatch(
      setFilterCriteria({
        semesterId,
        academicYear,
        type,
        status,
      })
    );
    handleClose();
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setSemesterId('all');
    setAcademicYear('all');
    setType('all');
    setStatus('all');
    handleClose();
  };

  return (
    <Overlay onClick={handleClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>⚙️ Lọc Mở Rộng Thời Khóa Biểu (BR12)</Title>
          <CloseButton onClick={handleClose}>✕</CloseButton>
        </Header>

        <Body>
          <FormGroup>
            <Label>Học kỳ</Label>
            <Select
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
            >
              <option value="all">Tất cả các học kỳ</option>
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.name} ({sem.academicYear})
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Niên khóa / Năm học</Label>
            <Select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            >
              <option value="all">Tất cả năm học</option>
              <option value="2026-2027">2026 - 2027 (Hiện hành)</option>
              <option value="2025-2026">2025 - 2026</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Định dạng thời khóa biểu</Label>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="scheduleType"
                  value="all"
                  checked={type === 'all'}
                  onChange={() => setType('all')}
                />
                Tất cả định dạng
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="scheduleType"
                  value="grid"
                  checked={type === 'grid'}
                  onChange={() => setType('grid')}
                />
                📊 Chỉ dạng lưới (Grid Matrix)
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="scheduleType"
                  value="file"
                  checked={type === 'file'}
                  onChange={() => setType('file')}
                />
                📄 Chỉ dạng file đính kèm (PDF / Image)
              </RadioLabel>
            </RadioGroup>
          </FormGroup>

          <FormGroup>
            <Label>Trạng thái phát hành</Label>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="scheduleStatus"
                  value="all"
                  checked={status === 'all'}
                  onChange={() => setStatus('all')}
                />
                Tất cả trạng thái
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="scheduleStatus"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                />
                ● Đã phát hành
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="scheduleStatus"
                  value="updated"
                  checked={status === 'updated'}
                  onChange={() => setStatus('updated')}
                />
                ★ Cập nhật (Đã gửi điều chỉnh)
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="scheduleStatus"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                />
                ○ Bản nháp
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
        </Body>

        <Footer>
          <Button onClick={handleReset}>Đặt lại</Button>
          <Button $primary onClick={handleApply}>
            Áp dụng bộ lọc
          </Button>
        </Footer>
      </ModalCard>
    </Overlay>
  );
};
