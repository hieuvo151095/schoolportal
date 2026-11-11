/**
 * Master Menu Table Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { WeeklyMenu } from '../../../types/menu';
import { canCloneMenu, formatMenuDateRange } from '../../../utils/menuValidation';
import { PublishMenuModal } from './PublishMenuModal';
import { CloneMenuModal } from './CloneMenuModal';
import { DeleteMenuModal } from './DeleteMenuModal';
import { SendHistoryModal } from './SendHistoryModal';
import { Tag, StatusTag, IconButton, EmptyState, DropdownMenu, DropdownMenuItem } from '../../../components/ds';

interface MenuTableProps {
  menus: WeeklyMenu[];
  schoolCode: string;
  onPublish: (menuId: string, viaAnnouncement: boolean) => void;
  onClone: (
    sourceId: string,
    targetWeek: number,
    targetYear: number,
    start: string,
    end: string
  ) => void;
  onDelete: (menuId: string) => void;
}

export const MenuTable: React.FC<MenuTableProps> = ({
  menus,
  schoolCode,
  onPublish,
  onClone,
  onDelete,
}) => {
  const [selectedForPublish, setSelectedForPublish] = useState<WeeklyMenu | null>(null);
  const [selectedForClone, setSelectedForClone] = useState<WeeklyMenu | null>(null);
  const [selectedForDelete, setSelectedForDelete] = useState<WeeklyMenu | null>(null);
  const [selectedForHistory, setSelectedForHistory] = useState<WeeklyMenu | null>(null);

  const handleDownload = (menu: WeeklyMenu) => {
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
    <>
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '220px' }}>
                Thực đơn tuần
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '220px' }}>
                Thời gian áp dụng
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '130px' }}>
                Hình thức
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '180px' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ width: '70px', textAlign: 'right' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {menus.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-0">
                  <EmptyState
                    icon="utensils"
                    title="Không tìm thấy thực đơn nào"
                    description="Thử điều chỉnh lại bộ lọc tìm kiếm hoặc tạo thực đơn tuần mới."
                  />
                </td>
              </tr>
            ) : (
              menus.map((menu) => {
                const isPublished = menu.status === 'published';
                const isGrid = menu.contentType === 'grid';
                const isCloneable = canCloneMenu(menu);

                return (
                  <tr key={menu.id}>
                    {/* Thực đơn tuần */}
                    <td className="body-sm is-primary">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Thực đơn
                      </span>
                      <div className="ecomd-cell__value">
                        <Link
                          href={`/${schoolCode}/school/menu/${menu.id}`}
                          className="body-sm-bold text-[var(--eco-blue-strong)] hover:underline block"
                        >
                          {menu.title}
                        </Link>
                        <div className="mt-1 flex items-center gap-1.5">
                          {menu.scope === 'all' ? (
                            <Tag variant="default">Toàn trường</Tag>
                          ) : (
                            <Tag variant="warning">{menu.className || 'Lớp học'}</Tag>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Thời gian áp dụng */}
                    <td className="body-sm font-numeric">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Thời gian
                      </span>
                      <div className="ecomd-cell__value flex-col">
                        <div className="body-sm-bold text-[var(--text-heading)]">
                          Tuần {menu.weekNumber}
                        </div>
                        <div className="body-xs text-[var(--text-subtle)] mt-0.5">
                          {formatMenuDateRange(menu.startDate, menu.endDate)}
                        </div>
                      </div>
                    </td>

                    {/* Hình thức */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Hình thức
                      </span>
                      <div className="ecomd-cell__value">
                        {isGrid ? (
                          <Tag variant="success">Dạng lưới</Tag>
                        ) : (
                          <Tag variant="default">Dạng file</Tag>
                        )}
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Trạng thái
                      </span>
                      <div className="ecomd-cell__value flex items-center gap-2">
                        {isPublished ? (
                          <StatusTag tone="success" label="Đã xuất bản" icon={true} />
                        ) : (
                          <StatusTag tone="neutral" label="Bản nháp" />
                        )}

                        {isPublished && (
                          <IconButton
                            icon="clock"
                            size="sm"
                            label="Xem lịch sử thông báo"
                            onClick={() => setSelectedForHistory(menu)}
                          />
                        )}
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="body-sm is-right is-actions" style={{ textAlign: 'right' }}>
                      <div className="ecomd-cell__value flex justify-end">
                        <DropdownMenu
                          trigger={
                            <IconButton
                              icon="ellipsis-vertical"
                              label="Thao tác"
                              size="sm"
                            />
                          }
                          align="right"
                          items={
                            [
                              {
                                label: 'Xuất bản / Gửi thông báo',
                                icon: 'paper-plane',
                                onClick: () => setSelectedForPublish(menu),
                              },
                              {
                                label: 'Chỉnh sửa thực đơn',
                                icon: 'pen-to-square',
                                href: `/${schoolCode}/school/menu/edit/${menu.id}`,
                              },
                              ...(isCloneable
                                ? [
                                    {
                                      label: 'Sao chép thực đơn',
                                      icon: 'clone',
                                      onClick: () => setSelectedForClone(menu),
                                    },
                                  ]
                                : []),
                              {
                                label: 'Tải xuống thực đơn',
                                icon: 'download',
                                onClick: () => handleDownload(menu),
                              },
                              ...(!isPublished
                                ? [
                                    {
                                      divider: true as const,
                                    },
                                    {
                                      label: 'Xóa bản nháp',
                                      icon: 'trash',
                                      tone: 'danger' as const,
                                      onClick: () => setSelectedForDelete(menu),
                                    },
                                  ]
                                : []),
                            ] as DropdownMenuItem[]
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {menus.length > 0 && (
        <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
          <div>
            Hiển thị <b>{menus.length}</b> thực đơn tuần
          </div>
          <div className="hidden sm:block">
            Theo dõi truy xuất nguồn gốc bữa ăn học đường chuẩn Bộ Y Tế & GD&ĐT
          </div>
        </div>
      )}

      {/* Modals */}
      <PublishMenuModal
        isOpen={!!selectedForPublish}
        menu={selectedForPublish}
        onClose={() => setSelectedForPublish(null)}
        onConfirmPublish={(viaAnnounce: boolean) => {
          if (selectedForPublish) {
            onPublish(selectedForPublish.id, viaAnnounce);
          }
          setSelectedForPublish(null);
        }}
      />

      <CloneMenuModal
        isOpen={!!selectedForClone}
        menu={selectedForClone}
        onClose={() => setSelectedForClone(null)}
        onConfirmClone={(targetWeek: number, targetYear: number, start: string, end: string) => {
          if (selectedForClone) {
            onClone(selectedForClone.id, targetWeek, targetYear, start, end);
          }
          setSelectedForClone(null);
        }}
      />

      <DeleteMenuModal
        isOpen={!!selectedForDelete}
        menu={selectedForDelete}
        onClose={() => setSelectedForDelete(null)}
        onConfirmDelete={(menuId: string) => {
          onDelete(menuId);
          setSelectedForDelete(null);
        }}
      />

      <SendHistoryModal
        isOpen={!!selectedForHistory}
        menu={selectedForHistory}
        onClose={() => setSelectedForHistory(null)}
      />
    </>
  );
};
