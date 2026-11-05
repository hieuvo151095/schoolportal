import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  closeSubmitGradingModal,
  submitOnBehalfAndGrade,
} from '../../../store/slices/assignmentSlice';
import {
  isLateSubmission,
  validateGradingSubmission,
} from '../../../utils/assignmentValidation';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;

  &:hover {
    color: #0f172a;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 80vh;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
`;

const RequiredStar = styled.span`
  color: #ef4444;
  margin-left: 2px;
`;

const TextInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  outline: none;

  &:focus {
    border-color: #0070ce;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.12);
  }
`;

const Textarea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  min-height: 80px;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #0070ce;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.12);
  }
`;

const StudentInfoCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StudentAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background-color: #dbeafe;
  color: #0070ce;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
`;

const LateWarningMessage = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #ef4444;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e1;
    transition: 0.2s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: '';
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.2s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #0070ce;
  }

  input:checked + span:before {
    transform: translateX(20px);
  }
`;

const EvaluationBox = styled.div`
  padding: 14px;
  border: 1px solid #bfdbfe;
  background-color: #eff6ff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: fadeIn 0.2s ease-out;
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 12px;
  margin-top: 2px;
`;

const FileUploadPlaceholder = styled.div`
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  background-color: #ffffff;
  cursor: pointer;

  &:hover {
    border-color: #0070ce;
    background-color: #f8fafc;
  }
`;

const ModalFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #475569;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const SaveButton = styled.button`
  padding: 8px 18px;
  border: none;
  background-color: #0070ce;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #005bb0;
  }
`;

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
      // Default to existing submission time or current ISO time converted to local datetime
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

  return (
    <Overlay onClick={() => dispatch(closeSubmitGradingModal())}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Nộp Bài Tập & Đánh Giá</ModalTitle>
          <CloseButton onClick={() => dispatch(closeSubmitGradingModal())}>
            ✕
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Student Banner */}
          <StudentInfoCard>
            <StudentAvatar>
              {currentStudentSubmission.studentName.charAt(0)}
            </StudentAvatar>
            <div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>
                {currentStudentSubmission.studentName}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Mã học sinh: {currentStudentSubmission.studentCode} •{' '}
                {currentAssignment.className}
              </div>
            </div>
          </StudentInfoCard>

          {/* Submission Timestamp (BR09) */}
          <FormGroup>
            <Label>
              Thời gian nộp bài<RequiredStar>*</RequiredStar>
            </Label>
            <TextInput
              type="datetime-local"
              value={submittedAt}
              onChange={(e) => setSubmittedAt(e.target.value)}
            />
            {isLate && (
              <LateWarningMessage>
                ⚠️ Bài nộp này được ghi nhận là trễ hạn (sau{' '}
                {new Date(currentAssignment.dueDate).toLocaleString('vi-VN')})
              </LateWarningMessage>
            )}
            {errors.submittedAt && <ErrorText>{errors.submittedAt}</ErrorText>}
          </FormGroup>

          {/* Submission File */}
          <FormGroup>
            <Label>File bài nộp (ảnh hoặc tài liệu)</Label>
            {fileName ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              >
                <span>📄 {fileName}</span>
                <button
                  type="button"
                  onClick={() => setFileName('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  ✕ Xóa
                </button>
              </div>
            ) : (
              <FileUploadPlaceholder onClick={handleSimulateUpload}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>📎</div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0070ce',
                  }}
                >
                  Nhấn để tải lên file bài làm
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Hỗ trợ định dạng PDF, JPG, PNG (tối đa 15MB)
                </div>
              </FileUploadPlaceholder>
            )}
          </FormGroup>

          {/* Grading Toggle (BR09) */}
          <ToggleContainer>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                Đánh giá & Chấm điểm
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Bật toggle để nhập điểm số và nhận xét bài nộp
              </div>
            </div>

            <ToggleSwitch>
              <input
                type="checkbox"
                checked={isGraded}
                onChange={(e) => setIsGraded(e.target.checked)}
              />
              <span />
            </ToggleSwitch>
          </ToggleContainer>

          {/* Evaluation Fields (Visible when isGraded is true) */}
          {isGraded && (
            <EvaluationBox>
              <FormGroup>
                <Label>
                  Điểm số (Thang điểm 10)<RequiredStar>*</RequiredStar>
                </Label>
                <TextInput
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  placeholder="Ví dụ: 8.5"
                  value={score}
                  onChange={(e) =>
                    setScore(e.target.value === '' ? '' : Number(e.target.value))
                  }
                />
                {errors.score && <ErrorText>{errors.score}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>
                  Nhận xét của giáo viên<RequiredStar>*</RequiredStar>
                </Label>
                <Textarea
                  placeholder="Nhận xét ưu điểm, lỗi sai hoặc hướng dẫn con cải thiện..."
                  value={teacherComment}
                  onChange={(e) => setTeacherComment(e.target.value)}
                />
                {errors.teacherComment && (
                  <ErrorText>{errors.teacherComment}</ErrorText>
                )}
              </FormGroup>
            </EvaluationBox>
          )}
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={() => dispatch(closeSubmitGradingModal())}>
            Hủy bỏ
          </CancelButton>
          <SaveButton onClick={handleSave}>Lưu kết quả</SaveButton>
        </ModalFooter>
      </ModalCard>
    </Overlay>
  );
};
