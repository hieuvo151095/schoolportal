import React, { useRef, useEffect } from 'react';

export interface EcoCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EcoCheckbox: React.FC<EcoCheckboxProps> = ({
  checked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
  label,
  description,
  onCheckedChange,
  onChange,
  className = '',
  style,
  id,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
    onChange?.(e);
  };

  const isChecked = Boolean(checked);
  const isActive = isChecked || indeterminate;

  const boxStyle: React.CSSProperties = {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: isActive ? 'var(--eco-blue)' : 'var(--border-default)',
    backgroundColor: isActive ? 'var(--eco-blue)' : 'var(--bg-surface)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    transition: 'all 0.15s ease-in-out',
  };

  return (
    <label
      className={`eco-checkbox ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: description ? 'flex-start' : 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontFamily: 'var(--font-sans-native)',
        color: 'var(--text-primary)',
        userSelect: 'none',
        ...style,
      }}
    >
      <span style={{ position: 'relative', display: 'inline-flex', marginTop: description ? '2px' : 0 }}>
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            margin: 0,
            cursor: 'inherit',
            width: '18px',
            height: '18px',
          }}
          {...rest}
        />
        <span style={boxStyle} aria-hidden="true">
          {isChecked && !indeterminate && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6L5 8.5L9.5 3.5"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {indeterminate && (
            <span
              style={{
                width: '8px',
                height: '2px',
                backgroundColor: '#FFFFFF',
                borderRadius: '1px',
              }}
            />
          )}
        </span>
      </span>

      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {label && <span style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 500 }}>{label}</span>}
          {description && (
            <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

export default EcoCheckbox;
