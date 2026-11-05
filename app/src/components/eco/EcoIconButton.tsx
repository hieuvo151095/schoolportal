import React from 'react';

export type EcoIconButtonVariant = 'default' | 'ghost' | 'filled' | 'overlay' | 'outline';
export type EcoIconButtonSize = 'sm' | 'md' | 'lg';

export interface EcoIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: EcoIconButtonVariant;
  size?: EcoIconButtonSize;
  label?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const EcoIconButton: React.FC<EcoIconButtonProps> = ({
  variant = 'ghost',
  size = 'md',
  label,
  loading = false,
  disabled = false,
  children,
  className = '',
  style,
  type = 'button',
  ...rest
}) => {
  const dims: Record<EcoIconButtonSize, { size: string; iconSize: string }> = {
    sm: { size: '28px', iconSize: '14px' },
    md: { size: '36px', iconSize: '18px' },
    lg: { size: '44px', iconSize: '22px' },
  };

  const variantStyles: Record<EcoIconButtonVariant, React.CSSProperties> = {
    default: {
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-default)',
    },
    outline: {
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-default)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      borderColor: 'transparent',
    },
    filled: {
      backgroundColor: 'var(--eco-blue)',
      color: '#ffffff',
      borderColor: 'transparent',
    },
    overlay: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      color: 'var(--text-primary)',
      borderColor: 'transparent',
      boxShadow: 'var(--shadow-xs)',
    },
  };

  const isDisabled = disabled || loading;
  const currentDim = dims[size] || dims.md;

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: currentDim.size,
    height: currentDim.size,
    borderRadius: 'var(--radius-full)',
    borderWidth: '1px',
    borderStyle: 'solid',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.45 : 1,
    boxSizing: 'border-box',
    padding: 0,
    userSelect: 'none',
    transition: 'all 0.15s ease-in-out',
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-label={label}
      title={label}
      style={baseStyle}
      className={`eco-icon-btn eco-icon-btn--${variant} eco-icon-btn--${size} ${className}`}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'eco-spin 0.75s linear infinite',
          }}
          aria-hidden="true"
        />
      ) : (
        children
      )}
    </button>
  );
};

export default EcoIconButton;
