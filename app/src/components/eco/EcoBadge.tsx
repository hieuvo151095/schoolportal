import React from 'react';

export type EcoBadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type EcoBadgeSize = 'sm' | 'md';
export type EcoBadgeType = 'dot' | 'text';

export interface EcoBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: EcoBadgeVariant;
  size?: EcoBadgeSize;
  type?: EcoBadgeType;
  dot?: boolean;
  count?: number;
  maxCount?: number;
  children?: React.ReactNode;
}

export const EcoBadge: React.FC<EcoBadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  type = 'text',
  dot = false,
  count,
  maxCount = 99,
  children,
  className = '',
  style,
  ...rest
}) => {
  const isDotOnly = type === 'dot' || (dot && !children && count === undefined);

  const variantMap: Record<
    EcoBadgeVariant,
    { bg: string; text: string; dotColor: string; border?: string }
  > = {
    neutral: {
      bg: 'var(--bg-canvas)',
      text: 'var(--text-secondary)',
      dotColor: 'var(--text-tertiary)',
    },
    info: {
      bg: 'rgba(74, 195, 255, 0.16)',
      text: 'var(--eco-blue)',
      dotColor: 'var(--artic-blue)',
    },
    success: {
      bg: 'rgba(0, 193, 193, 0.16)',
      text: '#008b8b',
      dotColor: 'var(--deep-aqua)',
    },
    warning: {
      bg: 'rgba(247, 135, 0, 0.16)',
      text: 'var(--color-warning-text)',
      dotColor: 'var(--orange-citrus)',
    },
    danger: {
      bg: 'rgba(192, 38, 58, 0.12)',
      text: 'var(--color-danger)',
      dotColor: 'var(--color-danger)',
    },
  };

  const v = variantMap[variant] || variantMap.neutral;

  // Dot-only badge rendering (e.g. unread indicator)
  if (isDotOnly) {
    return (
      <span
        aria-hidden="true"
        className={`eco-badge eco-badge--dot eco-badge--${variant} ${className}`}
        style={{
          display: 'inline-block',
          width: size === 'sm' ? '6px' : '8px',
          height: size === 'sm' ? '6px' : '8px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: v.dotColor,
          flexShrink: 0,
          ...style,
        }}
        {...rest}
      />
    );
  }

  // Display text: either count or children
  let content = children;
  if (count !== undefined) {
    content = count > maxCount ? `${maxCount}+` : count;
  }

  const sizeMap: Record<EcoBadgeSize, { fontSize: string; padding: string; height: string }> = {
    sm: { fontSize: '11px', padding: '1px 6px', height: '18px' },
    md: { fontSize: '12px', padding: '2px 8px', height: '22px' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    borderRadius: 'var(--radius-full)',
    fontFamily: 'var(--font-sans-native)',
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    backgroundColor: v.bg,
    color: v.text,
    boxSizing: 'border-box',
    ...currentSize,
    ...style,
  };

  return (
    <span
      className={`eco-badge eco-badge--${variant} eco-badge--${size} ${className}`}
      style={baseStyle}
      {...rest}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: v.dotColor,
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      )}
      {content}
    </span>
  );
};

export default EcoBadge;
