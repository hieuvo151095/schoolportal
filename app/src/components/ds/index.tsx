/* [DS] ECO ME DASHBOARD — SSR-Safe Native React 18 TypeScript Bridge */
import React, { useRef, useEffect, useState, cloneElement, ReactElement, ReactNode, CSSProperties, MouseEvent, ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ICONS, ALIASES, resolveIcon, IconName } from './icons';
import { Dropdown, DropdownSelect, DropdownOption, DropdownProps } from './Dropdown';

export type { IconName, DropdownOption, DropdownProps };
export { Dropdown, DropdownSelect };

/* Helper for joining classes */
function cx(...args: any[]): string {
  const out: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i]) out.push(args[i]);
  }
  return out.join(' ');
}

function pick<T>(v: any, list: T[], d: T): T {
  return list.indexOf(v) >= 0 ? v : d;
}

/* ==========================================================================
   1. Icon Component
   ========================================================================== */
export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export function Icon(p: IconProps) {
  const size = p.size || 16;
  const key = resolveIcon(p.name);
  const style = Object.assign({ width: size, height: size, color: p.color }, p.style);

  if (!key) {
    return React.createElement('span', {
      className: cx('ecomd-icon', 'ecomd-icon--missing', p.className),
      style,
      title: p.name,
      'aria-hidden': 'true',
    });
  }

  const d = ICONS[key];
  const a11y: any = p.title ? { role: 'img', 'aria-label': p.title } : { 'aria-hidden': true };
  return (
    <svg
      className={cx('ecomd-icon', p.className)}
      viewBox={`0 0 ${d[0]} ${d[1]}`}
      style={style}
      focusable="false"
      {...a11y}
    >
      {p.title ? <title>{p.title}</title> : null}
      <path d={d[2]} fill="currentColor" />
    </svg>
  );
}

Icon.has = function (n: string): boolean {
  return !!resolveIcon(n);
};
Icon.names = function (): string[] {
  return Object.keys(ICONS).sort();
};
Icon.aliases = function (): Record<string, string> {
  return Object.assign({}, ALIASES);
};
Icon.register = function (map: Record<string, [number, number, string]>): void {
  Object.keys(map).forEach((k) => {
    ICONS[k] = map[k];
  });
};
Icon.source = {
  set: 'Font Awesome 6 Free · Solid',
  version: '6.7.2',
  license: 'CC BY 4.0 (icons)',
  url: 'https://fontawesome.com',
};

/* ==========================================================================
   2. Button Component
   ========================================================================== */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  indicator?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  block?: boolean;
  disabled?: boolean;
  state?: 'default' | 'hover' | 'focus';
  href?: string;
  onClick?: (e: MouseEvent<any>) => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  title?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Button(p: ButtonProps) {
  const variant = pick(p.variant, ['primary', 'secondary', 'ghost', 'text'], 'primary');
  const size = p.size;
  const disabled = !!p.disabled;
  const iconEl = p.icon ? <Icon key="i" name={p.icon} size={size === 'sm' ? 10 : 12} /> : null;
  const right = p.iconPosition === 'right';
  const type = variant === 'primary' ? 'body-sm-semibold' : variant === 'text' ? 'body-xs-medium' : 'body-sm-medium';
  const active = variant === 'secondary' && !!p.active;
  const cls = cx(
    'ecomd-btn',
    'ecomd-btn--' + variant,
    size === 'sm' && 'ecomd-btn--sm',
    size === 'lg' && 'ecomd-btn--lg',
    type,
    active && 'is-active',
    p.block && 'is-block',
    p.state === 'hover' && 'is-hover',
    p.state === 'focus' && 'is-focus',
    p.className
  );
  const kids = [
    right ? null : iconEl,
    <span key="l">{p.children}</span>,
    right ? iconEl : null,
    p.indicator ? <span key="d" className="ecomd-btn__dot" aria-hidden="true" /> : null,
  ];

  if (p.href && !disabled) {
    return (
      <a className={cls} href={p.href} onClick={p.onClick} style={p.style} aria-label={p['aria-label']} title={p.title}>
        {kids}
      </a>
    );
  }
  return (
    <button
      className={cls}
      type={p.type || 'button'}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-pressed={variant === 'secondary' && p.active !== undefined ? !!p.active : undefined}
      onClick={p.onClick}
      style={p.style}
      aria-label={p['aria-label']}
      title={p.title}
    >
      {kids}
    </button>
  );
}

/* ==========================================================================
   3. IconButton Component
   ========================================================================== */
export interface IconButtonProps {
  icon: IconName;
  label: string;
  size?: 'sm' | 'md';
  badge?: boolean;
  active?: boolean;
  disabled?: boolean;
  state?: 'default' | 'hover' | 'focus';
  href?: string;
  onClick?: (e: MouseEvent<any>) => void;
  className?: string;
  style?: CSSProperties;
  'aria-haspopup'?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
  'aria-expanded'?: boolean;
}

export function IconButton(p: IconButtonProps) {
  const size = pick(p.size, ['md', 'sm'], 'sm');
  const cls = cx(
    'ecomd-icon-btn',
    'ecomd-icon-btn--' + size,
    p.active && 'is-active',
    p.state === 'hover' && 'is-hover',
    p.state === 'focus' && 'is-focus',
    p.className
  );
  const kids = [
    <Icon key="i" name={p.icon} size={size === 'md' ? 16 : 14} />,
    p.badge ? <span key="b" className="ecomd-icon-btn__dot" /> : null,
  ];
  const props = {
    className: cls,
    'aria-label': p.label,
    title: p.label,
    onClick: p.onClick,
    style: p.style,
    'aria-pressed': p.active !== undefined ? !!p.active : undefined,
    'aria-expanded': p['aria-expanded'],
    'aria-haspopup': p['aria-haspopup'],
  };
  if (p.href) return <a href={p.href} {...props}>{kids}</a>;
  return <button type="button" disabled={!!p.disabled} {...props}>{kids}</button>;
}

/* ==========================================================================
   4. SearchField Component
   ========================================================================== */
export interface SearchFieldProps {
  size?: 'md' | 'sm';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  block?: boolean;
  state?: 'default' | 'focus';
  className?: string;
  style?: CSSProperties;
}

