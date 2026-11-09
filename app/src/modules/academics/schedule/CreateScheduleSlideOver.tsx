import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createSchedule } from '../../../store/slices/scheduleSlice';
import { generateAutoTitle } from '../../../utils/scheduleValidation';
import { ScheduleType, TimeSlotRow } from '../../../types/schedule';
import { TimetableGridView } from './TimetableGridView';
import { SlideOver, Dropdown, Icon, SegmentedControl } from '@/components/ds';

interface CreateScheduleSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  schoolCode?: string;
}

const defaultSlots: TimeSlotRow[] = [
  {
    slotId: 'slot-1',
    slotName: 'Tiết 1',
    startTime: '08:00',
    endTime: '08:45',
    isBreak: false,
    days: {},
  },
  {
    slotId: 'slot-2',
    slotName: 'Tiết 2',
    startTime: '08:55',
    endTime: '09:40',
    isBreak: false,
    days: {},
  },
  {
    slotId: 'slot-3',
    slotName: 'Tiết 3',
    startTime: '09:50',
    endTime: '10:35',
    isBreak: false,
    days: {},
  },
];

export const CreateScheduleSlideOver: React.FC<CreateScheduleSlideOverProps> = ({
  isOpen,
  onClose,
  schoolCode = 'demo',
}) => {
  const dispatch = useAppDispatch();
  const { classes, semesters } = useAppSelector((state) => state.schedule);

  const [classId, setClassId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('grid');

  // File state
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);

  // Grid slots state
  const [slots, setSlots] = useState<TimeSlotRow[]>(defaultSlots);

  const selectedSemester = semesters.find((s) => s.id === semesterId);

  useEffect(() => {
    if (selectedSemester) {
      if (!title || title.startsWith('Thời khóa biểu')) {
        setTitle(generateAutoTitle(selectedSemester.name));
      }
      setStartDate(selectedSemester.startDate);
      setEndDate(selectedSemester.endDate);
    }
  }, [selectedSemester]);

  if (!isOpen) return null;

  const handleClose = () => {
    setClassId('');
    setSemesterId('');
    setTitle('');
    setStartDate('');
    setEndDate('');
    setScheduleType('grid');
    setFileName(null);
    setFileSize(0);
    setSlots(defaultSlots);
    onClose();
  };

  const isFileBlocked = scheduleType === 'file' && !fileName;
  const isFormValid =
    classId !== '' &&
    semesterId !== '' &&
    title.trim().length > 0 &&
    !isFileBlocked;

  const handleSimulateFile = () => {
    setFileName('thoi-khoa-bieu-chinh-thuc.pdf');
    setFileSize(1428570);
  };

  const handleSave = (autoSend: boolean) => {
    if (!isFormValid) return;

    const targetClass = classes.find((c) => c.id === classId);
    const targetSem = semesters.find((s) => s.id === semesterId);
    if (!targetClass || !targetSem) return;

    dispatch(
      createSchedule({
        title: title.trim(),
        schoolCode,
        classId: targetClass.id,
        className: targetClass.name,
        gradeLevel: targetClass.gradeLevel,
        semesterId: targetSem.id,
        semesterName: targetSem.name,
        academicYear: targetSem.academicYear,
        startDate: startDate || targetSem.startDate,
        endDate: endDate || targetSem.endDate,
        type: scheduleType,
        status: autoSend ? 'published' : 'draft',
        fileUrl: fileName ? `/mock/documents/${fileName}` : undefined,
        fileName: fileName || undefined,
        fileSize: fileSize || undefined,
        fileType: fileName ? 'application/pdf' : undefined,
        slots: scheduleType === 'grid' ? slots : [],
        autoSend,
        senderName: 'Văn Phòng Giáo Vụ',
      })
    );

    handleClose();
  };

  const classOptions = [
    { value: '', label: '-- Chọn lớp học --' },
    ...classes.map((c) => ({ value: c.id, label: c.name })),
  ];

  const semesterOptions = [
    { value: '', label: '-- Chọn học kỳ --' },
    ...semesters.map((s) => ({ value: s.id, label: `${s.name} (${s.academicYear})` })),
  ];

  return (
    <SlideOver
      open={isOpen}
      onClose={handleClose}
      title="Thêm thời khóa biểu mới"
      description="Khai báo thời khóa biểu lớp học, phân định tiết học hoặc tải tệp đính kèm"
      icon="clock"
      width={scheduleType === 'grid' ? 620 : 500}
      primaryAction={{
        label: 'Lưu và phát hành (Gửi PH)',
        icon: 'paper-plane',
        disabled: !isFormValid,
        onClick: () => handleSave(true),
      }}
      secondaryAction={{
        label: 'Lưu bản nháp',
        disabled: !isFormValid,
        onClick: () => handleSave(false),
      }}
    >
      <div className="space-y-4">
        {/* Class & Semester */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Tiêu đề thời khóa biểu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full h-10 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Thời khóa biểu Lớp 1A1 Học kỳ 1 2026-2027"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
              Ngày bắt đầu áp dụng
            </label>
            <input
              type="date"
              className="w-full h-10 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
              Ngày kết thúc áp dụng
            </label>
            <input
              type="date"
              className="w-full h-10 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Schedule Format */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Định dạng thời khóa biểu
          </label>
          <SegmentedControl
            value={scheduleType}
            onChange={(val) => setScheduleType(val as ScheduleType)}
            items={[
              { key: 'grid', label: 'Dạng lưới (Grid Matrix)', icon: 'layer-group' },
              { key: 'file', label: 'Tệp đính kèm (PDF / Ảnh)', icon: 'file-pdf' },
            ]}
          />
        </div>

        {/* File upload zone or Grid slots */}
        {scheduleType === 'file' ? (
          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
              Tệp thời khóa biểu đính kèm <span className="text-red-500">*</span>
            </label>
            <div
              onClick={handleSimulateFile}
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
                        {(fileSize / 1024 / 1024).toFixed(2)} MB • Nhấp để đổi tệp
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
                    Gỡ file
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <Icon name="cloud-arrow-up" size={32} className="mx-auto text-[var(--text-subtle)] mb-2" />
                  <p className="text-xs font-semibold text-[var(--primary)]">Nhấp để chọn tệp tải lên</p>
                  <p className="text-[11px] text-[var(--text-subtle)] mt-1">
                    Bắt buộc đính kèm tệp PDF hoặc ảnh trước khi lưu
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
              Cấu hình tiết học theo tuần
            </label>
            <div className="border border-[var(--border-default)] rounded-xl p-3 bg-slate-50 space-y-2">
              <p className="text-xs text-[var(--text-subtle)]">
                Sau khi tạo thời khóa biểu, bạn có thể chỉnh sửa chi tiết từng môn học, giáo viên và phòng học trên màn hình lưới trực quan.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--text-heading)]">Khung giờ khởi tạo:</span>
                <span className="text-xs text-[var(--text-body)]">3 tiết học buổi sáng (8:00 – 10:35)</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-lg p-3 text-xs text-[var(--text-subtle)] space-y-1">
          <p className="font-semibold text-[var(--text-heading)]">Quy định phát hành:</p>
          <p>• Khi chọn "Lưu và phát hành", hệ thống sẽ gửi thông báo đến ứng dụng di động của phụ huynh lớp tương ứng.</p>
          <p>• Bạn có thể xem lại lịch sử gửi thông báo và chỉnh sửa TKB bất kỳ lúc nào.</p>
        </div>
      </div>
    </SlideOver>
  );
};

export default CreateScheduleSlideOver;
