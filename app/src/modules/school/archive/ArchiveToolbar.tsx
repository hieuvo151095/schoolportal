import React from 'react';
import styled from 'styled-components';
import { Icon } from '@/components/ds';

interface ArchiveToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  archivePeriodMonth?: string;
  onMonthChange: (month?: string) => void;
  onExportExcel: () => void;
  totalCount: number;
}

const ToolbarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 650px;

  @media (max-width: 768px) {
    max-width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 240px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.625rem 2.25rem 0.625rem 2.5rem;
  font-size: 0.875rem;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  transition: all 0.15s ease-in-out;

  &:focus {
    outline: none;
    background: white;
    border-color: #0070ce;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  font-size: 0.875rem;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;

  &:hover {
    color: #475569;
    background: #e2e8f0;
  }
`;

const MonthPickerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 180px;
`;

const MonthInput = styled.input`
  width: 100%;
  padding: 0.625rem 2rem 0.625rem 2.25rem;
  font-size: 0.875rem;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  transition: all 0.15s ease-in-out;

  &:focus {
    outline: none;
    background: white;
    border-color: #0070ce;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.15);
  }
`;

const MonthIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  font-size: 0.875rem;
`;

const ClearMonthButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;

  &:hover {
    color: #475569;
    background: #e2e8f0;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const CounterBadge = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
`;

const ExportButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  color: #059669;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid #a7f3d0;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  white-space: nowrap;

  &:hover {
    background: #ecfdf5;
    border-color: #059669;
    box-shadow: 0 1px 2px rgba(5, 150, 105, 0.15);
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const ArchiveToolbar: React.FC<ArchiveToolbarProps> = ({
  searchQuery,
  onSearchChange,
  archivePeriodMonth,
  onMonthChange,
  onExportExcel,
  totalCount,
}) => {
  return (
    <ToolbarWrapper>
      <LeftSection>
        <SearchContainer>
          <SearchIconWrapper>
            <Icon name="magnifying-glass" size={14} />
          </SearchIconWrapper>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm theo tên, mã HS, lớp cũ, lý do..."
            aria-label="Tìm kiếm học sinh lưu trữ"
          />
          {searchQuery && (
            <ClearButton
              type="button"
              onClick={() => onSearchChange('')}
              title="Xóa tìm kiếm"
              aria-label="Xóa tìm kiếm"
            >
              <Icon name="xmark" size={12} />
            </ClearButton>
          )}
        </SearchContainer>

        <MonthPickerContainer>
          <MonthIconWrapper>
            <Icon name="calendar" size={14} />
          </MonthIconWrapper>
          <MonthInput
            type="month"
            value={archivePeriodMonth || ''}
            onChange={(e) => onMonthChange(e.target.value || undefined)}
            aria-label="Lọc theo tháng lưu trữ"
            title="Lọc theo tháng lưu trữ"
          />
          {archivePeriodMonth && (
            <ClearMonthButton
              type="button"
              onClick={() => onMonthChange(undefined)}
              title="Xoá lọc tháng"
              aria-label="Xoá lọc tháng"
            >
              <Icon name="xmark" size={12} />
            </ClearMonthButton>
          )}
        </MonthPickerContainer>
      </LeftSection>

      <RightSection>
        <CounterBadge>
          Tổng: <span style={{ color: '#0070ce' }}>{totalCount}</span>
        </CounterBadge>

        <ExportButton
          type="button"
          onClick={onExportExcel}
          title="Xuất danh sách học sinh lưu trữ ra file Excel"
        >
          <Icon name="download" size={14} />
          <span>Xuất Excel</span>
        </ExportButton>
      </RightSection>
    </ToolbarWrapper>
  );
};
