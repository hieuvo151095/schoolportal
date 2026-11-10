import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icon, Dropdown } from '@/components/ds';
import type { Student } from '../../../types/student';
import type { InvoiceRecord, InvoiceLineItem } from '../../../types/invoice';
import { useAppSelector } from '../../../store';
import { formatCurrencyVND } from '../../../utils/studentFeeCalculation';

interface StudentTuitionTabProps {
  student: Student;
  schoolCode: string;
}

export const StudentTuitionTab: React.FC<StudentTuitionTabProps> = ({
  student,
  schoolCode,
}) => {
  // Redux state for invoices
  const reduxInvoices = useAppSelector((state) => state.invoice?.invoices || []);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState<InvoiceRecord | null>(null);

  // Invoices list for this student (matching student.id or student.studentCode or realistic fallbacks)
  const studentInvoices: InvoiceRecord[] = useMemo(() => {
    const matched = reduxInvoices.filter(
      (inv) =>
        inv.studentId === student.id ||
        inv.studentCode === student.studentCode ||
        inv.studentName.toLowerCase() === student.fullName.toLowerCase()
    );

    if (matched.length > 0) return matched;

    // Fallback realistic invoices for this child
    return [
      {
        id: `inv-${student.id}-2026-10`,
        invoiceNo: 'HD2610-083',
        title: 'Học phí tháng 10/2026',
        billingMonth: '2026-10',
        studentId: student.id,
        studentName: student.fullName,
        studentCode: student.studentCode || '9192930044',
        classId: student.classId || 'class-11a1',
        className: student.className || 'Lớp 11A1',
        gradeLevel: 'Khối 11',
        parentName: 'Nguyễn Trí Đức (Bố)',
        parentPhone: '0901234567',
        status: 'thanh_toan_mot_phan',
        issueDate: '01/10/2026',
        sendDate: '01/10/2026',
        dueDate: '15/10/2026',
        exportElectronicInvoice: true,
        createdBy: 'Nguyễn Thị Kế Toán',
        createdAt: '2026-10-01T08:30:00Z',
        items: [
          {
            id: 'item-10-1',
            category: 'hoc_phi',
            name: 'Học phí chính khóa tháng 10/2026',
            description: 'Chương trình song ngữ phổ thông',
            unitPrice: 200000,
            quantity: 1,
            discountPercent: 0,
            discountAmount: 0,
            amount: 200000,
            isRequired: true,
          },
          {
            id: 'item-10-2',
            category: 'tien_an',
            name: 'Tiền ăn cơ bản (22 ngày)',
            description: '35.000 đ/ngày x 22 ngày học',
            unitPrice: 35000,
            quantity: 22,
            discountPercent: 0,
            discountAmount: 0,
            amount: 770000,
            isRequired: true,
          },
          {
            id: 'item-10-3',
            category: 'khac',
            name: 'Tiền ăn sáng (Bán trú)',
            description: 'Khoản phí đăng ký thêm theo tháng',
            unitPrice: 500000,
            quantity: 1,
            discountPercent: 0,
            discountAmount: 0,
            amount: 500000,
            isRequired: false,
          },
          {
            id: 'item-10-4',
            category: 'khac',
            name: 'Học liệu Lịch sử',
            description: 'Sách chuyên đề & học cụ lịch sử',
            unitPrice: 280000,
            quantity: 1,
            discountPercent: 0,
            discountAmount: 0,
            amount: 280000,
            isRequired: false,
          },
        ],
        subtotal: 1750000,
        discountTotal: 0,
        totalAmount: 1750000,
        paidAmount: 1000000,
        remainingAmount: 750000,
        paymentHistory: [
          {
            id: 'pay-10-1',
            paidAt: '05/10/2026 09:15',
            amount: 1000000,
            paymentMethod: 'chuyen_khoan',
            confirmedBy: 'Hệ thống VietQR tự động',
            transactionRef: 'VQR26100599182',
          },
        ],
        vietQRData: {
          bankName: 'Ngân hàng TMCP Quân Đội (MBBank)',
          bankCode: 'MB',
          accountNo: '0888999888',
          accountHolder: 'TRUONG PTTN FINVIET',
          transferContent: `HP ${student.studentCode || '083'} T10`,
          qrImageUrl: 'https://img.vietqr.io/image/MB-0888999888-compact.png',
        },
      },
      {
        id: `inv-${student.id}-2026-09`,
        invoiceNo: 'HD2609-083',
        title: 'Học phí tháng 09/2026',
        billingMonth: '2026-09',
        studentId: student.id,
        studentName: student.fullName,
        studentCode: student.studentCode || '9192930044',
        classId: student.classId || 'class-11a1',
        className: student.className || 'Lớp 11A1',
        gradeLevel: 'Khối 11',
        parentName: 'Nguyễn Trí Đức (Bố)',
        parentPhone: '0901234567',
        status: 'da_thanh_toan',
        issueDate: '01/09/2026',
        sendDate: '01/09/2026',
        dueDate: '15/09/2026',
        exportElectronicInvoice: true,
        createdBy: 'Nguyễn Thị Kế Toán',
        createdAt: '2026-09-01T08:30:00Z',
        items: [
          {
            id: 'item-09-1',
            category: 'hoc_phi',
            name: 'Học phí chính khóa tháng 09/2026',
            description: 'Chương trình song ngữ phổ thông',
            unitPrice: 200000,
            quantity: 1,
            discountPercent: 0,
            discountAmount: 0,
            amount: 200000,
            isRequired: true,
          },
          {
            id: 'item-09-2',
            category: 'tien_an',
            name: 'Tiền ăn cơ bản (20 ngày)',
            description: '35.000 đ/ngày x 20 ngày',
            unitPrice: 35000,
            quantity: 20,
            discountPercent: 0,
            discountAmount: 0,
            amount: 700000,
            isRequired: true,
          },
          {
            id: 'item-09-3',
            category: 'khac',
            name: 'Tiền ăn sáng',
            description: 'Ăn sáng định kỳ',
            unitPrice: 500000,
            quantity: 1,
            discountPercent: 0,
            discountAmount: 0,
            amount: 500000,
            isRequired: false,
          },
          {
            id: 'item-09-4',
            category: 'khac',
            name: 'Tiếng Anh tăng cường',
            description: 'Học phần bổ trợ',
            unitPrice: 1000,
            quantity: 1,
            discountPercent: 0,
            discountAmount: 0,
            amount: 1000,
            isRequired: false,
          },
        ],
        subtotal: 1401000,
        discountTotal: 0,
        totalAmount: 1401000,
        paidAmount: 1401000,
        remainingAmount: 0,
        paymentHistory: [
          {
            id: 'pay-09-1',
            paidAt: '08/09/2026 14:20',
            amount: 1401000,
            paymentMethod: 'chuyen_khoan',
            confirmedBy: 'Nguyễn Thị Kế Toán',
            transactionRef: 'VQR26090881920',
          },
        ],
        vietQRData: {
          bankName: 'Ngân hàng TMCP Quân Đội (MBBank)',
          bankCode: 'MB',
          accountNo: '0888999888',
          accountHolder: 'TRUONG PTTN FINVIET',
          transferContent: `HP ${student.studentCode || '083'} T09`,
          qrImageUrl: 'https://img.vietqr.io/image/MB-0888999888-compact.png',
        },
      },
      {
        id: `inv-${student.id}-2026-11`,
        invoiceNo: 'HD2611-083',
        title: 'Học phí tháng 11/2026 (Dự kiến)',
        billingMonth: '2026-11',
        studentId: student.id,
        studentName: student.fullName,
        studentCode: student.studentCode || '9192930044',
        classId: student.classId || 'class-11a1',
        className: student.className || 'Lớp 11A1',
        gradeLevel: 'Khối 11',
        parentName: 'Nguyễn Trí Đức (Bố)',
        parentPhone: '0901234567',
        status: 'da_gui',
        issueDate: '01/11/2026',
        sendDate: '01/11/2026',
        dueDate: '15/11/2026',
        exportElectronicInvoice: true,
        createdBy: 'Nguyễn Thị Kế Toán',
        createdAt: '2026-11-01T08:30:00Z',
        items: [
          {
            id: 'item-11-1',
            category: 'hoc_phi',
            name: 'Học phí chính khóa tháng 11/2026',
            description: 'Chương trình song ngữ phổ thông',
            unitPrice: 200000,
            quantity: 1,
            discountPercent: 0,
            discountAmount: 0,
            amount: 200000,
            isRequired: true,
          },
          {
            id: 'item-11-2',
            category: 'tien_an',
            name: 'Tiền ăn cơ bản',
            description: '35.000 đ/ngày x 22 ngày',
            unitPrice: 35000,
            quantity: 22,
            discountPercent: 0,
            discountAmount: 0,
            amount: 770000,
            isRequired: true,
          },
          {
            id: 'item-11-3',
            category: 'khac',
            name: 'Ăn sáng',
            description: 'Đăng ký ăn sáng tháng 11',
            unitPrice: 500000,
            quantity: 1,
            discountPercent: 0,
            discountAmount: 0,
            amount: 500000,
            isRequired: false,
          },
        ],
        subtotal: 1470000,
        discountTotal: 0,
        totalAmount: 1470000,
        paidAmount: 0,
        remainingAmount: 1470000,
        paymentHistory: [],
        vietQRData: {
          bankName: 'Ngân hàng TMCP Quân Đội (MBBank)',
          bankCode: 'MB',
          accountNo: '0888999888',
          accountHolder: 'TRUONG PTTN FINVIET',
          transferContent: `HP ${student.studentCode || '083'} T11`,
          qrImageUrl: 'https://img.vietqr.io/image/MB-0888999888-compact.png',
        },
      },
    ];
  }, [reduxInvoices, student]);

  // Aggregate KPI summary
  const summary = useMemo(() => {
    let totalBilled = 0;
    let totalPaid = 0;
    let totalRemaining = 0;

    studentInvoices.forEach((inv) => {
      totalBilled += inv.totalAmount;
      totalPaid += inv.paidAmount;
      totalRemaining += inv.remainingAmount !== undefined ? inv.remainingAmount : (inv.totalAmount - inv.paidAmount);
    });

    return {
      totalBilled,
      totalPaid,
      totalRemaining,
      invoiceCount: studentInvoices.length,
    };
  }, [studentInvoices]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return studentInvoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (monthFilter !== 'all' && inv.billingMonth !== monthFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchNo = inv.invoiceNo.toLowerCase().includes(q);
        const matchTitle = inv.title.toLowerCase().includes(q);
        if (!matchNo && !matchTitle) return false;
      }
      return true;
    });
  }, [studentInvoices, statusFilter, monthFilter, searchQuery]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'da_thanh_toan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Icon name="circle-check" size={10} />
            Đã hoàn thành
          </span>
        );
      case 'thanh_toan_mot_phan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Icon name="clock" size={10} />
            Nộp một phần
          </span>
        );
      case 'da_gui':
      case 'da_tao':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Icon name="clock" size={10} />
            Chưa nộp
          </span>
        );
      case 'qua_han':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Icon name="circle-exclamation" size={10} />
            Quá hạn
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Financial Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">Tổng học phí phát sinh</div>
          <div className="text-2xl font-bold text-slate-800">
            {formatCurrencyVND(summary.totalBilled)}
          </div>
          <div className="text-2xs text-slate-400 mt-1">Đã tính các khoản giảm trừ</div>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xs border border-emerald-100 bg-emerald-50/20">
          <div className="text-xs font-semibold text-emerald-700 mb-1">Đã thanh toán</div>
          <div className="text-2xl font-bold text-emerald-700">
            {formatCurrencyVND(summary.totalPaid)}
          </div>
          <div className="text-2xs text-emerald-600 font-medium mt-1">
            Đạt {summary.totalBilled > 0 ? ((summary.totalPaid / summary.totalBilled) * 100).toFixed(0) : 0}% tổng nghĩa vụ
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xs border border-amber-100 bg-amber-50/20">
          <div className="text-xs font-semibold text-amber-700 mb-1">Còn nợ / Cần thu</div>
          <div className="text-2xl font-bold text-amber-700">
            {formatCurrencyVND(summary.totalRemaining)}
          </div>
          <div className="text-2xs text-amber-600 font-medium mt-1">Hạn nộp đợt tới 15/11/2026</div>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xs border border-blue-100 bg-blue-50/20">
          <div className="text-xs font-semibold text-blue-700 mb-1">Số kỳ hóa đơn</div>
          <div className="text-2xl font-bold text-blue-700">{summary.invoiceCount} kỳ</div>
          <div className="text-2xs text-blue-600 font-medium mt-1">Niên khóa 2026 - 2027</div>
        </div>
      </div>

      {/* 2. Suitable Filter Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Status Filter */}
          <div className="w-48">
            <Dropdown
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'da_thanh_toan', label: 'Đã hoàn thành' },
                { value: 'thanh_toan_mot_phan', label: 'Nộp một phần' },
                { value: 'da_gui', label: 'Chưa nộp' },
                { value: 'qua_han', label: 'Quá hạn' },
              ]}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              size="sm"
              variant="filter"
            />
          </div>

          {/* Billing Month Filter */}
          <div className="w-44">
            <Dropdown
              options={[
                { value: 'all', label: 'Tất cả kỳ thu' },
                { value: '2026-11', label: 'Tháng 11/2026' },
                { value: '2026-10', label: 'Tháng 10/2026' },
                { value: '2026-09', label: 'Tháng 09/2026' },
              ]}
              value={monthFilter}
              onChange={(val) => setMonthFilter(val)}
              size="sm"
              variant="filter"
            />
          </div>

          {/* Search Input */}
          <div className="relative w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã hóa đơn, tiêu đề..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#0070CE] placeholder-slate-400"
            />
            <div className="absolute left-2.5 top-2.5 text-slate-400">
              <Icon name="magnifying-glass" size={12} />
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Hiển thị <span className="font-bold text-slate-800">{filteredInvoices.length}</span> / {studentInvoices.length} hóa đơn
        </div>
      </div>

      {/* 3. Invoices Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">Mã hóa đơn</th>
                <th className="py-3 px-4">Tiêu đề kỳ thu</th>
                <th className="py-3 px-4 text-right">Tổng số tiền</th>
                <th className="py-3 px-4 text-right">Đã thanh toán</th>
                <th className="py-3 px-4 text-right">Còn lại</th>
                <th className="py-3 px-4 text-center">Hạn nộp</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Invoice Code */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0">
                        <Icon name="receipt" size={14} />
                      </div>
                      <div>
                        <span className="font-bold text-[#0070CE]">{inv.invoiceNo}</span>
                        {inv.exportElectronicInvoice && (
                          <span className="block text-3xs font-semibold text-amber-700">Xuất HĐĐT</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Title & Month */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{inv.title}</div>
                    <div className="text-2xs text-slate-400">Kỳ thu: {inv.billingMonth}</div>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                    {formatCurrencyVND(inv.totalAmount)}
                  </td>

                  {/* Paid */}
                  <td className="py-3.5 px-4 text-right font-semibold text-emerald-700">
                    {formatCurrencyVND(inv.paidAmount)}
                  </td>

                  {/* Remaining */}
                  <td className="py-3.5 px-4 text-right font-semibold text-amber-700">
                    {formatCurrencyVND(inv.remainingAmount !== undefined ? inv.remainingAmount : (inv.totalAmount - inv.paidAmount))}
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 text-center text-slate-600 font-medium">
                    {inv.dueDate}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {renderStatusBadge(inv.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceForDetail(inv)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#0070CE] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết hóa đơn"
                    >
                      <svg className="w-3.5 h-3.5 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Chi tiết</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Insight */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Icon name="circle-info" size={14} className="text-blue-500" />
            <span>
              Hóa đơn bao gồm học phí cơ bản, tiền ăn, các khoản phí tự chọn đã cấu hình và khấu trừ hoàn tiền ăn từ chuyên cần.
            </span>
          </div>

          <Link
            href={`/${schoolCode}/school/fee`}
            className="text-[#0070CE] font-semibold hover:underline"
          >
            Mở sổ quản lý học phí trường &rarr;
          </Link>
        </div>
      </div>

      {/* 4. Invoice Detail Modal */}
      {selectedInvoiceForDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                  <Icon name="receipt" size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Chi tiết hóa đơn {selectedInvoiceForDetail.invoiceNo}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedInvoiceForDetail.title} — {student.fullName} ({student.className || 'Lớp 11A1'})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInvoiceForDetail(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                aria-label="Đóng"
              >
                <Icon name="xmark" size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Status and Issue dates */}
              <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block mb-0.5">Trạng thái:</span>
                  <div>{renderStatusBadge(selectedInvoiceForDetail.status)}</div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Hạn thanh toán:</span>
                  <div className="font-semibold text-slate-800">{selectedInvoiceForDetail.dueDate}</div>
                </div>
              </div>

              {/* Line items list */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2 uppercase text-2xs tracking-wider">
                  Bảng kê các khoản thu
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {selectedInvoiceForDetail.items.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        {item.description && (
                          <div className="text-2xs text-slate-400">{item.description}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-800">{formatCurrencyVND(item.amount)}</div>
                        <div className="text-3xs text-slate-400">
                          {formatCurrencyVND(item.unitPrice)} x {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary totals */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Tổng tiền học phí:</span>
                  <span className="font-semibold">{formatCurrencyVND(selectedInvoiceForDetail.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Đã thanh toán:</span>
                  <span className="font-bold">{formatCurrencyVND(selectedInvoiceForDetail.paidAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-amber-700 pt-2 border-t border-slate-200 font-bold text-sm">
                  <span>Còn nợ cần thu:</span>
                  <span>
                    {formatCurrencyVND(
                      selectedInvoiceForDetail.remainingAmount !== undefined
                        ? selectedInvoiceForDetail.remainingAmount
                        : selectedInvoiceForDetail.totalAmount - selectedInvoiceForDetail.paidAmount
                    )}
                  </span>
                </div>
              </div>

              {/* Payment History */}
              {selectedInvoiceForDetail.paymentHistory && selectedInvoiceForDetail.paymentHistory.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-2 uppercase text-2xs tracking-wider">
                    Lịch sử các lần nộp tiền
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {selectedInvoiceForDetail.paymentHistory.map((pay) => (
                      <div key={pay.id} className="p-3 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">
                            {formatCurrencyVND(pay.amount)}
                          </div>
                          <div className="text-2xs text-slate-400">
                            {pay.paidAt} • {pay.transactionRef || 'Tiền mặt'}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-2xs font-semibold">
                          Thành công
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedInvoiceForDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
