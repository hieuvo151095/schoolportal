import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullhorn,
  faEnvelope,
  faCommentDots,
  faMobileAlt,
  faUsers,
  faClock,
  faPaperclip,
  faTrash,
  faExclamationTriangle,
  faCheck,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import {
  Announcement,
  AnnouncementAudienceScope,
  AnnouncementCategory,
  AnnouncementChannel,
  AnnouncementPriority,
  AnnouncementSubAudience
} from '../../../types/announcement';
import {
  validateAnnouncementPayload,
  validateAttachment,
  resolveRecipientBreakdown,
  getAudienceScopeLabel
} from '../../../utils/announcementValidation';
import { MOCK_SCHOOL_CLASSES_FOR_TARGETING } from '../../../services/mockAnnouncementData';
import RecipientPreviewModal from './RecipientPreviewModal';

interface AnnouncementComposerProps {
  schoolCode: string;
  initialAnnouncement?: Announcement;
  isEditMode?: boolean;
  onSave: (payload: any, status: 'nhap' | 'da_len_lich' | 'da_gui') => void;
}

const FormCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormSectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChannelCheckboxLabel = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1.5px solid ${props => (props.$checked ? '#0070CE' : '#e2e8f0')};
  background-color: ${props => (props.$checked ? '#eff6ff' : '#f8fafc')};
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    border-color: #0070CE;
  }
