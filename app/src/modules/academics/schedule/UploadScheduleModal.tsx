import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createSchedule, setUploadModalOpen } from '../../../store/slices/scheduleSlice';
import { generateAutoTitle } from '../../../utils/scheduleValidation';
import { SlideOver, Dropdown, Icon } from '@/components/ds';

export const UploadScheduleModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isUploadModalOpen, classes, semesters } = useAppSelector(
    (state) => state.schedule
  );

  const [classId, setClassId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);

  const selectedSemester = semesters.find((s) => s.id === semesterId);

  useEffect(() => {
    if (selectedSemester && (!title || title.startsWith('Thời khóa biểu'))) {
      setTitle(generateAutoTitle(selectedSemester.name));
    }
  }, [selectedSemester]);

  if (!isUploadModalOpen) return null;

  const handleClose = () => {
    dispatch(setUploadModalOpen(false));
    setClassId('');
    setSemesterId('');
    setTitle('');
    setFileName(null);
    setFileSize(0);
  };

  const handleSimulateFilePick = () => {
    setFileName('thoi-khoa-bieu-lop-chinh-thuc.pdf');
    setFileSize(1428570);
  };

  const isFormValid =
    classId !== '' &&
    semesterId !== '' &&
    fileName !== null &&
    title.trim().length > 0;

  const handleSubmit = () => {
    if (!isFormValid || !fileName) return;

    const targetClass = classes.find((c) => c.id === classId);
    const targetSem = semesters.find((s) => s.id === semesterId);
    if (!targetClass || !targetSem) return;

    dispatch(
      createSchedule({
        title,
        schoolCode: 'demo',
        classId: targetClass.id,
        className: targetClass.name,
        gradeLevel: targetClass.gradeLevel,
        semesterId: targetSem.id,
        semesterName: targetSem.name,
        academicYear: targetSem.academicYear,
        startDate: targetSem.startDate,
        endDate: targetSem.endDate,
        type: 'file',
        status: 'published',
        fileUrl: `/mock/documents/${fileName}`,
        fileName,
        fileSize,
        fileType: 'application/pdf',
        slots: [],
        autoSend: true,
        senderName: 'Văn Phòng Giáo Vụ',
      })
    );

    handleClose();
  };

  const classOptions = [
    { value: '', label: '-- Chọn lớp học --' },
    ...classes.map((cls) => ({ value: cls.id, label: cls.name })),
  ];

  const semesterOptions = [
    { value: '', label: '-- Chọn học kỳ --' },
    ...semesters.map((sem) => ({
      value: sem.id,
      label: `${sem.name} (${sem.academicYear})`,
    })),
  ];

  return (
    <SlideOver
      open={isUploadModalOpen}
      onClose={handleClose}
      title="Tải lên tệp thời khóa biểu"
      description="Đăng tải tệp PDF hoặc hình ảnh thời khóa biểu chính thức cho lớp học"
      icon="upload"
      width={480}
      primaryAction={{
        label: 'Tải lên & Lưu',
        icon: 'upload',
        disabled: !isFormValid,
        onClick: handleSubmit,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Lớp học áp dụng <span className="text-red-500">*</span>
          </label>
          <Dropdown
            searchable
            fullWidth
            value={classId}
            onChange={(val) => setClassId(val)}
            options={classOptions}
            placeholder="-- Chọn lớp học --"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Học kỳ áp dụng <span className="text-red-500">*</span>
          </label>
          <Dropdown
            searchable
            fullWidth
            value={semesterId}
            onChange={(val) => setSemesterId(val)}
            options={semesterOptions}
            placeholder="-- Chọn học kỳ --"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Tiêu đề thời khóa biểu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full h-10 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Thời khóa biểu Học kỳ 1 2026-2027"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Tệp đính kèm (PDF / Hình ảnh) <span className="text-red-500">*</span>
          </label>
          <div
            onClick={handleSimulateFilePick}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              fileName
                ? 'border-emerald-500 bg-emerald-50/50'
                : 'border-[var(--border-default)] hover:border-[var(--primary)] bg-[var(--bg-surface)]'
            }`}
          >
            {fileName ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon name="file-pdf" size={24} className="text-emerald-600 flex-shrink-0" />
                  <div className="text-left truncate">
                    <p className="text-xs font-semibold text-emerald-800 truncate">{fileName}</p>
                    <p className="text-[11px] text-[var(--text-subtle)]">
                      {(fileSize / 1024 / 1024).toFixed(2)} MB • Nhấp để thay đổi
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileName(null);
                    setFileSize(0);
                  }}
                  className="text-xs text-red-500 hover:underline flex-shrink-0 ml-2"
                >
                  Gỡ tệp
                </button>
              </div>
            ) : (
              <div className="py-2">
                <Icon name="cloud-arrow-up" size={32} className="mx-auto text-[var(--text-subtle)] mb-2" />
                <p className="text-xs font-semibold text-[var(--primary)]">Nhấp để chọn tệp tải lên</p>
                <p className="text-[11px] text-[var(--text-subtle)] mt-1">
                  Định dạng PDF, JPG, PNG (tối đa 15MB)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-lg p-3 text-xs text-[var(--text-subtle)] space-y-1">
          <p className="font-semibold text-[var(--text-heading)]">Lưu ý nghiệp vụ:</p>
          <p>• Thời khóa biểu dạng file sẽ tự động phát hành và gửi thông báo đến ứng dụng phụ huynh.</p>
          <p>• Phụ huynh có thể phóng to, tải về hoặc lưu trữ tệp PDF trên thiết bị di động.</p>
        </div>
      </div>
    </SlideOver>
  );
};

export default UploadScheduleModal;
