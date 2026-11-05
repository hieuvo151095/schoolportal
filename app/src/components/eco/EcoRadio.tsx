import React from 'react';

export interface EcoRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const EcoRadio: React.FC<EcoRadioProps> = ({
  checked,
  defaultChecked,
  disabled = false,
  label,
  description,
  onChange,
  className = '',
  style,
  id,
  ...rest
}) => {
  const isChecked = Boolean(checked);

  const outerStyle: React.CSSProperties = {
    width: '18px',
    height: '18px',
    borderRadius: 'var(--radius-full)',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: isChecked ? 'var(--eco-blue)' : 'var(--border-default)',
    backgroundColor: 'var(--bg-surface)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    transition: 'all 0.15s ease-in-out',
  };

  return (
    <label
      className={`eco-radio ${className}`}
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
          id={id}
          type="radio"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={onChange}
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
        <span style={outerStyle} aria-hidden="true">
          {isChecked && (
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--eco-blue)',
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

export default EcoRadio;
