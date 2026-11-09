import React, { useState } from 'react';
import { SlideOver, Icon } from '@/components/ds';
import { useAppDispatch } from '../../../store';
import { createExtendedReport } from '../../../store/slices/reportsSlice';
import { DEVELOPMENTAL_TEMPLATES } from '../../../services/mockReportsData';
import { ExtendedReport, ReportTemplateId } from '../../../types/reports';

interface CreateExtendedReportSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  schoolCode?: string;
}

const MOCK_STUDENTS = [
  {
    id: 'hs-001',
    name: 'Lê Gia Huy',
    code: 'HS-1A1-001',
    age: '5 tuổi 8 tháng',
    classId: 'lop-1a1',
    className: 'Lớp 1A1 (Chồi)',
    avatarUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=120&h=120&fit=crop',
    parentName: 'Anh Lê Văn Thành',
  },
  {
    id: 'hs-002',
    name: 'Trần Minh Khôi',
    code: 'HS-1A1-002',
    age: '5 tuổi 9 tháng',
    classId: 'lop-1a1',
    className: 'Lớp 1A1 (Chồi)',
    avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&h=120&fit=crop',
    parentName: 'Chị Phạm Thị Hằng',
  },
  {
    id: 'hs-003',
    name: 'Nguyễn Minh Anh',
    code: 'HS-1A1-003',
    age: '5 tuổi 6 tháng',
    classId: 'lop-1a1',
    className: 'Lớp 1A1 (Chồi)',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    parentName: 'Chị Nguyễn Thảo My',
  },
  {
    id: 'hs-004',
    name: 'Hoàng Đức Minh',
    code: 'HS-1A2-004',
    age: '6 tuổi 2 tháng',
    classId: 'lop-1a2',
    className: 'Lớp 1A2 (Khối 1)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
    parentName: 'Anh Hoàng Văn Tuấn',
  },
  {
    id: 'hs-005',
    name: 'Lê Quốc Bảo',
    code: 'HS-2A1-005',
    age: '7 tuổi 1 tháng',
    classId: 'lop-2a1',
    className: 'Lớp 2A1 (Khối 2)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    parentName: 'Anh Lê Quốc Dũng',
  },
];