export function SearchField(p: SearchFieldProps) {
  const size = pick(p.size, ['md', 'sm'], 'md');
  const ph = p.placeholder == null ? 'Tìm kiếm...' : p.placeholder;
  const inputProps: any = {
    className: cx('ecomd-input', size === 'md' ? 'body-sm' : 'body-xs', p.state === 'focus' && 'is-focus'),
    type: 'search',
    placeholder: ph,
    'aria-label': p.label || ph,
    onChange: p.onChange ? (e: ChangeEvent<HTMLInputElement>) => p.onChange!(e.target.value, e) : undefined,
  };
  if (p.value !== undefined) inputProps.value = p.value;
  else if (p.defaultValue !== undefined) inputProps.defaultValue = p.defaultValue;
  if (p.value !== undefined && !p.onChange) inputProps.readOnly = true;

  return (
    <label className={cx('ecomd-search', 'ecomd-search--' + size, p.block && 'is-block', p.className)} style={p.style}>
      <Icon name="magnifying-glass" size={14} className="ecomd-search__icon" />
      <input {...inputProps} />
    </label>
  );
}

/* ==========================================================================
   5. SelectField Component (Custom Modern Dropdown Powered)
   ========================================================================== */
export interface SelectFieldProps {
  options: Array<string | { value: string; label: string; [k: string]: any }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e?: any) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  state?: 'default' | 'focus';
  className?: string;
  style?: CSSProperties;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'subtle' | 'ghost' | 'filter';
  prefix?: ReactNode;
  prefixIcon?: IconName;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  emptyText?: string;
  fullWidth?: boolean;
  'aria-label'?: string;
}

export function SelectField(p: SelectFieldProps) {
  const opts = (p.options || []).map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  return (
    <Dropdown
      options={opts}
      value={p.value}
      defaultValue={p.defaultValue}
      onChange={(val) => {
        if (p.onChange) {
          p.onChange(val, { target: { value: val } } as any);
        }
      }}
      label={p.label}
      disabled={p.disabled}
      className={p.className}
      style={p.style}
      placeholder={p.placeholder}
      size={p.size || 'md'}
      variant={p.variant || 'default'}
      prefix={p.prefix}
      prefixIcon={p.prefixIcon}
      searchable={p.searchable}
      searchPlaceholder={p.searchPlaceholder}
      clearable={p.clearable}
      emptyText={p.emptyText}
      fullWidth={p.fullWidth !== undefined ? p.fullWidth : false}
      aria-label={p['aria-label'] || p.label || (opts[0] && opts[0].label)}
    />
  );
}

/* ==========================================================================
   6. Checkbox Component
   ========================================================================== */
export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  'aria-label'?: string;
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: CSSProperties;
}

export function Checkbox(p: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!p.indeterminate;
  }, [p.indeterminate]);

  const inputProps: any = {
    ref,
    type: 'checkbox',
    className: 'ecomd-checkbox__box',
    disabled: !!p.disabled,
    'aria-label': p.label ? undefined : p['aria-label'],
    onChange: p.onChange ? (e: ChangeEvent<HTMLInputElement>) => p.onChange!(e.target.checked, e) : undefined,
  };
  if (p.checked !== undefined) {
    inputProps.checked = p.checked;
    if (!p.onChange) inputProps.readOnly = true;
  } else if (p.defaultChecked !== undefined) {
    inputProps.defaultChecked = p.defaultChecked;
  }

  if (!p.label) {
    return <input {...inputProps} className={cx('ecomd-checkbox__box', p.className)} style={p.style} />;
  }

  if (p.description) {
    return (
      <label className={cx('ecomd-checkbox', 'ecomd-checkbox--desc', p.disabled && 'is-disabled', p.className)} style={p.style}>
        <input {...inputProps} />
        <span className="ecomd-checkbox__text">
          <span className="ecomd-checkbox__label body-sm-medium">{p.label}</span>
          <span className="ecomd-checkbox__desc body-xs">{p.description}</span>
        </span>
      </label>
    );
  }

  return (
    <label className={cx('ecomd-checkbox', 'body-sm', p.disabled && 'is-disabled', p.className)} style={p.style}>
      <input {...inputProps} />
      <span>{p.label}</span>
    </label>
  );
}

/* ==========================================================================
   7. Avatar Component
   ========================================================================== */
export interface AvatarProps {
  src?: string;
  name?: string;
  initials?: string;
  size?: 'md' | 'sm' | 'xs';
  color?: string;
  ring?: boolean;
  className?: string;
  style?: CSSProperties;
}

