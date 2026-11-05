import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faCheckCircle,
  faUserGraduate,
  faUser,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '@/store';
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
} from '@/utils/feedbackValidation';
import { MOCK_STAFF_LIST } from '@/services/mockFeedbackData';

interface FeedbackRowProps {
  item: FeedbackItem;
}

export default function FeedbackRow({ item }: FeedbackRowProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { schoolCode = 'demo' } = router.query;

  const statusMeta = FEEDBACK_STATUS_MAP[item.status];
  const priorityMeta = FEEDBACK_PRIORITY_MAP[item.priority];

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
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
      {/* Code */}
      <td className="py-3 px-3 font-semibold text-blue-600 whitespace-nowrap">
        <Link
          href={`/${schoolCode}/school/feedback/${item.id}`}
          className="hover:underline flex items-center space-x-1"
        >
          <span>{item.code}</span>
        </Link>
      </td>

      {/* Title & Category */}
      <td className="py-3 px-3 max-w-[240px]">
        <Link
          href={`/${schoolCode}/school/feedback/${item.id}`}
          className="font-medium text-slate-800 hover:text-blue-600 line-clamp-1 mb-0.5"
          title={item.title}
        >
          {item.title}
        </Link>
        <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">
          {item.categoryLabel}
        </span>
      </td>

      {/* Student */}
      <td className="py-3 px-3 whitespace-nowrap">
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
          className="text-left group cursor-pointer"
        >
          <div className="flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
              <FontAwesomeIcon icon={faUserGraduate} />
            </span>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-blue-600">
                {item.studentName}
              </p>
              <p className="text-[10px] text-slate-500">Lớp {item.studentClass}</p>
            </div>
          </div>
        </button>
      </td>

      {/* Parent */}
      <td className="py-3 px-3 whitespace-nowrap">
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
          className="text-left group cursor-pointer"
        >
          <div className="flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <div>
              <p className="font-medium text-slate-700 group-hover:text-blue-600">
                {item.parentName}
              </p>
              <p className="text-[10px] text-slate-400">
                {item.parentRelationship || 'Phụ huynh'}
              </p>
            </div>
          </div>
        </button>
      </td>

      {/* Status */}
      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border"
          style={{
            color: statusMeta.color,
            backgroundColor: `${statusMeta.color}12`,
            borderColor: `${statusMeta.color}35`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full mr-1.5"
            style={{ backgroundColor: statusMeta.color }}
          />
          {statusMeta.label}
        </span>
      </td>

      {/* Waiting For */}
      <td className="py-3 px-3 whitespace-nowrap">
        {item.waitingFor === 'school' ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            Từ nhà trường
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-800 border border-purple-200">
            Từ phụ huynh
          </span>
        )}
      </td>

      {/* Inline Assignee Select */}
      <td className="py-3 px-3 whitespace-nowrap">
        <select
          value={item.assigneeId || 'unassigned'}
          onChange={handleAssigneeChange}
          className="text-xs bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[140px]"
        >
          <option value="unassigned">-- Chưa chọn --</option>
          {MOCK_STAFF_LIST.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.name}
            </option>
          ))}
        </select>
      </td>

      {/* Inline Priority Select (BR04, K056) */}
      <td className="py-3 px-3 whitespace-nowrap">
        <select
          value={item.priority}
          onChange={handlePriorityChange}
          className={`text-xs font-semibold rounded px-2 py-1 border cursor-pointer ${priorityMeta.badgeColor}`}
        >
          <option value="low">Thấp</option>
          <option value="medium">Trung bình</option>
          <option value="high">Cao</option>
          <option value="urgent">Khẩn cấp</option>
        </select>
      </td>

      {/* Created At */}
      <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-[11px]">
        {formatDate(item.createdAt)}
      </td>

      {/* Actions */}
      <td className="py-3 px-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end space-x-1.5">
          <Link
            href={`/${schoolCode}/school/feedback/${item.id}`}
            className="p-1 text-slate-500 hover:text-blue-600 rounded transition-colors"
            title="Xem chi tiết & thảo luận"
          >
            <FontAwesomeIcon icon={faEye} />
          </Link>

          {item.status !== 'completed' && (
            <button
              type="button"
              onClick={() => dispatch(openClosureModal(item.id))}
              className="p-1 text-slate-500 hover:text-emerald-600 rounded transition-colors"
              title="Đóng góp ý (Hoàn tất)"
            >
              <FontAwesomeIcon icon={faCheckCircle} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
