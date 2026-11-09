import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  closeSubmitGradingModal,
  submitOnBehalfAndGrade,
} from '../../../store/slices/assignmentSlice';
import {
  isLateSubmission,
  validateGradingSubmission,
} from '../../../utils/assignmentValidation';
import { SlideOver, StatusTag, Icon } from '@/components/ds';

export const SubmitGradingModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.assignment.isSubmitGradingModalOpen
  );
  const activeSubmission = useAppSelector(
    (state) => state.assignment.activeStudentSubmission
  );
  const assignments = useAppSelector(
    (state) => state.assignment.assignments
  );

  const [submittedAt, setSubmittedAt] = useState('');
  const [fileName, setFileName] = useState('');
  const [isGraded, setIsGraded] = useState(false);
  const [score, setScore] = useState<number | ''>('');
  const [teacherComment, setTeacherComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentAssignment = assignments.find(
    (a) => a.id === activeSubmission?.assignmentId
  );
  const currentStudentSubmission = currentAssignment?.submissions.find(
    (s) => s.studentId === activeSubmission?.studentId
  );

  // Initialize form when opened
  useEffect(() => {
    if (isOpen && currentStudentSubmission) {
      const initialDate = currentStudentSubmission.submittedAt
        ? new Date(currentStudentSubmission.submittedAt)
        : new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const localStr = `${initialDate.getFullYear()}-${pad(
        initialDate.getMonth() + 1
      )}-${pad(initialDate.getDate())}T${pad(initialDate.getHours())}:${pad(
        initialDate.getMinutes()
      )}`;

      setSubmittedAt(localStr);
      setFileName(currentStudentSubmission.submissionFile?.name || '');
      setIsGraded(
        currentStudentSubmission.status === 'cham_diem' ||
          currentStudentSubmission.score !== undefined
      );
      setScore(
        currentStudentSubmission.score !== undefined
          ? currentStudentSubmission.score
          : ''
      );
      setTeacherComment(currentStudentSubmission.teacherComment || '');
      setErrors({});
    }
  }, [isOpen, currentStudentSubmission]);

  if (!isOpen || !currentAssignment || !currentStudentSubmission) {
    return null;
  }

  const isLate = isLateSubmission(submittedAt, currentAssignment.dueDate);

  const isFormValid =
    !isGraded ||
    (score !== '' &&
      Number(score) >= 0 &&
      Number(score) <= 10 &&
      teacherComment.trim().length > 0);

  const handleSave = () => {
    const numScore = score === '' ? undefined : Number(score);

    const validation = validateGradingSubmission(
      {
        assignmentId: currentAssignment.id,
        studentId: currentStudentSubmission.studentId,
        submittedAt: new Date(submittedAt).toISOString(),
        submissionFile: fileName
          ? { name: fileName, url: '/submissions/demo-work.pdf' }
          : undefined,
        isGraded,
        score: numScore,
        teacherComment,
      },
      currentAssignment.dueDate
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    dispatch(
      submitOnBehalfAndGrade({
        assignmentId: currentAssignment.id,
        studentId: currentStudentSubmission.studentId,
        submittedAt: new Date(submittedAt).toISOString(),
        submissionFile: fileName
          ? { name: fileName, url: '/submissions/demo-work.pdf' }
          : undefined,
        isGraded,
        score: numScore,
        teacherComment,
        evaluatedBy: 'Giáo viên phụ trách',
      })
    );

    dispatch(closeSubmitGradingModal());
  };

  const handleSimulateUpload = () => {
    const mockFiles = [
      'BaiLam_HocSinh.pdf',
      'AnhChup_VoBaiTap.jpg',
      'PhieuTracNghiem.pdf',
    ];
    const picked = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setFileName(picked);
  };

  const handleClose = () => {
    dispatch(closeSubmitGradingModal());
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={handleClose}
      title="Chấm điểm & Đánh giá bài nộp"
      description={`Cập nhật bài làm và nhận xét cho học sinh ${currentStudentSubmission.studentName}`}
      icon="award"
      width={500}
      primaryAction={{
        label: 'Lưu kết quả chấm',
        icon: 'check',
        disabled: !isFormValid,
        onClick: handleSave,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-4">
        {/* Student Info Card */}
        <div className="bg-slate-50 border border-[var(--border-default)] rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--text-heading)]">
              {currentStudentSubmission.studentName}
            </span>
            <span className="text-xs font-mono text-[var(--text-subtle)]">
              Mã: {currentStudentSubmission.studentCode}
            </span>
          </div>
          <p className="text-xs text-[var(--text-subtle)]">
            Bài tập: <strong>{currentAssignment.title}</strong> ({currentAssignment.subjectName})
          </p>
        </div>

        {/* Submission Time & Late Warning */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Thời điểm nộp bài
          </label>
          <input
            type="datetime-local"
            className="w-full h-10 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
            value={submittedAt}
            onChange={(e) => setSubmittedAt(e.target.value)}
          />
          {isLate && (
            <div className="mt-1.5">
              <StatusTag tone="danger" label="Nộp muộn so với hạn chót" />
            </div>
          )}
        </div>

        {/* Attached Submission File */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Tệp đính kèm bài làm
          </label>
          {fileName ? (
            <div className="flex items-center justify-between p-3 border border-emerald-500 bg-emerald-50/50 rounded-xl">
              <div className="flex items-center gap-2 min-w-0">
                <Icon name="file-pdf" size={20} className="text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-emerald-800 truncate">{fileName}</span>
              </div>
              <button
                type="button"
                onClick={() => setFileName('')}
                className="text-xs text-red-500 hover:underline flex-shrink-0 ml-2"
              >
                Gỡ file
              </button>
            </div>
          ) : (
            <div
              onClick={handleSimulateUpload}
              className="border-2 border-dashed border-[var(--border-default)] hover:border-[var(--primary)] rounded-xl p-4 text-center cursor-pointer bg-[var(--bg-surface)]"
            >
              <Icon name="cloud-arrow-up" size={24} className="mx-auto text-[var(--text-subtle)] mb-1" />
              <p className="text-xs font-semibold text-[var(--primary)]">Nhấp để tải lên tệp bài làm</p>
              <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                Hỗ trợ PDF, hình ảnh chụp bài tập (tối đa 25MB)
              </p>
            </div>
          )}
        </div>

        {/* Grading Toggle */}
        <div className="pt-2 border-t border-[var(--border-subtle)]">
          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-xs font-bold text-[var(--text-heading)]">
              Chấm điểm & Nhận xét bài làm
            </span>
            <input
              type="checkbox"
              checked={isGraded}
              onChange={(e) => setIsGraded(e.target.checked)}
              className="w-4 h-4 text-[var(--eco-blue-strong)] rounded focus:ring-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Grading Fields */}
        {isGraded && (
          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3.5 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
                Điểm số (Thang điểm 10) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                className="w-full h-10 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
                placeholder="Nhập điểm từ 0.0 đến 10.0..."
                value={score}
                onChange={(e) =>
                  setScore(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
              {errors.score && (
                <p className="text-xs text-red-500 mt-1">{errors.score}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
                Lời phê / Nhận xét của giáo viên <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full min-h-[80px] p-2.5 border border-[var(--border-default)] rounded-lg text-xs bg-white text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
                placeholder="Nhận xét cụ thể về bài làm của bé để phụ huynh đồng hành..."
                value={teacherComment}
                onChange={(e) => setTeacherComment(e.target.value)}
              />
              {errors.teacherComment && (
                <p className="text-xs text-red-500 mt-1">{errors.teacherComment}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};

export default SubmitGradingModal;