function initialOf(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export function Avatar(p: AvatarProps) {
  const size = pick(p.size, ['md', 'sm', 'xs'], 'md');
  const ring = !!p.ring;
  const [imgError, setImgError] = useState(false);

  const hasValidSrc = p.src && p.src.trim() !== '' && !imgError;

  const inner = hasValidSrc ? (
    <img src={p.src} alt={p.name || ''} onError={() => setImgError(true)} />
  ) : (
    <span
      className={cx('ecomd-avatar__initials', size === 'md' ? 'body-sm-bold' : 'body-xs-bold')}
      style={p.color ? { backgroundColor: p.color } : undefined}
      aria-label={p.name}
      role="img"
    >
      {p.initials || initialOf(p.name)}
    </span>
  );

  return (
    <span className={cx('ecomd-avatar', 'ecomd-avatar--' + size, ring && 'is-ring', p.className)} style={p.style}>
      {inner}
    </span>
  );
}

/* ==========================================================================
   8. Tag & EmptyValue Components
   ========================================================================== */
export interface TagProps {
  variant?: 'default' | 'code' | 'success' | 'warning';
  pill?: boolean;
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Tag(p: TagProps) {
  const variant = pick(p.variant, ['default', 'code', 'success', 'warning'], 'default');
  const type = variant === 'code' ? 'code' : variant === 'default' ? 'body-xs' : 'body-xs-semibold';
  return (
    <span className={cx('ecomd-tag', 'ecomd-tag--' + variant, type, p.pill && 'is-pill', p.className)} style={p.style}>
      {p.children || p.label}
    </span>
  );
}

export interface EmptyValueProps {
  label?: ReactNode;
  children?: ReactNode;
  italic?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function EmptyValue(p: EmptyValueProps) {
  return (
    <span className={cx('ecomd-empty', 'body-xs', p.italic && 'is-italic', p.className)} style={p.style}>
      {p.children || p.label || 'Chưa có'}
    </span>
  );
}

/* ==========================================================================
   9. StatusTag Component
   ========================================================================== */
export interface StatusTagProps {
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  label?: ReactNode;
  children?: ReactNode;
  icon?: boolean | IconName;
  className?: string;
  style?: CSSProperties;
}

const TONE_ICON: Record<string, string> = {
  success: 'circle-check',
  warning: 'clock',
  danger: 'circle-xmark',
  info: 'circle-info',
  neutral: 'minus',
};

export function StatusTag(p: StatusTagProps) {
  const tone = pick(p.tone, ['success', 'warning', 'danger', 'info', 'neutral'], 'neutral');
  const iconName = p.icon === true ? TONE_ICON[tone] : (typeof p.icon === 'string' ? p.icon : null);
  return (
    <span className={cx('ecomd-status', 'ecomd-status--' + tone, 'body-xs-medium', p.className)} style={p.style}>
      {iconName ? <Icon name={iconName} size={12} /> : null}
      <span>{p.children || p.label}</span>
    </span>
  );
}

/* ==========================================================================
   9b. Meter Component (SSOT Table Cell Proportion Bar)
   ========================================================================== */
export interface MeterProps {
  value?: number;
  max?: number;
  text?: string;
  tone?: 'default' | 'success' | 'warning';
  showLabel?: boolean;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function Meter(p: MeterProps) {
  const max = p.max || 100;
  const v = Math.max(0, Math.min(max, +(p.value || 0)));
  const pct = max ? Math.round((v / max) * 100) : 0;
  const tone = pick(p.tone, ['default', 'success', 'warning'], 'default');
  return (
    <div
      className={cx('ecomd-meter', tone !== 'default' && 'ecomd-meter--' + tone, p.className)}
      style={p.style}
    >
      <div
        className="ecomd-meter__track"
        role="meter"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={p.label}
      >
        <div className="ecomd-meter__fill" style={{ width: `${pct}%` }} />
      </div>
      {p.showLabel !== false && (
        <span className="ecomd-meter__label body-xs">{p.text != null ? p.text : `${pct}%`}</span>
      )}
    </div>
  );
}

/* ==========================================================================
   10. StatCard Component
   ========================================================================== */
export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  icon?: IconName;
  tone?: 'neutral' | 'success' | 'info' | 'warning' | 'danger' | 'purple';
  className?: string;
  style?: CSSProperties;
}

export function StatCard(p: StatCardProps) {
  const tone = pick(p.tone, ['neutral', 'success', 'info', 'warning', 'danger', 'purple'], 'neutral');
  return (
    <div className={cx('ecomd-stat', 'ecomd-stat--' + tone, p.className)} style={p.style}>
      <div className="ecomd-stat__label body-xs-medium">{p.label}</div>
      <div className="ecomd-stat__value amount-sm">
        <span>{p.value}</span>
        {p.icon ? <Icon name={p.icon} size={16} /> : null}
      </div>
      {p.sub ? (
        <div className="body-xs" style={{ marginTop: 'var(--space-6)', color: 'var(--text-subtle)' }}>
          {p.sub}
        </div>
      ) : null}
    </div>
  );
}

StatCard.Group = function (p: { columns?: number; children?: ReactNode; className?: string; style?: CSSProperties }) {
  const cols = p.columns || 5;
  return (
    <div
      className={cx('ecomd-stat-group', p.className)}
      style={Object.assign({ '--ecomd-cols': cols } as any, p.style)}
    >
      {p.children}
    </div>
  );
};

/* ==========================================================================
   11. PageHeader Component
   ========================================================================== */
export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function PageHeader(p: PageHeaderProps) {
  return (
    <div className={cx('ecomd-page-header', p.className)} style={p.style}>
      <div>
        <h1 className="ecomd-page-header__title h4 text-lg sm:text-xl md:text-2xl font-black">{p.title}</h1>
        {p.description ? <p className="ecomd-page-header__desc body-sm text-xs sm:text-sm text-[var(--text-subtle)] mt-1">{p.description}</p> : null}
      </div>
      {p.actions ? <div className="ecomd-page-header__actions">{p.actions}</div> : null}
    </div>
  );
}

/* ==========================================================================
   12. FilterBar Component
   ========================================================================== */
export interface FilterBarProps {
  search?: SearchFieldProps | false;
  filters?: SelectFieldProps[];
  advanced?: { label?: string; active?: boolean; onClick?: (e: MouseEvent<any>) => void } | false;
  action?: { label: string; icon?: IconName | null; href?: string; onClick?: (e: MouseEvent<any>) => void };
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function FilterBar(p: FilterBarProps) {
  const a = p.action;
  return (
    <div className={cx('ecomd-filterbar', p.className)} style={p.style}>
      <div className="ecomd-filterbar__filters">
        {p.search !== false && <SearchField className="ecomd-filterbar__search" {...(p.search || {})} />}
        {(p.filters || []).map((f, i) => (
          <SelectField
            key={'f' + i}
            {...f}
            fullWidth={f.fullWidth ?? false}
            className={cx('ecomd-filterbar__select', f.className)}
          />
        ))}
        {p.advanced && (
          <Button
            variant="secondary"
            icon="filter"
            active={!!p.advanced.active}
            indicator={!!p.advanced.active}
            onClick={p.advanced.onClick}
          >
            {p.advanced.label || 'Bộ lọc nâng cao'}
          </Button>
        )}
        {p.children}
      </div>
      {(a || p.actions) && (
        <div className="ecomd-filterbar__actions">
          {p.actions}
          {a && (
            <Button
              icon={a.icon === undefined ? 'plus' : a.icon || undefined}
              href={a.href}
              onClick={a.onClick}
            >
              {a.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   12b. CountedTabs Component
   ========================================================================== */
export interface CountedTabItem {
  id: string;
  label: string;
  count?: number | string;
  icon?: IconName;
}

export interface CountedTabsProps {
  tabs: CountedTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  style?: CSSProperties;
}

export function CountedTabs(p: CountedTabsProps) {
  return (
    <div
      role="tablist"
      className={cx('ecomd-counted-tabs no-scrollbar', p.className)}
      style={Object.assign(
        {
          display: 'flex',
          gap: 'var(--space-16)',
          padding: '0 var(--space-16)',
          borderBottom: '1px solid var(--border-default)',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          background: 'var(--bg-surface)',
        },
        p.style
      )}
    >
      {p.tabs.map((tab) => {
        const isActive = tab.id === p.activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => p.onChange(tab.id)}
            style={{
              height: '48px',
              flex: 'none',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-8)',
              marginBottom: '-1px',
              padding: '0 var(--space-4)',
              border: '0',
              borderBottom: isActive ? '2px solid var(--eco-blue-strong)' : '2px solid transparent',
              background: 'transparent',
              color: isActive ? 'var(--eco-blue-strong)' : 'var(--text-subtle)',
              fontFamily: 'inherit',
              fontSize: '14px',
              fontWeight: isActive ? 700 : 500,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'color .15s, border-color .15s',
            }}
          >
            {tab.icon ? (
              <Icon
                name={tab.icon}
                size={16}
                color={isActive ? 'var(--eco-blue-strong)' : 'var(--text-subtle)'}
              />
            ) : null}
            <span>{tab.label}</span>
            {tab.count !== undefined ? (
              <span
                style={{
                  minWidth: '22px',
                  height: '20px',
                  boxSizing: 'border-box',
                  padding: '0 6px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'var(--bg-info-tint)' : 'var(--bg-muted)',
                  color: isActive ? 'var(--eco-blue-strong)' : 'var(--text-subtle)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   12c. BulkActionBar Component
   ========================================================================== */
export interface BulkActionBarProps {
  selectedCount: number;
  totalCount?: number;
  onClearSelection?: () => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function BulkActionBar(p: BulkActionBarProps) {
  if (p.selectedCount <= 0) return null;
  return (
    <div
      className={cx('ecomd-bulk-bar', p.className)}
      style={Object.assign(
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-12)',
          padding: 'var(--space-10) var(--space-20)',
          background: 'var(--semantic-info-soft)',
          borderBottom: '1px solid var(--border-info-soft)',
          color: 'var(--text-heading)',
          fontSize: '13px',
          fontWeight: 600,
        },
        p.style
      )}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
        <Icon name="check" size={14} color="var(--eco-blue-strong)" />
        <span>
          Đã chọn <strong>{p.selectedCount}</strong> {p.totalCount ? `trên ${p.totalCount}` : ''} mục
        </span>
        {p.onClearSelection ? (
          <button
            type="button"
            onClick={p.onClearSelection}
            style={{
              background: 'transparent',
              border: 0,
              color: 'var(--eco-blue-strong)',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
              marginLeft: 'var(--space-8)',
            }}
          >
            Bỏ chọn
          </button>
        ) : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
        {p.children}
      </div>
    </div>
  );
}

/* ==========================================================================
   13. DataTable Component
   ========================================================================== */
export interface DataTableColumn<R = any> {
  key: string;
  title: ReactNode;
  align?: 'left' | 'right';
  width?: number | string;
  render?: (row: R, index: number) => ReactNode;
  isPrimary?: boolean;
  isActions?: boolean;
}

export interface DataTableProps<R = any> {
  columns: DataTableColumn<R>[];
  rows: R[];
  rowKey?: string | ((row: R) => string | number);
  selectable?: boolean;
  selected?: Array<string | number>;
  onSelect?: (keys: Array<string | number>) => void;
  rowLabel?: (row: R) => string;
  selectAllLabel?: string;
  footer?: ReactNode;
  emptyText?: ReactNode;
  emptyIcon?: IconName;
  empty?: ReactNode;
  hoverIndex?: number;
  className?: string;
  style?: CSSProperties;
}

export function DataTable<R = any>(p: DataTableProps<R>) {
  const cols = p.columns || [];
  const rows = p.rows || [];
  const keyOf = (r: R, i: number) => (p.rowKey ? (typeof p.rowKey === 'function' ? p.rowKey(r) : (r as any)[p.rowKey]) : i);
  const sel = p.selected || [];
  const allOn = rows.length > 0 && rows.every((r, i) => sel.indexOf(keyOf(r, i)) >= 0);
  const someOn = !allOn && rows.some((r, i) => sel.indexOf(keyOf(r, i)) >= 0);

  function toggle(k: string | number, on: boolean) {
    if (!p.onSelect) return;
    const next = sel.filter((x) => x !== k);
    if (on) next.push(k);
    p.onSelect(next);
  }

  function toggleAll(on: boolean) {
    if (p.onSelect) p.onSelect(on ? rows.map(keyOf) : []);
  }

  return (
    <div className={cx('ecomd-table-card', p.className)} style={p.style}>
      <div className="ecomd-table-scroll">
        <table className="ecomd-table">
          <thead>
            <tr>
              {p.selectable && (
                <th className="is-check">
                  <Checkbox
                    aria-label={p.selectAllLabel || 'Chọn tất cả'}
                    checked={allOn}
                    indeterminate={someOn}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {cols.map((c, colIdx) => {
                const isCheck = c.key === 'checkbox';
                const isActions = c.isActions || c.key === 'actions' || (colIdx === cols.length - 1 && (!c.title || c.title === ''));
                const isPrimary = c.isPrimary || (!isCheck && !isActions && colIdx === 0);

                return (
                  <th
                    key={c.key}
                    className={cx(
                      'body-xs-bold',
                      c.align === 'right' && 'is-right',
                      isPrimary && 'is-primary',
                      isActions && 'is-actions'
                    )}
                    style={c.width ? { width: c.width } : undefined}
                  >
                    {c.title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const k = keyOf(r, i);
              return (
                <tr key={k} className={p.hoverIndex === i ? 'is-hover' : undefined}>
                  {p.selectable && (
                    <td className="is-check">
                      <Checkbox
                        aria-label={p.rowLabel ? p.rowLabel(r) : 'Chọn dòng ' + (i + 1)}
                        checked={sel.indexOf(k) >= 0}
                        onChange={(on) => toggle(k, on)}
                      />
                    </td>
                  )}
                  {cols.map((c, colIdx) => {
                    const v = c.render ? c.render(r, i) : (r as any)[c.key];
                    const isCheck = c.key === 'checkbox';
                    const isActions = c.isActions || c.key === 'actions' || (colIdx === cols.length - 1 && (!c.title || c.title === ''));
                    const isPrimary = c.isPrimary || (!isCheck && !isActions && colIdx === 0);

                    return (
                      <td
                        key={c.key}
                        className={cx(
                          'body-sm',
                          c.align === 'right' && 'is-right',
                          isPrimary && 'is-primary',
                          isActions && 'is-actions'
                        )}
                      >
                        {!isPrimary && !isActions && c.title ? (
                          <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                            {c.title}
                          </span>
                        ) : null}
                        <div className="ecomd-cell__value">
                          {v}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td className="ecomd-table__none" colSpan={cols.length + (p.selectable ? 1 : 0)}>
                  {p.empty || <EmptyState icon={p.emptyIcon} label={p.emptyText || 'Không có dữ liệu'} />}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {p.footer && <div className="ecomd-table__footer body-xs">{p.footer}</div>}
    </div>
  );
}

DataTable.Person = function (p: { name: string; meta?: ReactNode; avatar?: string; href?: string }) {
  return (
    <div className="ecomd-person">
      <Avatar src={p.avatar} name={p.name} />
      <div>
        {p.href ? (
          <a className="ecomd-person__name body-sm-medium" href={p.href}>
            {p.name}
          </a>
        ) : (
          <span className="ecomd-person__name body-sm-medium">{p.name}</span>
        )}
        {p.meta && <div className="ecomd-person__meta body-xs">{p.meta}</div>}
      </div>
    </div>
  );
};

DataTable.Tags = function (p: { children?: ReactNode }) {
  return <div className="ecomd-tags">{p.children}</div>;
};

DataTable.RowAction = function (p: {
  icon?: IconName;
  label?: string;
  items?: DropdownMenuItem[];
  onClick?: (e: MouseEvent<any>) => void;
  defaultOpen?: boolean;
  hoverIndex?: number;
}) {
  const btn = <IconButton icon={p.icon || 'ellipsis-vertical'} label={p.label || 'Thao tác'} onClick={p.onClick} />;
  if (!p.items) return btn;
  return <DropdownMenu items={p.items} trigger={btn} defaultOpen={p.defaultOpen} hoverIndex={p.hoverIndex} align="right" />;
};

/* ==========================================================================
   14. SidebarNav Component
   ========================================================================== */
export interface SidebarNavItem {
  key?: string;
  icon: IconName;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: (e: MouseEvent<any>) => void;
}

export interface SidebarNavGroup {
  key?: string;
  label?: string;
  icon?: IconName;
  items: SidebarNavItem[];
  defaultExpanded?: boolean;
}

export interface SidebarNavProps {
  groups: SidebarNavGroup[];
  activeKey?: string;
  hoverKey?: string;
  footer?: Array<{ label: string; value: ReactNode; tone?: 'default' | 'success' }>;
  label?: string;
  collapsed?: boolean;
  className?: string;
  style?: CSSProperties;
}

const SIDEBAR_STORAGE_KEY = 'ecomd_sidebar_expanded_groups';

export function SidebarNav(p: SidebarNavProps) {
  const scrollRef = useRef<HTMLElement>(null);

  // Group expansion state:
  // Persisted across page navigation so modules DO NOT auto-collapse when a sub-module is clicked.
  // Modules only hide/expand when the user clicks the hide/expand chevron.
  // Deterministic initial state to prevent SSR/CSR hydration mismatch.
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    (p.groups || []).forEach((g, gi) => {
      const groupKey = g.key || g.label || `group_${gi}`;
      initial[groupKey] = true;
    });
    return initial;
  });

  // Hydrate user preference from localStorage after client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (saved) {
        setExpandedGroups((prev) => ({
          ...prev,
          ...JSON.parse(saved),
        }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const next = {
        ...prev,
        [groupKey]: !prev[groupKey],
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
          // ignore
        }
      }
      return next;
    });
  };

  // If a sub-module is active (including in the last module "Cấu hình"),
  // ensure its parent group is expanded so the active sub-module is clearly displayed on UI
  useEffect(() => {
    const activeGroupKeys: string[] = [];
    (p.groups || []).forEach((g, gi) => {
      const groupKey = g.key || g.label || `group_${gi}`;
      const hasActive = (g.items || []).some(
        (it) => it.active || (p.activeKey != null && (it.key || it.label) === p.activeKey)
      );
      if (hasActive) {
        activeGroupKeys.push(groupKey);
      }
    });

    if (activeGroupKeys.length > 0) {
      setExpandedGroups((prev) => {
        let changed = false;
        const next = { ...prev };
        activeGroupKeys.forEach((key) => {
          if (!next[key]) {
            next[key] = true;
            changed = true;
          }
        });
        if (changed) {
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(next));
            } catch (e) {}
          }
          return next;
        }
        return prev;
      });
    }
  }, [p.groups, p.activeKey]);

  // Smoothly scroll active item into view when mounted or updated,
  // especially crucial for the last module "Cấu hình" which sits at the bottom of the sidebar
  useEffect(() => {
    if (typeof window !== 'undefined' && scrollRef.current) {
      const timer = setTimeout(() => {
        const activeItem = scrollRef.current?.querySelector('.ecomd-nav-item.is-active');
        if (activeItem) {
          activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [p.groups, p.activeKey, expandedGroups]);

  // Restore scroll position so sidebar stays completely still
  useEffect(() => {
    if (typeof window !== 'undefined' && scrollRef.current) {
      const savedScroll = sessionStorage.getItem('ecomd_sidebar_scroll');
      if (savedScroll) {
        scrollRef.current.scrollTop = Number(savedScroll);
      }
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ecomd_sidebar_scroll', String(e.currentTarget.scrollTop));
    }
  };

  return (
    <aside
      className={cx('ecomd-sidebar', p.collapsed && 'is-collapsed', p.className)}
      style={{
        height: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...p.style,
      }}
      aria-hidden={p.collapsed ? 'true' : undefined}
    >
      <nav
        ref={scrollRef}
        onScroll={handleScroll}
        className="ecomd-sidebar__scroll"
        style={{
          WebkitMaskImage: 'none',
          maskImage: 'none',
          paddingBottom: '36px',
        }}
        aria-label={p.label || 'Điều hướng chính'}
      >
        {(p.groups || []).map((g, gi) => {
          const groupKey = g.key || g.label || `group_${gi}`;
          const isExpanded = !!expandedGroups[groupKey];

          return (
            <div
              key={groupKey}
              className="ecomd-sidebar__group"
              role={p.collapsed ? 'group' : undefined}
              aria-label={p.collapsed ? g.label : undefined}
            >
              {g.label && !p.collapsed ? (
                <button
                  type="button"
                  className="ecomd-sidebar__group-header body-xs-medium"
                  onClick={() => toggleGroup(groupKey)}
                  aria-expanded={isExpanded}
                  title={isExpanded ? `Thu gọn nhóm ${g.label}` : `Mở rộng nhóm ${g.label}`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-6) var(--space-16) var(--space-6)',
                    color: isExpanded ? 'var(--text-heading)' : 'var(--text-subtle)',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-6)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-heading)';
                    e.currentTarget.style.background = 'var(--bg-muted)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isExpanded ? 'var(--text-heading)' : 'var(--text-subtle)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ fontWeight: 600, letterSpacing: '0.01em' }}>{g.label}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: 'var(--text-subtle)',
                      transition: 'transform 0.2s ease',
                      transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                    }}
                  >
                    <Icon name="chevron-down" size={12} />
                  </span>
                </button>
              ) : null}

              {(isExpanded || p.collapsed) && (
                <div className="ecomd-sidebar__items">
                  {(g.items || []).map((it, ii) => {
                    const active =
                      it.active ||
                      (p.activeKey != null && (it.key || it.label) === p.activeKey);
                    const hover =
                      p.hoverKey != null && (it.key || it.label) === p.hoverKey;
                    const itemCls = cx(
                      'ecomd-nav-item',
                      active ? 'body-sm-semibold' : 'body-sm-medium',
                      active && 'is-active',
                      hover && 'is-hover'
                    );

                    const content = (
                      <>
                        <Icon name={it.icon} size={16} />
                        {p.collapsed ? null : <span>{it.label}</span>}
                      </>
                    );

                    if (it.href) {
                      return (
                        <Link
                          key={ii}
                          href={it.href}
                          scroll={false}
                          className={itemCls}
                          aria-current={active ? 'page' : undefined}
                          aria-label={p.collapsed ? it.label : undefined}
                          title={p.collapsed ? it.label : undefined}
                          onClick={it.onClick}
                        >
                          {content}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={ii}
                        type="button"
                        className={itemCls}
                        aria-current={active ? 'page' : undefined}
                        aria-label={p.collapsed ? it.label : undefined}
                        title={p.collapsed ? it.label : undefined}
                        onClick={it.onClick}
                      >
                        {content}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      {p.footer && p.footer.length > 0 ? (
        <div className="ecomd-sidebar__footer body-xs">
          {p.footer.map((f, i) => (
            <div key={i}>
              <span>{f.label}</span>
              <b className={cx('body-xs-semibold', f.tone === 'success' && 'is-success')}>
                {f.value}
              </b>
            </div>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

/* ==========================================================================
   15. AppHeader Component
   ========================================================================== */
export interface AppHeaderProps {
  productName?: string;
  context?: string;
  tagline?: string;
  logoIcon?: IconName;
  search?: SearchFieldProps | false;
  center?: ReactNode;
  notification?: boolean;
  onNotification?: (e: MouseEvent<any>) => void;
  user?: {
    name: string;
    role?: string;
    avatar?: string;
    menuItems?: DropdownMenuItem[];
  };
  onMenu?: ((e: MouseEvent<any>) => void) | false;
  menuActive?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function AppHeader(p: AppHeaderProps) {
  const u = p.user;

  const userTrigger = u && u.name ? (
    <button
      type="button"
      className="ecomd-user"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        padding: 'var(--space-4) var(--space-8) var(--space-4) var(--space-4)',
      }}
      title="Tài khoản người dùng"
    >
      <Avatar src={u.avatar} name={u.name} size="sm" ring={true} />
      <div className="ecomd-user__text hidden sm:flex">
        <div className="ecomd-user__name body-xs-bold">{u.name}</div>
        {u.role ? <div className="ecomd-user__role body-2xs">{u.role}</div> : null}
      </div>
      <Icon name="chevron-down" size={12} className="ecomd-user__caret hidden sm:inline-block" />
    </button>
  ) : null;

  return (
    <header className={cx('ecomd-header w-full flex-nowrap overflow-visible relative z-40 flex-shrink-0', p.className)} style={p.style}>
      <div className="ecomd-header__left flex-shrink-0 min-w-0">
        {p.onMenu !== false && (
          <IconButton
            icon="bars"
            size="md"
            label={p.menuActive ? 'Mở thanh điều hướng' : 'Thu gọn thanh điều hướng'}
            active={!!p.menuActive}
            onClick={p.onMenu}
          />
        )}
        <div className="ecomd-header__logo flex-shrink-0">
          <Icon name={p.logoIcon || 'school'} size={20} />
        </div>
        <div className="ecomd-header__brand min-w-0">
          <div className="ecomd-header__title">
            <span className="ecomd-header__name body-lg-bold truncate max-w-[130px] sm:max-w-none">{p.productName || 'ECO School Portal'}</span>
            {p.context ? <Tag variant="warning" pill={true}>{p.context}</Tag> : null}
          </div>
          {p.tagline ? <p className="ecomd-header__tagline body-xs hidden md:block">{p.tagline}</p> : null}
        </div>
      </div>
      <div className="ecomd-header__right flex-shrink-0 min-w-0">
        {p.center ? (
          <div className="ecomd-header__center">{p.center}</div>
        ) : p.search !== false ? (
          <SearchField
            size="sm"
            placeholder="Tìm kiếm chức năng..."
            className="ecomd-header__search"
            {...(p.search || {})}
          />
        ) : null}
        <div className="ecomd-header__tools">
          <IconButton
            icon="bell"
            size="md"
            label="Thông báo"
            badge={!!p.notification}
            onClick={p.onNotification}
          />
          {userTrigger ? (
            u?.menuItems && u.menuItems.length > 0 ? (
              <DropdownMenu align="right" items={u.menuItems} trigger={userTrigger} />
            ) : (
              userTrigger
            )
          ) : null}
          {p.children}
        </div>
      </div>
    </header>
  );
}

/* ==========================================================================
   16. EmptyState Component
   ========================================================================== */
export interface EmptyStateProps {
  icon?: IconName | false;
  title?: ReactNode;
  description?: ReactNode;
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function EmptyState(p: EmptyStateProps) {
  return (
    <div className={cx('ecomd-empty-state', p.className)} style={p.style}>
      {p.icon !== false && (
        <Icon name={p.icon || 'magnifying-glass'} size={32} className="ecomd-empty-state__icon" />
      )}
      {p.title ? (
        <span className="title-md" style={{ color: 'var(--text-heading)' }}>
          {p.title}
        </span>
      ) : null}
      {p.description || p.children || p.label ? (
        <span className="body-xs" style={{ color: 'var(--text-subtle)' }}>
          {p.description || p.children || p.label}
        </span>
      ) : null}
    </div>
  );
}

/* ==========================================================================
   17. DropdownMenu Component
   ========================================================================== */
export type DropdownMenuItem =
  | {
      icon?: IconName;
      label: ReactNode;
      onClick?: (e: MouseEvent<any>) => void;
      href?: string;
      disabled?: boolean;
      tone?: 'default' | 'danger';
    }
  | { divider: true };

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  trigger?: ReactElement;
  align?: 'right' | 'left';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hoverIndex?: number;
  className?: string;
  style?: CSSProperties;
}

export function DropdownMenu(p: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(!!(p.open !== undefined ? p.open : p.defaultOpen));
  const open = p.open !== undefined ? p.open : internalOpen;
  const setOpen = (v: boolean) => {
    if (p.onOpenChange) p.onOpenChange(v);
    if (p.open === undefined) setInternalOpen(v);
  };
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !p.trigger) return;
    function onDoc(e: any) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const items = (p.items || []).map((it, i) => {
    if ('divider' in it && it.divider) {
      return <div key={i} className="ecomd-menu__divider" role="separator" />;
    }
    const item = it as Extract<DropdownMenuItem, { label: ReactNode }>;
    const cls = cx(
      'ecomd-menu__item',
      'body-xs-medium',
      item.tone === 'danger' && 'is-danger',
      p.hoverIndex === i && 'is-hover'
    );
    const kids = [
      item.icon ? <Icon key="i" name={item.icon} size={14} /> : null,
      <span key="l">{item.label}</span>,
    ];
    const click = (e: MouseEvent<any>) => {
      if (item.onClick) item.onClick(e);
      setOpen(false);
    };
    if (item.href) {
      return (
        <a key={i} href={item.href} role="menuitem" className={cls} onClick={click}>
          {kids}
        </a>
      );
    }
    return (
      <button key={i} type="button" role="menuitem" className={cls} disabled={!!item.disabled} onClick={click}>
        {kids}
      </button>
    );
  });

  const panel = (
    <div
      className={cx(
        'ecomd-menu',
        p.trigger && 'is-floating',
        p.align === 'left' ? 'is-left' : 'is-right',
        '!z-[1000] shadow-2xl',
        !p.trigger && p.className
      )}
      role="menu"
      style={p.trigger ? undefined : p.style}
    >
      {items}
    </div>
  );

  if (!p.trigger) return panel;

  const trig = cloneElement(p.trigger, {
    onClick: (e: MouseEvent<any>) => {
      if (p.trigger!.props.onClick) p.trigger!.props.onClick(e);
      setOpen(!open);
    },
    'aria-haspopup': 'menu',
    'aria-expanded': open,
  });

  return (
    <div
      ref={ref}
      className={cx(
        'ecomd-menu-wrap relative',
        open ? 'z-[950] is-open' : 'z-auto',
        p.className
      )}
      style={p.style}
    >
      {trig}
      {open ? panel : null}
    </div>
  );
}

/* ==========================================================================
   18. PopupModal Component
   ========================================================================== */
export interface PopupModalAction {
  label: ReactNode;
  icon?: IconName;
  onClick?: (e: MouseEvent<any>) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  tone?: 'neutral' | 'danger' | 'brand' | 'success' | 'warning' | 'info';
}

export interface PopupModalProps {
  open?: boolean;
  isOpen?: boolean;
  icon?: IconName;
  title: ReactNode;
  description?: ReactNode;
  subtitle?: ReactNode;
  onClose?: ((e?: any) => void) | false;
  primaryAction?: PopupModalAction;
  secondaryAction?: PopupModalAction | null;
  extraAction?: PopupModalAction;
  footer?: ReactNode;
  width?: number | string;
  closeOnOverlay?: boolean;
  inline?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

let _mid = 0;
export function PopupModal(p: PopupModalProps) {
  const idRef = useRef('ecomd-modal-' + ++_mid);
  const [mounted, setMounted] = useState(false);
  const open = p.isOpen !== undefined ? !!p.isOpen : (p.open === undefined ? true : !!p.open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !p.onClose) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && typeof p.onClose === 'function') p.onClose(e);
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [open, p.onClose]);

  if (!open) return null;
  const id = idRef.current;
  const sec: PopupModalAction | null = p.secondaryAction === undefined ? { label: 'Đóng', onClick: p.onClose as any } : p.secondaryAction;
  const pri = p.primaryAction;
  const ext = p.extraAction;
  const hasFooter = p.footer || pri || sec || ext;
  const footer =
    p.footer ||
    (hasFooter ? (
      <div className="ecomd-modal__footer">
        <div>{ext ? <Button variant={ext.variant || 'text'} icon={ext.icon} onClick={ext.onClick}>{ext.label}</Button> : null}</div>
        <div className="ecomd-modal__actions">
          {sec ? <Button variant={sec.variant || 'ghost'} onClick={sec.onClick}>{sec.label}</Button> : null}
          {pri ? <Button variant={pri.variant} icon={pri.icon} onClick={pri.onClick} disabled={pri.disabled}>{pri.label}</Button> : null}
        </div>
      </div>
    ) : null);

  const desc = p.description || p.subtitle;

  const content = (
    <div
      className={cx('ecomd-modal-overlay', p.inline && 'is-inline')}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && p.onClose && p.closeOnOverlay !== false) {
          p.onClose(e);
        }
      }}
    >
      <div
        className={cx('ecomd-modal', p.className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id + '-t'}
        style={Object.assign(p.width ? { maxWidth: p.width } : {}, p.style)}
      >
        <div className="ecomd-modal__header">
          <div className="ecomd-modal__heading">
            {p.icon ? (
              <div className="ecomd-modal__icon">
                <Icon name={p.icon} size={16} />
              </div>
            ) : null}
            <div>
              <h3 id={id + '-t'} className="ecomd-modal__title title-md">
                {p.title}
              </h3>
              {desc ? <p className="ecomd-modal__desc body-xs">{desc}</p> : null}
            </div>
          </div>
          {p.onClose !== false && (
            <IconButton icon="xmark" size="md" label="Đóng" onClick={p.onClose} />
          )}
        </div>
        <div className="ecomd-modal__body">
          {p.children}
          {footer}
        </div>
      </div>
    </div>
  );

  if (!p.inline && mounted && typeof document !== 'undefined' && document.body) {
    return createPortal(content, document.body);
  }

  return content;
}

PopupModal.Section = function (p: { label?: ReactNode; children?: ReactNode }) {
  return (
    <div className="ecomd-modal__section">
      {p.label ? <div className="ecomd-modal__section-label overline-xs">{p.label}</div> : null}
      {p.children}
    </div>
  );
};

/* ==========================================================================
   22. SegmentedControl Component
   ========================================================================== */
export interface SegmentedControlItem<T extends string = string> {
  key: T;
  label: ReactNode;
  icon?: IconName;
  count?: number;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentedControlItem<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
  style?: CSSProperties;
}

export function SegmentedControl<T extends string = string>(p: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cx('ecomd-segmented', p.size === 'sm' && 'ecomd-segmented--sm', p.className)}
      style={p.style}
    >
      {p.items.map((it) => {
        const active = it.key === p.value;
        return (
          <button
            key={it.key}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={it.disabled}
            className={cx('ecomd-segmented__item', active && 'is-active')}
            onClick={() => p.onChange(it.key)}
          >
            {it.icon ? <Icon name={it.icon} size={p.size === 'sm' ? 12 : 14} /> : null}
            <span>{it.label}</span>
            {it.count !== undefined ? (
              <span className="ecomd-segmented__count">{it.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   23. TextField Component  (nhập liệu một dòng: email, mật khẩu, mã…)
   ========================================================================== */
export interface TextFieldProps {
  label?: ReactNode;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: IconName;
  error?: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  autoComplete?: string;
  name?: string;
  autoFocus?: boolean;
  size?: 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
}

export function TextField(p: TextFieldProps) {
  const [reveal, setReveal] = useState(false);
  const uid = React.useId();
  const id = 'tf-' + uid;
  const isPassword = p.type === 'password';
  const type = isPassword && reveal ? 'text' : p.type || 'text';
  const inputProps: any = {
    id,
    name: p.name,
    type,
    className: cx('ecomd-textfield__input', p.size === 'lg' ? 'body-md' : 'body-sm'),
    placeholder: p.placeholder,
    disabled: !!p.disabled,
    autoComplete: p.autoComplete,
    autoFocus: p.autoFocus,
    'aria-invalid': p.error ? true : undefined,
    'aria-describedby': p.error ? id + '-err' : p.hint ? id + '-hint' : undefined,
    onChange: p.onChange ? (e: ChangeEvent<HTMLInputElement>) => p.onChange!(e.target.value, e) : undefined,
  };
  if (p.value !== undefined) {
    inputProps.value = p.value;
    if (!p.onChange) inputProps.readOnly = true;
  } else if (p.defaultValue !== undefined) {
    inputProps.defaultValue = p.defaultValue;
  }

  return (
    <div
      className={cx(
        'ecomd-textfield',
        p.size === 'lg' && 'ecomd-textfield--lg',
        p.error && 'has-error',
        p.disabled && 'is-disabled',
        p.className
      )}
      style={p.style}
    >
      {p.label ? (
        <label htmlFor={id} className="ecomd-textfield__label body-xs-medium">
          {p.label}
        </label>
      ) : null}
      <div className="ecomd-textfield__control">
        {p.icon ? <Icon name={p.icon} size={14} className="ecomd-textfield__icon" /> : null}
        <input {...inputProps} />
        {isPassword ? (
          <button
            type="button"
            className="ecomd-textfield__toggle"
            aria-label={reveal ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            aria-pressed={reveal}
            onClick={() => setReveal((v) => !v)}
            tabIndex={0}
          >
            <Icon name={reveal ? 'eye' : 'eye-slash'} size={14} />
          </button>
        ) : null}
      </div>
      {p.error ? (
        <div id={id + '-err'} role="alert" className="ecomd-textfield__msg is-error body-xs">
          {p.error}
        </div>
      ) : p.hint ? (
        <div id={id + '-hint'} className="ecomd-textfield__msg body-xs">
          {p.hint}
        </div>
      ) : null}
    </div>
  );
}

/* ==========================================================================
   24. ComboboxField Component  (ô chọn có tìm kiếm: Sở GD&ĐT, Trường…)
   ========================================================================== */
export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxFieldProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  icon?: IconName;
  label?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  searchable?: boolean;
  emptyText?: string;
  size?: 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
}

function foldText(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase();
}

export function ComboboxField(p: ComboboxFieldProps) {
  const uid = React.useId();
  const id = 'cb-' + uid;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const selected = p.options.find((o) => o.value === p.value);
  const searchable = p.searchable !== false;
  const q = foldText(query).trim();
  const list = q ? p.options.filter((o) => foldText(o.label).includes(q)) : p.options;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: Event) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const choose = (o: ComboboxOption) => {
    p.onChange && p.onChange(o.value);
    setOpen(false);
    setQuery('');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (p.disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((i) => Math.min(i + 1, Math.max(list.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && open) {
      e.preventDefault();
      if (list[active]) choose(list[active]);
    } else if (e.key === 'Escape' && open) {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div
      ref={rootRef}
      className={cx(
        'ecomd-combobox',
        p.size === 'lg' && 'ecomd-textfield--lg',
        open && 'is-open',
        p.error && 'has-error',
        p.disabled && 'is-disabled',
        p.className
      )}
      style={p.style}
    >
      {p.label ? (
        <label htmlFor={id} className="ecomd-textfield__label body-xs-medium">
          {p.label}
        </label>
      ) : null}
      <div className="ecomd-textfield__control" onClick={() => !p.disabled && setOpen(true)}>
        {p.icon ? <Icon name={p.icon} size={14} className="ecomd-textfield__icon" /> : null}
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={id + '-list'}
          aria-autocomplete="list"
          aria-invalid={p.error ? true : undefined}
          className={cx('ecomd-textfield__input', 'ecomd-combobox__input', p.size === 'lg' ? 'body-md' : 'body-sm')}
          disabled={!!p.disabled}
          readOnly={!searchable}
          autoComplete="off"
          placeholder={selected ? selected.label : p.placeholder}
          value={open ? query : selected ? selected.label : ''}
          onFocus={() => !p.disabled && setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        <span className="ecomd-combobox__chevron" aria-hidden="true">
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={12} />
        </span>
      </div>
      {open ? (
        <ul id={id + '-list'} role="listbox" className="ecomd-combobox__list">
          {list.length === 0 ? (
            <li className="ecomd-combobox__empty body-sm">{p.emptyText || 'Không tìm thấy kết quả'}</li>
          ) : (
            list.map((o, i) => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === p.value}
                className={cx(
                  'ecomd-combobox__option',
                  'body-sm',
                  i === active && 'is-active',
                  o.value === p.value && 'is-selected'
                )}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(o);
                }}
              >
                {o.label}
              </li>
            ))
          )}
        </ul>
      ) : null}
      {p.error ? (
        <div role="alert" className="ecomd-textfield__msg is-error body-xs">
          {p.error}
        </div>
      ) : null}
    </div>
  );
}

/* ==========================================================================
   26. SlideOver Component (Right Drawer for Create / Edit / View)
   ========================================================================== */
export { SlideOver } from './SlideOver';
export type { SlideOverProps, SlideOverAction } from './SlideOver';

