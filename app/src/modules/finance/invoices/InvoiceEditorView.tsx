/**
 * Invoice Editor View Component (BR06)
 * Dedicated editor for draft invoices (da_tao), permitting editing of
 * line items, unit prices, quantities, discounts, and HĐĐT toggle.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Reference: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR06)
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon, Dropdown, DropdownOption } from '@/components/ds';
import { useAppDispatch } from '../../../store';
import { updateDraftInvoice } from '../../../store/slices/invoiceSlice';
import { InvoiceRecord, InvoiceLineItem, InvoiceLineItemCategory } from '../../../types/invoice';
import {
  calculateLineItemTotal,
  calculateInvoiceTotals,
  formatVND,
  formatCurrencyNumber,
  parseCurrencyNumber,
} from '../../../utils/invoiceValidation';

interface InvoiceEditorViewProps {
  invoice: InvoiceRecord;
}

export const InvoiceEditorView: React.FC<InvoiceEditorViewProps> = ({ invoice }) => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  // Guard: Only draft invoices can be edited (BR03, BR06)
  if (invoice.status !== 'da_tao') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-lg mx-auto">
        <Icon name="circle-info" size={32} className="text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Không thể chỉnh sửa</h2>
        <p className="text-xs text-slate-500 mt-2">
          Hóa đơn này đang ở trạng thái &quot;{invoice.status}&quot;. Hệ thống chỉ cho phép cập nhật khi hóa đơn còn ở trạng thái Bản nháp (Đã tạo).
        </p>
        <Link
          href={`/${schoolCode}/school/fee/${invoice.id}`}
          className="inline-block mt-4 px-4 py-2 bg-[#0070CE] text-white text-xs font-bold rounded-lg"
        >
          Trở về trang chi tiết
        </Link>
      </div>
    );
  }

  const [issueDate, setIssueDate] = useState(invoice.issueDate);
  const [dueDate, setDueDate] = useState(invoice.dueDate);
  const [exportElectronicInvoice, setExportElectronicInvoice] = useState(
    invoice.exportElectronicInvoice
  );
  const [items, setItems] = useState<InvoiceLineItem[]>([...invoice.items]);

  // Update item field
  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };
    const explicitAmount =
      current.discountType === 'fixed_amount' ? current.discountAmount : undefined;
    const { amount, discountAmount } = calculateLineItemTotal(
      current.unitPrice,
      current.quantity,
      current.discountPercent,
      explicitAmount
    );
    current.amount = amount;
    current.discountAmount = discountAmount;
    updated[index] = current;
    setItems(updated);
  };

  // Switch discount type between percent (%) and fixed_amount (đ)
  const handleSwitchDiscountType = (
    index: number,
    newType: 'percent' | 'fixed_amount'
  ) => {
    const updated = [...items];
    const current = updated[index];
    const gross = current.unitPrice * current.quantity;

    if (newType === 'fixed_amount') {
      const amount =
        current.discountAmount !== undefined && current.discountAmount > 0
          ? current.discountAmount
          : Math.round(gross * ((current.discountPercent || 0) / 100));
      const calc = calculateLineItemTotal(
        current.unitPrice,
        current.quantity,
        current.discountPercent,
        amount
      );
      updated[index] = {
        ...current,
        discountType: 'fixed_amount',
        discountAmount: calc.discountAmount,
        amount: calc.amount,
      };
    } else {
      const percent =
        current.discountPercent > 0
          ? current.discountPercent
          : gross > 0 && current.discountAmount
          ? Math.min(100, Math.round((current.discountAmount / gross) * 100))
          : 0;
      const calc = calculateLineItemTotal(
        current.unitPrice,
        current.quantity,
        percent
      );
      updated[index] = {
        ...current,
        discountType: 'percent',
        discountPercent: percent,
        discountAmount: calc.discountAmount,
        amount: calc.amount,
      };
    }
    setItems(updated);
  };

  // Change discount value in either % or VND
  const handleDiscountValueChange = (index: number, rawValue: string) => {
    const updated = [...items];
    const current = updated[index];
    const isFixed = current.discountType === 'fixed_amount';
    const gross = current.unitPrice * current.quantity;

    if (isFixed) {
      const num = Math.min(gross, parseCurrencyNumber(rawValue));
      const calc = calculateLineItemTotal(
        current.unitPrice,
        current.quantity,
        current.discountPercent,
        num
      );
      updated[index] = {
        ...current,
        discountAmount: calc.discountAmount,
        amount: calc.amount,
        discountPercent: gross > 0 ? Math.round((calc.discountAmount / gross) * 100) : 0,
      };
    } else {
      const num = Math.min(100, Math.max(0, Number(rawValue) || 0));
      const calc = calculateLineItemTotal(
        current.unitPrice,
        current.quantity,
        num
      );
      updated[index] = {
        ...current,
        discountPercent: num,
        discountAmount: calc.discountAmount,
        amount: calc.amount,
      };
    }
    setItems(updated);
  };

  const handleAddItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item-${Date.now()}-${items.length + 1}`,
      category: 'khac',
      name: 'Khoản thu bổ sung',
      unitPrice: 100000,
      quantity: 1,
      discountPercent: 0,
      discountAmount: 0,
      amount: 100000,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const totals = calculateInvoiceTotals(items);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateDraftInvoice({
        id: invoice.id,
        items,
        issueDate,
        dueDate,
        exportElectronicInvoice,
      })
    );
    alert('Đã lưu thành công các thay đổi hóa đơn!');
    router.push(`/${schoolCode}/school/fee/${invoice.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${schoolCode}/school/fee/${invoice.id}`}
              className="h-10 px-3.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-2"
            >
              <Icon name="arrow-left" size={13} className="text-slate-500" />
              <span>Hủy bỏ</span>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Chỉnh sửa hóa đơn {invoice.invoiceNo}
              </h1>
              <div className="text-xs text-slate-500 mt-0.5">
                Học sinh: <span className="font-bold text-slate-700">{invoice.studentName}</span> ({invoice.studentCode}) • Lớp: {invoice.className}
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="h-10 px-5 bg-[#0070CE] hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Icon name="check" size={14} />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>

      {/* Date & Metadata */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Thông tin ngày & hóa đơn điện tử
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ngày hóa đơn
            </label>
            <input
              type="text"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hạn thanh toán
            </label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
            />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={exportElectronicInvoice}
                onChange={(e) => setExportElectronicInvoice(e.target.checked)}
                className="w-4 h-4 text-[#0070CE] rounded border-slate-300 focus:ring-[#0070CE]"
              />
              <span>Xuất hóa đơn điện tử (HĐĐT)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Itemized Lines Editor (BR06) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Chi tiết các dòng khoản thu (BR06)
          </h2>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-xs font-bold text-[#0070CE] hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Icon name="plus" size={12} />
            <span>Thêm dòng thu</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-xs font-bold text-slate-600">
                <th className="py-2 px-3">Khoản thu</th>
                <th className="py-2 px-3">Mô tả</th>
                <th className="py-2 px-3 text-right w-36">Đơn giá</th>
                <th className="py-2 px-3 text-center w-20">Số lượng</th>
                <th className="py-2 px-3 text-right w-36">Giảm trừ</th>
                <th className="py-2 px-3 text-right w-36">Thành tiền</th>
                <th className="py-2 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {items.map((item, idx) => {
                const categoryOptions: DropdownOption<InvoiceLineItemCategory>[] = [
                  { value: 'hoc_phi', label: 'Học phí' },
                  { value: 'tien_an', label: 'Tiền ăn' },
                  { value: 'co_so_vat_chat', label: 'Cơ sở vật chất' },
                  { value: 'ngoai_khoa', label: 'Ngoại khóa' },
                  { value: 'phi_tra_tre', label: 'Phí trả học sinh trễ' },
                  { value: 'khac', label: 'Khoản khác' },
                ];

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 min-w-[190px]">
                      <Dropdown
                        value={item.category}
                        onChange={(val) =>
                          handleUpdateItem(idx, 'category', val)
                        }
                        options={categoryOptions}
                        size="sm"
                        fullWidth
                      />
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                        className="w-full h-7 px-2 mt-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.description || ''}
                        placeholder="Ghi chú dòng"
                        onChange={(e) =>
                          handleUpdateItem(idx, 'description', e.target.value)
                        }
                        className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-slate-600"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <input
                        type="text"
                        value={item.unitPrice === 0 ? '' : formatCurrencyNumber(item.unitPrice)}
                        placeholder="0"
                        onChange={(e) => {
                          const val = parseCurrencyNumber(e.target.value);
                          handleUpdateItem(idx, 'unitPrice', val);
                        }}
                        className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-right font-medium focus:border-[#0070CE] focus:ring-1 focus:ring-[#0070CE]"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        value={item.quantity}
                        disabled={item.isMealFee}
                        title={item.isMealFee ? 'Tiền ăn tự khóa số ngày học thực tế' : ''}
                        onChange={(e) =>
                          handleUpdateItem(idx, 'quantity', Number(e.target.value))
                        }
                        className={`w-full h-8 px-2 border rounded text-xs text-center font-bold ${
                          item.isMealFee
                            ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center justify-end w-32 bg-white border border-slate-200 rounded overflow-hidden focus-within:border-[#0070CE] focus-within:ring-1 focus-within:ring-[#0070CE]">
                          <input
                            type="text"
                            value={
                              item.discountType === 'fixed_amount'
                                ? (item.discountAmount === 0 || item.discountAmount === undefined)
                                  ? '0'
                                  : formatCurrencyNumber(item.discountAmount)
                                : (item.discountPercent ?? 0)
                            }
                            onChange={(e) => handleDiscountValueChange(idx, e.target.value)}
                            className="w-full h-8 px-2 bg-transparent text-xs text-right text-emerald-600 font-bold focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleSwitchDiscountType(
                                idx,
                                item.discountType === 'fixed_amount' ? 'percent' : 'fixed_amount'
                              )
                            }
                            className="h-8 px-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border-l border-slate-200 cursor-pointer transition-colors shrink-0"
                            title="Chuyển đổi đơn vị (% hoặc đ)"
                          >
                            {item.discountType === 'fixed_amount' ? 'đ' : '%'}
                          </button>
                        </div>
                        {item.discountAmount > 0 && (
                          <span className="text-[11px] font-semibold text-emerald-600 tracking-tight whitespace-nowrap">
                            -{formatVND(item.discountAmount)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {formatVND(item.amount)}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {!item.isRequired && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Icon name="trash" size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals box */}
        <div className="border-t border-slate-200 pt-3 flex justify-end">
          <div className="w-64 space-y-1.5 text-xs text-right">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính:</span>
              <span className="font-semibold">{formatVND(totals.subtotal)}</span>
            </div>
            {totals.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Giảm trừ:</span>
                <span className="font-semibold">-{formatVND(totals.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-1.5">
              <span>Tổng tiền mới:</span>
              <span className="text-[#0070CE]">{formatVND(totals.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
