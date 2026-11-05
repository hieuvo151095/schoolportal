import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '../../../store';
import { createConversation } from '../../../store/slices/conversationSlice';
import { MessageCategory } from '../../../types/conversation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
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
  max-width: 560px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
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

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 70vh;
  overflow-y: auto;
`;

const ModeToggle = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
`;

const ModeBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#0070CE' : '#64748b')};
  box-shadow: ${({ $active }) =>
    $active ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none'};
  cursor: pointer;
  transition: all 0.15s;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #334155;

  span {
    color: #ef4444;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: #0070CE;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    border-color: #0070CE;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
  min-height: 90px;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    border-color: #0070CE;
  }
`;

const StudentCheckboxGroup = styled.div`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 14px;
  max-height: 130px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8fafc;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8fafc;
`;

const CancelBtn = styled.button`
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }
`;

const SubmitBtn = styled.button<{ disabled?: boolean }>`
  padding: 8px 20px;
  border: none;
  background: ${({ disabled }) => (disabled ? '#94a3b8' : '#0070CE')};
  color: #ffffff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background: ${({ disabled }) => (disabled ? '#94a3b8' : '#005096')};
  }
`;

export const CreateConversationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<'ca_nhan' | 'nhom'>('ca_nhan');
  const [classId, setClassId] = useState('lop-1a1');
  const [studentId, setStudentId] = useState('hs-1');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(['hs-1', 'hs-2']);
  const [groupTitle, setGroupTitle] = useState('');
  const [category, setCategory] = useState<MessageCategory>('tin_nhan');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const mockStudents = [
    { id: 'hs-1', name: 'Đỗ Nam', parentName: 'Nguyễn Thị Hương' },
    { id: 'hs-2', name: 'Lê Bảo An', parentName: 'Lê Văn Hoàng' },
    { id: 'hs-3', name: 'Trần Minh Thảo', parentName: 'Trần Tuấn Anh' },
    { id: 'hs-4', name: 'Trần Quang Khải', parentName: 'Trần Tuấn Anh' },
    { id: 'hs-5', name: 'Vũ Phong', parentName: 'Vũ Hoàng Yến' },
  ];

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllStudents = () => {
    if (selectedStudentIds.length === mockStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(mockStudents.map((s) => s.id));
    }
  };

  const isFormValid =
    mode === 'ca_nhan'
      ? studentId && content.trim()
      : groupTitle.trim() && selectedStudentIds.length > 0 && content.trim();

  const handleSubmit = () => {
    if (!isFormValid) return;

    if (mode === 'ca_nhan') {
      const student = mockStudents.find((s) => s.id === studentId);
      dispatch(
        createConversation({
          type: 'ca_nhan',
          title: `Phụ huynh ${student?.name || ''}`,
          classId,
          className: 'Lớp 1A1',
          studentId,
          studentName: student?.name,
          initialMessage: content.trim(),
          category,
          recipients: [
            {
              id: `ph-${studentId}`,
              name: student?.parentName || 'Phụ huynh',
              role: 'phu_huynh',
              childrenNames: [student?.name || ''],
              isManualAddition: false,
            },
          ],
        })
      );
    } else {
      dispatch(
        createConversation({
          type: 'nhom',
          title: groupTitle.trim(),
          classId,
          className: 'Lớp 1A1',
          studentIds: selectedStudentIds,
          initialMessage: content.trim(),
          recipients: [
            {
              id: 'gv-current',
              name: 'Cô Nguyễn Mai Anh (GVCN)',
              role: 'giao_vien',
              isManualAddition: true,
            },
          ],
        })
      );
    }

    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>Tạo Cuộc Trao Đổi Mới</Title>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Hình thức trao đổi</Label>
            <ModeToggle>
              <ModeBtn
                $active={mode === 'ca_nhan'}
                onClick={() => setMode('ca_nhan')}
              >
                👤 Trao đổi cá nhân (1:1)
              </ModeBtn>
              <ModeBtn
                $active={mode === 'nhom'}
                onClick={() => setMode('nhom')}
              >
                👥 Trao đổi nhóm
              </ModeBtn>
            </ModeToggle>
          </FormGroup>

          <FormGroup>
            <Label>
              Lớp học <span>*</span>
            </Label>
            <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
              <option value="lop-1a1">Lớp 1A1</option>
              <option value="lop-1a2">Lớp 1A2</option>
            </Select>
          </FormGroup>

          {mode === 'ca_nhan' ? (
            <>
              <FormGroup>
                <Label>
                  Học sinh <span>*</span>
                </Label>
                <Select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  {mockStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} — PH: {st.parentName}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Thể loại tin nhắn</Label>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MessageCategory)}
                >
                  <option value="tin_nhan">Tin nhắn</option>
                  <option value="bao_vang">Báo vắng</option>
                  <option value="dan_thuoc">Dặn thuốc</option>
                  <option value="gop_y">Góp ý</option>
                  <option value="khac">Khác</option>
                </Select>
              </FormGroup>
            </>
          ) : (
            <>
              <FormGroup>
                <Label>
                  Tiêu đề nhóm <span>*</span>
                </Label>
                <Input
                  placeholder="Ví dụ: Ban Đại Diện Cha Mẹ Học Sinh, Nhóm Ngoại Khóa..."
                  value={groupTitle}
                  onChange={(e) => setGroupTitle(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <Label style={{ marginBottom: 0 }}>
                    Chọn học sinh tham gia <span>*</span>
                  </Label>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', fontSize: '12px', color: '#0070CE', fontWeight: 700, cursor: 'pointer' }}
                    onClick={handleSelectAllStudents}
                  >
                    {selectedStudentIds.length === mockStudents.length
                      ? 'Bỏ chọn cả lớp'
                      : 'Chọn cả lớp'}
                  </button>
                </div>
                <StudentCheckboxGroup>
                  {mockStudents.map((st) => (
                    <CheckboxLabel key={st.id}>
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(st.id)}
                        onChange={() => handleToggleStudent(st.id)}
                      />
                      <span>
                        <strong>{st.name}</strong> ({st.parentName})
                      </span>
                    </CheckboxLabel>
                  ))}
                </StudentCheckboxGroup>
              </FormGroup>
            </>
          )}

          <FormGroup>
            <Label>
              Nội dung tin nhắn <span>*</span>
            </Label>
            <Textarea
              placeholder="Nhập nội dung trao đổi ban đầu..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CancelBtn onClick={onClose}>Hủy</CancelBtn>
          <SubmitBtn disabled={!isFormValid} onClick={handleSubmit}>
            Tạo & Gửi Tin Nhắn
          </SubmitBtn>
        </ModalFooter>
      </ModalBox>
    </Overlay>
  );
};
