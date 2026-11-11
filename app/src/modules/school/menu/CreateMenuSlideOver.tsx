/**
 * Create Menu SlideOver Component (Right Sheet)
 * Design System: [DS] ECO ME DASHBOARD v2.6.0 (SlideOver SSOT)
 */

import React, { useState, useEffect } from 'react';
import { Icon, Dropdown, SlideOver } from '@/components/ds';
import { useAppDispatch } from '@/store';
import { createMenu } from '@/store/slices/menuSlice';
import {
  MenuContentType,
  MenuScopeType,
  WeekdayKey,
  DayMealSchedule,
} from '@/types/menu';
import {
  getWeekNumber,
  getWeekDates,
  formatMenuDateRange,
} from '@/utils/menuValidation';
import { MenuGridEditor } from './MenuGridEditor';
import { MenuFileUploadEditor } from './MenuFileUploadEditor';
import { PublishMenuModal } from './PublishMenuModal';

interface CreateMenuSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'grid' | 'file';
  initialTemplate?: string;
  schoolCode: string;
}

export const CreateMenuSlideOver: React.FC<CreateMenuSlideOverProps> = ({
  isOpen,
  onClose,
  initialMode = 'grid',
  initialTemplate,
}) => {
  const dispatch = useAppDispatch();

  // Current calendar week and 8-week horizon options (BR01)
  const currentWeekInfo = getWeekNumber();
  const weekOptions = Array.from({ length: 8 }, (_, i) => {
    const w = currentWeekInfo.weekNumber + i;
    const y = currentWeekInfo.year;
    const dates = getWeekDates(w, y);
    return {
      weekNumber: w,
      year: y,
      startDate: dates.startDate,
      endDate: dates.endDate,
      label: `Tuần ${w} (${formatMenuDateRange(dates.startDate, dates.endDate)})`,
    };
  });

  const [selectedWeek, setSelectedWeek] = useState(weekOptions[0]);
  const [scope, setScope] = useState<MenuScopeType>('all');
  const [classId, setClassId] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [contentType, setContentType] = useState<MenuContentType>(initialMode);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  // Grid schedule state
  const emptySchedule = (): Record<WeekdayKey, DayMealSchedule> => {
    const emptyDay = (): DayMealSchedule => ({ breakfast: [], lunch: [], snack: [] });
    return {
      monday: emptyDay(),
      tuesday: emptyDay(),
      wednesday: emptyDay(),
      thursday: emptyDay(),
      friday: emptyDay(),
      saturday: emptyDay(),
    };
  };

  const [schedule, setSchedule] = useState<Record<WeekdayKey, DayMealSchedule>>(emptySchedule());

  // File attachment state
  const [fileAttachment, setFileAttachment] = useState<{
    name: string;
    size: number;
    url: string;
    mimeType: string;
  } | undefined>(undefined);

  useEffect(() => {
    if (initialMode) {
      setContentType(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    if (initialTemplate === 'ai') {
      setSchedule({
        monday: {
          breakfast: [{ id: 'ai-1', name: 'Phở bò Hà Nội', calories: 380, ingredients: [] }],
          lunch: [
            { id: 'ai-2', name: 'Cơm tám thơm & Thịt heo kho cút', calories: 460, ingredients: [] },
            { id: 'ai-3', name: 'Canh rau ngót nấu thịt nạc', calories: 85, ingredients: [] },
            { id: 'ai-4', name: 'Dưa hấu tráng miệng', calories: 45, ingredients: [] },
          ],
          snack: [{ id: 'ai-5', name: 'Sữa chua men sống & Bánh quy hạt', calories: 120, ingredients: [] }],
        },
        tuesday: {
          breakfast: [{ id: 'ai-6', name: 'Bánh cuốn chả lụa', calories: 350, ingredients: [] }],
          lunch: [
            { id: 'ai-7', name: 'Cơm trắng & Gà ram sả ớt', calories: 480, ingredients: [] },
            { id: 'ai-8', name: 'Canh bí đao sườn non', calories: 95, ingredients: [] },
            { id: 'ai-9', name: 'Chuối già Nam Mỹ', calories: 60, ingredients: [] },
          ],
          snack: [{ id: 'ai-10', name: 'Chè đậu đỏ hạt sen', calories: 140, ingredients: [] }],
        },
        wednesday: emptySchedule().wednesday,
        thursday: emptySchedule().thursday,
        friday: emptySchedule().friday,
        saturday: emptySchedule().saturday,
      });
    }
  }, [initialTemplate]);

  const isFormValid = scope === 'all' || (scope === 'class' && classId.trim() !== '');

  const handleSaveDraft = () => {
    if (!isFormValid) return;
    const newMenu = {
      id: `menu-${Date.now()}`,
      weekNumber: selectedWeek.weekNumber,
      year: selectedWeek.year,
      startDate: selectedWeek.startDate,
      endDate: selectedWeek.endDate,
      title: `Thực đơn Tuần ${selectedWeek.weekNumber} (${formatMenuDateRange(selectedWeek.startDate, selectedWeek.endDate)})`,
      scope,
      classId: scope === 'class' ? classId : undefined,
      className: scope === 'class' ? className : undefined,
      status: 'ban_nhap' as const,
      contentType,
      schedule: contentType === 'grid' ? schedule : undefined,
      fileAttachment: contentType === 'file' ? fileAttachment : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recipientScope: scope === 'all' ? 'Toàn trường' : (className || 'Lớp học'),
      targetStudentCount: scope === 'all' ? 420 : 35,
    };

    dispatch(createMenu(newMenu as any));
    onClose();
  };

  const handleConfirmPublish = (viaAnnouncement: boolean) => {
    if (!isFormValid) return;
    const newMenu = {
      id: `menu-${Date.now()}`,
      weekNumber: selectedWeek.weekNumber,
      year: selectedWeek.year,
      startDate: selectedWeek.startDate,
      endDate: selectedWeek.endDate,
      title: `Thực đơn Tuần ${selectedWeek.weekNumber} (${formatMenuDateRange(selectedWeek.startDate, selectedWeek.endDate)})`,
      scope,
      classId: scope === 'class' ? classId : undefined,
      className: scope === 'class' ? className : undefined,
      status: 'published' as const,
      contentType,
      schedule: contentType === 'grid' ? schedule : undefined,
      fileAttachment: contentType === 'file' ? fileAttachment : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      recipientScope: scope === 'all' ? 'Toàn trường' : (className || 'Lớp học'),
      targetStudentCount: scope === 'all' ? 420 : 35,
      publishedViaAnnouncement: viaAnnouncement,
    };

    dispatch(createMenu(newMenu as any));
    setShowPublishModal(false);
    onClose();
  };

  const dummyMenuForPublishModal = {
    id: 'draft-temp',
    title: `Thực đơn Tuần ${selectedWeek.weekNumber}`,
    scope,
    className,
    recipientScope: scope === 'all' ? 'Toàn trường' : className,
    targetStudentCount: scope === 'all' ? 420 : 35,
  };

  const classOptions = [
    { value: '10A1', label: 'Lớp 10A1' },
    { value: '12A1', label: 'Lớp 12A1' },
    { value: 'MN-CHOI', label: 'Lớp Chồi 1 (Mầm non)' },
    { value: 'lop-1a1', label: 'Lớp 1A1 (Tiểu học)' },
  ];

  return (
    <>
      <SlideOver
        open={isOpen}
        onClose={onClose}
        title="Tạo mới thực đơn tuần"
        description="Soạn thực đơn trực tiếp theo lưới ngày/bữa hoặc tải lên file đính kèm"
        icon="utensils"
        width={760}
        primaryAction={{
          label: 'Công bố',
          onClick: () => setShowPublishModal(true),
          disabled: !isFormValid,
          icon: 'paper-plane',
        }}
        secondaryAction={{
          label: 'Lưu bản nháp',
          onClick: handleSaveDraft,
          disabled: !isFormValid,
        }}
      >
        <div className="space-y-6 text-left pb-6">
          {/* 1. Chọn tuần áp dụng */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Icon name="calendar-days" className="w-4 h-4 text-blue-600" />
              1. Thời gian áp dụng
            </h3>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Chọn tuần thực đơn (Tối đa 8 tuần tới)
              </label>
              <Dropdown
                value={String(selectedWeek.weekNumber)}
                onChange={(val) => {
                  const found = weekOptions.find((w) => String(w.weekNumber) === val);
                  if (found) setSelectedWeek(found);
                }}
                options={weekOptions.map((w) => ({ value: String(w.weekNumber), label: w.label }))}
                fullWidth
              />
            </div>
          </div>

          {/* 2. Phạm vi & Đối tượng */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Icon name="school" className="w-4 h-4 text-blue-600" />
              2. Phạm vi & Đối tượng áp dụng
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  scope === 'all'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Toàn trường
              </button>
              <button
                type="button"
                onClick={() => setScope('class')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  scope === 'class'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Lớp cụ thể
              </button>
            </div>

            {scope === 'class' && (
              <div className="pt-2">
                <Dropdown
                  placeholder="-- Chọn lớp học --"
                  value={classId}
                  onChange={(val, opt) => {
                    setClassId(val);
                    setClassName(opt?.label || val);
                  }}
                  options={classOptions}
                  fullWidth
                />
              </div>
            )}
          </div>

          {/* 3. Hình thức nội dung */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Icon name="utensils" className="w-4 h-4 text-blue-600" />
              3. Hình thức nhập nội dung
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setContentType('grid')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  contentType === 'grid'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Lưới món ăn (Soạn trực tiếp)
              </button>
              <button
                type="button"
                onClick={() => setContentType('file')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  contentType === 'file'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tải lên tệp (PDF, Excel, Ảnh)
              </button>
            </div>
          </div>

          {/* 4. Trình soạn thảo chi tiết */}
          {contentType === 'grid' ? (
            <MenuGridEditor schedule={schedule} onScheduleChange={setSchedule} />
          ) : (
            <MenuFileUploadEditor
              fileAttachment={fileAttachment}
              onFileChange={setFileAttachment}
            />
          )}
        </div>
      </SlideOver>

      {/* Modal xác nhận công bố */}
      <PublishMenuModal
        isOpen={showPublishModal}
        menu={dummyMenuForPublishModal as any}
        onClose={() => setShowPublishModal(false)}
        onConfirmPublish={handleConfirmPublish}
      />
    </>
  );
};

export default CreateMenuSlideOver;
