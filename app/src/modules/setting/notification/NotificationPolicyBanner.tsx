import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faGlobe, faMobileScreenButton, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

/**
 * Top Informational Policy Banner for Notification Settings (BR03, K097)
 * Articulates the 3 non-negotiable operational principles across all school notification dispatch rules.
 */
export const NotificationPolicyBanner: React.FC = () => {
  return (
    <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#0070CE] flex items-center justify-center shrink-0 mt-0.5">
          <FontAwesomeIcon icon={faInfoCircle} className="text-base" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-blue-900 leading-snug">
            Nguyên tắc cấu hình thông báo tự động toàn trường
          </h3>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            Hệ thống thông báo vận hành dựa trên các tiêu chuẩn cốt lõi nhằm đảm bảo thông tin liên lạc thông suốt, không gián đoạn:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-blue-200/60">
            {/* Principle 1: School-wide Scope */}
            <div className="flex items-start gap-2 text-xs text-blue-800">
              <FontAwesomeIcon icon={faGlobe} className="text-[#0070CE] mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block text-blue-950">Phạm vi toàn trường</span>
                <span className="text-blue-700 leading-relaxed">
                  Thiết lập có hiệu lực đồng bộ trên tất cả các lớp học, giáo viên, nhân viên và phụ huynh.
                </span>
              </div>
            </div>

            {/* Principle 2: Multi-Platform Delivery */}
            <div className="flex items-start gap-2 text-xs text-blue-800">
              <FontAwesomeIcon icon={faMobileScreenButton} className="text-[#0070CE] mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block text-blue-950">Đa nền tảng đồng thời</span>
                <span className="text-blue-700 leading-relaxed">
                  Thông báo đẩy tự động xuất hiện trên cả Web Operating Portal và Ứng dụng Di động.
                </span>
              </div>
            </div>

            {/* Principle 3: Calendar Overflow Fallback Rule */}
            <div className="flex items-start gap-2 text-xs text-blue-800">
              <FontAwesomeIcon icon={faCalendarDays} className="text-[#0070CE] mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block text-blue-950">Quy tắc Fallback ngày 31</span>
                <span className="text-blue-700 leading-relaxed">
                  Lịch nhắc ngày 29, 30, 31 sẽ tự động kích hoạt vào ngày cuối cùng của các tháng ngắn hơn.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
