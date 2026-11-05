import React from 'react';

export type EcoButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'soil'
  | 'outline'
  | 'plain'
  | 'brand'
  | 'soft';

export type EcoButtonSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
export type EcoButtonShape = 'default' | 'round' | 'pill' | 'border';

export interface EcoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: EcoButtonVariant;
  size?: EcoButtonSize;
  shape?: EcoButtonShape;
  fullWidth?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const EcoButton: React.FC<EcoButtonProps> = ({
  variant = 'primary',
  size = 'md',
  shape = 'default',
  fullWidth = false,
  loading = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  children,
  className = '',
  style,
  type = 'button',
  ...rest
}) => {
  // Normalize sizes
  const normalizedSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : size === 'medium' ? 'md' : size;

  // Size styling map
  const sizeStyles: Record<'sm' | 'md' | 'lg', React.CSSProperties> = {
    sm: {
      height: '32px',
      padding: '0 12px',
      fontSize: '13px',
      lineHeight: '18px',
      gap: '6px',
    },
    md: {
      height: '40px',
      padding: '0 16px',
      fontSize: '14px',
      lineHeight: '20px',
      gap: '8px',
    },
    lg: {
      height: '48px',
      padding: '0 20px',
      fontSize: '16px',
      lineHeight: '24px',
      gap: '10px',
    },
  };

  // Normalize variant aliases
  const isBrand = variant === 'primary' || variant === 'brand' || variant === 'soil';
  const isOutline = variant === 'secondary' || variant === 'outline';
  const isGhost = variant === 'ghost' || variant === 'plain';
  const isSoft = variant === 'soft';
  const isDanger = variant === 'danger';

  // Variant styling map
  let variantStyle: React.CSSProperties = {
    backgroundColor: 'var(--eco-blue)',
    color: '#ffffff',
    borderColor: 'transparent',
  };

  if (isOutline) {
    variantStyle = {
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-default)',
    };
  } else if (isGhost) {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--eco-blue)',
      borderColor: 'transparent',
    };
  } else if (isSoft) {
    variantStyle = {
      backgroundColor: 'var(--bg-neutral-soft)',
      color: 'var(--text-primary)',
      borderColor: 'transparent',
    };
  } else if (isDanger) {
    variantStyle = {
      backgroundColor: 'var(--color-danger)',
      color: '#ffffff',
      borderColor: 'transparent',
    };
  }

  // Radii mapping
  const borderRadius =
    shape === 'round' || shape === 'pill'
      ? 'var(--radius-full)'
      : 'var(--radius-md)';

  const isDisabled = disabled || loading;

  const baseStyle: React.CSSProperties = {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-sans-native)',
    fontWeight: 500,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    boxSizing: 'border-box',
    textDecoration: 'none',
    userSelect: 'none',
    transition: 'all 0.15s ease-in-out',
    ...sizeStyles[normalizedSize],
    ...variantStyle,
    ...style,
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      style={baseStyle}
      className={`eco-btn eco-btn--${variant} eco-btn--${normalizedSize} ${className}`}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'eco-spin 0.75s linear infinite',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      ) : (
        leadingIcon && <span className="eco-btn__leading" style={{ display: 'inline-flex', alignItems: 'center' }}>{leadingIcon}</span>
      )}
      {children && <span className="eco-btn__label">{children}</span>}
      {!loading && trailingIcon && (
        <span className="eco-btn__trailing" style={{ display: 'inline-flex', alignItems: 'center' }}>{trailingIcon}</span>
      )}
    </button>
  );
};

export default EcoButton;
