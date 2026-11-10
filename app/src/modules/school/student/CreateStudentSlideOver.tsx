/**
 * Create Student SlideOver Component (Right Drawer)
 * Replaces full creation page with modern slide-over right drawer
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (SlideOver)
 */

import React, { useState, useMemo } from 'react';
import { Icon, Dropdown, SlideOver } from '@/components/ds';
import { useAppDispatch } from '../../../store';
import { addStudent } from '../../../store/slices/studentSlice';
import { addToast } from '../../../store/slices/toastSlice';
import {
  calculateBmi,
  classifyBmi,
  formatBmiClassification,
  getBmiBadgeStyle,
  validateStudentCreation,
} from '../../../utils/studentValidation';
import { StudentGender, GuardianRelationship } from '../../../types/student';

interface CreateStudentSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  schoolCode: string;
}

const CLASS_OPTIONS = [
  { value: 'lop-1a1', label: 'Lớp 1A1' },
  { value: 'lop-1a2', label: 'Lớp 1A2' },
  { value: 'lop-2a1', label: 'Lớp 2A1' },
];

const GUARDIAN_RELATIONSHIP_OPTIONS = [
  { value: 'bo', label: 'Bố' },
  { value: 'me', label: 'Mẹ' },
  { value: 'ong', label: 'Ông' },
  { value: 'ba', label: 'Bà' },
  { value: 'nguoi_giam_ho', label: 'Người giám hộ hợp pháp' },
];

const classNameMap: Record<string, string> = {
  'lop-1a1': 'Lớp 1A1',
  'lop-1a2': 'Lớp 1A2',
  'lop-2a1': 'Lớp 2A1',
};

