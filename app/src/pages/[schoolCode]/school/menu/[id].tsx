import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Icon } from '../../../../components/ds';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { publishMenu, cloneMenu, updateMenu, updateMealSessionTickXanh } from '../../../../store/slices/menuSlice';
import { formatMenuDateRange, canCloneMenu } from '../../../../utils/menuValidation';
import { MenuGridEditor } from '../../../../modules/school/menu/MenuGridEditor';
import { MenuFileUploadEditor } from '../../../../modules/school/menu/MenuFileUploadEditor';
import { PublishMenuModal } from '../../../../modules/school/menu/PublishMenuModal';
import { CloneMenuModal } from '../../../../modules/school/menu/CloneMenuModal';
import { SendHistoryModal } from '../../../../modules/school/menu/SendHistoryModal';

export default function MenuDetailPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const { menus } = useAppSelector((state) => state.menu);

  const menu = menus.find((m) => m.id === id);

  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [showCloneModal, setShowCloneModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  if (!menu) {
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

  const isPublished = menu.status === 'published';
  const isGrid = menu.contentType === 'grid';
  const isCloneable = canCloneMenu(menu);

  const handleDownload = () => {
    if (menu.contentType === 'file' && menu.fileAttachment) {
      window.open(menu.fileAttachment.url || '#', '_blank');
      return;
    }
    const content = `Thực đơn: ${menu.title}\nĐối tượng: ${
      menu.scope === 'all' ? 'Toàn trường' : menu.className || 'Lớp'
    }\nThời gian: ${menu.startDate} đến ${menu.endDate}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Thuc_Don_Tuan_${menu.weekNumber}_${menu.year}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>{menu.title} | Chi tiết thực đơn</title>
      </Head>

      <div className="w-full space-y-6">
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link
              href={`/${schoolCode}/school/menu`}
              className="hover:text-blue-600 font-medium transition-colors"
            >
              Thực đơn
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-800">{menu.title}</span>
          </div>

          <Link
            href={`/${schoolCode}/school/menu`}
            className="text-xs text-gray-500 hover:text-gray-800 font-medium inline-flex items-center gap-1.5"
          >
            <Icon name="arrow-left" className="w-3.5 h-3.5" />
            Quay lại danh sách
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{menu.title}</h1>
              {isPublished ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Đã xuất bản
                  {menu.publishedViaAnnouncement && (
                    <span className="font-normal opacity-90">(qua Bảng thông tin)</span>
                  )}
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  Bản nháp
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 font-medium text-gray-700">
                <Icon
                  name={menu.scope === 'all' ? 'school' : 'user'}
                  className="w-3.5 h-3.5 text-blue-600"
                />
                {menu.scope === 'all'
                  ? 'Thực đơn cho Toàn trường'
                  : `Thực đơn cho ${menu.className || 'Lớp học'}`}
              </span>

              <span>•</span>

              <span className="inline-flex items-center gap-1">
                <Icon name="calendar-week" className="w-3.5 h-3.5 text-gray-400" />
                Tuần {menu.weekNumber} ({formatMenuDateRange(menu.startDate, menu.endDate)})
              </span>

              <span>•</span>

              <span className="inline-flex items-center gap-1 font-medium">
                <Icon name={isGrid ? 'table-cells' : 'file'} className="w-3.5 h-3.5 text-gray-400" />
                {isGrid ? 'Dạng lưới món ăn' : 'Dạng file đính kèm'}
              </span>

              {isPublished && (
                <>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setShowHistoryModal(true)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <Icon name="clock-rotate-left" className="w-3.5 h-3.5" />
                    Lịch sử gửi ({menu.sendHistory?.length || 0})
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 text-gray-500 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Tải xuống
            </button>

            {isCloneable && (
              <button
                type="button"
                onClick={() => setShowCloneModal(true)}
                className="px-3.5 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl inline-flex items-center gap-1.5 transition-colors"
              >
                <Icon name="copy" className="w-3.5 h-3.5" />
                Sao chép
              </button>
            )}

            <Link
              href={`/${schoolCode}/school/menu/edit/${menu.id}`}
              className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl inline-flex items-center gap-1.5 transition-colors"
            >
              <Icon name="pencil" className="w-3.5 h-3.5 text-gray-500" />
              Chỉnh sửa
            </Link>

            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 inline-flex items-center gap-1.5 transition-all"
            >
              <Icon name="paper-plane" className="w-3.5 h-3.5" />
              {isPublished ? 'Gửi lại' : 'Xuất bản'}
            </button>
          </div>
        </div>

        {/* Content View */}
        {isGrid ? (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
              <Icon name="utensils" className="w-4 h-4 text-blue-600" />
              Lưới chi tiết món ăn và truy xuất nguồn gốc
            </div>
            <MenuGridEditor
              schedule={menu.schedule || ({} as any)}
              onScheduleChange={(newSchedule) => {
                dispatch(updateMenu({ id: menu.id, changes: { schedule: newSchedule } }));
              }}
              readOnly={true}
              startDate={menu.startDate}
              onSaveMealTickXanh={(day, meal, url, verified) => {
                dispatch(
                  updateMealSessionTickXanh({
                    menuId: menu.id,
                    day,
                    meal,
                    tickXanhUrl: url,
                    tickXanhVerified: verified,
                  })
                );
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
              <Icon name="file" className="w-4 h-4 text-blue-600" />
              Tệp thực đơn đính kèm
            </div>
            <MenuFileUploadEditor
              fileAttachment={menu.fileAttachment}
              onFileChange={() => {}}
              readOnly={true}
            />
          </div>
        )}

        {/* Modals */}
        <PublishMenuModal
          isOpen={showPublishModal}
          menu={menu}
          onClose={() => setShowPublishModal(false)}
          onConfirmPublish={(viaAnnouncement) => {
            dispatch(publishMenu({ id: menu.id, viaAnnouncement }));
            setShowPublishModal(false);
          }}
        />

        <CloneMenuModal
          isOpen={showCloneModal}
          menu={menu}
          onClose={() => setShowCloneModal(false)}
          onConfirmClone={(targetWeek, targetYear, start, end) => {
            dispatch(
              cloneMenu({
                sourceMenuId: menu.id,
                targetWeekNumber: targetWeek,
                targetYear: targetYear,
                targetStartDate: start,
                targetEndDate: end,
              })
            );
            setShowCloneModal(false);
            router.push(`/${schoolCode}/school/menu`);
          }}
        />

        <SendHistoryModal
          isOpen={showHistoryModal}
          menu={menu}
          onClose={() => setShowHistoryModal(false)}
        />
      </div>
    </PortalLayout>
  );
}
