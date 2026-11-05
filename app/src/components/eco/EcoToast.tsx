import React, { useEffect } from 'react';

export type EcoToastType =
  | 'neutral'
  | 'informative'
  | 'positive'
  | 'negative'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export interface EcoToastProps {
  open?: boolean;
  visible?: boolean;
  message: React.ReactNode;
  type?: EcoToastType;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const EcoToast: React.FC<EcoToastProps> = ({
  open = true,
  visible,
  message,
  type = 'neutral',
  actionLabel,
  onAction,
  onClose,
  duration = 4000,
  className = '',
  style,
}) => {
  const isOpen = visible !== undefined ? visible : open;

  useEffect(() => {
    if (!isOpen || !duration || duration <= 0) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  // Normalize semantic types
  const isPositive = type === 'positive' || type === 'success';
  const isNegative = type === 'negative' || type === 'danger';
  const isInformative = type === 'informative' || type === 'info';

  let iconText = 'ℹ️';
  let badgeColor = 'var(--text-inverse)';
  let bgColor = 'rgba(31, 31, 31, 0.92)';

  if (isPositive) {
    iconText = '✓';
    badgeColor = 'var(--deep-aqua)';
  } else if (isNegative) {
    iconText = '✕';
    badgeColor = 'var(--color-danger)';
  } else if (isInformative) {
    iconText = 'ℹ';
    badgeColor = 'var(--artic-blue)';
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`eco-toast eco-toast--${type} ${className}`}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 18px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: bgColor,
        color: 'var(--text-inverse)',
        boxShadow: 'var(--shadow-xl)',
        fontFamily: 'var(--font-sans-native)',
        fontSize: '14px',
        lineHeight: '20px',
        maxWidth: '90vw',
        boxSizing: 'border-box',
        animation: 'eco-fade-in 0.2s ease',
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: badgeColor,
          color: isPositive || isNegative ? '#FFFFFF' : '#1F1F1F',
          fontSize: '11px',
          fontWeight: 700,
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {iconText}
      </span>

      <span style={{ flex: 1 }}>{message}</span>

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--eco-yellow)',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '2px 6px',
            fontSize: '13px',
          }}
        >
          {actionLabel}
        </button>
      )}

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '2px',
            marginLeft: '4px',
            lineHeight: 1,
          }}
          aria-label="Đóng thông báo"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default EcoToast;
