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
  faFileAlt,
  faThLarge,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { updateMenu, publishMenu } from '../../../../../store/slices/menuSlice';
import {
  MenuContentType,
  MenuScopeType,
  WeekdayKey,
  DayMealSchedule,
  WeeklyMenu,
} from '../../../../../types/menu';
import { MenuGridEditor } from '../../../../../modules/school/menu/MenuGridEditor';
import { MenuFileUploadEditor } from '../../../../../modules/school/menu/MenuFileUploadEditor';
import { PublishMenuModal } from '../../../../../modules/school/menu/PublishMenuModal';

export default function EditSchoolMenuPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const { menus } = useAppSelector((state) => state.menu);

  const existingMenu = menus.find((m) => m.id === id);

  const [contentType, setContentType] = useState<MenuContentType>('grid');
  const [schedule, setSchedule] = useState<Record<WeekdayKey, DayMealSchedule>>({} as any);
  const [fileAttachment, setFileAttachment] = useState<any>(undefined);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  useEffect(() => {
    if (existingMenu) {
      setContentType(existingMenu.contentType);
      if (existingMenu.schedule) {
        setSchedule(JSON.parse(JSON.stringify(existingMenu.schedule)));
      }
      if (existingMenu.fileAttachment) {
        setFileAttachment(existingMenu.fileAttachment);
      }
    }
  }, [existingMenu]);

  if (!existingMenu) {
    return (
      <PortalLayout schoolCode={schoolCode}>
        <div className="p-8 text-center text-gray-500">
          Không tìm thấy thực đơn với mã này.
          <div className="mt-4">
            <Link
              href={`/${schoolCode}/school/menu`}
              className="text-blue-600 hover:underline text-xs"
            >
              Quay lại danh sách thực đơn
            </Link>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const handleCancelClick = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      router.push(`/${schoolCode}/school/menu`);
    }
  };

  const handleSave = () => {
    dispatch(
      updateMenu({
        id: existingMenu.id,
        changes: {
          contentType,
          schedule: contentType === 'grid' ? schedule : undefined,
          fileAttachment: contentType === 'file' ? fileAttachment : undefined,
        },
      })
    );
    router.push(`/${schoolCode}/school/menu`);
  };

  const handleConfirmPublish = (viaAnnouncement: boolean) => {
    dispatch(
      updateMenu({
        id: existingMenu.id,
        changes: {
          contentType,
          schedule: contentType === 'grid' ? schedule : undefined,
          fileAttachment: contentType === 'file' ? fileAttachment : undefined,
        },
      })
    );
    dispatch(publishMenu({ id: existingMenu.id, viaAnnouncement }));
    setShowPublishModal(false);
    router.push(`/${schoolCode}/school/menu`);
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Chỉnh sửa thực đơn: {existingMenu.title} | Cổng Vận Hành</title>
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
            <span className="font-semibold text-gray-800">Chỉnh sửa thực đơn</span>
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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Chỉnh sửa {existingMenu.title}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Phạm vi: {existingMenu.scope === 'all' ? 'Toàn trường' : existingMenu.className || 'Lớp'} •
              Trạng thái: {existingMenu.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
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
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-2xs inline-flex items-center gap-1.5 transition-colors"
            >
              <FontAwesomeIcon icon={faSave} className="text-gray-500" />
              Lưu thay đổi
            </button>
            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 inline-flex items-center gap-1.5 transition-all"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
              {existingMenu.status === 'published' ? 'Gửi lại / Công bố lại' : 'Gửi / Xuất bản'}
            </button>
          </div>
        </div>

        {/* Content Mode Switcher Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Hình thức nội dung:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setContentType('grid');
                  setIsDirty(true);
                }}
                className={`py-1.5 px-3 rounded-xl text-xs font-medium border text-center inline-flex items-center gap-1.5 transition-all ${
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
                className={`py-1.5 px-3 rounded-xl text-xs font-medium border text-center inline-flex items-center gap-1.5 transition-all ${
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

          <div className="text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
            Thực đơn đã xuất bản vẫn có thể chỉnh sửa và gửi lại bất kỳ lúc nào (BR03).
          </div>
        </div>

        {/* Editor */}
        {contentType === 'grid' ? (
          <MenuGridEditor
            schedule={schedule}
            onScheduleChange={(newSchedule) => {
              setSchedule(newSchedule);
              setIsDirty(true);
            }}
            startDate={existingMenu.startDate}
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

        {/* Publish Modal */}
        <PublishMenuModal
          isOpen={showPublishModal}
          menu={existingMenu}
          onClose={() => setShowPublishModal(false)}
          onConfirmPublish={handleConfirmPublish}
        />
      </div>
    </PortalLayout>
  );
}
