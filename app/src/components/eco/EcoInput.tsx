import React, { useState } from 'react';

export type EcoInputSize = 'sm' | 'md' | 'lg';

export interface EcoInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: string;
  error?: boolean | string;
  warning?: boolean | string;
  helperText?: string;
  size?: EcoInputSize;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  fullWidth?: boolean;
}

export const EcoInput: React.FC<EcoInputProps> = ({
  label,
  error,
  warning,
  helperText,
  size = 'md',
  prefix,
  suffix,
  clearable = false,
  onClear,
  fullWidth = true,
  disabled = false,
  required = false,
  value,
  defaultValue,
  onChange,
  className = '',
  style,
  type = 'text',
  id,
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : ''
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value) : internalValue;

  const hasError = Boolean(error);
  const hasWarning = Boolean(warning) && !hasError;

  // Resolve message text
  const errorMessage = typeof error === 'string' ? error : undefined;
  const warningMessage = typeof warning === 'string' ? warning : undefined;
  const bottomMessage = errorMessage || warningMessage || helperText;

  const sizeStyles: Record<EcoInputSize, { height: string; fontSize: string; padding: string }> = {
    sm: { height: '32px', fontSize: '13px', padding: '0 10px' },
    md: { height: '40px', fontSize: '14px', padding: '0 12px' },
    lg: { height: '48px', fontSize: '16px', padding: '0 14px' },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onClear?.();
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  let borderColor = 'var(--border-default)';
  if (hasError) {
    borderColor = 'var(--color-danger)';
  } else if (hasWarning) {
    borderColor = 'var(--orange-citrus)';
  } else if (isFocused) {
    borderColor = 'var(--eco-blue)';
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-sans-native)',
    boxSizing: 'border-box',
    ...style,
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: currentSize.height,
    borderRadius: 'var(--radius-sm)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor,
    backgroundColor: disabled ? 'var(--bg-canvas)' : 'var(--bg-surface)',
    boxShadow: isFocused ? '0 0 0 2px rgba(0, 111, 218, 0.15)' : 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    height: '100%',
    padding: currentSize.padding,
    fontSize: currentSize.fontSize,
    lineHeight: currentSize.height,
    fontFamily: 'var(--font-sans-native)',
    color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    minWidth: 0,
  };

  return (
    <div className={`eco-input-group ${className}`} style={containerStyle}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: hasError ? 'var(--color-danger)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}

      <div style={wrapperStyle}>
        {prefix && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              paddingLeft: '10px',
              color: 'var(--text-secondary)',
              flexShrink: 0,
            }}
          >
            {prefix}
          </span>
        )}

        <input
          id={id}
          type={type}
          disabled={disabled}
          value={currentValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={inputStyle}
          {...rest}
        />

        {clearable && currentValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-tertiary)',
              padding: '0 8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
            aria-label="Xóa nội dung"
          >
            ✕
          </button>
        )}

        {suffix && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              paddingRight: '10px',
              color: 'var(--text-secondary)',
              flexShrink: 0,
            }}
          >
            {suffix}
          </span>
        )}
      </div>

      {bottomMessage && (
        <span
          style={{
            fontSize: '12px',
            lineHeight: '16px',
            color: hasError
              ? 'var(--color-danger)'
              : hasWarning
              ? 'var(--orange-citrus)'
              : 'var(--text-tertiary)',
          }}
        >
          {bottomMessage}
        </span>
      )}
    </div>
  );
};

export default EcoInput;
