import React from 'react';

export interface EcoDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  dashed?: boolean;
  label?: React.ReactNode;
}

export const EcoDivider: React.FC<EcoDividerProps> = ({
  orientation = 'horizontal',
  dashed = false,
  label,
  className = '',
  style,
  ...rest
}) => {
  if (orientation === 'vertical') {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={`eco-divider eco-divider--vertical ${className}`}
        style={{
          display: 'inline-block',
          width: '1px',
          alignSelf: 'stretch',
          backgroundColor: dashed ? 'transparent' : 'var(--border-subtle)',
          borderLeft: dashed ? '1px dashed var(--border-default)' : 'none',
          margin: '0 8px',
          ...style,
        }}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={`eco-divider eco-divider--with-label ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          margin: '16px 0',
          fontFamily: 'var(--font-sans-native)',
          fontSize: '13px',
          color: 'var(--text-tertiary)',
          ...style,
        }}
        {...rest}
      >
        <span
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: dashed ? 'transparent' : 'var(--border-subtle)',
            borderTop: dashed ? '1px dashed var(--border-default)' : 'none',
          }}
        />
        <span>{label}</span>
        <span
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: dashed ? 'transparent' : 'var(--border-subtle)',
            borderTop: dashed ? '1px dashed var(--border-default)' : 'none',
          }}
        />
      </div>
    );
  }

  return (
    <div
      role="separator"
      className={`eco-divider eco-divider--horizontal ${className}`}
      style={{
        width: '100%',
        height: '1px',
        backgroundColor: dashed ? 'transparent' : 'var(--border-subtle)',
        borderTop: dashed ? '1px dashed var(--border-default)' : 'none',
        margin: '12px 0',
        ...style,
      }}
      {...rest}
    />
  );
};

export default EcoDivider;
