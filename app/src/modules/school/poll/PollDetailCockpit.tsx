import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  closePoll,
  deletePoll,
  sendPoll,
  openSendModal,
  openDeleteModal,
  openHistoryModal,
  closeModal,
} from '@/store/slices/pollSlice';
import {
  formatPollDeadline,
  canEditPoll,
  canSendPoll,
  canDeletePoll,
} from '@/utils/pollValidation';
import { POLL_AVAILABLE_CLASSES } from '@/services/mockPollData';
import { PollVoterRoster } from './PollVoterRoster';
import { SendPollModal } from './SendPollModal';
import { DeletePollModal } from './DeletePollModal';
import { VoteHistoryModal } from './VoteHistoryModal';

interface PollDetailCockpitProps {
  pollId: string;
}

export const PollDetailCockpit: React.FC<PollDetailCockpitProps> = ({ pollId }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { schoolCode } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

  const { polls, voters, activeModal, modalTargetPollId, modalTargetStudentId } =
    useAppSelector((state) => state.poll);

  const poll = polls.find((p) => p.id === pollId);
  const pollVoters = voters[pollId] || [];

  if (!poll) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
          <Icon name="circle-info" className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy cuộc bình chọn</h2>
        <p className="text-sm text-slate-500 mb-6">
          Cuộc bình chọn này có thể đã bị xóa hoặc liên kết không chính xác.
        </p>
        <Link
          href={`/${currentSchoolCode}/school/poll`}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-[#0070CE] text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Icon name="arrow-left" className="mr-2 w-4 h-4" />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Voter history modal target
  const historyVoter = modalTargetStudentId
    ? pollVoters.find((v) => v.studentId === modalTargetStudentId) || null
    : null;

  // Status configuration
  const statusMeta = {
    da_tao: {
      label: 'Bản nháp (Chưa gửi)',
      badgeCls: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    da_gui: {
      label: 'Đang diễn ra',
      badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    da_dong: {
      label: 'Đã đóng',
      badgeCls: 'bg-slate-100 text-slate-600 border-slate-200',
    },
  }[poll.status];

  // Description truncation logic (BR09)
  const fullDesc = poll.description || '';
  const isLongDescription = fullDesc.length > 180;
  const displayDescription =
    !isDescriptionExpanded && isLongDescription
      ? `${fullDesc.slice(0, 180)}...`
      : fullDesc;

  // Action handlers
  const handleSendConfirm = (payload: {
    pollId: string;
    audienceScope: 'toan_truong' | 'lop_hoc';
    targetClassIds?: string[];
    targetClassNames?: string[];
  }) => {
    dispatch(sendPoll(payload));
  };

  const handleDeleteConfirm = (id: string) => {
    dispatch(deletePoll(id));
    router.push(`/${currentSchoolCode}/school/poll`);
  };

  const handleClosePoll = () => {
    if (window.confirm('Bạn có chắc chắn muốn đóng cuộc bình chọn này trước thời hạn không?')) {
      dispatch(closePoll(poll.id));
    }
  };

  // SVG Donut calculation constants
  const svgRadius = 70;
  const svgCircumference = 2 * Math.PI * svgRadius; // ~439.82297
  let cumulativeStrokeOffset = 0;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Link
            href={`/${currentSchoolCode}/school/poll`}
            className="hover:text-[#0070CE] transition-colors flex items-center"
          >
            <Icon name="arrow-left" className="mr-2 w-3.5 h-3.5" />
            Bình chọn
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
            {poll.title}
          </span>
        </div>

        {/* State-driven actions */}
        <div className="flex items-center space-x-2">
          {canSendPoll(poll.status) && (
            <button
              onClick={() => dispatch(openSendModal(poll.id))}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-[#0070CE] hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <Icon name="paper-plane" className="mr-2 w-3.5 h-3.5" />
              Gửi bình chọn
            </button>
          )}

          {canEditPoll(poll.status) && (
            <Link
              href={`/${currentSchoolCode}/school/poll/edit/${poll.id}`}
              className="inline-flex items-center px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition-colors"
            >
              <Icon name="pen" className="mr-2 w-3.5 h-3.5 text-blue-600" />
              Chỉnh sửa
            </Link>
          )}

          {canDeletePoll(poll.status) && (
            <button
              onClick={() => dispatch(openDeleteModal(poll.id))}
              className="inline-flex items-center px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold shadow-sm transition-colors"
            >
              <Icon name="trash" className="mr-2 w-3.5 h-3.5" />
              Xóa
            </button>
          )}

          {poll.status === 'da_gui' && (
            <button
              onClick={handleClosePoll}
              className="inline-flex items-center px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-sm font-semibold shadow-sm transition-colors"
            >
              <Icon name="lock" className="mr-2 w-3.5 h-3.5" />
              Đóng bình chọn
            </button>
          )}
        </div>
      </div>

      {/* Main Poll Header & Metadata Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {poll.imageUrl && (
          <div className="w-full h-48 sm:h-64 overflow-hidden relative bg-slate-100 border-b border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poll.imageUrl}
              alt={poll.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-6 right-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-white/90 ${statusMeta.badgeCls}`}
              >
                {statusMeta.label}
              </span>
            </div>
          </div>
        )}

        <div className="p-6">
          {!poll.imageUrl && (
            <div className="mb-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.badgeCls}`}
              >
                {statusMeta.label}
              </span>
            </div>
          )}

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{poll.title}</h1>

          {/* Collapsible Description (BR09) */}
          {poll.description && (
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 mb-6">
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {displayDescription}
              </p>
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-2 text-xs font-bold text-[#0070CE] hover:underline flex items-center"
                >
                  <span>{isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
                  <Icon
                    name={isDescriptionExpanded ? "chevron-up" : "chevron-down"}
                    className="ml-1 w-2.5 h-2.5"
                  />
                </button>
              )}
            </div>
          )}

          {/* Metadata Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            {/* Deadline */}
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0070CE] flex items-center justify-center flex-shrink-0">
                <Icon name="clock" className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Thời hạn</p>
                <p className="text-xs font-bold text-slate-700">
                  {formatPollDeadline(poll.deadline)}
                </p>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Icon name="id-badge" className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Người khởi tạo</p>
                <p className="text-xs font-bold text-slate-700">
                  {poll.authorName} ({poll.authorRole})
                </p>
              </div>
            </div>

            {/* Audience */}
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                <Icon name="users" className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Đối tượng nhận</p>
                <p className="text-xs font-bold text-slate-700">
                  {poll.audienceScope === 'toan_truong'
                    ? 'Toàn trường'
                    : poll.targetClassNames && poll.targetClassNames.length > 0
                    ? `Lớp: ${poll.targetClassNames.join(', ')}`
                    : 'Chưa chỉ định'}
                </p>
              </div>
            </div>

            {/* Config Rules */}
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Icon name="check" className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Cấu hình bình chọn</p>
                <div className="text-xs font-semibold text-slate-700 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Icon name="check" className="w-3 h-3 text-emerald-600 inline shrink-0" />
                    <span>
                      {poll.config.allowMultipleChoices
                        ? 'Chọn nhiều phương án'
                        : 'Chọn 1 phương án duy nhất'}
                    </span>
                  </p>
                  <p className="text-slate-500 flex items-center gap-1.5">
                    {poll.config.allowParentViewResults ? (
                      <>
                        <Icon name="check" className="w-3 h-3 text-emerald-600 inline shrink-0" />
                        <span>PH xem được kết quả</span>
                      </>
                    ) : (
                      <>
                        <Icon name="xmark" className="w-3 h-3 text-slate-400 inline shrink-0" />
                        <span>Không công khai kết quả PH</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Results Section (BR05, BR06, NFR01) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Icon name="square-poll-vertical" className="mr-2 w-4 h-4 text-[#0070CE]" />
              Kết quả bình chọn trực tiếp
            </h2>
            <p className="text-xs text-slate-500">
              Tổng hợp tỷ lệ và số lượng bình chọn của từng lựa chọn
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0070CE] font-bold text-xs border border-blue-100">
              Tổng số phiếu: {poll.totalVotes}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
              Số người tham gia: {poll.voterCount}
            </span>
          </div>
        </div>

        {/* Breakdown layout: Progress bars on left, conditional pie chart on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Horizontal Progress Bars (Always visible) */}
          <div
            className={
              poll.totalVotes > 0
                ? 'lg:col-span-7 space-y-4'
                : 'lg:col-span-12 space-y-4'
            }
          >
            {poll.options.map((option, idx) => (
              <div
                key={option.id}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 transition-all hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: option.color || '#0070CE' }}
                    />
                    <span className="text-sm font-bold text-slate-800">
                      {idx + 1}. {option.title}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-extrabold text-slate-900">
                      {option.voteCount} phiếu
                    </span>
                    <span className="ml-1 text-xs font-semibold text-slate-500">
                      ({option.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${option.percentage}%`,
                      backgroundColor: option.color || '#0070CE',
                    }}
                  />
                </div>
              </div>
            ))}

            {poll.totalVotes === 0 && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-xs font-semibold text-amber-800">
                  Chưa có lượt bình chọn nào được ghi nhận cho cuộc bình chọn này.
                </p>
                <p className="text-[11px] text-amber-600 mt-1">
                  Biểu đồ phân bổ sẽ tự động hiển thị ngay khi có phiếu đầu tiên được gửi.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Visual Pie/Donut Chart (Rendered IF AND ONLY IF totalVotes > 0 per BR06) */}
          {poll.totalVotes > 0 && (
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
                <Icon name="chart-pie" className="w-3.5 h-3.5 text-[#0070CE]" />
                <span>Biểu đồ tỷ lệ (%)</span>
              </div>

              {/* SVG Donut Chart */}
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                <svg
                  className="w-full h-full -rotate-90"
                  viewBox="0 0 200 200"
                >
                  {/* Background track circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={svgRadius}
                    fill="transparent"
                    stroke="#E2E8F0"
                    strokeWidth="24"
                  />
                  {/* Option slices */}
                  {poll.options.map((opt) => {
                    const strokeLen = (opt.voteCount / poll.totalVotes) * svgCircumference;
                    const strokeOffset = cumulativeStrokeOffset;
                    cumulativeStrokeOffset += strokeLen;

                    return (
                      <circle
                        key={opt.id}
                        cx="100"
                        cy="100"
                        r={svgRadius}
                        fill="transparent"
                        stroke={opt.color || '#0070CE'}
                        strokeWidth="24"
                        strokeDasharray={`${strokeLen} ${svgCircumference}`}
                        strokeDashoffset={-strokeOffset}
                        className="transition-all duration-700 ease-out"
                      />
                    );
                  })}
                </svg>

                {/* Donut hole center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {poll.totalVotes}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                    Phiếu
                  </span>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="w-full space-y-2 border-t border-slate-200/60 pt-4">
                {poll.options.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between text-xs text-slate-600"
                  >
                    <div className="flex items-center space-x-2 truncate pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: opt.color || '#0070CE' }}
                      />
                      <span className="truncate font-medium">{opt.title}</span>
                    </div>
                    <span className="font-bold text-slate-900 flex-shrink-0">
                      {opt.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enrolled Student Voter Roster (BR07, BR08, BR11) */}
      <PollVoterRoster
        voters={pollVoters}
        classes={POLL_AVAILABLE_CLASSES}
        onOpenHistoryModal={(studentId) =>
          dispatch(openHistoryModal({ pollId: poll.id, studentId }))
        }
      />

      {/* Interaction Modals */}
      <SendPollModal
        poll={poll}
        isOpen={activeModal === 'send' && modalTargetPollId === poll.id}
        availableClasses={POLL_AVAILABLE_CLASSES}
        onClose={() => dispatch(closeModal())}
        onConfirm={handleSendConfirm}
      />

      <DeletePollModal
        poll={poll}
        isOpen={activeModal === 'delete' && modalTargetPollId === poll.id}
        onClose={() => dispatch(closeModal())}
        onConfirm={handleDeleteConfirm}
      />

      <VoteHistoryModal
        voter={historyVoter}
        isOpen={activeModal === 'history' && modalTargetPollId === poll.id}
        onClose={() => dispatch(closeModal())}
      />
    </div>
  );
};

export default PollDetailCockpit;
