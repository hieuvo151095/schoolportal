import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createAssignment } from '../../../store/slices/assignmentSlice';
import { validateAssignmentForm } from '../../../utils/assignmentValidation';
import { AudienceType } from '../../../types/assignment';
import { SlideOver, Dropdown, Icon } from '@/components/ds';

interface CreateAssignmentSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  schoolCode?: string;
}

export const CreateAssignmentSlideOver: React.FC<CreateAssignmentSlideOverProps> = ({
  isOpen,
  onClose,
  schoolCode = 'demo',
}) => {
  const dispatch = useAppDispatch();
  const subjects = useAppSelector((state) => state.assignment.subjects);
  const students = useAppSelector((state) => state.assignment.students);

  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [scheduledSendDate, setScheduledSendDate] = useState('');
  const [audienceType, setAudienceType] = useState<AudienceType>('whole_class');
  const [targetStudentIds, setTargetStudentIds] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  if (!isOpen) return null;

  // Filter students by selected class
  const classStudents = students.filter(
    (s) => s.classId.toLowerCase() === classId.toLowerCase()
  );

  const filteredClassStudents = classStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleStudentToggle = (id: string) => {
    setTargetStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllStudents = () => {
    if (targetStudentIds.length === filteredClassStudents.length) {
      setTargetStudentIds([]);
    } else {
      setTargetStudentIds(filteredClassStudents.map((s) => s.id));
    }
  };

  const handleClose = () => {
    setClassId('');
    setSubjectId('');
    setTitle('');
    setDescription('');
    setDueDate('');
    setScheduledSendDate('');
    setAudienceType('whole_class');
    setTargetStudentIds([]);
    setFileName('');
    setStudentSearch('');
    onClose();
  };

  const isFormValid =
    classId !== '' &&
    subjectId !== '' &&
    title.trim().length > 0 &&
    dueDate !== '' &&
    (audienceType !== 'specific_students' || targetStudentIds.length > 0);

  const isDraftValid = title.trim().length > 0;

  const handleSave = (isDraft: boolean) => {
    if (!isDraft && !isFormValid) return;
    if (isDraft && !isDraftValid) return;

    dispatch(
      createAssignment({
        classId,
        subjectId,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
        scheduledSendDate: scheduledSendDate || undefined,
        audienceType,
        targetStudentIds: audienceType === 'specific_students' ? targetStudentIds : [],
        attachments: fileName
          ? [
              {
                id: `att-${Date.now()}`,
                name: fileName,
                url: `/mock/assignments/${fileName}`,
                sizeBytes: 1542000,
              },
            ]
          : [],
        createdBy: 'Cô Nguyễn Thị Mai',
        isDraft,
      })
    );

    handleClose();
  };

  const classOptions = [
    { value: '', label: '-- Chọn lớp học --' },
    { value: '1a1', label: 'Lớp 1A1' },
    { value: '2a2', label: 'Lớp 2A2' },
  ];

  const subjectOptions = [
    { value: '', label: '-- Chọn môn học --' },
    ...subjects.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <SlideOver
      open={isOpen}
      onClose={handleClose}
      title="Tạo bài tập mới"
      description="Giao bài tập về nhà, tài liệu ôn tập và hạn nộp cho học sinh"
      icon="book-open"
      width={520}
      primaryAction={{
        label: 'Lưu và gửi học sinh',
        icon: 'paper-plane',
        disabled: !isFormValid,
        onClick: () => handleSave(false),
      }}
      secondaryAction={{
        label: 'Lưu bản nháp',
        disabled: !isDraftValid,
        onClick: () => handleSave(true),
      }}
    >
      <div className="space-y-4">
        {/* Class & Subject Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
              Lớp học <span className="text-red-500">*</span>
            </label>
            <Dropdown
              searchable
              fullWidth
              value={classId}
              onChange={(val) => {
                setClassId(val);
                setTargetStudentIds([]);
              }}
              options={classOptions}
              placeholder="-- Chọn lớp học --"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
              Môn học <span className="text-red-500">*</span>
            </label>
            <Dropdown
              searchable
              fullWidth
              value={subjectId}
              onChange={(val) => setSubjectId(val)}
              options={subjectOptions}
              placeholder="-- Chọn môn học --"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Tên bài tập <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full h-10 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
            placeholder="Ví dụ: Bài tập Toán tuần 4: Phép cộng có nhớ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Nội dung hướng dẫn
          </label>
          <textarea
            className="w-full min-h-[90px] p-2.5 border border-[var(--border-default)] rounded-lg text-xs bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
            placeholder="Nhập yêu cầu bài tập, các trang sách giáo khoa cần hoàn thành..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Due date & Scheduled send */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
              Hạn nộp bài <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              className="w-full h-10 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
              Lên lịch gửi sau (tùy chọn)
            </label>
            <input
              type="datetime-local"
              className="w-full h-10 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
              value={scheduledSendDate}
              onChange={(e) => setScheduledSendDate(e.target.value)}
            />
          </div>
        </div>

        {/* Audience Scope */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Đối tượng giao bài <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-6 py-1">
            <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-heading)] cursor-pointer">
              <input
                type="radio"
                name="slideoverAudienceType"
                checked={audienceType === 'whole_class'}
                onChange={() => setAudienceType('whole_class')}
                className="text-[var(--eco-blue-strong)]"
              />
              <span>Cả lớp {classId ? `(${classStudents.length} học sinh)` : ''}</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-heading)] cursor-pointer">
              <input
                type="radio"
                name="slideoverAudienceType"
                checked={audienceType === 'specific_students'}
                onChange={() => setAudienceType('specific_students')}
                className="text-[var(--eco-blue-strong)]"
              />
              <span>Chọn học sinh cụ thể</span>
            </label>
          </div>

          {/* Student Checklist */}
          {audienceType === 'specific_students' && (
            <div className="mt-2.5 border border-[var(--border-default)] rounded-xl p-3 bg-slate-50 space-y-2.5">
              {!classId ? (
                <p className="text-xs text-[var(--text-subtle)] italic">
                  Vui lòng chọn lớp học ở phía trên trước khi chọn học sinh.
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <input
                      type="text"
                      placeholder="Tìm học sinh trong lớp..."
                      className="h-8 px-2.5 border border-[var(--border-default)] rounded-lg text-xs bg-white text-[var(--text-body)] flex-1 mr-2 outline-none"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleSelectAllStudents}
                      className="text-[var(--eco-blue-strong)] font-semibold hover:underline flex-shrink-0"
                    >
                      {targetStudentIds.length === filteredClassStudents.length
                        ? 'Bỏ chọn'
                        : 'Chọn tất cả'}
                    </button>
                  </div>

                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {filteredClassStudents.map((st) => {
                      const isChecked = targetStudentIds.includes(st.id);
                      return (
                        <label
                          key={st.id}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleStudentToggle(st.id)}
                            className="rounded text-[var(--eco-blue-strong)] cursor-pointer"
                          />
                          <span className="font-medium text-[var(--text-heading)]">{st.name}</span>
                          <span className="text-[var(--text-subtle)] font-mono">({st.studentCode})</span>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Attachment */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Tài liệu đính kèm (tùy chọn)
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
              onClick={() => setFileName('Phieu_Bai_Tap_Tuan_4.pdf')}
              className="border-2 border-dashed border-[var(--border-default)] hover:border-[var(--primary)] rounded-xl p-4 text-center cursor-pointer bg-[var(--bg-surface)]"
            >
              <Icon name="paperclip" size={20} className="mx-auto text-[var(--text-subtle)] mb-1" />
              <p className="text-xs font-semibold text-[var(--primary)]">Nhấp để đính kèm tệp bài tập</p>
              <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                Hỗ trợ PDF, DOCX, JPG, PNG (tối đa 25MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </SlideOver>
  );
};

export default CreateAssignmentSlideOver;