export const CreateExtendedReportSlideOver: React.FC<CreateExtendedReportSlideOverProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const [studentId, setStudentId] = useState(MOCK_STUDENTS[0].id);
  const [templateId, setTemplateId] = useState<ReportTemplateId>('tieng_viet');
  const [dateType, setDateType] = useState<'date_range' | 'stage'>('date_range');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [stageName, setStageName] = useState('Kỳ 1 - Khởi động 2026');
  const [createdBy, setCreatedBy] = useState('Cô Nguyễn Mai');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedStudent = MOCK_STUDENTS.find((s) => s.id === studentId) || MOCK_STUDENTS[0];
  const selectedTemplate = DEVELOPMENTAL_TEMPLATES.find((t) => t.id === templateId) || DEVELOPMENTAL_TEMPLATES[0];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!studentId) {
      setError('Vui lòng chọn học sinh cần tạo báo cáo.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Vui lòng nhập đầy đủ thời gian đánh giá.');
      return;
    }

    const newReport: ExtendedReport = {
      id: `rep-${Date.now()}`,
      title: `${selectedTemplate.name} - ${selectedStudent.name}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentCode: selectedStudent.code,
      studentAge: selectedStudent.age,
      studentAvatar: selectedStudent.avatarUrl,
      parentName: selectedStudent.parentName,
      classId: selectedStudent.classId,
      className: selectedStudent.className,
      templateId: selectedTemplate.id as ReportTemplateId,
      templateName: selectedTemplate.name,
      dateType,
      startDate,
      endDate,
      stageName: dateType === 'stage' ? stageName : undefined,
      status: 'draft',
      createdBy: createdBy.trim() || 'Cô Nguyễn Mai',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checklistData: {},
      generalNotes: notes.trim(),
    };

    dispatch(createExtendedReport(newReport));
    onClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      icon="file-lines"
      title="Tạo Báo Cáo Mở Rộng Mới"
      description="Thiết lập biểu mẫu đánh giá năng lực hoặc thư tuần định kỳ gửi tới phụ huynh"
      width={520}
      primaryAction={{
        label: '+ Tạo báo cáo mới',
        icon: 'plus',
        onClick: () => handleSubmit(),
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Chọn học sinh */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Chọn học sinh <span className="text-[var(--text-danger)]">*</span>
          </label>
          <div className="relative">
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all font-medium pr-9"
            >
              {MOCK_STUDENTS.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.code}) - {st.className}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-subtle)]">
              <Icon name="chevron-down" size={14} />
            </div>
          </div>
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Học sinh được chọn sẽ liên kết tự động với sổ theo dõi và hồ sơ phụ huynh.
          </p>
        </div>

        {/* Mẫu báo cáo */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Mẫu báo cáo đánh giá <span className="text-[var(--text-danger)]">*</span>
          </label>
          <div className="relative">
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value as ReportTemplateId)}
              className="w-full appearance-none px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all font-medium pr-9"
            >
              {DEVELOPMENTAL_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name} ({tmpl.category})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-subtle)]">
              <Icon name="chevron-down" size={14} />
            </div>
          </div>
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            {selectedTemplate.description}
          </p>
        </div>

        {/* Hình thức xác định thời gian */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Hình thức kỳ đánh giá <span className="text-[var(--text-danger)]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDateType('date_range')}
              className={`px-3 py-2 text-xs font-semibold rounded-[var(--radius-8)] border transition-all text-center ${
                dateType === 'date_range'
                  ? 'border-[var(--eco-blue-strong)] bg-[var(--semantic-info-soft)] text-[var(--eco-blue-strong)]'
                  : 'border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-subtle)] hover:border-[var(--text-subtle)]'
              }`}
            >
              Khoảng thời gian (Từ ~ Đến)
            </button>
            <button
              type="button"
              onClick={() => setDateType('stage')}
              className={`px-3 py-2 text-xs font-semibold rounded-[var(--radius-8)] border transition-all text-center ${
                dateType === 'stage'
                  ? 'border-[var(--eco-blue-strong)] bg-[var(--semantic-info-soft)] text-[var(--eco-blue-strong)]'
                  : 'border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-subtle)] hover:border-[var(--text-subtle)]'
              }`}
            >
              Theo giai đoạn / Học kỳ
            </button>
          </div>
        </div>

        {/* Dates */}
        {dateType === 'date_range' ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
                Từ ngày <span className="text-[var(--text-danger)]">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
                Đến ngày <span className="text-[var(--text-danger)]">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)]"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
              Tên giai đoạn đánh giá <span className="text-[var(--text-danger)]">*</span>
            </label>
            <input
              type="text"
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              placeholder="VD: Kỳ 1 - Đánh giá giữa kỳ..."
              className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)]"
            />
          </div>
        )}

        {/* Người tạo / Cập nhật */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Giáo viên phụ trách đánh giá <span className="text-[var(--text-danger)]">*</span>
          </label>
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)]"
          />
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Hiển thị trên phần chữ ký và báo cáo gửi cho phụ huynh.
          </p>
        </div>

        {/* Ghi chú ban đầu */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Ghi chú ban đầu
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú sơ bộ về năng lực hoặc lưu ý riêng cho học sinh này..."
            className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] resize-none placeholder:text-[var(--text-disabled)]"
          />
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Ghi chú nội bộ cho giáo viên và ban giám hiệu trước khi duyệt hoàn tất.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 p-3 rounded-[var(--radius-8)] bg-[var(--semantic-danger-soft)] text-[var(--text-danger)] text-xs font-medium">
            <Icon name="circle-xmark" size={14} />
            <span>{error}</span>
          </div>
        )}
      </form>
    </SlideOver>
  );
};

export default CreateExtendedReportSlideOver;
