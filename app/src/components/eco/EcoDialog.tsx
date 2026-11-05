import React, { useEffect } from 'react';
import { EcoButton } from './EcoButton';

export interface EcoDialogProps {
  open?: boolean;
  visible?: boolean;
  title?: React.ReactNode;
  message?: React.ReactNode;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  confirmVariant?: 'primary' | 'danger';
  loading?: boolean;
  backdrop?: boolean;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const EcoDialog: React.FC<EcoDialogProps> = ({
  open,
  visible,
  title,
  message,
  children,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Đóng',
  onConfirm,
  onCancel,
  onClose,
  confirmVariant = 'primary',
  loading = false,
  backdrop = true,
  maxWidth = '420px',
  className = '',
  style,
}) => {
  const isOpen = open !== undefined ? open : Boolean(visible);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
        else if (onCancel) onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onCancel]);

  // Lock background scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && backdrop) {
      if (onClose) onClose();
      else if (onCancel) onCancel();
    }
  };

  const dialogCard = (
    <div
      role="alertdialog"
      aria-modal="true"
      className={`eco-dialog ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '90%',
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        padding: '24px 20px 20px',
        color: 'var(--text-primary)',
        boxSizing: 'border-box',
        animation: 'eco-fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
    >
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '24px',
              fontFamily: 'var(--font-sans-native)',
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </h3>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                fontSize: '18px',
                lineHeight: 1,
                padding: '4px',
              }}
              aria-label="Đóng hộp thoại"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {message && (
        <div
          style={{
            fontSize: '14px',
            lineHeight: '20px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans-native)',
          }}
        >
          {message}
        </div>
      )}

      {children && <div>{children}</div>}

      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
          marginTop: '8px',
        }}
      >
        {cancelLabel && (
          <EcoButton
            variant="secondary"
            size="md"
            onClick={onCancel || onClose}
            disabled={loading}
          >
            {cancelLabel}
          </EcoButton>
        )}
        {confirmLabel && (
          <EcoButton
            variant={confirmVariant === 'danger' ? 'danger' : 'primary'}
            size="md"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </EcoButton>
        )}
      </div>
    </div>
  );

  if (!backdrop) {
    return dialogCard;
  }

  return (
    <div
      className="eco-dialog-layer"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-overlay)',
        backdropFilter: 'blur(2px)',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      {dialogCard}
    </div>
  );
};

export default EcoDialog;
