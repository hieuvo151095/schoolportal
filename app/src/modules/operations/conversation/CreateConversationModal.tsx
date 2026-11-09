import React, { useState } from 'react';
import { SlideOver, Icon } from '@/components/ds';
import { useAppDispatch } from '../../../store';
import { createConversation } from '../../../store/slices/conversationSlice';
import { MessageCategory } from '../../../types/conversation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateConversationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<'individual' | 'group'>('individual');

  // Form states
  const [selectedClass, setSelectedClass] = useState('lop-1a1');
  const [selectedStudentId, setSelectedStudentId] = useState('hs-001');
  const [groupTitle, setGroupTitle] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(['hs-001', 'hs-002']);
  const [category, setCategory] = useState<MessageCategory>('tin_nhan');
  const [content, setContent] = useState('');

  // Mock available students in the class
  const mockStudents = [
    { id: 'hs-001', name: 'Đỗ Nam', parentName: 'Mẹ Đỗ Nam', code: 'HS2026-001' },
    { id: 'hs-002', name: 'Lê Bảo An', parentName: 'Bố Lê Bảo An', code: 'HS2026-002' },
    { id: 'hs-003', name: 'Trần Minh Thảo', parentName: 'Mẹ Trần Minh Thảo', code: 'HS2026-003' },
    { id: 'hs-004', name: 'Nguyễn Gia Bảo', parentName: 'Bố Nguyễn Gia Bảo', code: 'HS2026-004' },
    { id: 'hs-005', name: 'Vũ Hoàng Yến', parentName: 'Mẹ Vũ Hoàng Yến', code: 'HS2026-005' },
  ];

  const handleToggleStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((item) => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handleSelectAllStudents = () => {
    if (selectedStudentIds.length === mockStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(mockStudents.map((s) => s.id));
    }
  };

  const isFormValid =
    content.trim().length > 0 &&
    (mode === 'individual' ? Boolean(selectedStudentId) : groupTitle.trim().length > 0 && selectedStudentIds.length > 0);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid) return;

    if (mode === 'individual') {
      const student = mockStudents.find((s) => s.id === selectedStudentId);
      if (!student) return;

      dispatch(
        createConversation({
          title: `Phụ huynh ${student.name}`,
          type: 'ca_nhan',
          classId: selectedClass,
          className: selectedClass === 'lop-1a1' ? 'Lớp 1A1' : 'Lớp 1A2',
          studentId: student.id,
          studentName: student.name,
          category,
          initialMessage: content.trim(),
        })
      );
    } else {
      dispatch(
        createConversation({
          title: groupTitle.trim(),
          type: 'nhom',
          classId: selectedClass,
          className: selectedClass === 'lop-1a1' ? 'Lớp 1A1' : 'Lớp 1A2',
          studentIds: selectedStudentIds,
          category,
          initialMessage: content.trim(),
        })
      );
    }

    // Reset and close
    setContent('');
    setGroupTitle('');
    onClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      icon="comments"
      title="Tạo Cuộc Trò Chuyện Mới"
      description="Bắt đầu trao đổi trực tiếp với phụ huynh học sinh hoặc lập nhóm trao đổi theo lớp"
      width={540}
      primaryAction={{
        label: 'Tạo & Gửi Tin Nhắn',
        icon: 'paper-plane',
        disabled: !isFormValid,
        onClick: () => handleSubmit(),
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode Toggle: Cá nhân vs Nhóm lớp */}
        <div className="flex bg-[var(--bg-muted)] p-1 rounded-[var(--radius-8)] border border-[var(--border-default)]">
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-bold rounded-[var(--radius-6)] transition-all ${
              mode === 'individual'
                ? 'bg-[var(--bg-surface)] text-[var(--eco-blue-strong)] shadow-xs'
                : 'text-[var(--text-subtle)] hover:text-[var(--text-heading)]'
            }`}
            onClick={() => setMode('individual')}
          >
            Cá nhân (1-1 với Phụ huynh)
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-bold rounded-[var(--radius-6)] transition-all ${
              mode === 'group'
                ? 'bg-[var(--bg-surface)] text-[var(--eco-blue-strong)] shadow-xs'
                : 'text-[var(--text-subtle)] hover:text-[var(--text-heading)]'
            }`}
            onClick={() => setMode('group')}
          >
            Nhóm lớp / Ban đại diện
          </button>
        </div>

        {/* Lớp học */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Lớp học <span className="text-[var(--text-danger)]">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all font-medium pr-9"
            >
              <option value="lop-1a1">Lớp 1A1 (Cô Mai & Cô Thủy)</option>
              <option value="lop-1a2">Lớp 1A2 (Cô Thảo & Thầy Tuấn)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-subtle)]">
              <Icon name="chevron-down" size={14} />
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Chuyên mục trao đổi
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MessageCategory)}
              className="w-full appearance-none px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all font-medium pr-9"
            >
              <option value="tin_nhan">Tin nhắn chung</option>
              <option value="bao_vang">Báo vắng / Nghỉ học</option>
              <option value="dan_thuoc">Dặn thuốc / Y tế</option>
              <option value="yeu_cau_don_ve">Ủy quyền đón về</option>
              <option value="gop_y">Góp ý / Kiến nghị</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-subtle)]">
              <Icon name="chevron-down" size={14} />
            </div>
          </div>
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Gắn nhãn để phụ huynh và giáo viên lọc tin nhắn quan trọng dễ dàng hơn.
          </p>
        </div>

        {mode === 'individual' ? (
          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
              Chọn học sinh & Phụ huynh <span className="text-[var(--text-danger)]">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all font-medium pr-9"
              >
                {mockStudents.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.code}) - {st.parentName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-subtle)]">
                <Icon name="chevron-down" size={14} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
                Tiêu đề nhóm <span className="text-[var(--text-danger)]">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Ban Đại Diện Cha Mẹ Học Sinh, Nhóm Ngoại Khóa..."
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all placeholder:text-[var(--text-disabled)]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-[var(--text-heading)]">
                  Chọn học sinh tham gia <span className="text-[var(--text-danger)]">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleSelectAllStudents}
                  className="text-xs font-bold text-[var(--eco-blue-strong)] hover:underline cursor-pointer"
                >
                  {selectedStudentIds.length === mockStudents.length ? 'Bỏ chọn cả lớp' : 'Chọn cả lớp'}
                </button>
              </div>
              <div className="border border-[var(--border-default)] rounded-[var(--radius-8)] p-2 max-h-40 overflow-y-auto space-y-1.5 bg-[var(--bg-surface)]">
                {mockStudents.map((st) => (
                  <label
                    key={st.id}
                    className="flex items-center gap-2 p-1.5 rounded-[var(--radius-4)] hover:bg-[var(--bg-subtle)] cursor-pointer text-xs text-[var(--text-heading)]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(st.id)}
                      onChange={() => handleToggleStudent(st.id)}
                      className="rounded border-[var(--border-default)] text-[var(--eco-blue-strong)]"
                    />
                    <span>
                      <strong>{st.name}</strong> ({st.parentName})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Nội dung tin nhắn */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Nội dung tin nhắn ban đầu <span className="text-[var(--text-danger)]">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Nhập nội dung trao đổi ban đầu..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all placeholder:text-[var(--text-disabled)] resize-none"
          />
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Tin nhắn sẽ được gửi ngay sau khi tạo hội thoại thành công.
          </p>
        </div>
      </form>
    </SlideOver>
  );
};

export default CreateConversationModal;
