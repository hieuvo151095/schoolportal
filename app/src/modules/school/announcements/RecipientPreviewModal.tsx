import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../../components/ds';
import { AnnouncementRecipientBreakdown } from '../../../types/announcement';

interface RecipientPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: AnnouncementRecipientBreakdown;
  audienceScopeLabel: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 42rem;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

export const RecipientPreviewModal: React.FC<RecipientPreviewModalProps> = ({
  isOpen,
  onClose,
  breakdown,
  audienceScopeLabel
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
              <Icon name="users" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Xem Trước Đối Tượng Nhận Thông Báo
              </h3>
              <p className="text-xs text-slate-500">
                Phạm vi gửi: <span className="font-semibold text-blue-700">{audienceScopeLabel}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Icon name="xmark" className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Total summary banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                <Icon name="school" className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                  Tổng lượng tiếp cận dự kiến
                </p>
                <p className="text-2xl font-black text-blue-800">
                  {breakdown.totalRecipients.toLocaleString('vi-VN')} <span className="text-sm font-medium text-slate-600">người nhận</span>
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 max-w-xs flex items-center gap-1 justify-end">
              <Icon name="circle-info" className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Bao gồm tài khoản phụ huynh, học sinh và cán bộ liên quan</span>
            </div>
          </div>

          {/* Breakdown cards */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Phân loại theo nhóm người nhận
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-emerald-600 mb-1 flex justify-center">
                  <Icon name="users" className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xs font-medium text-slate-500">Phụ huynh</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">
                  {breakdown.parentCount.toLocaleString('vi-VN')}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-blue-600 mb-1 flex justify-center">
                  <Icon name="graduation-cap" className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xs font-medium text-slate-500">Học sinh</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">
                  {breakdown.studentCount.toLocaleString('vi-VN')}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-amber-600 mb-1 flex justify-center">
                  <Icon name="chalkboard-user" className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xs font-medium text-slate-500">Giáo viên</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">
                  {breakdown.teacherCount.toLocaleString('vi-VN')}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-purple-600 mb-1 flex justify-center">
                  <Icon name="id-badge" className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xs font-medium text-slate-500">Cán bộ/Nhân viên</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">
                  {breakdown.staffCount.toLocaleString('vi-VN')}
                </div>
              </div>
            </div>
          </div>

          {/* Class Cohorts Table */}
          {breakdown.classBreakdown.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Chi tiết danh sách lớp mục tiêu ({breakdown.classBreakdown.length} lớp)
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Tên lớp</th>
                      <th className="py-2.5 px-4 text-center">Sĩ số học sinh</th>
                      <th className="py-2.5 px-4 text-right">Phụ huynh ước tính</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {breakdown.classBreakdown.map(c => (
                      <tr key={c.classId} className="hover:bg-slate-50">
                        <td className="py-2 px-4 font-medium text-slate-800">{c.className}</td>
                        <td className="py-2 px-4 text-center text-slate-600">{c.count}</td>
                        <td className="py-2 px-4 text-right text-slate-600">~{Math.round(c.count * 1.8)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-300 transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RecipientPreviewModal;
