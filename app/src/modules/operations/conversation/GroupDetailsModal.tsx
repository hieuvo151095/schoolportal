import React, { useState } from 'react';
import { SlideOver, Icon, Dropdown } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  removeStudentFromGroup,
  addRecipientToGroup,
} from '../../../store/slices/conversationSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
}

export const GroupDetailsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  conversationId,
}) => {
  const dispatch = useAppDispatch();
  const conv = useAppSelector((state) =>
    state.conversation.conversations.find((c) => c.id === conversationId)
  );

  const [activeTab, setActiveTab] = useState<'students' | 'recipients'>('students');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Add recipient form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientType, setNewRecipientType] = useState<'phu_huynh' | 'giao_vien'>('giao_vien');

  if (!conv || !isOpen) return null;

  // Mock student roster
  const studentRoster = conv.studentIds.map((id, index) => ({
    id,
    name:
      id === 'hs-001'
        ? 'Đỗ Nam'
        : id === 'hs-002'
        ? 'Lê Bảo An'
        : id === 'hs-003'
        ? 'Trần Minh Thảo'
        : `Học sinh ${index + 1}`,
    parentName:
      id === 'hs-001'
        ? 'Mẹ Đỗ Nam'
        : id === 'hs-002'
        ? 'Bố Lê Bảo An'
        : id === 'hs-003'
        ? 'Mẹ Trần Minh Thảo'
        : `PH Học sinh ${index + 1}`,
    code: `HS2026-${(index + 1).toString().padStart(3, '0')}`,
  }));

  const handleToggleStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((s) => s !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleBulkRemoveStudents = () => {
    selectedStudents.forEach((studentId) => {
      dispatch(removeStudentFromGroup({ conversationId, studentId }));
    });
    setSelectedStudents([]);
  };

  const handleAddRecipient = () => {
    if (!newRecipientName.trim()) return;

    dispatch(
      addRecipientToGroup({
        conversationId,
        recipient: {
          id: `rec-manual-${Date.now()}`,
          name: newRecipientName.trim(),
          role: newRecipientType,
          isManualAddition: true,
        },
      })
    );

    setNewRecipientName('');
    setShowAddForm(false);
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      icon="users"
      title={`Chi Tiết Nhóm: ${conv.title}`}
      description="Quản lý danh sách học sinh tham gia và thành viên nhận tin của nhóm trao đổi"
      width={560}
      primaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
      secondaryAction={null}
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border-default)]">
          <button
            type="button"
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'students'
                ? 'border-[var(--eco-blue-strong)] text-[var(--eco-blue-strong)]'
                : 'border-transparent text-[var(--text-subtle)] hover:text-[var(--text-heading)]'
            }`}
            onClick={() => setActiveTab('students')}
          >
            Học Sinh ({conv.studentIds.length})
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'recipients'
                ? 'border-[var(--eco-blue-strong)] text-[var(--eco-blue-strong)]'
                : 'border-transparent text-[var(--text-subtle)] hover:text-[var(--text-heading)]'
            }`}
            onClick={() => setActiveTab('recipients')}
          >
            Người Nhận ({conv.recipients.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'students' ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-subtle)]">
                Học sinh nguồn kéo theo phụ huynh vào nhóm
              </span>
              {selectedStudents.length > 0 && (
                <button
                  type="button"
                  onClick={handleBulkRemoveStudents}
                  className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-[var(--radius-6)] transition-all cursor-pointer"
                >
                  Xóa khỏi nhóm ({selectedStudents.length})
                </button>
              )}
            </div>

            <div className="border border-[var(--border-default)] rounded-[var(--radius-8)] overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[var(--bg-muted)] text-[var(--text-subtle)] border-b border-[var(--border-default)]">
                  <tr>
                    <th className="w-8 px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={
                          studentRoster.length > 0 &&
                          selectedStudents.length === studentRoster.length
                        }
                        onChange={() => {
                          if (selectedStudents.length === studentRoster.length) {
                            setSelectedStudents([]);
                          } else {
                            setSelectedStudents(studentRoster.map((s) => s.id));
                          }
                        }}
                        className="rounded border-[var(--border-default)]"
                      />
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">Mã HS</th>
                    <th className="px-3 py-2 text-left font-semibold">Học sinh</th>
                    <th className="px-3 py-2 text-left font-semibold">Phụ huynh</th>
                    <th className="w-12 px-3 py-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {studentRoster.map((st) => (
                    <tr key={st.id} className="hover:bg-[var(--bg-subtle)]">
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(st.id)}
                          onChange={() => handleToggleStudent(st.id)}
                          className="rounded border-[var(--border-default)]"
                        />
                      </td>
                      <td className="px-3 py-2 font-mono text-[var(--text-subtle)]">{st.code}</td>
                      <td className="px-3 py-2 font-semibold text-[var(--text-heading)]">{st.name}</td>
                      <td className="px-3 py-2 text-[var(--text-subtle)]">{st.parentName}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              removeStudentFromGroup({
                                conversationId,
                                studentId: st.id,
                              })
                            )
                          }
                          title="Xóa học sinh này"
                          className="text-[var(--text-subtle)] hover:text-rose-600 transition-colors p-1"
                        >
                          <Icon name="trash" size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-subtle)]">
                Phụ huynh tự động & giáo viên phụ trách
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-2.5 py-1 text-xs font-bold text-[var(--eco-blue-strong)] bg-[var(--eco-blue-50,#eff6ff)] hover:bg-[var(--eco-blue-100,#dbeafe)] rounded-[var(--radius-6)] transition-all cursor-pointer"
              >
                + Thêm người nhận
              </button>
            </div>

            {showAddForm && (
              <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-[var(--radius-8)] space-y-2.5">
                <div className="text-xs font-bold text-[var(--text-heading)]">
                  Thêm thành viên nhận tin mới
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Dropdown
                    options={[
                      { value: 'giao_vien', label: 'Giáo viên / Quản lý' },
                      { value: 'phu_huynh', label: 'Phụ huynh khác' },
                    ]}
                    value={newRecipientType}
                    onChange={(val) =>
                      setNewRecipientType(val as 'phu_huynh' | 'giao_vien')
                    }
                    size="sm"
                    fullWidth
                  />
                  <input
                    type="text"
                    placeholder="Họ và tên (ví dụ: Thầy Tuấn Anh)"
                    value={newRecipientName}
                    onChange={(e) => setNewRecipientName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-6)] text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-2.5 py-1 text-xs font-semibold text-[var(--text-subtle)] hover:text-[var(--text-heading)]"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleAddRecipient}
                    disabled={!newRecipientName.trim()}
                    className="px-3 py-1 text-xs font-bold text-white bg-[var(--eco-blue-strong)] hover:bg-[var(--eco-blue-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-[var(--radius-6)]"
                  >
                    Thêm ngay
                  </button>
                </div>
              </div>
            )}

            <div className="border border-[var(--border-default)] rounded-[var(--radius-8)] overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[var(--bg-muted)] text-[var(--text-subtle)] border-b border-[var(--border-default)]">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Họ và tên</th>
                    <th className="px-3 py-2 text-left font-semibold">Vai trò / Liên kết</th>
                    <th className="px-3 py-2 text-left font-semibold">Nguồn tham gia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {conv.recipients.map((rec) => (
                    <tr key={rec.id} className="hover:bg-[var(--bg-subtle)]">
                      <td className="px-3 py-2 font-semibold text-[var(--text-heading)]">
                        {rec.name}
                      </td>
                      <td className="px-3 py-2">
                        {rec.role === 'phu_huynh' ? (
                          <span className="text-blue-600 font-medium">
                            {rec.childrenNames && rec.childrenNames.length > 0
                              ? `PH của ${rec.childrenNames.join(', ')}`
                              : 'Phụ huynh'}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium">
                            Giáo viên / Quản lý
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {rec.isManualAddition ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700">
                            Thủ công
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] bg-blue-50 text-blue-700">
                            Tự động
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};
