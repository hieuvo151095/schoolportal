import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { updateAssignment } from '../../../../../store/slices/assignmentSlice';
import { validateAssignmentForm } from '../../../../../utils/assignmentValidation';
import { AudienceType } from '../../../../../types/assignment';
import { Dropdown } from '@/components/ds';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;

  a {
    color: #0070ce;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const FormCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
`;

const RequiredStar = styled.span`
  color: #ef4444;
  margin-left: 2px;
`;

const LockedHint = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 400;
  margin-left: 6px;
`;

const RowGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const TextInput = styled.input<{ $disabled?: boolean }>`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: ${(props) => (props.$disabled ? '#64748b' : '#1e293b')};
  background-color: ${(props) => (props.$disabled ? '#f1f5f9' : '#ffffff')};
  outline: none;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'text')};

  &:focus {
    border-color: ${(props) => (props.$disabled ? '#cbd5e1' : '#0070ce')};
    box-shadow: ${(props) =>
      props.$disabled ? 'none' : '0 0 0 3px rgba(0, 112, 206, 0.12)'};
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  min-height: 120px;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #0070ce;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.12);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 4px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
`;

const StudentPickerBox = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
`;

const StudentCheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 12px;
  margin-top: 2px;
`;

const ActionFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
`;

const CancelBtn = styled.button`
  padding: 10px 18px;
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

const UpdateBtn = styled.button`
  padding: 10px 18px;
  border: 1px solid #0070ce;
  background-color: #eff6ff;
  color: #0070ce;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #dbeafe;
  }
`;

const UpdateAndSendBtn = styled.button`
  padding: 10px 22px;
  border: none;
  background-color: #0070ce;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #005bb0;
  }
`;

export default function EditAssignmentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const assignmentId = router.query.assignmentId as string;

  const assignments = useAppSelector((state) => state.assignment.assignments);
  const subjects = useAppSelector((state) => state.assignment.subjects);
  const students = useAppSelector((state) => state.assignment.students);

  const existingAssignment = assignments.find((a) => a.id === assignmentId);

  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [scheduledSendDate, setScheduledSendDate] = useState('');
  const [audienceType, setAudienceType] = useState<AudienceType>('whole_class');
  const [targetStudentIds, setTargetStudentIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingAssignment) {
      setClassId(existingAssignment.classId);
      setSubjectId(existingAssignment.subjectId);
      setTitle(existingAssignment.title);
      setDescription(existingAssignment.description || '');

      // Format ISO string to datetime-local format
      const formatForInput = (iso?: string) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '';
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate()
        )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      setDueDate(formatForInput(existingAssignment.dueDate));
      setScheduledSendDate(formatForInput(existingAssignment.scheduledSendDate));
      setAudienceType(existingAssignment.audienceType);
      setTargetStudentIds(existingAssignment.targetStudentIds || []);
    }
  }, [existingAssignment]);

  if (!existingAssignment) {
    return (
      <PortalLayout>
        <Container>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Không tìm thấy bài tập</h2>
            <Link href={`/${schoolCode}/school/assignment`} passHref legacyBehavior>
              <CancelBtn as="a">Quay lại danh sách</CancelBtn>
            </Link>
          </div>
        </Container>
      </PortalLayout>
    );
  }

  const classStudents = students.filter(
    (s) => s.classId.toLowerCase() === classId.toLowerCase()
  );

  const handleStudentToggle = (id: string) => {
    setTargetStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = (dispatchNow: boolean) => {
    const validation = validateAssignmentForm(
      {
        classId,
        subjectId,
        dueDate,
        scheduledSendDate,
        audienceType,
        targetStudentIds,
      },
      true // isEdit: true skips title requirement
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    dispatch(
      updateAssignment({
        id: existingAssignment.id,
        data: {
          classId,
          subjectId,
          description: description.trim(),
          dueDate: new Date(dueDate).toISOString(),
          scheduledSendDate: scheduledSendDate
            ? new Date(scheduledSendDate).toISOString()
            : undefined,
          audienceType,
          targetStudentIds:
            audienceType === 'specific_students' ? targetStudentIds : [],
        },
        dispatchNow,
      })
    );

    router.push(`/${schoolCode}/school/assignment/${existingAssignment.id}`);
  };

  return (
    <PortalLayout>
      <Head>
        <title>Chỉnh Sửa Bài Tập | Finviet School Operating Portal</title>
        <meta
          name="description"
          content={`Chỉnh sửa bài tập ${existingAssignment.title}`}
        />
      </Head>

      <Container>
        <Breadcrumbs>
          <Link href={`/${schoolCode}/school/assignment`}>Bài Tập</Link>
          <span>/</span>
          <Link
            href={`/${schoolCode}/school/assignment/${existingAssignment.id}`}
          >
            {existingAssignment.title}
          </Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>Chỉnh sửa</span>
        </Breadcrumbs>

        <FormCard>
          <CardTitle>Chỉnh Sửa Bài Tập</CardTitle>

          {/* Class & Subject */}
          <RowGroup>
            <FormGroup>
              <Label>
                Lớp học<RequiredStar>*</RequiredStar>
              </Label>
              <Dropdown
                searchable
                fullWidth
                value={classId}
                onChange={(val) => {
                  setClassId(val);
                  setTargetStudentIds([]);
                }}
                options={[
                  { value: '1a1', label: 'Lớp 1A1' },
                  { value: '2a2', label: 'Lớp 2A2' },
                ]}
                placeholder="-- Chọn lớp học --"
              />
              {errors.classId && <ErrorText>{errors.classId}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>
                Môn học<RequiredStar>*</RequiredStar>
              </Label>
              <Dropdown
                searchable
                fullWidth
                value={subjectId}
                onChange={(val) => setSubjectId(val)}
                options={subjects.map((s) => ({ value: s.id, label: s.name }))}
                placeholder="-- Chọn môn học --"
              />
              {errors.subjectId && <ErrorText>{errors.subjectId}</ErrorText>}
            </FormGroup>
          </RowGroup>

          {/* Title - LOCKED IN EDIT MODE (BR11) */}
          <FormGroup>
            <Label>
              Tên bài tập
              <LockedHint>(Không thể đổi tên bài tập sau khi đã tạo)</LockedHint>
            </Label>
            <TextInput
              type="text"
              value={title}
              disabled
              $disabled
              readOnly
            />
          </FormGroup>

          {/* Description */}
          <FormGroup>
            <Label>Nội dung hướng dẫn</Label>
            <Textarea
              placeholder="Nhập yêu cầu bài tập..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>

          {/* Due date & Scheduled date */}
          <RowGroup>
            <FormGroup>
              <Label>
                Hạn nộp bài<RequiredStar>*</RequiredStar>
              </Label>
              <TextInput
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              {errors.dueDate && <ErrorText>{errors.dueDate}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>Ngày gửi (Lên lịch gửi sau)</Label>
              <TextInput
                type="datetime-local"
                value={scheduledSendDate}
                onChange={(e) => setScheduledSendDate(e.target.value)}
              />
              {errors.scheduledSendDate && (
                <ErrorText>{errors.scheduledSendDate}</ErrorText>
              )}
            </FormGroup>
          </RowGroup>

          {/* Audience */}
          <FormGroup>
            <Label>Giao cho</Label>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="audienceType"
                  checked={audienceType === 'whole_class'}
                  onChange={() => setAudienceType('whole_class')}
                />
                <span>Cả lớp ({classStudents.length} học sinh)</span>
              </RadioLabel>

              <RadioLabel>
                <input
                  type="radio"
                  name="audienceType"
                  checked={audienceType === 'specific_students'}
                  onChange={() => setAudienceType('specific_students')}
                />
                <span>Chọn học sinh cụ thể</span>
              </RadioLabel>
            </RadioGroup>

            {audienceType === 'specific_students' && (
              <StudentPickerBox>
                {classStudents.map((st) => (
                  <StudentCheckboxRow key={st.id}>
                    <input
                      type="checkbox"
                      checked={targetStudentIds.includes(st.id)}
                      onChange={() => handleStudentToggle(st.id)}
                    />
                    <span>
                      <strong>{st.name}</strong> ({st.studentCode})
                    </span>
                  </StudentCheckboxRow>
                ))}
              </StudentPickerBox>
            )}
            {errors.targetStudentIds && (
              <ErrorText>{errors.targetStudentIds}</ErrorText>
            )}
          </FormGroup>

          {/* 3-Way Action Footer (BR11) */}
          <ActionFooter>
            <Link
              href={`/${schoolCode}/school/assignment/${existingAssignment.id}`}
              passHref
              legacyBehavior
            >
              <CancelBtn as="a">Hủy bỏ</CancelBtn>
            </Link>

            <UpdateBtn onClick={() => handleSave(false)}>
              Cập nhật
            </UpdateBtn>

            <UpdateAndSendBtn onClick={() => handleSave(true)}>
              Cập nhật và gửi
            </UpdateAndSendBtn>
          </ActionFooter>
        </FormCard>
      </Container>
    </PortalLayout>
  );
}
