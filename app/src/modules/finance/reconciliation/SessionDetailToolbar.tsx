import React from 'react';
import { PaymentChannel } from '../../../types/reconciliation';
import { FilterBar, Button } from '../../../components/ds';

interface SessionDetailToolbarProps {
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  selectedChannel: 'all' | PaymentChannel;
  onChannelChange: (channel: 'all' | PaymentChannel) => void;
  filteredCount: number;
  onExport: () => void;
}

export const SessionDetailToolbar: React.FC<SessionDetailToolbarProps> = ({
  searchKeyword,
  onSearchChange,
  selectedChannel,
  onChannelChange,
  filteredCount,
  onExport,
}) => {
  const isExportDisabled = filteredCount === 0;

  return (
    <div className="mb-4">
      <FilterBar
        search={{
          placeholder: 'Tìm theo mã trẻ, tên trẻ, mã giao dịch...',
          value: searchKeyword,
          onChange: (val) => onSearchChange(val),
        }}
        filters={[
          {
            placeholder: 'Chọn cổng thanh toán',
            options: [
              { value: 'all', label: 'Tất cả cổng thanh toán' },
              { value: 'finviet', label: 'Ví FinViet' },
              { value: 'ecopay', label: 'QR Ecopay' },
            ],
            value: selectedChannel,
            onChange: (val) => onChannelChange(val as any),
          },
        ]}
        actions={
          <Button
            variant="secondary"
            icon="download"
            onClick={onExport}
            disabled={isExportDisabled}
          >
            Xuất bảng đối soát Excel
          </Button>
        }
      />
    </div>
  );
};

export default SessionDetailToolbar;
