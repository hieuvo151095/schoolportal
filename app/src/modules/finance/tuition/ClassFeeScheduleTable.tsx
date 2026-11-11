/**
 * Class Fee Schedule Table Component (Danh Sách Cấu Hình Khoản Phí Theo Lớp)
 * Route: /[schoolCode]/school/tuition-management
 * Legacy Reference: docs_legacy/operating-portal/tai-chinh/quan-ly-hoc-phi.md (BR01, BR02, BR07, BR08, BR09)
 * Standardized with [DS] ECO ME DASHBOARD
 */

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setFilterCriteria } from '../../../store/slices/tuitionManagementSlice';
import {
  formatFeeAmount,
  filterClassOverviews,
} from '../../../utils/tuitionManagementValidation';
import { ClassFeeOverview } from '../../../types/tuitionManagement';
import {
  StatCard,
  FilterBar,
  DataTable,
  DataTableColumn,
  Tag,
  StatusTag,
  Button,
  PopupModal,
  DropdownMenuItem,
  Icon,
} from '../../../components/ds';
import { addToast } from '../../../store/slices/toastSlice';

const GRADE_LEVEL_OPTIONS = [
  { value: 'all', label: 'Tất cả khối' },
  { value: 'Khối 12', label: 'Khối 12' },
  { value: 'Khối 11', label: 'Khối 11' },
  { value: 'Khối 10', label: 'Khối 10' },
  { value: 'Khối 9', label: 'Khối 9' },
  { value: 'Khối 8', label: 'Khối 8' },
  { value: 'Khối 7', label: 'Khối 7' },
  { value: 'Khối 6', label: 'Khối 6' },
  { value: 'Khối 5', label: 'Khối 5' },
  { value: 'Khối 4', label: 'Khối 4' },
  { value: 'Khối 3', label: 'Khối 3' },
  { value: 'Khối 2', label: 'Khối 2' },
  { value: 'Khối 1', label: 'Khối 1' },
];

