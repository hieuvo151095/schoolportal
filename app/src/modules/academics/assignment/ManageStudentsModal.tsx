import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  addStudentToAssignment,
  closeManageStudentsModal,
} from '../../../store/slices/assignmentSlice';

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
  max-width: 480px;
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
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StudentRow = styled.label<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid ${(props) => (props.$selected ? '#0070ce' : '#e2e8f0')};
  background-color: ${(props) => (props.$selected ? '#eff6ff' : '#ffffff')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #0070ce;
  }
`;

const StudentName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
`;

const StudentCode = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const ModalFooter = styled.div`
  padding: 14px 20px;
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

const AddButton = styled.button`
  padding: 8px 18px;
  border: none;
  background-color: #0070ce;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #005bb0;
  }
`;

export const ManageStudentsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.assignment.isManageStudentsModalOpen
  );
  const assignmentId = useAppSelector(
    (state) => state.assignment.activeAssignmentIdForStudents
  );
  const assignments = useAppSelector(
    (state) => state.assignment.assignments
  );
  const allStudents = useAppSelector((state) => state.assignment.students);

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const currentAssignment = assignments.find((a) => a.id === assignmentId);

  if (!isOpen || !currentAssignment) return null;

  // Filter out students who are already part of this assignment's submissions
  const existingStudentIds = currentAssignment.submissions.map(
    (s) => s.studentId
  );
  const availableStudents = allStudents.filter(
    (s) =>
      s.classId.toLowerCase() === currentAssignment.classId.toLowerCase() &&
      !existingStudentIds.includes(s.id)
  );

  const handleToggle = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddStudents = () => {
    selectedStudentIds.forEach((studentId) => {
      dispatch(
        addStudentToAssignment({
          assignmentId: currentAssignment.id,
          studentId,
        })
      );
    });

    setSelectedStudentIds([]);
    dispatch(closeManageStudentsModal());
  };

  return (
    <Overlay onClick={() => dispatch(closeManageStudentsModal())}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Thêm Học Sinh Vào Bài Tập</ModalTitle>
          <CloseButton onClick={() => dispatch(closeManageStudentsModal())}>
            ✕
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px' }}>
            Chọn học sinh trong {currentAssignment.className} cần giao bài:
          </p>

          {availableStudents.length === 0 ? (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
              }}
            >
              Tất cả học sinh trong lớp đã có trong danh sách bài tập này.
            </div>
          ) : (
            availableStudents.map((student) => {
              const isSelected = selectedStudentIds.includes(student.id);

              return (
                <StudentRow
                  key={student.id}
                  $selected={isSelected}
                  onClick={() => handleToggle(student.id)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    style={{ accentColor: '#0070ce' }}
                  />
                  <div>
                    <StudentName>{student.name}</StudentName>
                    <StudentCode>
                      Mã: {student.studentCode}
                      {student.nickname && ` • Tên gọi: ${student.nickname}`}
                    </StudentCode>
                  </div>
                </StudentRow>
              );
            })
          )}
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={() => dispatch(closeManageStudentsModal())}>
            Hủy bỏ
          </CancelButton>
          <AddButton
            disabled={selectedStudentIds.length === 0}
            onClick={handleAddStudents}
          >
            Thêm ({selectedStudentIds.length}) học sinh
          </AddButton>
        </ModalFooter>
      </ModalCard>
    </Overlay>
  );
};
