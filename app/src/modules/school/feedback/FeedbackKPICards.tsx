import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSpinner,
  faCheck,
  faRotateLeft,
  faFilterCircleXmark,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setStatusCardFilter,
  clearStatusCardFilter,
} from '@/store/slices/feedbackSlice';
import { FeedbackStatus } from '@/types/feedback';
import { computeFeedbackKPIs } from '@/utils/feedbackValidation';

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const KPICard = styled.div<{ $isActive: boolean; $themeColor: string }>`
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 2px solid ${(props) => (props.$isActive ? props.$themeColor : '#E2E8F0')};
  box-shadow: ${(props) =>
    props.$isActive
      ? `0 4px 12px ${props.$themeColor}25`
      : '0 1px 3px rgba(0, 0, 0, 0.05)'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${(props) => props.$themeColor};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const IconBadge = styled.div<{ $bgColor: string; $color: string }>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.625rem;
  background-color: ${(props) => props.$bgColor};
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
`;

export default function FeedbackKPICards() {
  const dispatch = useAppDispatch();
  const { items, filters, activeCardFilter } = useAppSelector((state) => state.feedback);

  const kpis = computeFeedbackKPIs(items, filters.schoolYear);

  const cards: {
    status: FeedbackStatus;
    label: string;
    count: number;
    icon: any;
    themeColor: string;
    bgColor: string;
    tooltip?: string;
  }[] = [
    {
      status: 'new',
      label: 'Yêu cầu mới',
      count: kpis.newCount,
      icon: faPlus,
      themeColor: '#0070CE',
      bgColor: '#EFF6FF',
      tooltip: 'Góp ý mới gửi từ phụ huynh qua App (Icon + chỉ là biểu tượng nhận diện và lọc)',
    },
    {
      status: 'processing',
      label: 'Đang xử lý',
      count: kpis.processingCount,
      icon: faSpinner,
      themeColor: '#8B5CF6',
      bgColor: '#F5F3FF',
      tooltip: 'Góp ý đang được nhà trường giải quyết và trao đổi',
    },
    {
      status: 'completed',
      label: 'Hoàn tất',
      count: kpis.completedCount,
      icon: faCheck,
      themeColor: '#10B981',
      bgColor: '#ECFDF5',
      tooltip: 'Góp ý đã được xử lý xong và đóng chính thức',
    },
    {
      status: 'reopened',
      label: 'Mở lại',
      count: kpis.reopenedCount,
      icon: faRotateLeft,
      themeColor: '#F59E0B',
      bgColor: '#FFFBEB',
      tooltip: 'Góp ý phụ huynh gửi thêm ý kiến sau khi đã đóng',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tổng quan trạng thái ({filters.schoolYear || 'Toàn bộ'})
          </span>
          <span
            className="text-xs text-slate-400 cursor-help"
            title="Nhấp vào thẻ để lọc danh sách theo trạng thái"
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </span>
        </div>
        {activeCardFilter !== 'all' && (
          <button
            onClick={() => dispatch(clearStatusCardFilter())}
            className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faFilterCircleXmark} className="mr-1" />
            Xóa bộ lọc thẻ (Hiện tất cả {kpis.totalCount})
          </button>
        )}
      </div>

      <CardsGrid>
        {cards.map((card) => {
          const isActive = activeCardFilter === card.status;
          return (
            <KPICard
              key={card.status}
              $isActive={isActive}
              $themeColor={card.themeColor}
              onClick={() => dispatch(setStatusCardFilter(card.status))}
              title={card.tooltip}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{card.count}</p>
                </div>
                <IconBadge $bgColor={card.bgColor} $color={card.themeColor}>
                  <FontAwesomeIcon icon={card.icon} />
                </IconBadge>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {isActive ? 'Đang lọc trạng thái này' : 'Bấm để lọc danh sách'}
                </span>
                {isActive && (
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: card.themeColor }}
                  />
                )}
              </div>
            </KPICard>
          );
        })}
      </CardsGrid>
    </div>
  );
}
