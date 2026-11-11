import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faBuilding,
  faCalendarAlt,
  faEnvelope,
  faSlidersH,
  faPlus,
  faTrash,
  faInfoCircle,
  faCheckCircle,
  faExclamationCircle,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  closeSchoolGroupModal,
  updateActiveGroupDraft,
  updateActiveGroupScheduleType,
  generateActiveGroupTerms,
  removeActiveGroupTerm,
  saveActiveGroup
} from '@/store/slices/settingFeeSlice';
import { addToast } from '@/store/slices/toastSlice';
import { validateEmailCandidate } from '@/utils/settingFeeValidation';
import type { ReconciliationScheduleType, ReconciliationUnit } from '@/types/settingFee';
import { SlideOver } from '@/components/ds';

export const SchoolGroupReconciliationModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.settingFee.isGroupModalOpen);
  const activeDraft = useAppSelector(
    (state) => state.settingFee.draft.activeGroupDraft
  );

  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  if (!isOpen || !activeDraft) return null;

  const handleClose = () => {
    dispatch(closeSchoolGroupModal());
  };

  const handleUnitChange = (unit: ReconciliationUnit) => {
    dispatch(updateActiveGroupDraft({ reconciliationUnit: unit }));
  };

  const handleScheduleTypeChange = (type: ReconciliationScheduleType) => {
    dispatch(updateActiveGroupScheduleType(type));
  };

  const handleAddEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailInput.trim()) return;

    const currentEmails = activeDraft.emails || [];
    const validation = validateEmailCandidate(emailInput, currentEmails);
    if (!validation.isValid) {
      setEmailError(validation.error || 'Email không hợp lệ');
      return;
    }

    setEmailError(null);
    dispatch(
      updateActiveGroupDraft({
        emails: [...currentEmails, emailInput.trim()]
      })
    );
    setEmailInput('');
  };

  const handleRemoveEmail = (index: number) => {
    const currentEmails = activeDraft.emails || [];
    const nextEmails = currentEmails.filter((_, i) => i !== index);
    dispatch(updateActiveGroupDraft({ emails: nextEmails }));
    setEmailError(null);
  };

  const handleGenerateTerms = () => {
    if (activeDraft.scheduleType === 'year') {
      return; // Not applicable for year
    }
    dispatch(generateActiveGroupTerms());
  };

  const handleSave = () => {
    dispatch(saveActiveGroup());
    dispatch(
      addToast({
        type: 'success',
        message: `Đã cập nhật cấu hình đối soát nhóm trường: ${activeDraft.groupName}!`
      })
    );
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={handleClose}
      title={`Cập nhật nhóm trường: ${activeDraft.groupCode}`}
      description="Thiết lập thông tin pháp nhân, đơn vị đối soát, lịch kỳ và ngưỡng thu phí"
      icon="building"
      width={720}
      primaryAction={{
        label: 'Lưu',
        icon: 'check',
        onClick: handleSave,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-6 py-2">
          {/* Section 2: Đơn vị đối soát */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#0070CE] text-white flex items-center justify-center text-[11px] font-bold">
                2
              </span>
              <span>Đơn vị đối soát</span>
            </div>

            {/* Radio Topologies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => handleUnitChange('group')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeDraft.reconciliationUnit === 'group'
                    ? 'border-[#0070CE] bg-blue-50/40 ring-1 ring-[#0070CE]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Theo nhóm trường
                  </span>
                  <input
                    type="radio"
                    checked={activeDraft.reconciliationUnit === 'group'}
                    onChange={() => handleUnitChange('group')}
                    className="text-[#0070CE] focus:ring-[#0070CE]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Tạo phiên gộp cả nhóm: thành một cổng, sinh một biên bản đối soát duy nhất cho cả pháp nhân (BR02).
                </p>
              </div>

              <div
                onClick={() => handleUnitChange('school')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeDraft.reconciliationUnit === 'school'
                    ? 'border-[#0070CE] bg-blue-50/40 ring-1 ring-[#0070CE]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Theo từng trường
                  </span>
                  <input
                    type="radio"
                    checked={activeDraft.reconciliationUnit === 'school'}
                    onChange={() => handleUnitChange('school')}
                    className="text-[#0070CE] focus:ring-[#0070CE]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Mỗi chi nhánh được tạo thành một phiên đối soát và biên bản riêng biệt (BR02).
                </p>
              </div>
            </div>

            {/* Email Recipients */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Email nhận biên bản của nhóm (Tối đa 3 email) <span className="text-red-500">*</span>
              </label>
              <form onSubmit={handleAddEmail} className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  disabled={activeDraft.emails.length >= 3}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder={
                    activeDraft.emails.length >= 3
                      ? 'Đã đủ tối đa 3 email'
                      : 'Nhập email nhận biên bản (VD: ketoan@school.edu.vn)...'
                  }
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] disabled:bg-slate-100 disabled:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={activeDraft.emails.length >= 3 || !emailInput.trim()}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005bb5] disabled:bg-slate-200 disabled:text-slate-400 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                  <span>Thêm</span>
                </button>
              </form>
              {emailError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                  <span>{emailError}</span>
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {activeDraft.emails.map((email, idx) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 text-slate-500" />
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(idx)}
                      className="text-slate-400 hover:text-red-500 ml-1"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Phân tách các email bằng dấu phẩy hoặc chấm phẩy (BR03).
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Lịch kỳ đối soát & Năm sử dụng dịch vụ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#0070CE] text-white flex items-center justify-center text-[11px] font-bold">
                3
              </span>
              <span>Lịch kỳ đối soát & Năm sử dụng dịch vụ</span>
            </div>

            {/* Schedule Type Radios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => handleScheduleTypeChange('year')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeDraft.scheduleType === 'year'
                    ? 'border-[#0070CE] bg-blue-50/40 ring-1 ring-[#0070CE]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    1. Đối soát theo năm
                  </span>
                  <input
                    type="radio"
                    checked={activeDraft.scheduleType === 'year'}
                    onChange={() => handleScheduleTypeChange('year')}
                    className="text-[#0070CE] focus:ring-[#0070CE]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Cấu hình năm học/năm dịch vụ trọn gói (cố định 1 kỳ)
                </p>
              </div>

              <div
                onClick={() => handleScheduleTypeChange('term')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeDraft.scheduleType === 'term'
                    ? 'border-[#0070CE] bg-blue-50/40 ring-1 ring-[#0070CE]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    2. Đối soát theo kỳ
                  </span>
                  <input
                    type="radio"
                    checked={activeDraft.scheduleType === 'term'}
                    onChange={() => handleScheduleTypeChange('term')}
                    className="text-[#0070CE] focus:ring-[#0070CE]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Cấu hình theo từng kỳ/học kỳ riêng biệt
                </p>
              </div>
            </div>

            {/* Date Inputs & Term Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Từ ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={activeDraft.serviceStartDate}
                  onChange={(e) =>
                    dispatch(
                      updateActiveGroupDraft({
                        serviceStartDate: e.target.value
                      })
                    )
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đến ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={activeDraft.serviceEndDate}
                  onChange={(e) =>
                    dispatch(
                      updateActiveGroupDraft({
                        serviceEndDate: e.target.value
                      })
                    )
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số kỳ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    disabled={activeDraft.scheduleType === 'year'}
                    value={activeDraft.termCount}
                    onChange={(e) =>
                      dispatch(
                        updateActiveGroupDraft({
                          termCount: parseInt(e.target.value) || 1
                        })
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
                {activeDraft.scheduleType === 'term' && (
                  <button
                    type="button"
                    onClick={handleGenerateTerms}
                    className="self-end px-3 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005bb5] rounded-lg transition-colors shrink-0"
                  >
                    Sinh lịch kỳ
                  </button>
                )}
              </div>
            </div>

            {/* CRITICAL: WHEN SCHEDULE TYPE IS 'YEAR', DO NOT RENDER THE RED FRAME SUB-PERIODS TABLE! */}
            {activeDraft.scheduleType === 'year' ? (
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs text-blue-900">
                <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-[#0070CE] shrink-0" />
                <span>
                  <strong>Chế độ đối soát theo năm:</strong> Áp dụng chu kỳ năm học trọn gói (cố định 1 kỳ duy nhất từ {activeDraft.serviceStartDate} đến {activeDraft.serviceEndDate}). Không phát sinh danh sách phân chia kỳ con.
                </span>
              </div>
            ) : (
              /* Sub-periods Table (Rendered only for scheduleType === 'term') */
              <div className="space-y-2 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Danh sách phân kỳ đối soát ({activeDraft.terms.length} kỳ)
                  </span>
                </div>
                {activeDraft.terms.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 italic">
                    Chưa sinh lịch kỳ. Vui lòng chọn số kỳ và nhấn "Sinh lịch kỳ".
                  </div>
                ) : (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Tên kỳ</th>
                        <th className="px-3 py-2">Từ ngày</th>
                        <th className="px-3 py-2">Đến ngày</th>
                        <th className="px-3 py-2 text-center">Thu phí (BR05)</th>
                        <th className="px-3 py-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeDraft.terms.map((term) => (
                        <tr key={term.id} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={term.termName}
                              onChange={(e) => {
                                const nextTerms = activeDraft.terms.map((t) =>
                                  t.id === term.id ? { ...t, termName: e.target.value } : t
                                );
                                dispatch(updateActiveGroupDraft({ terms: nextTerms }));
                              }}
                              className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="date"
                              value={term.startDate}
                              onChange={(e) => {
                                const nextTerms = activeDraft.terms.map((t) =>
                                  t.id === term.id ? { ...t, startDate: e.target.value } : t
                                );
                                dispatch(updateActiveGroupDraft({ terms: nextTerms }));
                              }}
                              className="px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="date"
                              value={term.endDate}
                              onChange={(e) => {
                                const nextTerms = activeDraft.terms.map((t) =>
                                  t.id === term.id ? { ...t, endDate: e.target.value } : t
                                );
                                dispatch(updateActiveGroupDraft({ terms: nextTerms }));
                              }}
                              className="px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={term.isChargeable}
                              onChange={(e) => {
                                const nextTerms = activeDraft.terms.map((t) =>
                                  t.id === term.id ? { ...t, isChargeable: e.target.checked } : t
                                );
                                dispatch(updateActiveGroupDraft({ terms: nextTerms }));
                              }}
                              className="rounded text-[#0070CE] focus:ring-[#0070CE]"
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => dispatch(removeActiveGroupTerm(term.id))}
                              className="text-xs text-red-500 hover:text-red-700 font-medium"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Section 4: Ngưỡng thu phí (BR06 & BR07) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#0070CE] text-white flex items-center justify-center text-[11px] font-bold">
                4
              </span>
              <span>Ngưỡng thu phí (BR06 & BR07)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Ngưỡng thu (tháng) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={activeDraft.threshold.minActiveMonths}
                    onChange={(e) =>
                      dispatch(
                        updateActiveGroupDraft({
                          threshold: {
                            ...activeDraft.threshold,
                            minActiveMonths: parseInt(e.target.value) || 1
                          }
                        })
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">tháng</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Số tháng active tối thiểu để tính phí trong kỳ (BR06)
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Ngày dư làm tròn lên 1 tháng (lần đầu) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={activeDraft.threshold.roundingDaysThreshold}
                    onChange={(e) =>
                      dispatch(
                        updateActiveGroupDraft({
                          threshold: {
                            ...activeDraft.threshold,
                            roundingDaysThreshold: parseInt(e.target.value) || 15
                          }
                        })
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">ngày</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Quy đổi số ngày dư thành 1 tháng (ví dụ: &ge; 15 ngày tính tròn 1 tháng - BR07)
                </p>
              </div>
            </div>
          </div>
        </div>
    </SlideOver>
  );
};