export const ClassFeeScheduleTable: React.FC = () => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const { classOverviews, searchQuery, gradeLevelFilter } = useAppSelector(
    (state) => state.tuitionManagement
  );
  const [selectedClassForFees, setSelectedClassForFees] = useState<ClassFeeOverview | null>(null);

  const getClassFeeList = (item: ClassFeeOverview) => {
    const fees: Array<{
      feeName: string;
      amount: number;
      unit: string;
      exportElectronicInvoice: boolean;
    }> = [];

    if (item.mandatoryFeesSummary.hocPhi !== null) {
      fees.push({
        feeName: 'Học phí',
        amount: item.mandatoryFeesSummary.hocPhi,
        unit: 'Tháng',
        exportElectronicInvoice: item.exportElectronicInvoice,
      });
    }

    if (item.mandatoryFeesSummary.tienAn !== null) {
      fees.push({
        feeName: 'Tiền ăn',
        amount: item.mandatoryFeesSummary.tienAn,
        unit: 'Ngày',
        exportElectronicInvoice: item.exportElectronicInvoice,
      });
    }

    item.optionalFeesSummary.forEach((opt) => {
      fees.push({
        feeName: opt.feeName,
        amount: opt.amount,
        unit: opt.unit,
        exportElectronicInvoice: (opt as any).exportElectronicInvoice ?? false,
      });
    });

    return fees;
  };

  const filteredClasses = useMemo(() => {
    return filterClassOverviews(classOverviews, searchQuery, gradeLevelFilter);
  }, [classOverviews, searchQuery, gradeLevelFilter]);

  const totalStudentsAll = useMemo(() => {
    return classOverviews.reduce((sum, c) => sum + (c.totalStudents || 0), 0);
  }, [classOverviews]);

  const handleSearchChange = (val: string) => {
    dispatch(setFilterCriteria({ searchQuery: val }));
  };

  const handleGradeLevelChange = (val: string) => {
    dispatch(setFilterCriteria({ gradeLevelFilter: val }));
  };

  const rowMenu = (item: ClassFeeOverview): DropdownMenuItem[] => {
    return [
      {
        label: 'Quản lý học phí (Ma trận)',
        href: `/${schoolCode}/school/tuition-management/${item.classId}`,
      },
      {
        label: 'Xem hóa đơn của lớp',
        href: `/${schoolCode}/school/fee?classId=${item.classId}`,
      },
    ];
  };

  const columns: DataTableColumn<ClassFeeOverview>[] = [
    {
      key: 'index',
      title: 'STT',
      width: 60,
      render: (_r, i) => (
        <span className="body-xs text-[var(--text-subtle)]">{i + 1}</span>
      ),
    },
    {
      key: 'className',
      title: 'Tên lớp',
      render: (item) => (
        <Tag variant="default" className="body-sm-bold text-[var(--eco-blue-strong)]">
          {item.className}
        </Tag>
      ),
    },
    {
      key: 'gradeLevel',
      title: 'Khối',
      render: (item) => (
        <span className="body-sm text-[var(--text-body)]">{item.gradeLevel}</span>
      ),
    },
    {
      key: 'totalStudents',
      title: 'Sĩ số',
      align: 'right',
      render: (item) => (
        <span className="body-sm font-tabular text-[var(--text-heading)]">
          {item.totalStudents} học sinh
        </span>
      ),
    },
    {
      key: 'fees',
      title: 'Các khoản phí gán theo lớp',
      render: (item) => {
        const feeList = getClassFeeList(item);
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon="eye"
              onClick={() => setSelectedClassForFees(item)}
            >
              {feeList.length} khoản phí
            </Button>
          </div>
        );
      },
    },
    {
      key: 'actions',
      title: 'Thao tác',
      align: 'right',
      render: (item) => (
        <DataTable.RowAction
          label={'Thao tác lớp ' + item.className}
          items={rowMenu(item)}
        />
      ),
    },
  ];

  const handleExportExcel = () => {
    dispatch(
      addToast({
        type: 'success',
        message: 'Đang xuất danh sách cấu hình học phí theo lớp ra file Excel...',
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* 4 StatCards KPI Summary */}
      <div
        className="ecomd-stat-group"
        style={{ '--ecomd-cols': 4 } as React.CSSProperties}
      >
        <StatCard
          label="Tổng số lớp"
          value={classOverviews.length}
          icon="chalkboard"
          tone="neutral"
        />
        <StatCard
          label="Học sinh toàn trường"
          value={totalStudentsAll}
          icon="graduation-cap"
          tone="info"
        />
        <StatCard
          label="Lớp đã có cấu hình phí"
          value={classOverviews.filter((c) => getClassFeeList(c).length > 0).length}
          icon="coins"
          tone="success"
        />
        <StatCard
          label="Đang hiển thị"
          value={filteredClasses.length}
          icon="sliders"
          tone="purple"
        />
      </div>

      {/* Main Table Card */}
      <div className="ecomd-table-card">
        {/* FilterBar with Search and Grade Level */}
        <FilterBar
          search={{
            placeholder: 'Tìm kiếm theo tên lớp...',
            value: searchQuery,
            onChange: handleSearchChange,
          }}
          filters={[
            {
              placeholder: 'Chọn khối lớp',
              options: GRADE_LEVEL_OPTIONS,
              value: gradeLevelFilter,
              onChange: handleGradeLevelChange,
            },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon="download"
                onClick={handleExportExcel}
                disabled={filteredClasses.length === 0}
              >
                Xuất Excel
              </Button>
            </div>
          }
        />

        {/* Main Class Schedule DataTable */}
        <DataTable
          columns={columns}
          rows={filteredClasses}
          rowKey="classId"
          emptyText="Không tìm thấy lớp học nào phù hợp"
          emptyIcon="magnifying-glass"
          footer={
            <div className="w-full flex items-center justify-between">
              <div>
                Đang hiển thị <b className="body-xs-semibold">{filteredClasses.length}</b> lớp học có cấu hình khoản phí
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 body-xs text-[var(--text-subtle)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--eco-blue-strong)] inline-block" />
                  Icon coins: Quản lý ma trận học phí
                </span>
                <span className="flex items-center gap-1.5 body-xs text-[var(--text-subtle)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--semantic-success)] inline-block" />
                  Icon invoice: Xem hóa đơn lớp
                </span>
              </div>
            </div>
          }
        />
      </div>

      {/* Class Fees Detail Table Pop-up */}
      {selectedClassForFees && (
        <PopupModal
          open={true}
          icon="clipboard-list"
          title={`Danh sách khoản phí - Lớp ${selectedClassForFees.className}`}
          description={`${selectedClassForFees.gradeLevel} • ${selectedClassForFees.totalStudents} học sinh`}
          onClose={() => setSelectedClassForFees(null)}
          primaryAction={{
            label: 'Đến bảng ma trận lớp',
            icon: 'coins',
            onClick: () => {
              const cid = selectedClassForFees.classId;
              setSelectedClassForFees(null);
              router.push(`/${schoolCode}/school/tuition-management/${cid}`);
            },
          }}
          secondaryAction={{
            label: 'Đóng',
            onClick: () => setSelectedClassForFees(null),
          }}
          width={600}
        >
          <div className="overflow-x-auto">
            <table className="ecomd-table">
              <thead>
                <tr>
                  <th className="body-xs-bold">Khoản phí</th>
                  <th className="body-xs-bold is-right">Số tiền</th>
                  <th className="body-xs-bold">Đơn vị</th>
                  <th className="body-xs-bold">Xuất HĐĐT</th>
                </tr>
              </thead>
              <tbody>
                {getClassFeeList(selectedClassForFees).map((fee, idx) => (
                  <tr key={idx}>
                    <td className="body-sm-bold text-[var(--text-heading)]">{fee.feeName}</td>
                    <td className="body-sm is-right font-tabular text-[var(--text-heading)]">
                      {formatFeeAmount(fee.amount)}
                    </td>
                    <td className="body-sm">
                      <Tag>{fee.unit}</Tag>
                    </td>
                    <td className="body-sm">
                      <StatusTag tone={fee.exportElectronicInvoice ? 'success' : 'neutral'} icon={true}>
                        {fee.exportElectronicInvoice ? 'Có' : 'Không'}
                      </StatusTag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PopupModal>
      )}
    </div>
  );
};
