import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Icon, Dropdown, SlideOver } from '../../../../components/ds';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { useAppDispatch } from '../../../../store';
import { createMenu } from '../../../../store/slices/menuSlice';
import {
  MenuContentType,
  MenuScopeType,
  WeekdayKey,
  DayMealSchedule,
} from '../../../../types/menu';
import {
  getWeekNumber,
  getWeekDates,
  formatMenuDateRange,
} from '../../../../utils/menuValidation';
import { MenuGridEditor } from '../../../../modules/school/menu/MenuGridEditor';
import { MenuFileUploadEditor } from '../../../../modules/school/menu/MenuFileUploadEditor';
import { PublishMenuModal } from '../../../../modules/school/menu/PublishMenuModal';

export default function CreateSchoolMenuPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
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
  const [contentType, setContentType] = useState<MenuContentType>('grid');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);
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

  // Check URL query parameters
  useEffect(() => {
    if (router.query.mode === 'file') {
      setContentType('file');
    }
    if (router.query.template === 'ai') {
      // Preload sample balanced meals
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
      setIsDirty(true);
    }
  }, [router.query]);

  // Validation
  const isFormValid = scope === 'all' || (scope === 'class' && classId.trim() !== '');

  // Handlers
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
    setIsDirty(false);
    router.push(`/${schoolCode}/school/menu`);
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
    setIsDirty(false);
    setShowPublishModal(false);
    router.push(`/${schoolCode}/school/menu`);
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      router.push(`/${schoolCode}/school/menu`);
    }
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
    <PortalLayout>
      <Head>
        <title>Tạo mới thực đơn tuần | ECO School Portal</title>
      </Head>

      <div className="space-y-6 pb-20">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href={`/${schoolCode}/school/menu`} className="hover:text-blue-600 transition-colors">
              Quản lý thực đơn
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-800">Tạo mới thực đơn</span>
          </div>

          <button
            type="button"
            onClick={handleCancelClick}
            className="text-xs text-gray-500 hover:text-gray-800 font-medium inline-flex items-center gap-1.5"
          >
            <Icon name="arrow-left" className="w-3.5 h-3.5" />
            Quay lại danh sách
          </button>
        </div>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tạo mới thực đơn tuần</h1>
            <p className="text-xs text-gray-500 mt-1">
              Soạn thực đơn trực tiếp theo lưới ngày/bữa hoặc tải lên file đính kèm
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={!isFormValid}
              className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-2xs inline-flex items-center gap-1.5 transition-colors border ${
                !isFormValid
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon name="floppy-disk" className="w-3.5 h-3.5 text-gray-500" />
              Lưu bản nháp
            </button>
            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              disabled={!isFormValid}
              className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-sm inline-flex items-center gap-1.5 transition-all ${
                !isFormValid
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                  : 'text-white bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              <Icon name="paper-plane" className="w-3.5 h-3.5" />
              Gửi / Xuất bản
            </button>
          </div>
        </div>

        {/* Scope, Horizon, and Content Type Form Settings Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Chọn tuần áp dụng (BR01 - Max 8 weeks) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Icon name="calendar-week" className="w-3.5 h-3.5 text-blue-600" />
                Tuần áp dụng (Tối đa 8 tuần)
              </label>
              <Dropdown
                value={String(selectedWeek.weekNumber)}
                onChange={(val) => {
                  const opt = weekOptions.find((w) => w.weekNumber === Number(val));
                  if (opt) {
                    setSelectedWeek(opt);
                    setIsDirty(true);
                  }
                }}
                options={weekOptions.map((w) => ({
                  value: String(w.weekNumber),
                  label: w.label,
                }))}
                fullWidth
              />
            </div>

            {/* 2. Thực đơn cho (Toàn trường vs Lớp học) (BR02) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Icon name="school" className="w-3.5 h-3.5 text-blue-600" />
                Phạm vi áp dụng
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setScope('all');
                    setIsDirty(true);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    scope === 'all'
                      ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Toàn trường
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScope('class');
                    setIsDirty(true);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    scope === 'class'
                      ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Lớp cụ thể
                </button>
              </div>

              {scope === 'class' && (
                <div className="mt-2 animate-in fade-in">
                  <Dropdown
                    placeholder="-- Chọn lớp học --"
                    value={classId}
                    onChange={(val, opt) => {
                      setClassId(val);
                      setClassName(opt?.label || val);
                      setIsDirty(true);
                    }}
                    options={classOptions}
                    fullWidth
                  />
                </div>
              )}
            </div>

            {/* 3. Toggle "Sử dụng file" (BR04) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Hình thức nội dung (Sử dụng file)
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setContentType('grid');
                    setIsDirty(true);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border text-center inline-flex items-center justify-center gap-1.5 transition-all ${
                    contentType === 'grid'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon name="table-cells" className="w-3.5 h-3.5" />
                  Dạng lưới
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setContentType('file');
                    setIsDirty(true);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border text-center inline-flex items-center justify-center gap-1.5 transition-all ${
                    contentType === 'file'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-800 font-semibold'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon name="file" className="w-3.5 h-3.5" />
                  Sử dụng file (Tải lên)
                </button>
              </div>
            </div>
          </div>

          {/* Mandatory Business Rule Note (BR02) */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-900 flex items-center gap-2">
            <Icon name="circle-info" className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Lưu ý nghiệp vụ:</strong> Toàn trường chỉ có thể có 1 thực đơn / tuần. Lớp không
              có thực đơn riêng sẽ tự động dùng thực đơn toàn trường.
            </span>
          </div>
        </div>

        {/* Content Mode Editor (Grid vs File) */}
        {contentType === 'grid' ? (
          <MenuGridEditor
            schedule={schedule}
            onScheduleChange={(newSchedule) => {
              setSchedule(newSchedule);
              setIsDirty(true);
            }}
            startDate={selectedWeek?.startDate}
          />
        ) : (
          <MenuFileUploadEditor
            fileAttachment={fileAttachment}
            onFileChange={(f) => {
              setFileAttachment(f);
              setIsDirty(true);
            }}
          />
        )}

        {/* Discard Warning SlideOver (BR10, TD-04) */}
        <SlideOver
          open={showDiscardModal}
          onClose={() => setShowDiscardModal(false)}
          title="Xác nhận rời khỏi trang"
          description="Cảnh báo khi có thay đổi chưa được lưu"
          icon="triangle-exclamation"
          width={460}
          primaryAction={{
            label: 'Xác nhận rời đi',
            icon: 'arrow-right-from-bracket',
            tone: 'danger',
            onClick: () => {
              setShowDiscardModal(false);
              router.push(`/${schoolCode}/school/menu`);
            },
          }}
          secondaryAction={{
            label: 'Ở lại chỉnh sửa',
            onClick: () => setShowDiscardModal(false),
          }}
        >
          <div className="space-y-4 py-2">
            <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <Icon name="triangle-exclamation" size={14} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Các thông tin thực đơn đang soạn thảo sẽ bị hủy bỏ nếu bạn rời khỏi trang này.
            </p>
          </div>
        </SlideOver>

        {/* Publish Selection Modal (BR06, TD-03) */}
        <PublishMenuModal
          isOpen={showPublishModal}
          menu={dummyMenuForPublishModal as any}
          onClose={() => setShowPublishModal(false)}
          onConfirmPublish={handleConfirmPublish}
        />
      </div>
    </PortalLayout>
  );
}