export const CreateStudentSlideOver: React.FC<CreateStudentSlideOverProps> = ({
  isOpen,
  onClose,
  schoolCode,
}) => {
  const dispatch = useAppDispatch();

  // Form State
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [studentCode, setStudentCode] = useState(
    `HS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [cccd, setCccd] = useState('');
  const [dob, setDob] = useState('2020-01-01');
  const [gender, setGender] = useState<StudentGender>('nam');
  const [classId, setClassId] = useState('');
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [address, setAddress] = useState('');
  const [ethnicity, setEthnicity] = useState('Kinh');
  const [religion, setReligion] = useState('Không');
  const [notes, setNotes] = useState('');

  // Primary Guardian State
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState<GuardianRelationship>('bo');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianOccupation, setGuardianOccupation] = useState('');
  const [isPrimaryPickup, setIsPrimaryPickup] = useState(true);
  const [isEmergencyContact, setIsEmergencyContact] = useState(true);

  // Baseline Physical Growth State
  const [heightCm, setHeightCm] = useState('115');
  const [weightKg, setWeightKg] = useState('20.5');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFullName('');
    setNickName('');
    setStudentCode(`HS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    setCccd('');
    setDob('2020-01-01');
    setGender('nam');
    setClassId('');
    setAdmissionDate(new Date().toISOString().split('T')[0]);
    setAddress('');
    setEthnicity('Kinh');
    setReligion('Không');
    setNotes('');
    setGuardianName('');
    setGuardianRelationship('bo');
    setGuardianPhone('');
    setGuardianEmail('');
    setGuardianOccupation('');
    setIsPrimaryPickup(true);
    setIsEmergencyContact(true);
    setHeightCm('115');
    setWeightKg('20.5');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = useMemo(() => {
    return (
      fullName.trim() !== '' &&
      classId.trim() !== '' &&
      cccd.trim() !== '' &&
      guardianName.trim() !== '' &&
      guardianPhone.trim() !== ''
    );
  }, [fullName, classId, cccd, guardianName, guardianPhone]);

  // Live BMI calculation
  const numHeight = parseFloat(heightCm) || 0;
  const numWeight = parseFloat(weightKg) || 0;
  const liveBmi = useMemo(() => calculateBmi(numHeight, numWeight), [numHeight, numWeight]);
  const liveBmiClassification = useMemo(() => classifyBmi(liveBmi), [liveBmi]);
  const bmiBadgeStyle = useMemo(() => getBmiBadgeStyle(liveBmiClassification), [liveBmiClassification]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const validation = validateStudentCreation({
      fullName,
      dob,
      gender,
      classId,
      studentCode,
      cccd,
      guardians: [
        {
          id: `ph-${Date.now()}`,
          fullName: guardianName,
          relationship: guardianRelationship,
          phone: guardianPhone,
          email: guardianEmail || undefined,
          occupation: guardianOccupation || undefined,
          isPrimaryPickup,
          isEmergencyContact,
        },
      ],
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      dispatch(
        addToast({
          type: 'error',
          title: 'Thông tin chưa đầy đủ',
          message: 'Vui lòng kiểm tra và điền các trường bắt buộc',
        })
      );
      return;
    }

    setErrors({});

    const growthRecords = [];
    if (numHeight > 0 && numWeight > 0) {
      growthRecords.push({
        id: `gr-${Date.now()}`,
        measuredAt: admissionDate,
        heightCm: numHeight,
        weightKg: numWeight,
        bmi: liveBmi,
        bmiClassification: liveBmiClassification,
        measuredBy: 'Y tế học đường',
        notes: 'Chỉ số đo lúc nhập học',
      });
    }

    dispatch(
      addStudent({
        schoolCode,
        studentCode,
        fullName: fullName.trim(),
        nickName: nickName.trim() || undefined,
        dob,
        gender,
        cccd: cccd.trim(),
        status: 'active',
        classId,
        className: classNameMap[classId] || classId,
        admissionDate,
        address: address.trim() || undefined,
        ethnicity,
        religion,
        notes: notes.trim() || undefined,
        guardians: [
          {
            id: `ph-${Date.now()}`,
            fullName: guardianName.trim(),
            relationship: guardianRelationship,
            phone: guardianPhone.trim(),
            email: guardianEmail.trim() || undefined,
            occupation: guardianOccupation.trim() || undefined,
            isPrimaryPickup,
            isEmergencyContact,
          },
        ],
        growthRecords,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Tạo hồ sơ thành công',
        message: `Đã thêm học sinh ${fullName} vào ${classNameMap[classId] || classId}`,
      })
    );

    handleClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={handleClose}
      title="Thêm học sinh mới"
      description="Nhập thông tin cá nhân, người giám hộ và chỉ số sức khỏe ban đầu"
      icon="user-plus"
      width={740}
      primaryAction={{
        label: 'Tạo hồ sơ học sinh',
        icon: 'circle-check',
        disabled: !isFormValid,
        onClick: () => {
          const form = document.getElementById('create-student-form') as HTMLFormElement;
          if (form) form.requestSubmit();
        },
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: handleClose,
      }}
    >
      <form id="create-student-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Student Information */}
        <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200/80 pb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0070CE] flex items-center justify-center font-semibold text-xs">
              <Icon name="user-check" size={14} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">1. Thông tin học sinh</h2>
              <p className="text-xs text-slate-500">Các trường đánh dấu (*) là bắt buộc</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-sm">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên học sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Nguyễn Hoàng Nam"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden font-medium ${
                  errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.fullName && <p className="text-2xs text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên gọi ở nhà / Biệt danh
              </label>
              <input
                type="text"
                placeholder="VD: Bơ, Miu, Bin..."
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden"
              />
            </div>

            {/* Student Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mã học sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden font-mono ${
                  errors.studentCode ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.studentCode && (
                <p className="text-2xs text-red-600 mt-1">{errors.studentCode}</p>
              )}
            </div>

            {/* CCCD */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số định danh / CCCD <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="12 chữ số định danh"
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden font-mono ${
                  errors.cccd ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.cccd && <p className="text-2xs text-red-600 mt-1">{errors.cccd}</p>}
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden ${
                  errors.dob ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                }`}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="student-gender"
                    checked={gender === 'nam'}
                    onChange={() => setGender('nam')}
                    className="text-[#0070CE] focus:ring-[#0070CE]"
                  />
                  <span>Nam</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="student-gender"
                    checked={gender === 'nu'}
                    onChange={() => setGender('nu')}
                    className="text-[#0070CE] focus:ring-[#0070CE]"
                  />
                  <span>Nữ</span>
                </label>
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lớp học <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={classId}
                onChange={(val) => setClassId(val)}
                options={CLASS_OPTIONS}
                placeholder="-- Chọn lớp học --"
                fullWidth
              />
              {errors.classId && <p className="text-2xs text-red-600 mt-1">{errors.classId}</p>}
            </div>

            {/* Admission Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày nhập học</label>
              <input
                type="date"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ thường trú</label>
              <input
                type="text"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Primary Guardian Info */}
        <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200/80 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-xs">
              <Icon name="user" size={14} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">2. Người giám hộ chính *</h2>
              <p className="text-xs text-slate-500">
                Dùng để liên kết tài khoản ứng dụng phụ huynh và liên hệ khẩn cấp
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-sm">
            {/* Guardian Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên người giám hộ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Nguyễn Văn Hùng"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden font-medium ${
                  errors.guardianName ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.guardianName && (
                <p className="text-2xs text-red-600 mt-1">{errors.guardianName}</p>
              )}
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quan hệ với học sinh <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={guardianRelationship}
                onChange={(val) => setGuardianRelationship(val as GuardianRelationship)}
                options={GUARDIAN_RELATIONSHIP_OPTIONS}
                placeholder="Chọn quan hệ"
                fullWidth
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại liên hệ <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="VD: 0903123456"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden font-medium ${
                  errors.guardianPhone ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.guardianPhone && (
                <p className="text-2xs text-red-600 mt-1">{errors.guardianPhone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="VD: phuhuynh@example.com"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden"
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nghề nghiệp</label>
              <input
                type="text"
                placeholder="VD: Kỹ sư, Bác sĩ..."
                value={guardianOccupation}
                onChange={(e) => setGuardianOccupation(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden"
              />
            </div>

            {/* Pickup / Emergency Toggles */}
            <div className="flex items-center gap-4 pt-4 sm:col-span-2 md:col-span-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimaryPickup}
                  onChange={(e) => setIsPrimaryPickup(e.target.checked)}
                  className="rounded text-[#0070CE] focus:ring-[#0070CE]"
                />
                <span>Người đón chính</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmergencyContact}
                  onChange={(e) => setIsEmergencyContact(e.target.checked)}
                  className="rounded text-[#0070CE] focus:ring-[#0070CE]"
                />
                <span>Liên hệ khẩn cấp</span>
              </label>
            </div>
          </div>
        </div>

        {/* Card 3: Baseline Physical Growth & BMI */}
        <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-semibold text-xs">
                <Icon name="heart" size={14} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">3. Chỉ số thể chất ban đầu</h2>
                <p className="text-xs text-slate-500">Ghi nhận chiều cao và cân nặng lúc nhập học</p>
              </div>
            </div>

            {/* Live BMI badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">BMI:</span>
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: bmiBadgeStyle.bg, color: bmiBadgeStyle.text }}
              >
                {liveBmi} • {formatBmiClassification(liveBmiClassification)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chiều cao ban đầu (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cân nặng ban đầu (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú sức khỏe</label>
              <input
                type="text"
                placeholder="VD: Dị ứng thức ăn, cận thị..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </form>
    </SlideOver>
  );
};
