import React from 'react';
import { Icon, SlideOver } from '@/components/ds';
import type { ArchiveStaffOperator } from '@/types/archive';

interface ArchiveStaffModalProps {
  staff: ArchiveStaffOperator | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArchiveStaffModal: React.FC<ArchiveStaffModalProps> = ({
  staff,
  isOpen,
  onClose,
}) => {
  if (!staff) return null;

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Người thực hiện lưu trữ"
      description="Thông tin cán bộ / nhân sự phụ trách tiếp nhận và xác thực hồ sơ lưu trữ"
      icon="user-tie"
      width={480}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-[#0070CE] flex items-center justify-center text-2xl font-bold mb-3 border-2 border-blue-200">
            <Icon name="user-tie" size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">{staff.name}</h3>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {staff.role || 'Cán bộ nhà trường'}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Thông tin liên hệ & định danh
          </h4>

          {staff.code && (
            <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl text-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0070CE] flex items-center justify-center shrink-0">
                <Icon name="id-badge" size={16} />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Mã nhân sự</div>
                <div className="font-semibold text-slate-800">{staff.code}</div>
              </div>
            </div>
          )}

          {staff.phone && (
            <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl text-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Icon name="phone" size={16} />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Số điện thoại</div>
                <div className="font-semibold text-slate-800">{staff.phone}</div>
              </div>
            </div>
          )}

          {staff.email && (
            <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl text-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Icon name="envelope" size={16} />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Hòm thư điện tử</div>
                <div className="font-semibold text-slate-800">{staff.email}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SlideOver>
  );
};
