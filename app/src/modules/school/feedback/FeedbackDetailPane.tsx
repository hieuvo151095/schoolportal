import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCheckCircle,
  faUserGraduate,
  faUser,
  faHistory,
  faTag,
  faCalendarAlt,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  updatePriority,
  updateAssignee,
  openClosureModal,
  openProfileModal,
} from '@/store/slices/feedbackSlice';
import { FeedbackItem, FeedbackPriority } from '@/types/feedback';
import {
  FEEDBACK_PRIORITY_MAP,
  FEEDBACK_STATUS_MAP,
  formatFallbackField,
} from '@/utils/feedbackValidation';
import { MOCK_STAFF_LIST } from '@/services/mockFeedbackData';
import DiscussionStream from './DiscussionStream';
import DiscussionComposer from './DiscussionComposer';
import ClosureModal from './ClosureModal';
import ProfileQuickViewModal from './ProfileQuickViewModal';

interface FeedbackDetailPaneProps {
  item: FeedbackItem;
}

const DetailLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2.4fr 1fr;
  }
`;

const SidebarCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

export default function FeedbackDetailPane({ item }: FeedbackDetailPaneProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { schoolCode = 'demo' } = router.query;
  const { items } = useAppSelector((state) => state.feedback);

  const statusMeta = FEEDBACK_STATUS_MAP[item.status];
  const priorityMeta = FEEDBACK_PRIORITY_MAP[item.priority];

  // Find recent other tickets from the same parent
  const recentTickets = items
    .filter((i) => i.parentId === item.parentId && i.id !== item.id)
    .slice(0, 4);

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      updatePriority({
        feedbackId: item.id,
        priority: e.target.value as FeedbackPriority,
      })
    );
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId || selectedId === 'unassigned') {
      dispatch(
        updateAssignee({
          feedbackId: item.id,
          assigneeId: undefined,
          assigneeName: undefined,
          assigneeAvatar: undefined,
        })
      );
    } else {
      const staff = MOCK_STAFF_LIST.find((s) => s.id === selectedId);
      if (staff) {
        dispatch(
          updateAssignee({
            feedbackId: item.id,
            assigneeId: staff.id,
            assigneeName: staff.name,
            assigneeAvatar: staff.avatarUrl,
          })
        );
      }
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()} ${d
      .getHours()
      .toString()
      .padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {/* Navigation Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href={`/${schoolCode}/school/feedback`}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-all"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5" />
            Quay lại danh sách
          </Link>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>Góp ý</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">{item.code}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
            style={{
              color: statusMeta.color,
              backgroundColor: `${statusMeta.color}15`,
              borderColor: `${statusMeta.color}40`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: statusMeta.color }}
            />
            {statusMeta.label}
          </span>
        </div>
      </div>

      <DetailLayout>
        {/* Left Pane: Original Message & Discussion Stream (70%) */}
        <div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
              <h1 className="text-lg font-bold text-slate-800">{item.title}</h1>
              <span className="text-xs px-2.5 py-1 font-medium bg-slate-100 text-slate-700 rounded-md">
                {item.categoryLabel}
              </span>
            </div>

            {/* Discussion Timeline */}
            <DiscussionStream item={item} />

            {/* Discussion Composer (BR06) */}
            <DiscussionComposer
              feedbackId={item.id}
              isClosed={item.status === 'completed'}
            />
          </div>
        </div>

        {/* Right Sidebar: 3 Metadata Cards (30%) */}
        <div>
          {/* Card 1: Thông tin góp ý */}
          <SidebarCard>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Thông tin góp ý</span>
              <FontAwesomeIcon icon={faTag} className="text-slate-400" />
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[11px] text-slate-400 mb-0.5">Loại góp ý</p>
                <p className="font-semibold text-slate-800">{item.categoryLabel}</p>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 mb-0.5">Thời gian gửi</p>
                <p className="font-medium text-slate-700">{formatDate(item.createdAt)}</p>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 mb-0.5">Học sinh liên quan</p>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      openProfileModal({
                        type: 'student',
                        data: {
                          id: item.studentId,
                          fullName: item.studentName,
                          className: item.studentClass,
                          avatarUrl: item.studentAvatar,
                        },
                      })
                    )
                  }
                  className="font-semibold text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <FontAwesomeIcon icon={faUserGraduate} className="text-[10px]" />
                  <span>
                    {item.studentName} ({item.studentClass})
                  </span>
                </button>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 mb-1">Người xử lý</p>
                <select
                  value={item.assigneeId || 'unassigned'}
                  onChange={handleAssigneeChange}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="unassigned">-- Chưa phân công --</option>
                  {MOCK_STAFF_LIST.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 mb-1">Độ ưu tiên</p>
                <select
                  value={item.priority}
                  onChange={handlePriorityChange}
                  className={`w-full text-xs font-semibold rounded-lg px-2.5 py-1.5 border cursor-pointer ${priorityMeta.badgeColor}`}
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>

              {/* Action Button: Đóng góp ý (BR07, GY-01) */}
              <div className="pt-2">
                {item.status !== 'completed' ? (
                  <button
                    type="button"
                    onClick={() => dispatch(openClosureModal(item.id))}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5" />
                    Đóng góp ý (Hoàn tất)
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center text-xs text-emerald-800 font-semibold">
                    Đã hoàn tất ngày {item.closedAt ? formatDate(item.closedAt) : 'trước đó'}
                  </div>
                )}
              </div>
            </div>
          </SidebarCard>

          {/* Card 2: Thông tin người tạo */}
          <SidebarCard>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Thông tin người tạo</span>
              <FontAwesomeIcon icon={faUser} className="text-slate-400" />
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <p className="text-[11px] text-slate-400 mb-0.5">Họ và tên phụ huynh</p>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      openProfileModal({
                        type: 'parent',
                        data: {
                          id: item.parentId,
                          fullName: item.parentName,
                          relationship: item.parentRelationship,
                          phone: item.parentPhone,
                          email: item.parentEmail,
                          studentName: item.studentName,
                          studentClass: item.studentClass,
                        },
                      })
                    )
                  }
                  className="font-bold text-slate-800 hover:text-blue-600 transition-colors"
                >
                  {item.parentName}
                </button>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 mb-0.5">Mối quan hệ</p>
                <p className="font-medium text-slate-700">
                  {formatFallbackField(item.parentRelationship, 'quan hệ')}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 mb-0.5">Số điện thoại</p>
                <p className="font-medium text-slate-700">
                  {formatFallbackField(item.parentPhone, 'số điện thoại')}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 mb-0.5">Email liên hệ</p>
                <p className="font-medium text-slate-700 truncate">
                  {formatFallbackField(item.parentEmail, 'email')}
                </p>
              </div>
            </div>
          </SidebarCard>

          {/* Card 3: Góp ý gần đây */}
          <SidebarCard>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Góp ý gần đây</span>
              <FontAwesomeIcon icon={faHistory} className="text-slate-400" />
            </h3>

            {recentTickets.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Không có góp ý gần đây</p>
            ) : (
              <div className="space-y-2">
                {recentTickets.map((recent) => (
                  <Link
                    key={recent.id}
                    href={`/${schoolCode}/school/feedback/${recent.id}`}
                    className="block p-2 bg-slate-50 hover:bg-blue-50/60 rounded-lg transition-colors border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-blue-600">
                        {recent.code}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(recent.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-1 font-medium">
                      {recent.title}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </SidebarCard>
        </div>
      </DetailLayout>

      {/* Modals */}
      <ClosureModal />
      <ProfileQuickViewModal />
    </div>
  );
}
