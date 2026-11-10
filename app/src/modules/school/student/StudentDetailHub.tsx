import React, { useState } from 'react';
import Link from 'next/link';
import { Icon, Dropdown, IconName, SlideOver } from '@/components/ds';
import { Student } from '../../../types/student';
import {
  formatLegacyField,
  formatBmiClassification,
  getBmiBadgeStyle,
  getStudentActiveDiscounts,
  ActiveStudentDiscountItem,
} from '../../../utils/studentValidation';
import { useAppDispatch, useAppSelector } from '../../../store';
import { AVAILABLE_FEE_ITEMS_FOR_DISCOUNT } from '../../../services/mockDiscountData';
import { updateDiscountPolicy, createDiscountPolicy } from '../../../store/slices/discountSlice';
import { updateTuitionOverride } from '../../../store/slices/studentSlice';
import { addToast } from '../../../store/slices/toastSlice';
import { StudentFeeSection } from './StudentFeeSection';
import { StudentMediaGalleryTab } from './StudentMediaGalleryTab';
import { StudentAttendanceTab } from './StudentAttendanceTab';
import { StudentTuitionTab } from './StudentTuitionTab';

interface StudentDetailHubProps {
  student: Student;
  schoolCode: string;
  onOpenTransfer: () => void;
  onOpenGrowth: () => void;
  onOpenNotes: () => void;
  onOpenTuition?: () => void;
}

type TabKey = 'profile' | 'media' | 'attendance' | 'finance';

