import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSave,
  faPaperPlane,
  faCalendarWeek,
  faSchool,
  faUserGraduate,
  faFileAlt,
  faThLarge,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
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
  const [classId, setClassId] = useState<string>('10A1');
  const [className, setClassName] = useState<string>('Lớp 10A1');
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
          ],
          snack: [{ id: 'ai-4', name: 'Sữa chua Ba Vì', calories: 110, ingredients: [] }],
        },
        tuesday: {
          breakfast: [{ id: 'ai-5', name: 'Bánh cuốn chả quế', calories: 350, ingredients: [] }],
          lunch: [
            { id: 'ai-6', name: 'Cơm trắng & Gà om nấm đông cô', calories: 440, ingredients: [] },
            { id: 'ai-7', name: 'Canh cải ngọt nấu tôm', calories: 90, ingredients: [] },
          ],
          snack: [{ id: 'ai-8', name: 'Chè đậu đỏ', calories: 140, ingredients: [] }],
        },
        wednesday: { breakfast: [], lunch: [], snack: [] },
        thursday: { breakfast: [], lunch: [], snack: [] },
        friday: { breakfast: [], lunch: [], snack: [] },
        saturday: { breakfast: [], lunch: [], snack: [] },
      });
      setIsDirty(true);
    }
  }, [router.query]);

  // Dirty navigation guard (BR10, TD-04)
  const handleCancelClick = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      router.push(`/${schoolCode}/school/menu`);
    }
  };

  const handleSaveDraft = () => {
    dispatch(
      createMenu({
        scope,
        classId: scope === 'class' ? classId : undefined,
        className: scope === 'class' ? className : undefined,
        weekNumber: selectedWeek.weekNumber,
        year: selectedWeek.year,
        startDate: selectedWeek.startDate,
        endDate: selectedWeek.endDate,
        contentType,
        schedule: contentType === 'grid' ? schedule : undefined,
        fileAttachment: contentType === 'file' ? fileAttachment : undefined,
        publishNow: false,
      })
    );
    router.push(`/${schoolCode}/school/menu`);
  };

  const handleConfirmPublish = (viaAnnouncement: boolean) => {
    dispatch(
      createMenu({
        scope,
        classId: scope === 'class' ? classId : undefined,
        className: scope === 'class' ? className : undefined,
        weekNumber: selectedWeek.weekNumber,
        year: selectedWeek.year,
        startDate: selectedWeek.startDate,
        endDate: selectedWeek.endDate,
        contentType,
        schedule: contentType === 'grid' ? schedule : undefined,
        fileAttachment: contentType === 'file' ? fileAttachment : undefined,
        publishNow: true,
        publishedViaAnnouncement: viaAnnouncement,
      })
    );
    setShowPublishModal(false);
    router.push(`/${schoolCode}/school/menu`);
  };

  const dummyMenuForPublishModal = {
    id: 'new-menu',
    title: `Thực đơn tuần: ${formatMenuDateRange(selectedWeek.startDate, selectedWeek.endDate)}`,
    scope,
    weekNumber: selectedWeek.weekNumber,
    year: selectedWeek.year,
    startDate: selectedWeek.startDate,
    endDate: selectedWeek.endDate,
    contentType,
    status: 'draft' as const,
    updatedAt: new Date().toISOString(),
    sendHistory: [],
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Tạo Thực đơn mới | Cổng Vận Hành</title>
      </Head>

      <div className="w-full space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link
              href={`/${schoolCode}/school/menu`}
              className="hover:text-blue-600 font-medium transition-colors"
            >
              Thực đơn
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-800">Tạo mới thực đơn</span>
          </div>

          <button
            type="button"
            onClick={handleCancelClick}
            className="text-xs text-gray-500 hover:text-gray-800 font-medium inline-flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
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
          <div className="flex items-center gap-2">
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
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-2xs inline-flex items-center gap-1.5 transition-colors"
            >
              <FontAwesomeIcon icon={faSave} className="text-gray-500" />
              Lưu bản nháp
            </button>
            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 inline-flex items-center gap-1.5 transition-all"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
              Gửi / Xuất bản
            </button>
          </div>
        </div>

        {/* Scope, Horizon, and Content Type Form Settings Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Chọn tuần áp dụng (BR01 - Max 8 weeks) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                <FontAwesomeIcon icon={faCalendarWeek} className="mr-1.5 text-blue-600" />
                Tuần áp dụng (Tối đa 8 tuần)
              </label>
              <select
                value={selectedWeek.weekNumber}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const opt = weekOptions.find((w) => w.weekNumber === val);
                  if (opt) {
                    setSelectedWeek(opt);
                    setIsDirty(true);
                  }
                }}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-gray-800 bg-white font-medium"
              >
                {weekOptions.map((w) => (
                  <option key={w.weekNumber} value={w.weekNumber}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Thực đơn cho (Toàn trường vs Lớp học) (BR02) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                <FontAwesomeIcon icon={faSchool} className="mr-1.5 text-blue-600" />
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
                  <select
                    value={classId}
                    onChange={(e) => {
                      setClassId(e.target.value);
                      const name = e.target.options[e.target.selectedIndex].text;
                      setClassName(name);
                      setIsDirty(true);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 text-gray-800 bg-white"
                  >
                    <option value="10A1">Lớp 10A1</option>
                    <option value="12A1">Lớp 12A1</option>
                    <option value="MN-CHOI">Lớp Chồi 1 (Mầm non)</option>
                    <option value="lop-1a1">Lớp 1A1 (Tiểu học)</option>
                  </select>
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
                  <FontAwesomeIcon icon={faThLarge} className="text-[10px]" />
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
                  <FontAwesomeIcon icon={faFileAlt} className="text-[10px]" />
                  Sử dụng file (Tải lên)
                </button>
              </div>
            </div>
          </div>

          {/* Mandatory Business Rule Note (BR02) */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600" />
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

        {/* Discard Warning Modal (BR10, TD-04) */}
        {showDiscardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Xác nhận rời khỏi trang</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDiscardModal(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Ở lại chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDiscardModal(false);
                    router.push(`/${schoolCode}/school/menu`);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm"
                >
                  Xác nhận rời đi
                </button>
              </div>
            </div>
          </div>
        )}

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