`;

export const AnnouncementComposer: React.FC<AnnouncementComposerProps> = ({
  schoolCode,
  initialAnnouncement,
  isEditMode = false,
  onSave
}) => {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState(initialAnnouncement?.title || '');
  const [excerpt, setExcerpt] = useState(initialAnnouncement?.excerpt || '');
  const [content, setContent] = useState(initialAnnouncement?.content || '');
  const [category, setCategory] = useState<AnnouncementCategory>(
    initialAnnouncement?.category || 'chung'
  );
  const [priority, setPriority] = useState<AnnouncementPriority>(
    initialAnnouncement?.priority || 'normal'
  );
  const [channels, setChannels] = useState<AnnouncementChannel[]>(
    initialAnnouncement?.channels || ['portal', 'email']
  );
  const [audienceScope, setAudienceScope] = useState<AnnouncementAudienceScope>(
    initialAnnouncement?.audienceScope || 'toan_truong'
  );
  const [subAudience, setSubAudience] = useState<AnnouncementSubAudience>(
    initialAnnouncement?.subAudience || 'all'
  );
  const [targetGradeIds, setTargetGradeIds] = useState<string[]>(
    initialAnnouncement?.targetGradeIds || []
  );
  const [targetClassIds, setTargetClassIds] = useState<string[]>(
    initialAnnouncement?.targetClassIds || []
  );
  const [isScheduled, setIsScheduled] = useState(
    initialAnnouncement?.status === 'da_len_lich' || false
  );
  const [scheduledAt, setScheduledAt] = useState(
    initialAnnouncement?.scheduledAt || ''
  );
  const [attachments, setAttachments] = useState(
    initialAnnouncement?.attachments || []
  );
  const [isPinned, setIsPinned] = useState(initialAnnouncement?.isPinned || false);

  // Validation & Modal states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Guardrail check: if editing a published announcement, block form mutations
  const isLockedPublished = isEditMode && initialAnnouncement?.status === 'da_gui';

  // Toggle channel
  const handleToggleChannel = (channel: AnnouncementChannel) => {
    if (isLockedPublished) return;
    if (channels.includes(channel)) {
      setChannels(channels.filter(c => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  // Grade options for selection
  const gradeOptions = [
    { id: 'k01', name: 'Khối 1' },
    { id: 'k06', name: 'Khối 6' },
    { id: 'k07', name: 'Khối 7' },
    { id: 'k10', name: 'Khối 10' },
    { id: 'k11', name: 'Khối 11' },
    { id: 'k12', name: 'Khối 12' }
  ];

  // Simulated file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const validation = validateAttachment({ name: file.name, size: file.size });
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const newAttachment = {
      id: `att-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.name.split('.').pop() || 'file',
      fileUrl: URL.createObjectURL(file)
    };

    setAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (attId: string) => {
    setAttachments(attachments.filter(a => a.id !== attId));
  };

  // Calculate preview breakdown
  const previewBreakdown = resolveRecipientBreakdown(
    audienceScope,
    targetGradeIds,
    targetClassIds,
    subAudience,
    MOCK_SCHOOL_CLASSES_FOR_TARGETING
  );

  const handleSubmit = (actionType: 'nhap' | 'da_len_lich' | 'da_gui') => {
    const payload = {
      schoolCode,
      title,
      excerpt: excerpt.trim() || title.substring(0, 100),
      content,
      category,
      priority,
      status: actionType,
      channels,
      audienceScope,
      subAudience,
      targetGradeIds,
      targetClassIds,
      targetStaffRoles: audienceScope === 'nhan_vien' ? ['teacher', 'staff'] : [],
      attachments,
      scheduledAt: actionType === 'da_len_lich' ? scheduledAt : undefined,
      publishedAt: actionType === 'da_gui' ? new Date().toISOString() : undefined,
      createdBy: initialAnnouncement?.createdBy || 'usr-current-admin',
      authorName: initialAnnouncement?.authorName || 'Ban Giám Hiệu',
      authorRole: initialAnnouncement?.authorRole || 'Quản trị viên',
      isPinned,
      recipientCount: previewBreakdown.totalRecipients
    };

    const validation = validateAnnouncementPayload(payload);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onSave(payload, actionType);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header breadcrumb & navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(`/${schoolCode}/school/announcements`)}
          className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Quay lại Bảng thông tin</span>
        </button>
        <h1 className="text-lg font-bold text-slate-800">
          {isEditMode ? 'Chỉnh Sửa Bản Nháp Thông Báo' : 'Soạn Thông Báo Mới'}
        </h1>
      </div>

      {/* Lock alert for published items */}
      {isLockedPublished && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex gap-3 text-amber-900">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600 mt-1" />
          <div className="text-sm">
            <p className="font-bold">Thông báo này đã được phát hành chính thức!</p>
            <p className="text-xs mt-0.5">
              Theo quy định tính toàn vẹn thông tin, các thông báo đã gửi qua Email/SMS không thể chỉnh sửa.
              Bạn chỉ có thể xem chi tiết hoặc xóa thông báo.
            </p>
          </div>
        </div>
      )}

      {/* Section 1: General Information */}
      <FormCard>
        <FormSectionTitle>
          <FontAwesomeIcon icon={faBullhorn} className="text-blue-600" />
          <span>1. Thông tin chung thông báo</span>
        </FormSectionTitle>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tiêu đề thông báo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              disabled={isLockedPublished}
              onChange={e => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              placeholder="VD: Thông báo về việc phát hành phiếu thu học phí tháng 10/2026..."
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-medium`}
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tóm tắt ngắn (tùy chọn)
            </label>
            <input
              type="text"
              value={excerpt}
              disabled={isLockedPublished}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Tóm tắt 1-2 câu hiển thị tại danh sách hoặc tiêu đề thông báo..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
            />
          </div>

          {/* Category & Priority grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Danh mục phân loại <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                disabled={isLockedPublished}
                onChange={e => setCategory(e.target.value as AnnouncementCategory)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 cursor-pointer"
              >
                <option value="chung">Thông báo chung</option>
                <option value="hoc_phi">Học phí & Thu chi</option>
                <option value="su_kien">Sự kiện & Lễ hội</option>
                <option value="khan_cap">Khẩn cấp (thời tiết, dịch bệnh)</option>
                <option value="hoc_tap">Học tập & Thi cử</option>
                <option value="nghi_le">Nghỉ lễ & Nghỉ hè</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mức độ ưu tiên
              </label>
              <select
                value={priority}
                disabled={isLockedPublished}
                onChange={e => setPriority(e.target.value as AnnouncementPriority)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 cursor-pointer"
              >
                <option value="normal">Bình thường</option>
                <option value="important">Quan trọng (gắn cờ vàng)</option>
                <option value="urgent">Hỏa tốc (cảnh báo đỏ)</option>
              </select>
            </div>
          </div>

          {/* Pin to top */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPinned"
              checked={isPinned}
              disabled={isLockedPublished}
              onChange={e => setIsPinned(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isPinned" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Ghim thông báo này lên đầu danh sách
            </label>
          </div>
        </div>
      </FormCard>

      {/* Section 2: Delivery Channels */}
      <FormCard>
        <FormSectionTitle>
          <FontAwesomeIcon icon={faEnvelope} className="text-emerald-600" />
          <span>2. Kênh phát hành (Chọn ít nhất 1 kênh)</span>
        </FormSectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ChannelCheckboxLabel $checked={channels.includes('portal')}>
            <input
              type="checkbox"
              checked={channels.includes('portal')}
              disabled={isLockedPublished}
              onChange={() => handleToggleChannel('portal')}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <div className="text-xs font-bold text-slate-800">Bảng tin Portal</div>
              <div className="text-[11px] text-slate-500">Hiển thị trên Web</div>
            </div>
          </ChannelCheckboxLabel>

          <ChannelCheckboxLabel $checked={channels.includes('email')}>
            <input
              type="checkbox"
              checked={channels.includes('email')}
              disabled={isLockedPublished}
              onChange={() => handleToggleChannel('email')}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <div className="text-xs font-bold text-slate-800">Email Phụ huynh</div>
              <div className="text-[11px] text-slate-500">Gửi hòm thư điện tử</div>
            </div>
          </ChannelCheckboxLabel>

          <ChannelCheckboxLabel $checked={channels.includes('sms')}>
            <input
              type="checkbox"
              checked={channels.includes('sms')}
              disabled={isLockedPublished}
              onChange={() => handleToggleChannel('sms')}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <div className="text-xs font-bold text-slate-800">SMS Brandname</div>
              <div className="text-[11px] text-slate-500">Tin nhắn thương hiệu</div>
            </div>
          </ChannelCheckboxLabel>

          <ChannelCheckboxLabel $checked={channels.includes('push')}>
            <input
              type="checkbox"
              checked={channels.includes('push')}
              disabled={isLockedPublished}
              onChange={() => handleToggleChannel('push')}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <div className="text-xs font-bold text-slate-800">Mobile App Push</div>
              <div className="text-[11px] text-slate-500">Thông báo điện thoại</div>
            </div>
          </ChannelCheckboxLabel>
        </div>
        {errors.channels && (
          <p className="text-xs text-rose-600 mt-2 font-medium">{errors.channels}</p>
        )}
      </FormCard>

      {/* Section 3: Audience Scope Targeting */}
      <FormCard>
        <FormSectionTitle>
          <FontAwesomeIcon icon={faUsers} className="text-indigo-600" />
          <span>3. Đối tượng nhận thông báo</span>
        </FormSectionTitle>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phạm vi nhận
              </label>
              <select
                value={audienceScope}
                disabled={isLockedPublished}
                onChange={e => setAudienceScope(e.target.value as AnnouncementAudienceScope)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 cursor-pointer"
              >
                <option value="toan_truong">Toàn trường (Tất cả phụ huynh & học sinh)</option>
                <option value="khoi_lop">Theo Khối lớp cụ thể</option>
                <option value="lop_hoc">Theo Lớp học cụ thể</option>
                <option value="nhan_vien">Toàn thể Cán bộ & Giáo viên</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nhóm đối tượng
              </label>
              <select
                value={subAudience}
                disabled={isLockedPublished}
                onChange={e => setSubAudience(e.target.value as AnnouncementSubAudience)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 cursor-pointer"
              >
                <option value="all">Tất cả (Phụ huynh, Học sinh, Giáo viên)</option>
                <option value="parents">Chỉ Phụ huynh học sinh</option>
                <option value="students">Chỉ Học sinh</option>
                <option value="teachers">Chỉ Giáo viên phụ trách</option>
              </select>
            </div>
          </div>

          {/* Conditional Target Picker: Grade level */}
          {audienceScope === 'khoi_lop' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Chọn khối lớp nhận thông báo:
              </label>
              <div className="flex flex-wrap gap-2">
                {gradeOptions.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    disabled={isLockedPublished}
                    onClick={() => {
                      if (targetGradeIds.includes(g.id)) {
                        setTargetGradeIds(targetGradeIds.filter(id => id !== g.id));
                      } else {
                        setTargetGradeIds([...targetGradeIds, g.id]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      targetGradeIds.includes(g.id)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {targetGradeIds.includes(g.id) && <FontAwesomeIcon icon={faCheck} className="mr-1" />}
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Target Picker: Class cohort */}
          {audienceScope === 'lop_hoc' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Chọn các lớp học nhận thông báo:
              </label>
              <div className="flex flex-wrap gap-2">
                {MOCK_SCHOOL_CLASSES_FOR_TARGETING.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    disabled={isLockedPublished}
                    onClick={() => {
                      if (targetClassIds.includes(c.id)) {
                        setTargetClassIds(targetClassIds.filter(id => id !== c.id));
                      } else {
                        setTargetClassIds([...targetClassIds, c.id]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      targetClassIds.includes(c.id)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {targetClassIds.includes(c.id) && <FontAwesomeIcon icon={faCheck} className="mr-1" />}
                    {c.name} ({c.studentCount} HS)
                  </button>
                ))}
              </div>
            </div>
          )}
          {errors.audience && (
            <p className="text-xs text-rose-600 font-medium">{errors.audience}</p>
          )}

          {/* Recipient preview button */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Ước tính khoảng <strong className="text-slate-800">{previewBreakdown.totalRecipients}</strong> tài khoản sẽ nhận được thông báo này.
            </div>
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faUsers} />
              <span>Xem trước danh sách người nhận</span>
            </button>
          </div>
        </div>
      </FormCard>

      {/* Section 4: Content Body */}
      <FormCard>
        <FormSectionTitle>
          <FontAwesomeIcon icon={faBullhorn} className="text-amber-600" />
          <span>4. Nội dung thông báo</span>
        </FormSectionTitle>

        <div className="space-y-4">
          <div>
            <textarea
              rows={8}
              value={content}
              disabled={isLockedPublished}
              onChange={e => {
                setContent(e.target.value);
                if (errors.content) setErrors({ ...errors, content: '' });
              }}
              placeholder="Nhập nội dung chi tiết thông báo..."
              className={`w-full p-4 text-sm bg-slate-50 border ${
                errors.content ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-sans leading-relaxed`}
            />
            {errors.content && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.content}</p>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tệp đính kèm (Tối đa 25MB/tệp)
            </label>
            <div className="flex items-center gap-3">
              <label
                className={`px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer border border-slate-300 flex items-center gap-2 transition-colors ${
                  isLockedPublished ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FontAwesomeIcon icon={faPaperclip} />
                <span>Thêm tệp tin</span>
                <input
                  type="file"
                  disabled={isLockedPublished}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-400">
                Hỗ trợ định dạng PDF, DOCX, XLSX, PNG, JPG
              </span>
            </div>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map(att => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faPaperclip} className="text-slate-400" />
                      <span className="font-semibold text-slate-700">{att.fileName}</span>
                      <span className="text-slate-400">
                        ({(att.fileSize / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    {!isLockedPublished && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(att.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </FormCard>

      {/* Section 5: Future Scheduling */}
      {!isLockedPublished && (
        <FormCard>
          <FormSectionTitle>
            <FontAwesomeIcon icon={faClock} className="text-purple-600" />
            <span>5. Thời gian phát hành</span>
          </FormSectionTitle>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isScheduled"
                checked={isScheduled}
                onChange={e => setIsScheduled(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="isScheduled" className="text-sm font-semibold text-slate-700 cursor-pointer">
                Lên lịch gửi trong tương lai (Hẹn giờ phát hành tự động)
              </label>
            </div>

            {isScheduled && (
              <div className="pl-6 pt-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Chọn ngày và giờ phát hành:
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => {
                    setScheduledAt(e.target.value);
                    if (errors.scheduledAt) setErrors({ ...errors, scheduledAt: '' });
                  }}
                  className="px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
                />
                {errors.scheduledAt && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.scheduledAt}</p>
                )}
              </div>
            )}
          </div>
        </FormCard>
      )}

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <button
          type="button"
          onClick={() => router.push(`/${schoolCode}/school/announcements`)}
          className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors"
        >
          Hủy bỏ
        </button>

        {!isLockedPublished && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit('nhap')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Lưu bản nháp
            </button>

            {isScheduled ? (
              <button
                type="button"
                onClick={() => handleSubmit('da_len_lich')}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faClock} />
                <span>Lên lịch phát hành</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit('da_gui')}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faBullhorn} />
                <span>Phát hành ngay</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recipient preview modal */}
      <RecipientPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        breakdown={previewBreakdown}
        audienceScopeLabel={getAudienceScopeLabel(audienceScope)}
      />
    </div>
  );
};

export default AnnouncementComposer;
