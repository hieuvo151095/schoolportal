import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store/index.ts';
import { closeRubricModal, updateDevelopmentalRubric } from '../../../store/slices/gradebookSlice.ts';
import type { RubricRating } from '../../../types/gradebook.ts';
import { calculateEvaluationTally } from '../../../utils/gradebookValidation.ts';

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 54rem;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { transform: translateY(20px) scale(0.98); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  background: #f8fafc;
`;

const RatingButton = styled.button<{ $active: boolean; $ratingType: RubricRating }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  transition: all 0.15s ease;
  border: 1px solid;

  ${props => {
    if (!props.$active) {
      return `
        background-color: #f8fafc;
        color: #64748b;
        border-color: #e2e8f0;
        &:hover {
          background-color: #f1f5f9;
          color: #1e293b;
          border-color: #cbd5e1;
        }
      `;
    }
    switch (props.$ratingType) {
      case 'tot':
        return `
          background-color: #10b981;
          color: #ffffff;
          border-color: #059669;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        `;
      case 'dat':
        return `
          background-color: #0070CE;
          color: #ffffff;
          border-color: #005bb5;
          box-shadow: 0 2px 4px rgba(0, 112, 206, 0.3);
        `;
      case 'can_co_gang':
        return `
          background-color: #f59e0b;
          color: #ffffff;
          border-color: #d97706;
          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
        `;
    }
  }}
`;

const CORE_ITEMS = [
  { key: 'tu_chu_tu_hoc', label: 'Tự chủ và tự học' },
  { key: 'giao_tiep_hop_tac', label: 'Giao tiếp và hợp tác' },
  { key: 'giai_quyet_van_de', label: 'Giải quyết vấn đề và sáng tạo' }
];

const SPECIFIC_ITEMS = [
  { key: 'ngon_ngu', label: 'Ngôn ngữ' },
  { key: 'toan_hoc', label: 'Toán học' },
  { key: 'khoa_hoc', label: 'Khoa học' },
  { key: 'tham_my', label: 'Thẩm mỹ (Âm nhạc, Mỹ thuật)' },
  { key: 'the_chat', label: 'Thể chất' },
  { key: 'cong_nghe', label: 'Công nghệ' },
  { key: 'tin_hoc', label: 'Tin học' }
];

const QUALITY_ITEMS = [
  { key: 'yeu_nuoc', label: 'Yêu nước' },
  { key: 'nhan_ai', label: 'Nhân ái' },
  { key: 'cham_chi', label: 'Chăm chỉ' },
  { key: 'trung_thuc', label: 'Trung thực' },
  { key: 'trach_nhiem', label: 'Trách nhiệm' }
];

export const PeriodicEvaluationModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isRubricModalOpen, activeRubricStudentId, selectedClassId, selectedTermId, developmentalRubrics, classes } =
    useSelector((state: RootState) => state.gradebook);

  const rubricKey = `${selectedClassId}_${selectedTermId}`;
  const studentList = developmentalRubrics[rubricKey] || [];
  const currentStudent = studentList.find(s => s.studentId === activeRubricStudentId);
  const currentClass = classes.find(c => c.classId === selectedClassId);
  const currentTerm = currentClass?.terms.find(t => t.termId === selectedTermId);

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

  // Tallies strictly clamped (BR07)
  const coreTally = calculateEvaluationTally(coreRatings, 3);
  const specificTally = calculateEvaluationTally(specificRatings, 7);
  const qualityTally = calculateEvaluationTally(qualityRatings, 5);

  const handleRatingChange = (
    category: 'core' | 'specific' | 'quality',
    key: string,
    rating: RubricRating
  ) => {
    if (category === 'core') {
      setCoreRatings(prev => ({ ...prev, [key]: rating }));
    } else if (category === 'specific') {
      setSpecificRatings(prev => ({ ...prev, [key]: rating }));
    } else {
      setQualityRatings(prev => ({ ...prev, [key]: rating }));
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
        generalComment
      })
    );
    setSavedSuccess(true);
    setTimeout(() => {
      dispatch(closeRubricModal());
    }, 600);
  };

  return (
    <ModalBackdrop onClick={() => dispatch(closeRubricModal())}>
      <ModalCard onClick={e => e.stopPropagation()}>
        {/* Header */}
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
              {currentStudent.studentName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">
                  Phiếu Đánh Giá Học Tập: {currentStudent.studentName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {currentStudent.studentCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentClass?.className || 'Lớp'} &bull; {currentTerm?.termName || 'Học kỳ'} &bull; Đánh giá sự phát triển theo Thông tư 51/27
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeRubricModal())}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </ModalHeader>

        {/* Body */}
        <ModalBody>
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-info text-blue-600"></i> Quy ước mức đánh giá:
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
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-brain text-purple-600"></i> 1. Năng Lực Cốt Lõi
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                {coreTally.label}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {CORE_ITEMS.map(item => (
                <div key={item.key} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
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
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-shapes text-blue-600"></i> 2. Năng Lực Đặc Thù
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {specificTally.label}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {SPECIFIC_ITEMS.map(item => (
                <div key={item.key} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
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
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-heart text-rose-600"></i> 3. Phẩm Chất Chủ Yếu
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                {qualityTally.label}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {QUALITY_ITEMS.map(item => (
                <div key={item.key} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
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

          {/* Absence & Physical Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                <i className="fa-regular fa-calendar-xmark mr-1 text-slate-500"></i> Số ngày nghỉ trong học kỳ
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Nghỉ có phép (P)</span>
                  <input
                    type="number"
                    min={0}
                    value={excusedAbsence}
                    onChange={e => setExcusedAbsence(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Nghỉ không phép (KP)</span>
                  <input
                    type="number"
                    min={0}
                    value={unexcusedAbsence}
                    onChange={e => setUnexcusedAbsence(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <i className="fa-solid fa-stethoscope mr-1 text-emerald-600"></i> Tình trạng sức khỏe & thể lực
              </label>
              <span className="text-[11px] text-slate-500 block mb-1.5">Ghi nhận chiều cao, cân nặng, dinh dưỡng</span>
              <input
                type="text"
                value={healthStatus}
                onChange={e => setHealthStatus(e.target.value)}
                placeholder="VD: Bình thường, Chiều cao: 104cm, Cân nặng: 16kg"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* General homeroom teacher comment */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              <i className="fa-regular fa-comment-dots mr-1 text-blue-600"></i> Nhận xét chung của giáo viên chủ nhiệm
            </label>
            <textarea
              rows={3}
              value={generalComment}
              onChange={e => setGeneralComment(e.target.value)}
              placeholder="Nhập đánh giá tổng quát về sự tiến bộ, thái độ học tập và rèn luyện của học sinh..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>
        </ModalBody>

        {/* Footer */}
        <ModalFooter>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 mr-auto flex items-center gap-1 animate-pulse">
              <i className="fa-solid fa-check-circle"></i> Đã lưu đánh giá thành công!
            </span>
          )}
          <button
            type="button"
            onClick={() => dispatch(closeRubricModal())}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-[#0070CE] hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all flex items-center gap-1.5"
          >
            <i className="fa-solid fa-floppy-disk"></i> Lưu Đánh Giá
          </button>
        </ModalFooter>
      </ModalCard>
    </ModalBackdrop>
  );
};
