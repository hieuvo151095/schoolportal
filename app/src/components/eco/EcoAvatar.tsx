import React, { useState } from 'react';

export type EcoAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export type EcoAvatarShape = 'circle' | 'rounded' | 'square';

export interface EcoAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  name?: string;
  initials?: string;
  size?: EcoAvatarSize;
  shape?: EcoAvatarShape;
  bordered?: boolean;
  placeholder?: 'initials' | 'student' | 'user';
}

// Deterministic color palette for initials avatars
const AVATAR_BG_COLORS = [
  '#006FDA', // Eco Blue
  '#00A389', // Aqua Dark
  '#E8590C', // Orange Citrus
  '#7952B3', // Purple
  '#008080', // Teal
  '#C0263A', // Deep Red
  '#2B8A3E', // Green
  '#364FC7', // Indigo
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_BG_COLORS.length;
  return AVATAR_BG_COLORS[index];
}

export const EcoAvatar: React.FC<EcoAvatarProps> = ({
  src,
  alt = '',
  name = '',
  initials,
  size = 'md',
  shape = 'circle',
  bordered = false,
  placeholder = 'initials',
  className = '',
  style,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  // Compute dimension in pixels
  let dimPx = 36;
  if (typeof size === 'number') {
    dimPx = size;
  } else {
    const dimMap: Record<string, number> = {
      xs: 20,
      sm: 28,
      md: 36,
      lg: 48,
      xl: 64,
    };
    dimPx = dimMap[size] || 36;
  }

  // Compute font size proportional to dimension
  const fontSize = Math.max(10, Math.floor(dimPx * 0.4));

  // Compute initials
  let displayInitials = initials;
  if (!displayInitials && name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      displayInitials = parts[0].slice(0, 2).toUpperCase();
    } else {
      displayInitials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  } else if (!displayInitials && alt) {
    displayInitials = alt.slice(0, 2).toUpperCase();
  } else if (!displayInitials) {
    displayInitials = '?';
  }

  // Radii
  const borderRadius =
    shape === 'circle'
      ? 'var(--radius-full)'
      : shape === 'rounded'
      ? 'var(--radius-md)'
      : 'var(--radius-sm)';

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${dimPx}px`,
    height: `${dimPx}px`,
    borderRadius,
    overflow: 'hidden',
    flexShrink: 0,
    fontFamily: 'var(--font-sans-native)',
    fontWeight: 600,
    fontSize: `${fontSize}px`,
    color: '#ffffff',
    backgroundColor: name ? getAvatarColor(name) : 'var(--bg-solid)',
    border: bordered ? '2px solid var(--bg-surface)' : 'none',
    boxShadow: bordered ? 'var(--shadow-xs)' : 'none',
    userSelect: 'none',
    boxSizing: 'border-box',
    ...style,
  };

  if (src && !hasError) {
    return (
      <span className={`eco-avatar ${className}`} style={baseStyle} {...rest}>
        <img
          src={src}
          alt={alt || name}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </span>
    );
  }

  return (
    <span
      className={`eco-avatar eco-avatar--fallback ${className}`}
      style={baseStyle}
      title={name || alt}
      {...rest}
    >
      {placeholder === 'user' ? (
        <span aria-hidden="true" style={{ fontSize: `${Math.floor(dimPx * 0.5)}px` }}>👤</span>
      ) : (
        displayInitials
      )}
    </span>
  );
};

export default EcoAvatar;
