import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store/index';
import { closeRubricModal, updateDevelopmentalRubric } from '../../../store/slices/gradebookSlice';
import type { RubricRating } from '../../../types/gradebook';
import { calculateEvaluationTally } from '../../../utils/gradebookValidation';
import { SlideOver, Icon, Tag } from '@/components/ds';

const RatingButton = styled.button<{ $active?: boolean; $ratingType?: 'tot' | 'dat' | 'can_co_gang' }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  border: 1px solid;

  ${(p) => {
    if (!p.$active) {
      return `
        background: #ffffff;
        border-color: #e2e8f0;
        color: #64748b;
        &:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #334155;
        }
      `;
    }
    switch (p.$ratingType) {
      case 'tot':
        return `
          background: #10b981;
          border-color: #059669;
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.25);
        `;
      case 'dat':
        return `
          background: #0070CE;
          border-color: #005bb5;
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 112, 206, 0.25);
        `;
      case 'can_co_gang':
        return `
          background: #f59e0b;
          border-color: #d97706;
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.25);
        `;
      default:
        return '';
    }
  }}
`;

const CORE_ITEMS = [
  { key: 'tu_chu_tu_hoc', label: 'Tự chủ và tự học' },
  { key: 'giao_tiep_hop_tac', label: 'Giao tiếp và hợp tác' },
  { key: 'giai_quyet_van_de_sang_tao', label: 'Giải quyết vấn đề và sáng tạo' },
];

const SPECIFIC_ITEMS = [
  { key: 'ngon_ngu', label: 'Năng lực Ngôn ngữ' },
  { key: 'tinh_toan', label: 'Năng lực Tính toán' },
  { key: 'khoa_hoc', label: 'Năng lực Khoa học' },
  { key: 'cong_nghe', label: 'Năng lực Công nghệ' },
  { key: 'tin_hoc', label: 'Năng lực Tin học' },
  { key: 'tham_my', label: 'Năng lực Thẩm mỹ' },
  { key: 'the_chat', label: 'Năng lực Thể chất' },
];

const QUALITY_ITEMS = [
  { key: 'yeu_nuoc', label: 'Yêu nước' },
  { key: 'nhan_ai', label: 'Nhân ái' },
  { key: 'cham_chi', label: 'Chăm chỉ' },
  { key: 'trung_thuc', label: 'Trung thực' },
  { key: 'trach_nhiem', label: 'Trách nhiệm' },
];

export const PeriodicEvaluationModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isRubricModalOpen, activeRubricStudentId, selectedClassId, selectedTermId, developmentalRubrics, classes } =
    useSelector((state: RootState) => state.gradebook);

  const rubricKey = `${selectedClassId}_${selectedTermId}`;
  const studentList = developmentalRubrics[rubricKey] || [];
  const currentStudent = studentList.find((s) => s.studentId === activeRubricStudentId);
  const currentClass = classes.find((c) => c.classId === selectedClassId);
  const currentTerm = currentClass?.terms.find((t) => t.termId === selectedTermId);

  // Local editable draft state
  const [coreRatings, setCoreRatings] = useState<Record<string, RubricRating>>({});
  const [specificRatings, setSpecificRatings] = useState<Record<string, RubricRating>>({});
  const [qualityRatings, setQualityRatings] = useState<Record<string, RubricRating>>({});
  const [excusedAbsence, setExcusedAbsence] = useState<number>(0);
  const [unexcusedAbsence, setUnexcusedAbsence] = useState<number>(0);
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [generalComment, setGeneralComment] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (currentStudent) {
      setCoreRatings({ ...currentStudent.coreCompetencies });
      setSpecificRatings({ ...currentStudent.specificCompetencies });
      setQualityRatings({ ...currentStudent.primaryQualities });
      setExcusedAbsence(currentStudent.excusedAbsence || 0);
      setUnexcusedAbsence(currentStudent.unexcusedAbsence || 0);
      setHealthStatus(currentStudent.healthStatus || '');
      setGeneralComment(currentStudent.generalComment || '');
      setSavedSuccess(false);
    }
  }, [currentStudent, activeRubricStudentId]);

  if (!isRubricModalOpen || !currentStudent) return null;

  const coreTally = calculateEvaluationTally(coreRatings, 3);
  const specificTally = calculateEvaluationTally(specificRatings, 7);
  const qualityTally = calculateEvaluationTally(qualityRatings, 5);

  const handleRatingChange = (
    category: 'core' | 'specific' | 'quality',
    key: string,
    rating: RubricRating
  ) => {
    if (category === 'core') {
      setCoreRatings((prev) => ({ ...prev, [key]: rating }));
    } else if (category === 'specific') {
      setSpecificRatings((prev) => ({ ...prev, [key]: rating }));
    } else {
      setQualityRatings((prev) => ({ ...prev, [key]: rating }));
    }
  };

  const handleSave = () => {
    dispatch(
      updateDevelopmentalRubric({
        classId: selectedClassId,
        termId: selectedTermId,
        studentId: currentStudent.studentId,
        coreCompetencies: coreRatings,
        specificCompetencies: specificRatings,
        primaryQualities: qualityRatings,
        excusedAbsence,
        unexcusedAbsence,
        healthStatus,
        generalComment,
      })
    );
    setSavedSuccess(true);
    setTimeout(() => {
      dispatch(closeRubricModal());
    }, 600);
  };

  const handleClose = () => {
    dispatch(closeRubricModal());
  };

  return (
    <SlideOver
      open={isRubricModalOpen}
      onClose={handleClose}
      title={`Phiếu Đánh Giá: ${currentStudent.studentName}`}
      description={`${currentClass?.className || 'Lớp'} • ${currentTerm?.termName || 'Học kỳ'} • Theo chuẩn Thông tư Bộ GD&ĐT`}
      icon="award"
      width={640}
      primaryAction={{
        label: savedSuccess ? '✓ Đã lưu thành công' : 'Lưu phiếu đánh giá',
        icon: 'check',
        onClick: handleSave,
      }}
      secondaryAction={{
        label: 'Đóng',
        onClick: handleClose,
      }}
    >
      <div className="space-y-4">
        {/* Rating Convention Legend */}
        <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-slate-50 border border-[var(--border-default)] text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Icon name="circle-info" size={14} className="text-[var(--eco-blue-strong)]" /> Quy ước mức đánh giá:
          </span>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
              <span className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px]">T</span>
              Tốt
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-blue-700">
              <span className="w-5 h-5 rounded bg-[#0070CE] text-white flex items-center justify-center font-bold text-[11px]">Đ</span>
              Đạt
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-amber-700">
              <span className="w-5 h-5 rounded bg-amber-500 text-white flex items-center justify-center font-bold text-[11px]">C</span>
              Cần cố gắng
            </span>
          </div>
        </div>

        {/* Section 1: Năng lực cốt lõi */}
        <div className="border border-[var(--border-default)] rounded-xl overflow-hidden bg-white">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-[var(--border-default)] flex items-center justify-between">
            <span className="font-bold text-xs text-[var(--text-heading)]">
              1. Năng Lực Cốt Lõi
            </span>
            <Tag variant="default">{coreTally.label}</Tag>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {CORE_ITEMS.map((item) => (
              <div key={item.key} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                <span className="text-xs font-medium text-[var(--text-body)]">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <RatingButton
                    type="button"
                    $active={coreRatings[item.key] === 'tot'}
                    $ratingType="tot"
                    onClick={() => handleRatingChange('core', item.key, 'tot')}
                    title="Tốt"
                  >
                    T
                  </RatingButton>
                  <RatingButton
                    type="button"
                    $active={coreRatings[item.key] === 'dat'}
                    $ratingType="dat"
                    onClick={() => handleRatingChange('core', item.key, 'dat')}
                    title="Đạt"
                  >
                    Đ
                  </RatingButton>
                  <RatingButton
                    type="button"
                    $active={coreRatings[item.key] === 'can_co_gang'}
                    $ratingType="can_co_gang"
                    onClick={() => handleRatingChange('core', item.key, 'can_co_gang')}
                    title="Cần cố gắng"
                  >
                    C
                  </RatingButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Năng lực đặc thù */}
        <div className="border border-[var(--border-default)] rounded-xl overflow-hidden bg-white">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-[var(--border-default)] flex items-center justify-between">
            <span className="font-bold text-xs text-[var(--text-heading)]">
              2. Năng Lực Đặc Thù
            </span>
            <Tag variant="default">{specificTally.label}</Tag>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {SPECIFIC_ITEMS.map((item) => (
              <div key={item.key} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                <span className="text-xs font-medium text-[var(--text-body)]">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <RatingButton
                    type="button"
                    $active={specificRatings[item.key] === 'tot'}
                    $ratingType="tot"
                    onClick={() => handleRatingChange('specific', item.key, 'tot')}
                    title="Tốt"
                  >
                    T
                  </RatingButton>
                  <RatingButton
                    type="button"
                    $active={specificRatings[item.key] === 'dat'}
                    $ratingType="dat"
                    onClick={() => handleRatingChange('specific', item.key, 'dat')}
                    title="Đạt"
                  >
                    Đ
                  </RatingButton>
                  <RatingButton
                    type="button"
                    $active={specificRatings[item.key] === 'can_co_gang'}
                    $ratingType="can_co_gang"
                    onClick={() => handleRatingChange('specific', item.key, 'can_co_gang')}
                    title="Cần cố gắng"
                  >
                    C
                  </RatingButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Phẩm chất chủ yếu */}
        <div className="border border-[var(--border-default)] rounded-xl overflow-hidden bg-white">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-[var(--border-default)] flex items-center justify-between">
            <span className="font-bold text-xs text-[var(--text-heading)]">
              3. Phẩm Chất Chủ Yếu
            </span>
            <Tag variant="default">{qualityTally.label}</Tag>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {QUALITY_ITEMS.map((item) => (
              <div key={item.key} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                <span className="text-xs font-medium text-[var(--text-body)]">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <RatingButton
                    type="button"
                    $active={qualityRatings[item.key] === 'tot'}
                    $ratingType="tot"
                    onClick={() => handleRatingChange('quality', item.key, 'tot')}
                    title="Tốt"
                  >
                    T
                  </RatingButton>
                  <RatingButton
                    type="button"
                    $active={qualityRatings[item.key] === 'dat'}
                    $ratingType="dat"
                    onClick={() => handleRatingChange('quality', item.key, 'dat')}
                    title="Đạt"
                  >
                    Đ
                  </RatingButton>
                  <RatingButton
                    type="button"
                    $active={qualityRatings[item.key] === 'can_co_gang'}
                    $ratingType="can_co_gang"
                    onClick={() => handleRatingChange('quality', item.key, 'can_co_gang')}
                    title="Cần cố gắng"
                  >
                    C
                  </RatingButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Chuyên cần & Sức khỏe */}
        <div className="border border-[var(--border-default)] rounded-xl p-4 bg-white space-y-3">
          <span className="font-bold text-xs text-[var(--text-heading)] block">
            4. Chuyên Cần &amp; Sức Khỏe
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
                Số ngày nghỉ có phép
              </label>
              <input
                type="number"
                min="0"
                className="w-full h-9 px-3 border border-[var(--border-default)] rounded-lg text-xs bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
                value={excusedAbsence}
                onChange={(e) => setExcusedAbsence(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
                Số ngày nghỉ không phép
              </label>
              <input
                type="number"
                min="0"
                className="w-full h-9 px-3 border border-[var(--border-default)] rounded-lg text-xs bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
                value={unexcusedAbsence}
                onChange={(e) => setUnexcusedAbsence(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
              Tình trạng sức khỏe &amp; Thể chất
            </label>
            <input
              type="text"
              placeholder="VD: Bình thường, phát triển thể lực tốt..."
              className="w-full h-9 px-3 border border-[var(--border-default)] rounded-lg text-xs bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
              value={healthStatus}
              onChange={(e) => setHealthStatus(e.target.value)}
            />
          </div>
        </div>

        {/* Section 5: Nhận xét chung */}
        <div className="border border-[var(--border-default)] rounded-xl p-4 bg-white space-y-2">
          <span className="font-bold text-xs text-[var(--text-heading)] block">
            5. Lời Nhận Xét Của Giáo Viên Chủ Nhiệm
          </span>
          <textarea
            rows={3}
            placeholder="Nhận xét tổng quát về sự tiến bộ, điểm mạnh và điểm cần rèn luyện thêm của học sinh..."
            className="w-full p-2.5 border border-[var(--border-default)] rounded-lg text-xs bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
            value={generalComment}
            onChange={(e) => setGeneralComment(e.target.value)}
          />
        </div>
      </div>
    </SlideOver>
  );
};

export default PeriodicEvaluationModal;
