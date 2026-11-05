import React from 'react';

export interface EcoSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EcoSwitch: React.FC<EcoSwitchProps> = ({
  checked,
  defaultChecked,
  disabled = false,
  label,
  onCheckedChange,
  onChange,
  className = '',
  style,
  id,
  ...rest
}) => {
  const isChecked = Boolean(checked);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
    onChange?.(e.target.checked, e);
  };

  const trackStyle: React.CSSProperties = {
    width: '40px',
    height: '24px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: isChecked ? 'var(--eco-blue)' : 'var(--border-default)',
    position: 'relative',
    transition: 'background-color 0.15s ease',
    flexShrink: 0,
    display: 'inline-block',
  };

  const thumbStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: isChecked ? '18px' : '2px',
    width: '20px',
    height: '20px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: '#ffffff',
    boxShadow: 'var(--shadow-xs)',
    transition: 'left 0.15s ease',
  };

  return (
    <label
      className={`eco-switch ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        userSelect: 'none',
        ...style,
      }}
    >
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={isChecked}
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
            width: '40px',
            height: '24px',
          }}
          {...rest}
        />
        <span style={trackStyle} aria-hidden="true">
          <span style={thumbStyle} />
        </span>
      </span>

      {label && (
        <span
          style={{
            fontFamily: 'var(--font-sans-native)',
            fontSize: '14px',
            lineHeight: '20px',
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default EcoSwitch;
