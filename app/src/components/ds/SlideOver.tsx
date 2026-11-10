import React, { useEffect, useRef, ReactNode, CSSProperties, MouseEvent } from 'react';
import { Icon, IconName, IconButton, Button } from './index';

export interface SlideOverAction {
  label: ReactNode;
  icon?: IconName;
  onClick?: (e?: MouseEvent<any>) => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'default' | 'danger';
}

export interface SlideOverProps {
  open?: boolean;
  onClose: () => void;
  icon?: IconName;
  title: ReactNode;
  description?: ReactNode;
  width?: number | string;
  primaryAction?: SlideOverAction;
  secondaryAction?: SlideOverAction | null;
  extraAction?: SlideOverAction;
  footer?: ReactNode;
  closeOnOverlay?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function SlideOver({
  open = true,
  onClose,
  icon,
  title,
  description,
  width = 500,
  primaryAction,
  secondaryAction,
  extraAction,
  footer,
  closeOnOverlay = true,
  children,
  className = '',
  style,
}: SlideOverProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key & Lock body scroll
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sec = secondaryAction === undefined ? { label: 'Hủy', onClick: onClose } : secondaryAction;
  const pri = primaryAction;
  const ext = extraAction;
  const hasFooter = footer || pri || sec || ext;

  const cleanLabel = (label: ReactNode, icon?: IconName) => {
    if (typeof label === 'string' && icon && label.trim().startsWith('+')) {
      return label.trim().replace(/^\+\s*/, '');
    }
    return label;
  };

  const renderedFooter =
    footer ||
    (hasFooter ? (
      <div className="flex-none border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-3.5 sm:px-6 flex items-center justify-between gap-3">
        <div>
          {ext ? (
            <Button
              variant="text"
              icon={ext.icon}
              onClick={ext.onClick}
              disabled={ext.disabled}
            >
              {cleanLabel(ext.label, ext.icon)}
            </Button>
          ) : null}
        </div>
        <div className="flex items-center gap-2.5 ml-auto">
          {sec ? (
            <Button
              variant="secondary"
              onClick={sec.onClick}
              disabled={sec.disabled}
            >
              {cleanLabel(sec.label, sec.icon)}
            </Button>
          ) : null}
          {pri ? (
            <Button
              variant="primary"
              icon={pri.icon}
              onClick={pri.onClick}
              disabled={pri.disabled}
            >
              {cleanLabel(pri.label, pri.icon)}
            </Button>
          ) : null}
        </div>
      </div>
    ) : null);

  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ease-out animate-fadeIn"
        onClick={() => {
          if (closeOnOverlay) onClose();
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        {/* Slide-over panel container */}
        <div
          ref={panelRef}
          className={`w-screen max-w-full sm:max-w-none flex flex-col bg-[var(--bg-surface)] shadow-2xl transition-transform ease-out duration-300 transform translate-x-0 overflow-hidden ${className}`}
          style={{
            width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100vw' : widthStyle,
            ...style,
          }}
        >
          {/* Header */}
          <div className="flex-none flex items-center justify-between gap-3 px-5 py-4 sm:px-6 border-b border-[var(--border-default)] bg-[var(--bg-subtle)]/70">
            <div className="flex items-center gap-3 min-w-0">
              {icon && (
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: 'var(--semantic-info-soft)',
                    color: 'var(--eco-blue-strong)',
                  }}
                >
                  <Icon name={icon} size={18} />
                </div>
              )}
              <div className="min-w-0">
                <h3
                  id="slide-over-title"
                  className="title-sm truncate"
                  style={{ color: 'var(--text-heading)', margin: 0, fontWeight: 700 }}
                >
                  {title}
                </h3>
                {description && (
                  <p
                    className="body-xs truncate mt-0.5"
                    style={{ color: 'var(--text-subtle)', margin: 0 }}
                  >
                    {description}
                  </p>
                )}
              </div>
            </div>

            <IconButton
              icon="xmark"
              size="md"
              label="Đóng"
              onClick={onClose}
              className="shrink-0 text-[var(--text-subtle)] hover:text-[var(--text-heading)]"
            />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-6 space-y-4">
            {children}
          </div>

          {/* Footer */}
          {renderedFooter}
        </div>
      </div>
    </div>
  );
}

export default SlideOver;