export const StudentDetailHub: React.FC<StudentDetailHubProps> = ({
  student,
  schoolCode,
  onOpenTransfer,
  onOpenGrowth,
  onOpenNotes,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const dispatch = useAppDispatch();

  // Redux state for discounts
  const policies = useAppSelector((state) => state.discount?.policies || []);
  const { activeDiscounts } = getStudentActiveDiscounts(student, policies);

  // Modal editing & adding state
  const [editingItem, setEditingItem] = useState<ActiveStudentDiscountItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState('');
  const [editFeeItemId, setEditFeeItemId] = useState('fee-01');
  const [editDiscountType, setEditDiscountType] = useState<'percent' | 'fixed_amount'>('percent');
  const [editDiscountValue, setEditDiscountValue] = useState<number>(0);
  const [editValidityType, setEditValidityType] = useState<'academic_year' | 'month_range'>('academic_year');
  const [editReason, setEditReason] = useState('');

  // Add form states
  const [addName, setAddName] = useState('');
  const [addFeeItemId, setAddFeeItemId] = useState('fee-01');
  const [addDiscountType, setAddDiscountType] = useState<'percent' | 'fixed_amount'>('percent');
  const [addDiscountValue, setAddDiscountValue] = useState<number>(10);
  const [addReason, setAddReason] = useState('');

  // Group discounts by feeItemName to identify multiple policies on the same fee
  const feeMap = new Map<string, number>();
  activeDiscounts.forEach((d) => {
    feeMap.set(d.feeItemName, (feeMap.get(d.feeItemName) || 0) + 1);
  });
  const hasMultipleDiscountsForSameFee = Array.from(feeMap.values()).some((count) => count > 1);

  // Highest tuition discount item
  const tuitionItems = activeDiscounts.filter((d) =>
    d.feeItemName.toLowerCase().includes('học phí')
  );
  const highestTuitionItem =
    tuitionItems.length > 0
      ? tuitionItems.reduce((prev, curr) =>
          curr.discountValue > prev.discountValue ? curr : prev
        )
      : null;

  // Fee category badge color & icon mapper
  const getFeeBadgeStyle = (feeName: string): { bg: string; icon: IconName } => {
    const lower = feeName.toLowerCase();
    if (lower.includes('học phí')) {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: 'graduation-cap',
      };
    }
    if (lower.includes('ăn') || lower.includes('bán trú')) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: 'utensils',
      };
    }
    if (lower.includes('xe') || lower.includes('đưa đón')) {
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: 'compass',
      };
    }
    return {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'coins',
    };
  };

  const handleOpenEdit = (item: ActiveStudentDiscountItem) => {
    setEditingItem(item);
    setEditName(item.name);
    const matchedFee = AVAILABLE_FEE_ITEMS_FOR_DISCOUNT.find(
      (f) => f.name.toLowerCase() === item.feeItemName.toLowerCase()
    );
    setEditFeeItemId(matchedFee ? matchedFee.id : 'fee-01');
    setEditDiscountType(item.discountType);
    setEditDiscountValue(item.discountValue);
    setEditValidityType(item.validityText.includes('→') ? 'month_range' : 'academic_year');
    setEditReason(item.reason);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editName.trim()) {
      alert('Vui lòng nhập tên chương trình miễn giảm');
      return;
    }
    if (editDiscountValue <= 0) {
      alert('Mức miễn giảm phải lớn hơn 0');
      return;
    }

    const matchedPolicy = policies.find((p) => p.id === editingItem.id);
    if (matchedPolicy) {
      dispatch(
        updateDiscountPolicy({
          id: matchedPolicy.id,
          name: editName.trim(),
          discountType: editDiscountType,
          discountValue: Number(editDiscountValue),
          feeItemId: editFeeItemId,
          scopeType: matchedPolicy.scopeType,
          targetIds: matchedPolicy.targets.map((t) => t.targetId),
          validityType: editValidityType,
          academicYearId: matchedPolicy.academicYearId || 'ay-2026-2027',
          fromMonth: matchedPolicy.fromMonth,
          toMonth: matchedPolicy.toMonth,
          reason: editReason.trim(),
        })
      );
    } else if (editingItem.id.startsWith('override-')) {
      dispatch(
        updateTuitionOverride({
          studentId: student.id,
          tuitionDiscountPercent: editDiscountType === 'percent' ? Number(editDiscountValue) : undefined,
        })
      );
    }

    dispatch(
      addToast({
        type: 'success',
        title: 'Cập nhật thành công',
        message: `Đã cập nhật chính sách "${editName.trim()}"`,
      })
    );
    setEditingItem(null);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) {
      alert('Vui lòng nhập tên chương trình miễn giảm');
      return;
    }
    if (addDiscountValue <= 0) {
      alert('Mức miễn giảm phải lớn hơn 0');
      return;
    }

    dispatch(
      createDiscountPolicy({
        name: addName.trim(),
        discountType: addDiscountType,
        discountValue: Number(addDiscountValue),
        feeItemId: addFeeItemId,
        scopeType: 'student',
        targetIds: [student.id],
        validityType: 'academic_year',
        academicYearId: 'ay-2026-2027',
        reason: addReason.trim() || 'Chính sách ưu đãi cấp trường',
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Tạo chương trình thành công',
        message: `Đã áp dụng chương trình "${addName.trim()}" cho học sinh ${student.fullName}`,
      })
    );

    setIsAddModalOpen(false);
    setAddName('');
    setAddDiscountValue(10);
    setAddReason('');
  };

  const renderDiscountSection = () => (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base font-bold shadow-2xs">
            <Icon name="coins" size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800">
                Miễn giảm ({activeDiscounts.length})
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold ${
                  activeDiscounts.length > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {activeDiscounts.length > 0 ? 'Đang áp dụng' : 'Không có'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Danh sách các chương trình miễn giảm đang có hiệu lực đối với học sinh này (theo lớp hoặc cá nhân)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-xl transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Icon name="plus" size={12} />
          <span>Thêm miễn giảm</span>
        </button>
      </div>

      {activeDiscounts.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Icon name="coins" size={32} className="text-slate-300 mb-2 block mx-auto" />
          <span className="font-semibold text-slate-600 block text-sm">
            Học sinh hiện không áp dụng chương trình miễn giảm nào
          </span>
          <p className="text-2xs text-slate-400 mt-1 max-w-md mx-auto">
            Các chính sách học bổng theo lớp hoặc theo hồ sơ cá nhân khi được kích hoạt sẽ tự động hiển thị tại đây. Bấm nút "Thêm miễn giảm" để tạo mới.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-3.5 whitespace-nowrap">Mã & Tên chương trình</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Khoản thu áp dụng</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Mức miễn giảm</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Phạm vi</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Thời gian hiệu lực</th>
                  <th className="py-3 px-3.5">Lý do / Căn cứ</th>
                  <th className="py-3 px-3.5 text-right whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {activeDiscounts.map((item) => {
                  const feeBadge = getFeeBadgeStyle(item.feeItemName);
                  const isHighestForTuition =
                    highestTuitionItem &&
                    item.id === highestTuitionItem.id &&
                    tuitionItems.length > 1;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3.5">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5 flex-wrap">
                          <span>{item.name}</span>
                          {isHighestForTuition && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Áp dụng ưu tiên
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-2xs text-slate-400 mt-0.5">{item.code}</div>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-2xs font-semibold border ${feeBadge.bg}`}
                        >
                          <Icon name={feeBadge.icon} size={11} className="opacity-80" />
                          <span>{item.feeItemName}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 font-bold text-emerald-600 text-sm">
                        {item.discountDisplay}
                      </td>
                      <td className="py-3.5 px-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold ${
                            item.scopeType === 'student'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.scopeText}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-600 whitespace-nowrap">
                        {item.validityText}
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-600 max-w-[220px]" title={item.reason}>
                        <span className="line-clamp-2">{item.reason}</span>
                      </td>
                      <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#0070CE] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/60 shadow-2xs cursor-pointer"
                          title="Chỉnh sửa chương trình miễn giảm này"
                        >
                          <Icon name="pen" size={11} />
                          <span>Sửa</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {hasMultipleDiscountsForSameFee && highestTuitionItem && (
            <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
              <Icon name="circle-info" size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <span className="font-semibold block">Quy tắc tự động áp dụng khi lập hóa đơn:</span>
                <span className="text-amber-700 leading-relaxed block">
                  Học sinh đang thụ hưởng đồng thời {tuitionItems.length} chương trình cho cùng khoản thu ({tuitionItems[0].feeItemName}). Khi phát hành hóa đơn, hệ thống sẽ tự động ưu tiên mức cao nhất ({highestTuitionItem.name} - {highestTuitionItem.discountDisplay}), đồng thời cho phép kế toán viên chọn chương trình khác khi cần.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${schoolCode}/school/kid`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0070CE] transition-colors"
        >
          <Icon name="arrow-left" size={13} />
          <span>Danh sách học sinh</span>
        </Link>
      </div>

      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border-2 border-slate-200 shadow-xs">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-[#0070CE] font-black text-2xl">
                  {student.fullName.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{student.fullName}</h1>
                {student.nickName && (
                  <span className="text-sm font-medium text-slate-400">({student.nickName})</span>
                )}
                {student.status === 'active' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Đang học
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    Chưa xếp lớp
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>
                  Mã HS:{' '}
                  <strong className="text-slate-700">
                    {formatLegacyField(student.studentCode, 'Chưa có')}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Lớp:{' '}
                  <strong className="text-[#0070CE]">
                    {student.className || 'Chưa xếp lớp'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Ngày sinh: <strong className="text-slate-700">{student.dob}</strong>
                </span>
                <span>•</span>
                <span>
                  Giới tính:{' '}
                  <strong className="text-slate-700">
                    {student.gender === 'nam' ? 'Nam' : 'Nữ'}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={onOpenTransfer}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Icon name="rotate-right" size={13} className="text-slate-500" />
              <span>Chuyển lớp</span>
            </button>

            <button
              onClick={onOpenGrowth}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 cursor-pointer"
            >
              <Icon name="circle-info" size={13} />
              <span>Đo thể trạng</span>
            </button>

            <button
              onClick={onOpenNotes}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-yellow-800 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors border border-yellow-200 cursor-pointer"
            >
              <Icon name="clipboard-list" size={13} />
              <span>Ghi chú</span>
            </button>
          </div>
        </div>

        {/* 4-Tab Navigation Bar */}
        <div className="flex items-center gap-1 border-b border-slate-200 mt-6 pt-2 overflow-x-auto no-scrollbar">
          {[
            { key: 'profile', label: 'Hồ sơ học sinh', icon: 'user' as IconName },
            { key: 'media', label: 'Thư viện ảnh', icon: 'images' as IconName },
            { key: 'attendance', label: 'Điểm danh', icon: 'calendar-check' as IconName },
            { key: 'finance', label: 'Học phí', icon: 'receipt' as IconName },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors shrink-0 whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'border-[#0070CE] text-[#0070CE]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon name={tab.icon} size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Profile (Hồ Sơ) */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Basic Info + Growth History */}
            <div className="lg:col-span-2 space-y-6">
              {/* General Info Card */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                  Thông tin chung
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Họ và tên</span>
                    <span className="font-semibold text-slate-800">{student.fullName}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Mã học sinh</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {formatLegacyField(student.studentCode, 'Chưa có mã')}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Số định danh / CCCD</span>
                    <span className="font-mono text-slate-800">
                      {formatLegacyField(student.cccd, 'Chưa có CCCD')}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Ngày sinh</span>
                    <span className="text-slate-800">{student.dob}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Giới tính</span>
                    <span className="text-slate-800">
                      {student.gender === 'nam' ? 'Nam' : 'Nữ'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Ngày nhập học</span>
                    <span className="text-slate-800">{student.admissionDate}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Dân tộc</span>
                    <span className="text-slate-800">{student.ethnicity || 'Kinh'}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Tôn giáo</span>
                    <span className="text-slate-800">{student.religion || 'Không'}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Lớp chính khóa</span>
                    <span className="font-semibold text-[#0070CE]">
                      {student.className || 'Chưa xếp lớp'}
                    </span>
                  </div>
                </div>

                {student.address && (
                  <div className="pt-2">
                    <span className="text-xs text-slate-400 block font-medium">Địa chỉ thường trú</span>
                    <span className="text-sm text-slate-700">{student.address}</span>
                  </div>
                )}
              </div>

              {/* Growth History & BMI Card */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="circle-info" size={14} className="text-red-500" />
                    <h3 className="text-base font-bold text-slate-800">
                      Lịch sử phát triển thể chất & BMI
                    </h3>
                  </div>
                  <button
                    onClick={onOpenGrowth}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0070CE] hover:underline cursor-pointer"
                  >
                    <Icon name="plus" size={10} />
                    <span>Thêm lần đo</span>
                  </button>
                </div>

                {student.growthRecords.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Chưa có dữ liệu đo chiều cao / cân nặng. Nhấn "Thêm lần đo" để ghi nhận.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                          <th className="py-2.5 px-3">Ngày đo</th>
                          <th className="py-2.5 px-3">Chiều cao</th>
                          <th className="py-2.5 px-3">Cân nặng</th>
                          <th className="py-2.5 px-3">Chỉ số BMI</th>
                          <th className="py-2.5 px-3">Đánh giá</th>
                          <th className="py-2.5 px-3">Người đo</th>
                          <th className="py-2.5 px-3">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {student.growthRecords.map((gr) => {
                          const style = getBmiBadgeStyle(gr.bmiClassification);
                          return (
                            <tr key={gr.id} className="hover:bg-slate-50/60">
                              <td className="py-2.5 px-3 font-medium text-slate-900">
                                {gr.measuredAt}
                              </td>
                              <td className="py-2.5 px-3 font-semibold">{gr.heightCm} cm</td>
                              <td className="py-2.5 px-3 font-semibold">{gr.weightKg} kg</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{gr.bmi}</td>
                              <td className="py-2.5 px-3">
                                <span
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold"
                                  style={{ backgroundColor: style.bg, color: style.text }}
                                >
                                  {formatBmiClassification(gr.bmiClassification)}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500">{gr.measuredBy}</td>
                              <td className="py-2.5 px-3 text-slate-500 italic">
                                {gr.notes || '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right 1 Col: Guardians + Internal Notes */}
            <div className="space-y-6">
              {/* Guardians Card */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                  Người giám hộ ({student.guardians.length})
                </h3>

                <div className="space-y-3">
                  {student.guardians.map((guardian) => (
                    <div
                      key={guardian.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {guardian.fullName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-blue-100 text-blue-800">
                          {guardian.relationship === 'bo'
                            ? 'Bố'
                            : guardian.relationship === 'me'
                            ? 'Mẹ'
                            : guardian.relationship === 'ong'
                            ? 'Ông'
                            : guardian.relationship === 'ba'
                            ? 'Bà'
                            : 'Giám hộ'}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Icon name="phone" size={12} className="text-slate-400" />
                          <a
                            href={`tel:${guardian.phone}`}
                            className="hover:text-[#0070CE] font-medium"
                          >
                            {guardian.phone}
                          </a>
                        </div>
                        {guardian.email && (
                          <div className="flex items-center gap-2">
                            <Icon name="envelope" size={12} className="text-slate-400" />
                            <span className="truncate">{guardian.email}</span>
                          </div>
                        )}
                        {guardian.occupation && (
                          <div className="flex items-center gap-2">
                            <Icon name="id-badge" size={12} className="text-slate-400" />
                            <span>{guardian.occupation}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 text-2xs">
                        {guardian.isPrimaryPickup && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Icon name="circle-check" size={12} /> Đón chính
                          </span>
                        )}
                        {guardian.isEmergencyContact && (
                          <span className="text-red-700 font-semibold flex items-center gap-1">
                            <Icon name="circle-check" size={12} /> Liên hệ khẩn cấp
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes Card */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-800">Ghi chú nội bộ</h3>
                  <button
                    onClick={onOpenNotes}
                    className="text-xs font-semibold text-[#0070CE] hover:underline"
                  >
                    Chỉnh sửa
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {student.notes || 'Chưa có ghi chú nội bộ cho học sinh này.'}
                </p>
              </div>
            </div>
          </div>

          {/* Full-width Thông Tin Học Phí Section */}
          <StudentFeeSection student={student} schoolCode={schoolCode} />

          {/* Full-width Miễn Giảm Table Section */}
          {renderDiscountSection()}
        </div>
      )}

      {/* Tab 2: Media Gallery with AI Face Recognition Tagging */}
      {activeTab === 'media' && (
        <StudentMediaGalleryTab student={student} schoolCode={schoolCode} />
      )}

      {/* Tab 3: Attendance History & Daily Check-in / Check-out Ledger */}
      {activeTab === 'attendance' && (
        <StudentAttendanceTab student={student} schoolCode={schoolCode} />
      )}

      {/* Tab 4: Invoices & Tuition Database Records */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <StudentTuitionTab student={student} schoolCode={schoolCode} />
          {renderDiscountSection()}
        </div>
      )}

      {/* Edit Discount Policy SlideOver */}
      {editingItem && (
        <SlideOver
          open={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title="Chỉnh sửa chương trình miễn giảm"
          description={`Mã chương trình: ${editingItem.code} • Học sinh: ${student.fullName}`}
          icon="pen"
          width={520}
          primaryAction={{
            label: 'Lưu thay đổi',
            icon: 'check',
            onClick: () => {
              const form = document.getElementById('edit-discount-form') as HTMLFormElement;
              if (form) form.requestSubmit();
            },
          }}
          secondaryAction={{
            label: 'Hủy bỏ',
            onClick: () => setEditingItem(null),
          }}
        >
          <form id="edit-discount-form" onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên chương trình miễn giảm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0070CE] focus:ring-1 focus:ring-[#0070CE]"
                placeholder="Ví dụ: Học bổng tài năng học thuật 50%"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Khoản thu áp dụng <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  value={editFeeItemId}
                  onChange={(val) => setEditFeeItemId(val)}
                  options={AVAILABLE_FEE_ITEMS_FOR_DISCOUNT.map((fee) => ({
                    value: fee.id,
                    label: fee.name,
                  }))}
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Thời gian hiệu lực
                </label>
                <Dropdown
                  value={editValidityType}
                  onChange={(val) => setEditValidityType(val as any)}
                  options={[
                    { value: 'academic_year', label: 'Năm học 2026 - 2027' },
                    { value: 'month_range', label: 'Theo khoảng tháng' },
                  ]}
                  fullWidth
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hình thức giảm
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditDiscountType('percent')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      editDiscountType === 'percent'
                        ? 'bg-[#0070CE] text-white border-[#0070CE]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Phần trăm (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditDiscountType('fixed_amount')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      editDiscountType === 'fixed_amount'
                        ? 'bg-[#0070CE] text-white border-[#0070CE]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Số tiền (VNĐ)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mức miễn giảm ({editDiscountType === 'percent' ? '%' : 'VNĐ'}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={editDiscountType === 'percent' ? 100 : 100000000}
                  value={editDiscountValue}
                  onChange={(e) => setEditDiscountValue(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0070CE] font-bold text-emerald-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lý do / Căn cứ xét duyệt
              </label>
              <textarea
                rows={2}
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0070CE]"
                placeholder="Căn cứ quyết định khen thưởng hoặc hoàn cảnh..."
              />
            </div>
          </form>
        </SlideOver>
      )}

      {/* Add Discount Policy SlideOver */}
      {isAddModalOpen && (
        <SlideOver
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Thêm chính sách miễn giảm"
          description={`Áp dụng riêng cho học sinh: ${student.fullName} (${student.className || 'Hồ sơ'})`}
          icon="plus"
          width={520}
          primaryAction={{
            label: 'Tạo và Áp dụng',
            icon: 'check',
            onClick: () => {
              const form = document.getElementById('add-discount-form') as HTMLFormElement;
              if (form) form.requestSubmit();
            },
          }}
          secondaryAction={{
            label: 'Hủy bỏ',
            onClick: () => setIsAddModalOpen(false),
          }}
        >
          <form id="add-discount-form" onSubmit={handleSaveAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên chương trình miễn giảm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0070CE] focus:ring-1 focus:ring-[#0070CE]"
                placeholder="Ví dụ: Hỗ trợ tiền ăn bán trú 30%"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Khoản thu áp dụng <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={addFeeItemId}
                onChange={(val) => setAddFeeItemId(val)}
                options={AVAILABLE_FEE_ITEMS_FOR_DISCOUNT.map((fee) => ({
                  value: fee.id,
                  label: fee.name,
                }))}
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hình thức giảm
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddDiscountType('percent')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      addDiscountType === 'percent'
                        ? 'bg-[#0070CE] text-white border-[#0070CE]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Phần trăm (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddDiscountType('fixed_amount')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      addDiscountType === 'fixed_amount'
                        ? 'bg-[#0070CE] text-white border-[#0070CE]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Số tiền (VNĐ)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mức miễn giảm ({addDiscountType === 'percent' ? '%' : 'VNĐ'}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={addDiscountType === 'percent' ? 100 : 100000000}
                  value={addDiscountValue}
                  onChange={(e) => setAddDiscountValue(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0070CE] font-bold text-emerald-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lý do / Căn cứ xét duyệt
              </label>
              <textarea
                rows={2}
                value={addReason}
                onChange={(e) => setAddReason(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0070CE]"
                placeholder="Căn cứ quyết định khen thưởng hoặc hoàn cảnh..."
              />
            </div>
          </form>
        </SlideOver>
      )}
    </div>
  );
};
