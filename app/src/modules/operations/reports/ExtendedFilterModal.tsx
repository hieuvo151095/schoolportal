import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setReportFilterCriteria, toggleExtendedFilter } from '../../../store/slices/reportsSlice';
import { DEVELOPMENTAL_TEMPLATES } from '../../../services/mockReportsData';
import { ReportLifecycleStatus, ReportTemplateId } from '../../../types/reports';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(2px);
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 1px solid #E2E8F0;
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F8FAFC;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1E293B;
    margin: 0;
  }

  button {
    background: none;
    border: none;
    color: #64748B;
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
    padding: 4px;
    &:hover {
      color: #0F172A;
    }
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  font-size: 13px;
  color: #1E293B;
  outline: none;

  &:focus {
    border-color: #0070CE;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.15);
  }
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  font-size: 13px;
  color: #1E293B;
  outline: none;
  background-color: white;

  &:focus {
    border-color: #0070CE;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.15);
  }
`;

const ModalFooter = styled.div`
  padding: 14px 20px;
  border-top: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F8FAFC;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  border: 1px solid ${props => 
    props.$variant === 'primary' ? '#0070CE' : 
    props.$variant === 'secondary' ? '#CBD5E1' : 'transparent'};
  background-color: ${props => 
    props.$variant === 'primary' ? '#0070CE' : 
    props.$variant === 'secondary' ? '#FFFFFF' : 'transparent'};
  color: ${props => 
    props.$variant === 'primary' ? '#FFFFFF' : 
    props.$variant === 'ghost' ? '#EF4444' : '#334155'};

  &:hover {
    background-color: ${props => 
      props.$variant === 'primary' ? '#005bb5' : 
      props.$variant === 'ghost' ? '#FEE2E2' : '#F1F5F9'};
  }
`;

export const ExtendedFilterModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.reports.isExtendedFilterOpen);
  const currentFilters = useAppSelector(state => state.reports.reportFilters);

  const [searchQuery, setSearchQuery] = useState(currentFilters.searchQuery);
  const [templateId, setTemplateId] = useState<'all' | ReportTemplateId>(currentFilters.templateId);
  const [status, setStatus] = useState<'all' | ReportLifecycleStatus>(currentFilters.status);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(currentFilters.searchQuery);
      setTemplateId(currentFilters.templateId);
      setStatus(currentFilters.status);
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(toggleExtendedFilter(false));
  };

  const handleApply = () => {
    dispatch(setReportFilterCriteria({
      searchQuery,
      templateId,
      status
    }));
    handleClose();
  };

  const handleReset = () => {
    dispatch(setReportFilterCriteria({
      searchQuery: '',
      classId: 'all',
      templateId: 'all',
      status: 'all'
    }));
    handleClose();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalCard onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="filter-title">
        <ModalHeader>
          <h3 id="filter-title">Bộ Lọc Báo Cáo Mở Rộng</h3>
          <button onClick={handleClose} aria-label="Đóng">&times;</button>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label htmlFor="filter-search">Tên học sinh / Mã học sinh:</label>
            <Input
              id="filter-search"
              placeholder="Nhập tên học sinh để tìm kiếm..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="filter-template">Mẫu báo cáo (Template):</label>
            <Select
              id="filter-template"
              value={templateId}
              onChange={e => setTemplateId(e.target.value as 'all' | ReportTemplateId)}
            >
              <option value="all">-- Tất cả mẫu báo cáo --</option>
              {DEVELOPMENTAL_TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <label htmlFor="filter-status">Trạng thái báo cáo:</label>
            <Select
              id="filter-status"
              value={status}
              onChange={e => setStatus(e.target.value as 'all' | ReportLifecycleStatus)}
            >
              <option value="all">-- Tất cả trạng thái --</option>
              <option value="draft">Bản nháp (Draft)</option>
              <option value="sent">Đã gửi cho phụ huynh (Sent)</option>
              <option value="completed">Đã hoàn tất (Completed)</option>
            </Select>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button $variant="ghost" onClick={handleReset}>
            Đặt lại bộ lọc
          </Button>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button $variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button $variant="primary" onClick={handleApply}>
              Áp dụng
            </Button>
          </div>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};
