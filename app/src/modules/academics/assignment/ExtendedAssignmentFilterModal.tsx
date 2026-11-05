import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setFilterCriteria,
  setFilterDrawerOpen,
  resetFilterCriteria,
} from '../../../store/slices/assignmentSlice';
import {
  AudienceType,
  DueDateFilter,
  AssignmentLifecycleStatus,
} from '../../../types/assignment';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 100;
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const DrawerContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
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

const DrawerHeader = styled.div`
  padding: 18px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DrawerTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;

  &:hover {
    color: #0f172a;
    background-color: #f1f5f9;
  }
`;

const DrawerBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 12px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RadioLabel = styled.label<{ $checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid ${(props) => (props.$checked ? '#0070ce' : '#e2e8f0')};
  background-color: ${(props) => (props.$checked ? '#eff6ff' : '#ffffff')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${(props) => (props.$checked ? '600' : '400')};
  color: ${(props) => (props.$checked ? '#0070ce' : '#334155')};
  transition: all 0.2s;

  &:hover {
    border-color: #0070ce;
  }
`;

const DrawerFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background-color: #f8fafc;
`;

const ResetButton = styled.button`
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #475569;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;

const ApplyButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #0070ce;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: #005bb0;
  }
`;

export const ExtendedAssignmentFilterModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.assignment.isFilterDrawerOpen
  );
  const filterCriteria = useAppSelector(
    (state) => state.assignment.filterCriteria
  );

  const [audience, setAudience] = useState<'all' | AudienceType>(
    filterCriteria.audienceType || 'all'
  );
  const [dueDate, setDueDate] = useState<DueDateFilter>(
    filterCriteria.dueDateFilter
  );
  const [status, setStatus] = useState<'all' | AssignmentLifecycleStatus>(
    filterCriteria.status
  );

  if (!isOpen) return null;

  const handleApply = () => {
    dispatch(
      setFilterCriteria({
        audienceType: audience,
        dueDateFilter: dueDate,
        status,
      })
    );
    dispatch(setFilterDrawerOpen(false));
  };

  const handleReset = () => {
    dispatch(resetFilterCriteria());
    setAudience('all');
    setDueDate('tat_ca');
    setStatus('all');
    dispatch(setFilterDrawerOpen(false));
  };

  return (
    <Overlay $isOpen={isOpen} onClick={() => dispatch(setFilterDrawerOpen(false))}>
      <DrawerContainer onClick={(e) => e.stopPropagation()}>
        <DrawerHeader>
          <DrawerTitle>Lọc Mở Rộng Bài Tập</DrawerTitle>
          <CloseButton onClick={() => dispatch(setFilterDrawerOpen(false))}>
            ✕
          </CloseButton>
        </DrawerHeader>

        <DrawerBody>
          {/* Audience Scope (BR12) */}
          <div>
            <SectionTitle>Giao cho</SectionTitle>
            <RadioGroup>
              <RadioLabel $checked={audience === 'all'}>
                <input
                  type="radio"
                  name="audience"
                  checked={audience === 'all'}
                  onChange={() => setAudience('all')}
                />
                <span>Tất cả</span>
              </RadioLabel>
              <RadioLabel $checked={audience === 'whole_class'}>
                <input
                  type="radio"
                  name="audience"
                  checked={audience === 'whole_class'}
                  onChange={() => setAudience('whole_class')}
                />
                <span>Cả lớp</span>
              </RadioLabel>
              <RadioLabel $checked={audience === 'specific_students'}>
                <input
                  type="radio"
                  name="audience"
                  checked={audience === 'specific_students'}
                  onChange={() => setAudience('specific_students')}
                />
                <span>Học sinh cụ thể</span>
              </RadioLabel>
            </RadioGroup>
          </div>

          {/* Due Date Status (BR12, BR13) */}
          <div>
            <SectionTitle>Hạn nộp bài</SectionTitle>
            <RadioGroup>
              <RadioLabel $checked={dueDate === 'tat_ca'}>
                <input
                  type="radio"
                  name="dueDate"
                  checked={dueDate === 'tat_ca'}
                  onChange={() => setDueDate('tat_ca')}
                />
                <span>Tất cả bài tập</span>
              </RadioLabel>
              <RadioLabel $checked={dueDate === 'dang_tien_hanh'}>
                <input
                  type="radio"
                  name="dueDate"
                  checked={dueDate === 'dang_tien_hanh'}
                  onChange={() => setDueDate('dang_tien_hanh')}
                />
                <span>Đang tiến hành (chưa hết hạn)</span>
              </RadioLabel>
              <RadioLabel $checked={dueDate === 'het_han'}>
                <input
                  type="radio"
                  name="dueDate"
                  checked={dueDate === 'het_han'}
                  onChange={() => setDueDate('het_han')}
                />
                <span>Hết hạn nộp</span>
              </RadioLabel>
            </RadioGroup>
          </div>

          {/* Lifecycle Status (BR05, BR12) */}
          <div>
            <SectionTitle>Trạng thái bài tập</SectionTitle>
            <RadioGroup>
              <RadioLabel $checked={status === 'all'}>
                <input
                  type="radio"
                  name="status"
                  checked={status === 'all'}
                  onChange={() => setStatus('all')}
                />
                <span>Tất cả trạng thái</span>
              </RadioLabel>
              <RadioLabel $checked={status === 'da_gui'}>
                <input
                  type="radio"
                  name="status"
                  checked={status === 'da_gui'}
                  onChange={() => setStatus('da_gui')}
                />
                <span>Đã gửi</span>
              </RadioLabel>
              <RadioLabel $checked={status === 'chua_gui'}>
                <input
                  type="radio"
                  name="status"
                  checked={status === 'chua_gui'}
                  onChange={() => setStatus('chua_gui')}
                />
                <span>Chưa gửi (đã lên lịch)</span>
              </RadioLabel>
              <RadioLabel $checked={status === 'da_tao'}>
                <input
                  type="radio"
                  name="status"
                  checked={status === 'da_tao'}
                  onChange={() => setStatus('da_tao')}
                />
                <span>Đã tạo (bản nháp)</span>
              </RadioLabel>
            </RadioGroup>
          </div>
        </DrawerBody>

        <DrawerFooter>
          <ResetButton onClick={handleReset}>Xóa bộ lọc</ResetButton>
          <ApplyButton onClick={handleApply}>Áp dụng bộ lọc</ApplyButton>
        </DrawerFooter>
      </DrawerContainer>
    </Overlay>
  );
};
