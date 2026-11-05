import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPaperPlane, faBullhorn, faGlobe } from '@fortawesome/free-solid-svg-icons';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
              <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Gửi / Xuất bản thực đơn</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-700">
            Đang chọn gửi <span className="font-semibold text-gray-900">"{menu.title}"</span>. Vui lòng
            chọn hình thức gửi:
          </div>

          <div className="space-y-3 pt-2">
            {/* Option 1: Gửi thông báo qua Bảng thông tin */}
            <button
              type="button"
              onClick={() => onConfirmPublish(true)}
              className="w-full text-left p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 transition-all group flex items-start gap-3.5"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                <FontAwesomeIcon icon={faBullhorn} className="text-sm" />
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
              className="w-full text-left p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all group flex items-start gap-3.5"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <FontAwesomeIcon icon={faGlobe} className="text-sm" />
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

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};
