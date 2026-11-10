import React from 'react';
import { Icon, SlideOver } from '../../../components/ds';
import { WeeklyMenu } from '../../../types/menu';

interface PublishMenuModalProps {
  isOpen: boolean;
  menu: WeeklyMenu | null;
  onClose: () => void;
  onConfirmPublish: (viaAnnouncement: boolean) => void;
}

export const PublishMenuModal: React.FC<PublishMenuModalProps> = ({
  isOpen,
  menu,
  onClose,
  onConfirmPublish,
}) => {
  if (!isOpen || !menu) return null;

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Gửi / Xuất bản thực đơn"
      description={menu.title}
      icon="paper-plane"
      width={520}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-4">
        <div className="text-sm text-gray-700">
          Đang chọn gửi <span className="font-semibold text-gray-900">&ldquo;{menu.title}&rdquo;</span>. Vui lòng
          chọn hình thức gửi:
        </div>

        <div className="space-y-3 pt-2">
          {/* Option 1: Gửi thông báo qua Bảng thông tin */}
          <button
            type="button"
            onClick={() => onConfirmPublish(true)}
            className="w-full text-left p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 transition-all group flex items-start gap-3.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Icon name="bullhorn" className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-blue-900 text-sm flex items-center gap-2">
                Gửi thông báo (qua Bảng thông tin)
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-blue-100 text-blue-700 rounded-full">
                  Khuyên dùng
                </span>
              </div>
              <div className="text-xs text-blue-700/80 mt-1 leading-relaxed">
                Xuất bản thực đơn và tự động tạo thông báo gửi tới ứng dụng phụ huynh và bảng tin nội bộ nhà trường.
              </div>
            </div>
          </button>

          {/* Option 2: Chỉ xuất bản */}
          <button
            type="button"
            onClick={() => onConfirmPublish(false)}
            className="w-full text-left p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all group flex items-start gap-3.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Icon name="globe" className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Chỉ xuất bản</div>
              <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                Chỉ cập nhật trạng thái hiển thị trên Cổng Vận Hành, không gửi tin nhắn thông báo đẩy cho phụ huynh.
              </div>
            </div>
          </button>
        </div>
      </div>
    </SlideOver>
  );
};
