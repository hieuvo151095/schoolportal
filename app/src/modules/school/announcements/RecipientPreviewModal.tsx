import React from 'react';
import { Icon, SlideOver } from '../../../components/ds';
import { AnnouncementRecipientBreakdown } from '../../../types/announcement';

interface RecipientPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: AnnouncementRecipientBreakdown;
  audienceScopeLabel: string;
}

export const RecipientPreviewModal: React.FC<RecipientPreviewModalProps> = ({
  isOpen,
  onClose,
  breakdown,
  audienceScopeLabel,
}) => {
  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Đối tượng nhận thông báo"
      description={`Phạm vi phát hành: ${audienceScopeLabel}`}
      icon="users"
      width={560}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        {/* Total summary banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#0070CE] text-white flex items-center justify-center text-xl font-bold shadow-xs">
              <Icon name="school" size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                Tổng người nhận ước tính
              </p>
              <h3 className="text-2xl font-black text-blue-950 mt-0.5">
                {breakdown.totalRecipients.toLocaleString('vi-VN')}
              </h3>
            </div>
          </div>
        </div>

        {/* Breakdown 3 target groups */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Phân bổ đối tượng
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <div className="text-blue-600 mb-1 flex justify-center">
                <Icon name="user-group" size={18} />
              </div>
              <div className="text-xs font-medium text-slate-500">Phụ huynh</div>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                ~{breakdown.parentCount.toLocaleString('vi-VN')}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <div className="text-amber-600 mb-1 flex justify-center">
                <Icon name="chalkboard-user" size={18} />
              </div>
              <div className="text-xs font-medium text-slate-500">Giáo viên</div>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                {breakdown.teacherCount.toLocaleString('vi-VN')}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <div className="text-purple-600 mb-1 flex justify-center">
                <Icon name="id-badge" size={18} />
              </div>
              <div className="text-xs font-medium text-slate-500">Cán bộ / NV</div>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                {breakdown.staffCount.toLocaleString('vi-VN')}
              </div>
            </div>
          </div>
        </div>

        {/* Class Cohorts Table */}
        {breakdown.classBreakdown.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Danh sách lớp mục tiêu ({breakdown.classBreakdown.length} lớp)
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3.5">Tên lớp</th>
                    <th className="py-2.5 px-3.5 text-center">Sĩ số học sinh</th>
                    <th className="py-2.5 px-3.5 text-right">Phụ huynh ước tính</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {breakdown.classBreakdown.map((c) => (
                    <tr key={c.classId} className="hover:bg-slate-50">
                      <td className="py-2 px-3.5 font-medium text-slate-800">{c.className}</td>
                      <td className="py-2 px-3.5 text-center text-slate-600">{c.count}</td>
                      <td className="py-2 px-3.5 text-right text-slate-600">~{Math.round(c.count * 1.8)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};

export default RecipientPreviewModal;
