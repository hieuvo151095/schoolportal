/**
 * Client-Side Spreadsheet Export Generator for Tuition Exemption & Fee Discounts
 * Finance Domain - Finviet / SOHA School Operating Portal
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 */

import { DiscountPolicy } from '../../../types/discount';
import { formatCurrency, formatDiscountValue } from '../../../utils/discountValidation';

/**
 * Exports a list of discount policies to a UTF-8 BOM CSV format compatible with Microsoft Excel.
 */
export function exportDiscountPoliciesToCSV(policies: DiscountPolicy[]): void {
  const headers = [
    'Mã chính sách',
    'Tên chính sách',
    'Khoản phí áp dụng',
    'Loại miễn giảm',
    'Mức miễn giảm',
    'Phạm vi áp dụng',
    'Chi tiết đối tượng',
    'Thời hạn áp dụng',
    'Trạng thái',
    'Lý do miễn giảm',
    'Ngày tạo',
  ];

  const escapeCSV = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = policies.map((p) => {
    const scopeLabel = p.scopeType === 'class' ? 'Theo lớp học' : 'Theo học sinh';
    const targetDetails = p.targets
      .map((t) => (t.targetClass ? `${t.targetName} (${t.targetClass})` : t.targetName))
      .join(', ');

    const periodLabel =
      p.validityType === 'academic_year'
        ? p.academicYearName || 'Năm học 2026 - 2027'
        : `Tháng ${p.fromMonth} - ${p.toMonth}`;

    const statusLabel =
      p.status === 'active'
        ? 'Đang hoạt động'
        : p.status === 'paused'
        ? 'Ngừng áp dụng'
        : 'Hết hạn';

    const discountVal =
      p.discountType === 'percent'
        ? `${p.discountValue}%`
        : formatCurrency(p.discountValue);

    return [
      escapeCSV(p.code),
      escapeCSV(p.name),
      escapeCSV(p.feeItemName),
      escapeCSV(p.discountType === 'percent' ? 'Giảm theo %' : 'Giảm theo số tiền cố định'),
      escapeCSV(discountVal),
      escapeCSV(scopeLabel),
      escapeCSV(targetDetails),
      escapeCSV(periodLabel),
      escapeCSV(statusLabel),
      escapeCSV(p.reason),
      escapeCSV(p.createdAt),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `chinh-sach-mien-giam_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
