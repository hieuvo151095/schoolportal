import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { createAssignment } from '../../../../../store/slices/assignmentSlice';
import { validateAssignmentForm } from '../../../../../utils/assignmentValidation';
import { AudienceType } from '../../../../../types/assignment';
import { Dropdown, Icon } from '@/components/ds';

const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 24px;
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

const RowGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const TextInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  outline: none;

  &:focus {
    border-color: #0070ce;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.12);
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

const FileUploadBox = styled.div`
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #0070ce;
    background-color: #eff6ff;
  }
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

const DraftBtn = styled.button`
  padding: 10px 18px;
  border: 1px solid #0070ce;
  background-color: #eff6ff;
  color: #0070ce;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
    border-color: #cbd5e1;
    color: #94a3b8;
  }

  &:hover:not(:disabled) {
    background-color: #dbeafe;
  }
`;

const SubmitBtn = styled.button`
  padding: 10px 22px;
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
    background-color: #cbd5e1;
  }

  &:hover:not(:disabled) {
    background-color: #005bb0;
  }
`;

export default function CreateAssignmentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const subjects = useAppSelector((state) => state.assignment.subjects);
  const students = useAppSelector((state) => state.assignment.students);

  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [scheduledSendDate, setScheduledSendDate] = useState('');
  const [audienceType, setAudienceType] = useState<AudienceType>('whole_class');
  const [targetStudentIds, setTargetStudentIds] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormValid =
    classId !== '' &&
    subjectId !== '' &&
    title.trim().length > 0 &&
    dueDate !== '' &&
    (audienceType !== 'specific_students' || targetStudentIds.length > 0);
  const isDraftValid = title.trim().length > 0;

  const classOptions = [
    { value: '', label: '-- Chọn lớp học --' },
    { value: '1a1', label: 'Lớp 1A1' },
    { value: '2a2', label: 'Lớp 2A2' },
  ];

  const subjectOptions = [
    { value: '', label: '-- Chọn môn học --' },
    ...subjects.map((s) => ({ value: s.id, label: s.name })),
  ];

  // Filter students by selected class
  const classStudents = students.filter(
    (s) => s.classId.toLowerCase() === classId.toLowerCase()
  );

  const handleStudentToggle = (id: string) => {
    setTargetStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = (isDraft: boolean) => {
    if (!isDraft) {
      const validation = validateAssignmentForm({
        classId,
        subjectId,
        title,
        dueDate,
        scheduledSendDate,
        audienceType,
        targetStudentIds,
      });

      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
    } else {
      // Draft allows saving with title or partial fields
      if (!title.trim()) {
        setErrors({ title: 'Vui lòng nhập tiêu đề cho bản nháp' });
        return;
      }
    }

    dispatch(
      createAssignment({
        classId,
        subjectId,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
        scheduledSendDate: scheduledSendDate || undefined,
        audienceType,
        targetStudentIds:
          audienceType === 'specific_students' ? targetStudentIds : [],
        attachments: fileName
          ? [
              {
                id: `att-${Date.now()}`,
                name: fileName,
                url: '/docs/demo-attachment.pdf',
                sizeBytes: 1500000,
                type: 'pdf',
              },
            ]
          : [],
        createdBy: 'Cô Nguyễn Thị Mai',
        isDraft,
      })
    );

    router.push(`/${schoolCode}/school/assignment`);
  };

  return (
    <PortalLayout>
      <Head>
        <title>Thêm Bài Tập Mới | Finviet School Operating Portal</title>
        <meta
          name="description"
          content="Tạo bài tập về nhà mới cho học sinh theo lớp, đặt hạn nộp và đính kèm tài liệu học tập."
        />
      </Head>

      <Container>
        <Breadcrumbs>
          <Link href={`/${schoolCode}/school/assignment`}>Bài Tập</Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>
            Thêm bài tập mới
          </span>
        </Breadcrumbs>

        <FormCard>
          <CardTitle>Thêm Bài Tập Mới</CardTitle>

          {/* Class & Subject Pickers (BR01, BR02) */}
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
                options={classOptions}
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
                options={subjectOptions}
                placeholder="-- Chọn môn học --"
              />
              {errors.subjectId && <ErrorText>{errors.subjectId}</ErrorText>}
            </FormGroup>
          </RowGroup>

          {/* Title input (BR01) */}
          <FormGroup>
            <Label>
              Tên bài tập<RequiredStar>*</RequiredStar>
            </Label>
            <TextInput
              type="text"
              placeholder="Ví dụ: Bài tập Toán tuần 4: Phép cộng có nhớ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <ErrorText>{errors.title}</ErrorText>}
          </FormGroup>

          {/* Description */}
          <FormGroup>
            <Label>Nội dung hướng dẫn</Label>
            <Textarea
              placeholder="Nhập yêu cầu bài tập, các trang sách giáo khoa cần hoàn thành..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>

          {/* Due date & Scheduled send date (BR01, BR04) */}
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
              <Label>Ngày gửi (Lên lịch gửi sau - tuỳ chọn)</Label>
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

          {/* Audience Scope (BR03) */}
          <FormGroup>
            <Label>
              Giao cho<RequiredStar>*</RequiredStar>
            </Label>
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

            {/* Target Student Checklist if specific_students */}
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

          {/* Attachments */}
          <FormGroup>
            <Label>File đính kèm (tuỳ chọn)</Label>
            {fileName ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="paperclip" size={13} />
                  <span>{fileName}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setFileName('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                  }}
                  className="inline-flex items-center gap-1"
                >
                  <Icon name="xmark" size={11} />
                  <span>Gỡ file</span>
                </button>
              </div>
            ) : (
              <FileUploadBox
                onClick={() => setFileName('Phieu_Bai_Tap_Mau.pdf')}
              >
                <div className="flex justify-center mb-1 text-[#006FDA]">
                  <Icon name="cloud-arrow-up" size={28} />
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0070ce',
                  }}
                >
                  Nhấn để chọn tài liệu đính kèm
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Hỗ trợ định dạng PDF, DOCX, JPG, PNG (tối đa 25MB)
                </div>
              </FileUploadBox>
            )}
          </FormGroup>

          {/* Submit Actions */}
          <ActionFooter>
            <Link href={`/${schoolCode}/school/assignment`} passHref legacyBehavior>
              <CancelBtn as="a">Hủy bỏ</CancelBtn>
            </Link>

            <DraftBtn disabled={!isDraftValid} onClick={() => handleSave(true)}>
              Lưu nháp
            </DraftBtn>

            <SubmitBtn disabled={!isFormValid} onClick={() => handleSave(false)}>
              Lưu và gửi
            </SubmitBtn>
          </ActionFooter>
        </FormCard>
      </Container>
    </PortalLayout>
  );
}
