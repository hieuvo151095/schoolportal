import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faEye,
  faEyeSlash,
  faCopy,
  faCheck,
  faHistory,
  faShieldAlt,
  faCircleCheck,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/toastSlice';

export const SepayIntegrationBlock: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const sepay = useAppSelector((state) => state.settingFee.sepay);

  const [showSecret, setShowSecret] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const handleCopy = (text: string, type: 'token' | 'webhook') => {
    navigator.clipboard.writeText(text);
    if (type === 'token') {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } else {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
    dispatch(
      addToast({
        type: 'success',
        message: `Đã sao chép ${type === 'token' ? 'API Secret Token' : 'Webhook URL'} vào clipboard!`
      })
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FontAwesomeIcon icon={faBolt} className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-slate-800">
                Thanh toán tự động Sepay
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-emerald-600" />
                Đang kết nối
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cổng thanh toán tự động qua ngân hàng và quét mã VietQR dành cho phụ huynh.
            </p>
          </div>
        </div>

        {/* View History Button */}
        <Link
          href={`/${schoolCode}/setting/fee/payment-history`}
          className="px-3.5 py-1.5 text-xs font-semibold text-[#0070CE] hover:text-[#005bb5] bg-blue-50 hover:bg-blue-100/80 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5"
        >
          <FontAwesomeIcon icon={faHistory} className="w-3.5 h-3.5" />
          <span>Lịch sử thanh toán Sepay</span>
        </Link>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* API Secret Token (Masked with Eye Toggle) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              API Secret Token (Sepay Secret Key)
            </label>
            <div className="relative flex items-center">
              <input
                type={showSecret ? 'text' : 'password'}
                readOnly
                value={sepay.apiSecretToken}
                className="w-full pl-3.5 pr-20 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none select-all"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded transition-colors"
                  title={showSecret ? 'Ẩn Secret Key' : 'Hiển thị Secret Key'}
                >
                  <FontAwesomeIcon
                    icon={showSecret ? faEyeSlash : faEye}
                    className="w-3.5 h-3.5"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(sepay.apiSecretToken, 'token')}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded transition-colors"
                  title="Sao chép Token"
                >
                  <FontAwesomeIcon
                    icon={copiedToken ? faCheck : faCopy}
                    className={`w-3.5 h-3.5 ${copiedToken ? 'text-emerald-600' : ''}`}
                  />
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Khóa bí mật xác thực kết nối truyền nhận webhook thanh toán.
            </p>
          </div>

          {/* Webhook URL (Read-only with Copy) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Webhook URL nhận thông báo biến động số dư
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={sepay.webhookUrl}
                className="w-full pl-3.5 pr-10 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(sepay.webhookUrl, 'webhook')}
                className="absolute right-1.5 p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded transition-colors"
                title="Sao chép Webhook URL"
              >
                <FontAwesomeIcon
                  icon={copiedWebhook ? faCheck : faCopy}
                  className={`w-3.5 h-3.5 ${copiedWebhook ? 'text-emerald-600' : ''}`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Địa chỉ endpoint nhận callback xử lý gạch nợ hóa đơn tức thì.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-100 flex items-start gap-3">
          <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 text-[#0070CE] mt-0.5 shrink-0" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">Bảo mật kết nối tự động: </span>
            Hệ thống tự động đồng bộ hóa giao dịch thanh toán trực tuyến qua Sepay mỗi khi phát sinh biến động số dư. Cấu hình tích hợp được kích hoạt mặc định bởi quản trị viên hệ thống.
          </div>
        </div>
      </div>
    </div>
  );
};
