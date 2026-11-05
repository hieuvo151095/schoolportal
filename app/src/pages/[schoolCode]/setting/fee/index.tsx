import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH, faArrowLeft, faSave, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  InvoiceNoteBlock,
  SepayIntegrationBlock,
  SInvoiceBlock,
  LatePickupAndRefundBlock,
  ReconciliationEmailBlock,
  UnsavedChangesModal
} from '@/modules/settings/fee';
import { isAnyBlockDirty } from '@/utils/settingFeeValidation';
import { discardAllChanges, saveAllChanges } from '@/store/slices/settingFeeSlice';
import { addToast } from '@/store/slices/toastSlice';
import { PageHeader, Button } from '@/components/ds';

export default function SettingFeePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const dirtyFlags = useAppSelector((state) => state.settingFee.dirtyFlags);
  const hasUnsaved = isAnyBlockDirty(dirtyFlags);

  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Determine dirty block names for the modal
  const dirtyBlockNames: string[] = [];
  if (dirtyFlags.invoiceNote) dirtyBlockNames.push('Ghi chú hóa đơn học phí');
  if (dirtyFlags.sinvoice) dirtyBlockNames.push('Hóa đơn điện tử SInvoice');
  if (dirtyFlags.latePickupAndRefund) dirtyBlockNames.push('Cấu hình trả trễ & Báo vắng');
  if (dirtyFlags.reconciliation) dirtyBlockNames.push('Cấu hình đối soát học phí');

  // Route Guard for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsaved) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleRouteChange = (url: string) => {
      if (hasUnsaved && url !== router.asPath) {
        setPendingRoute(url);
        setShowUnsavedModal(true);
        router.events.emit('routeChangeError');
        throw 'Route change aborted for unsaved changes confirmation';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [hasUnsaved, router.asPath]);

  const handleConfirmLeave = () => {
    setShowUnsavedModal(false);
    dispatch(discardAllChanges());
    if (pendingRoute) {
      router.push(pendingRoute);
    }
  };

  const handleSaveAll = () => {
    dispatch(saveAllChanges());
    dispatch(
      addToast({
        type: 'success',
        message: 'Đã lưu tất cả các thay đổi cấu hình học phí!'
      })
    );
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Cấu hình Học phí | Finviet School Operating Portal</title>
      </Head>

      <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Page Header */}
          <PageHeader
            title="Cấu hình Học phí"
            description="Quản lý quy tắc xuất hóa đơn, kết nối thanh toán tự động, phí trả trễ và đối soát."
            actions={
              hasUnsaved ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--semantic-amber, #b45309)',
                      background: '#fffbeb',
                      border: '1px solid #fef3c7',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                    }}
                  >
                    Có {dirtyBlockNames.length} mục có thay đổi chưa lưu
                  </span>
                  <Button variant="primary" icon="check" onClick={handleSaveAll}>
                    Lưu tất cả thay đổi
                  </Button>
                </div>
              ) : null
            }
          />

          {/* Configuration Form Blocks (5 blocks) */}
          <div className="space-y-6 pb-12">
            {/* Block 1: Ghi chú hóa đơn học phí */}
            <InvoiceNoteBlock />

            {/* Block 2: Thanh toán tự động Sepay */}
            <SepayIntegrationBlock />

            {/* Block 3: Hóa đơn điện tử SInvoice */}
            <SInvoiceBlock />

            {/* Block 4: Cấu hình trả trễ & Báo vắng */}
            <LatePickupAndRefundBlock />

            {/* Block 5: Cấu hình đối soát học phí */}
            <ReconciliationEmailBlock />
          </div>
        </div>
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        dirtyBlocks={dirtyBlockNames}
        onConfirmLeave={handleConfirmLeave}
        onStay={() => setShowUnsavedModal(false)}
      />
    </PortalLayout>
  );
}
