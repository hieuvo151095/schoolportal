import React, { useState } from 'react';
import styled from 'styled-components';
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

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 620px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 85vh;
`;

const ModalHeader = styled.div`
  padding: 18px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;

  &:hover {
    color: #0f172a;
  }
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  font-size: 13px;
  font-weight: 700;
  border: none;
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#0070CE' : '#64748b')};
  border-bottom: 2px solid
    ${({ $active }) => ($active ? '#0070CE' : 'transparent')};
  cursor: pointer;
`;

const TabContent = styled.div`
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const PrimaryBtn = styled.button`
  background: #0070CE;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #005096;
  }
`;

const DeleteBtn = styled.button`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #fecdd3;
  }
`;

const ItemTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
  }

  th {
    background: #f8fafc;
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }
`;

const AddBox = styled.div`
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Select = styled.select`
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 12px;
`;

const Input = styled.input`
  flex: 2;
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 12px;
`;

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipientType, setNewRecipientType] = useState<'phu_huynh' | 'giao_vien'>('giao_vien');
  const [newRecipientName, setNewRecipientName] = useState('');

  if (!isOpen || !conv) return null;

  // Mock list of class students for display in Tab 1
  const studentRoster = [
    { id: 'hs-1', name: 'Đỗ Nam', code: 'HS001', parentName: 'Nguyễn Thị Hương' },
    { id: 'hs-2', name: 'Lê Bảo An', code: 'HS002', parentName: 'Lê Văn Hoàng' },
    { id: 'hs-3', name: 'Trần Minh Thảo', code: 'HS003', parentName: 'Trần Tuấn Anh' },
    { id: 'hs-4', name: 'Trần Quang Khải', code: 'HS004', parentName: 'Trần Tuấn Anh' },
    { id: 'hs-5', name: 'Vũ Phong', code: 'HS005', parentName: 'Vũ Hoàng Yến' },
  ].filter((s) => conv.studentIds.includes(s.id));

  const handleToggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
          id: `rec-${Date.now()}`,
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
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>Chi Tiết Nhóm: {conv.title}</Title>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <TabBar>
          <TabButton
            $active={activeTab === 'students'}
            onClick={() => setActiveTab('students')}
          >
            Danh Sách Học Sinh ({conv.studentIds.length})
          </TabButton>
          <TabButton
            $active={activeTab === 'recipients'}
            onClick={() => setActiveTab('recipients')}
          >
            Danh Sách Người Nhận ({conv.recipients.length})
          </TabButton>
        </TabBar>

        <TabContent>
          {activeTab === 'students' ? (
            <div>
              <ActionRow>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Học sinh nguồn kéo theo phụ huynh vào danh sách nhận tin
                </div>
                {selectedStudents.length > 0 && (
                  <DeleteBtn onClick={handleBulkRemoveStudents}>
                    Xóa trẻ ({selectedStudents.length})
                  </DeleteBtn>
                )}
              </ActionRow>

              <ItemTable>
                <thead>
                  <tr>
                    <th style={{ width: '36px' }}>Chọn</th>
                    <th>Mã HS</th>
                    <th>Họ và tên học sinh</th>
                    <th>Phụ huynh liên kết</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {studentRoster.map((st) => (
                    <tr key={st.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(st.id)}
                          onChange={() => handleToggleStudent(st.id)}
                        />
                      </td>
                      <td>{st.code}</td>
                      <td>
                        <strong>{st.name}</strong>
                      </td>
                      <td>{st.parentName}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          onClick={() =>
                            dispatch(
                              removeStudentFromGroup({
                                conversationId,
                                studentId: st.id,
                              })
                            )
                          }
                          title="Xóa học sinh này khỏi nhóm"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ItemTable>
            </div>
          ) : (
            <div>
              <ActionRow>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Phụ huynh suy ra tự động & thành viên bổ sung
                </div>
                <PrimaryBtn onClick={() => setShowAddForm(!showAddForm)}>
                  + Thêm người nhận
                </PrimaryBtn>
              </ActionRow>

              {showAddForm && (
                <AddBox>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                    Thêm thành viên nhận tin
                  </div>
                  <FormRow>
                    <Select
                      value={newRecipientType}
                      onChange={(e) =>
                        setNewRecipientType(e.target.value as 'phu_huynh' | 'giao_vien')
                      }
                    >
                      <option value="giao_vien">Giáo viên / Quản lý</option>
                      <option value="phu_huynh">Phụ huynh khác</option>
                    </Select>
                    <Input
                      placeholder="Họ và tên (ví dụ: Cô Thu Thủy)"
                      value={newRecipientName}
                      onChange={(e) => setNewRecipientName(e.target.value)}
                    />
                  </FormRow>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      style={{
                        padding: '4px 10px',
                        fontSize: '12px',
                        background: 'none',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                      onClick={() => setShowAddForm(false)}
                    >
                      Hủy
                    </button>
                    <PrimaryBtn onClick={handleAddRecipient}>Thêm ngay</PrimaryBtn>
                  </div>
                </AddBox>
              )}

              <ItemTable>
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Vai trò / Gắn thẻ con</th>
                    <th>Nguồn tham gia</th>
                  </tr>
                </thead>
                <tbody>
                  {conv.recipients.map((rec) => (
                    <tr key={rec.id}>
                      <td>
                        <strong>{rec.name}</strong>
                      </td>
                      <td>
                        {rec.role === 'phu_huynh' ? (
                          <span style={{ color: '#2563eb', fontWeight: 600 }}>
                            {rec.childrenNames && rec.childrenNames.length > 0
                              ? `PH của ${rec.childrenNames.join(', ')}`
                              : 'Phụ huynh'}
                          </span>
                        ) : (
                          <span style={{ color: '#059669', fontWeight: 600 }}>
                            Giáo viên / Quản lý
                          </span>
                        )}
                      </td>
                      <td>
                        {rec.isManualAddition ? (
                          <span
                            style={{
                              background: '#f1f5f9',
                              color: '#475569',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                            }}
                          >
                            Thêm thủ công
                          </span>
                        ) : (
                          <span
                            style={{
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                            }}
                          >
                            Tự động theo học sinh
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ItemTable>
            </div>
          )}
        </TabContent>
      </ModalBox>
    </Overlay>
  );
};
